import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Paciente } from "../types/paciente";
import {
  obterPacienteLogado,
  obterPacientes,
  salvarPacienteLogado,
  salvarPacientes,
} from "../services/storage";

export default function CadastroPaciente({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [etapa, setEtapa] = useState<"cpf" | "cadastro">("cpf");
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarBotaoCadastro, setMostrarBotaoCadastro] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const pacienteLogado = await obterPacienteLogado();

        if (pacienteLogado) {
          navigation.replace("Home");
          return;
        }

        setEtapa("cpf");
        setCpf("");
        setNome("");
        setEmail("");
        setTelefone("");
        setErro("");
        setMostrarBotaoCadastro(false);
        setVerificando(false);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  function validarCPF(valor: string): boolean {
    const cpfLimpo = valor.replace(/\D/g, "");
    return cpfLimpo.length === 11;
  }

  async function verificarCPF() {
    setErro("");
    setMostrarBotaoCadastro(false);

    if (!cpf.trim()) {
      setErro("Por favor, preencha seu CPF");
      return;
    }

    if (!validarCPF(cpf)) {
      setErro("CPF deve ter 11 dígitos");
      return;
    }

    try {
      setVerificando(true);

      const pacientes = await obterPacientes();

      const pacienteExistente = pacientes.find(
        (p) => p.cpf.replace(/\D/g, "") === cpf.replace(/\D/g, "")
      );

      if (pacienteExistente) {
        await salvarPacienteLogado(pacienteExistente);
        navigation.replace("Home");
      } else {
        setErro(
          "CPF não encontrado no cadastro. Verifique se digitou corretamente."
        );
        setMostrarBotaoCadastro(true);
      }
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setErro("Não foi possível verificar o CPF");
    } finally {
      setVerificando(false);
    }
  }

  async function completarCadastro() {
    setErro("");

    if (!nome.trim()) {
      setErro("Por favor, preencha seu nome");
      return;
    }

    if (!email.trim()) {
      setErro("Por favor, preencha seu email");
      return;
    }

    try {
      setVerificando(true);

      const novoPaciente: Paciente = {
        id: Date.now(),
        nome: nome.trim(),
        cpf: cpf.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
      };

      const pacientes = await obterPacientes();
      const novaLista = [...pacientes, novoPaciente];

      await salvarPacientes(novaLista);
      await salvarPacienteLogado(novoPaciente);

      navigation.replace("Home");
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      setErro("Não foi possível realizar o cadastro");
    } finally {
      setVerificando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.icone}>🏥</Text>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>
            {etapa === "cpf"
              ? "Informe seu CPF para continuar"
              : "Complete seu cadastro"}
          </Text>
        </View>

        <View style={styles.form}>
          {etapa === "cpf" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CPF *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#999"
                  value={cpf}
                  onChangeText={(texto) => {
                    setCpf(texto);
                    setErro("");
                    setMostrarBotaoCadastro(false);
                  }}
                  keyboardType="numeric"
                  maxLength={14}
                  editable={!verificando}
                />
              </View>

              <TouchableOpacity
                style={[styles.botao, verificando && styles.botaoDesabilitado]}
                onPress={verificarCPF}
                disabled={verificando}
              >
                <Text style={styles.botaoTexto}>
                  {verificando ? "Verificando..." : "Continuar"}
                </Text>
              </TouchableOpacity>

              {erro ? (
                <View style={styles.erroContainer}>
                  <Text style={styles.erroTexto}>{erro}</Text>

                  {mostrarBotaoCadastro && (
                    <TouchableOpacity
                      style={styles.botaoCadastro}
                      onPress={() => {
                        setEtapa("cadastro");
                        setErro("");
                      }}
                    >
                      <Text style={styles.botaoCadastroTexto}>
                        Fazer cadastro agora
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : null}

              <View style={styles.infoContainer}>
                <Text style={styles.infoTexto}>
                  Se você já é cadastrado, o login será feito automaticamente.
                </Text>
              </View>
            </>
          )}

          {etapa === "cadastro" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={[styles.input, styles.inputDesabilitado]}
                  value={cpf}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#999"
                  value={nome}
                  onChangeText={(texto) => {
                    setNome(texto);
                    setErro("");
                  }}
                  autoCapitalize="words"
                  editable={!verificando}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={(texto) => {
                    setEmail(texto);
                    setErro("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!verificando}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(11) 99999-9999"
                  placeholderTextColor="#999"
                  value={telefone}
                  onChangeText={(texto) => {
                    setTelefone(texto);
                    setErro("");
                  }}
                  keyboardType="phone-pad"
                  editable={!verificando}
                />
              </View>

              {erro ? (
                <View style={styles.erroContainer}>
                  <Text style={styles.erroTexto}>{erro}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.botao, verificando && styles.botaoDesabilitado]}
                onPress={completarCadastro}
                disabled={verificando}
              >
                <Text style={styles.botaoTexto}>
                  {verificando ? "Cadastrando..." : "Finalizar Cadastro"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => {
                  setEtapa("cpf");
                  setErro("");
                  setMostrarBotaoCadastro(false);
                }}
                disabled={verificando}
              >
                <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  icone: {
    fontSize: 50,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  inputDesabilitado: {
    backgroundColor: "#e9e9e9",
    color: "#666",
  },
  botao: {
    backgroundColor: "#79059C",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  erroContainer: {
    marginTop: 16,
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#F5C2C7",
    borderRadius: 12,
    padding: 16,
  },
  erroTexto: {
    color: "#B02A37",
    fontSize: 14,
    marginBottom: 12,
  },
  botaoCadastro: {
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoCadastroTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 18,
    padding: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  infoTexto: {
    color: "#555",
    textAlign: "center",
    fontSize: 13,
  },
  botaoVoltar: {
    marginTop: 14,
    alignItems: "center",
  },
  botaoVoltarTexto: {
    color: "#79059C",
    fontSize: 15,
    fontWeight: "600",
  },
});