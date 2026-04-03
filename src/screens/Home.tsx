import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import {
  obterConsultas,
  obterPacienteLogado,
  removerPacienteLogado,
  salvarConsultas,
} from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [nomePaciente, setNomePaciente] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    const paciente = await obterPacienteLogado();

    if (!paciente) {
      navigation.replace("Login");
      return;
    }

    setNomePaciente(paciente.nome);

    const todasConsultas = await obterConsultas();
    const consultasDoPaciente = todasConsultas.filter(
      (c) => c.paciente.id === paciente.id
    );

    setConsultas(consultasDoPaciente);
  }

  async function confirmarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "confirmada" as const } : c
    );

    setConsultas(consultasAtualizadas);

    const todasConsultas = await obterConsultas();
    const consultasAtualizadasCompletas = todasConsultas.map((c) =>
      c.id === consultaId ? { ...c, status: "confirmada" as const } : c
    );

    await salvarConsultas(consultasAtualizadasCompletas);
  }

  async function cancelarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "cancelada" as const } : c
    );

    setConsultas(consultasAtualizadas);

    const todasConsultas = await obterConsultas();
    const consultasAtualizadasCompletas = todasConsultas.map((c) =>
      c.id === consultaId ? { ...c, status: "cancelada" as const } : c
    );

    await salvarConsultas(consultasAtualizadasCompletas);
  }

  async function executarLogout() {
    try {
      await removerPacienteLogado();

      setConsultas([]);
      setNomePaciente("");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (erro) {
      console.error("Erro ao sair:", erro);
      Alert.alert("Erro", "Não foi possível sair da conta");
    }
  }

  function handleLogout() {
    if (Platform.OS === "web") {
      const confirmou = confirm("Deseja realmente sair da sua conta?");

      if (confirmou) {
        executarLogout();
      }

      return;
    }

    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: () => {
          executarLogout();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Olá, {nomePaciente}!</Text>
          <Text style={styles.subtitulo}>
            {consultas.length} consulta(s) agendada(s)
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              padding: 16,
              borderRadius: 10,
              marginBottom: 10,
            }}
            onPress={() => navigation.navigate("Agendamento")}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              + Agendar Nova Consulta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 12,
              borderRadius: 10,
            }}
            onPress={handleLogout}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Sair
            </Text>
          </TouchableOpacity>
        </View>

        {consultas.length === 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: 30,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 15 }}>📅</Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Você ainda não tem consultas agendadas
            </Text>
          </View>
        ) : (
          consultas.map((consulta) => (
            <ConsultaCard
              key={consulta.id}
              consulta={consulta}
              onConfirmar={() => confirmarConsulta(consulta.id)}
              onCancelar={() => cancelarConsulta(consulta.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}