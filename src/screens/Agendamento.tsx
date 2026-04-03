import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import {
  obterConsultas,
  obterEspecialidades,
  obterMedicos,
  obterPacienteLogado,
  salvarConsultas,
} from "../services/storage";

export default function Agendamento({ navigation }: any) {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState<Medico[]>([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<Especialidade | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);
  const [dataConsulta, setDataConsulta] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const esps = await obterEspecialidades();
    const meds = await obterMedicos();

    setEspecialidades(esps);
    setMedicos(meds);
  }

  function selecionarEspecialidade(esp: Especialidade) {
    setEspecialidadeSelecionada(esp);
    setMedicoSelecionado(null);

    const medicosDaEspecialidade = medicos.filter(
      (m) => m.especialidade.id === esp.id
    );

    setMedicosFiltrados(medicosDaEspecialidade);
  }

  async function agendarConsulta() {
    if (!especialidadeSelecionada) {
      Alert.alert("Atenção", "Selecione uma especialidade");
      return;
    }

    if (!medicoSelecionado) {
      Alert.alert("Atenção", "Selecione um médico");
      return;
    }

    if (!dataConsulta.trim()) {
      Alert.alert("Atenção", "Informe a data da consulta");
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataConsulta)) {
      Alert.alert("Erro", "Use o formato DD/MM/AAAA para a data");
      return;
    }

    try {
      const paciente = await obterPacienteLogado();

      if (!paciente) {
        Alert.alert("Erro", "Você precisa estar logado para agendar");
        navigation.replace("Login");
        return;
      }

      const [dia, mes, ano] = dataConsulta.split("/");
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (data < hoje) {
        Alert.alert("Erro", "Não é possível agendar consultas no passado");
        return;
      }

      const novaConsulta: Consulta = {
        id: Date.now(),
        medico: medicoSelecionado,
        paciente,
        data,
        valor: 350,
        status: "agendada",
        observacoes: "Consulta agendada via app",
      };

      const consultas = await obterConsultas();
      await salvarConsultas([...consultas, novaConsulta]);

      Alert.alert(
        "Sucesso!",
        `Consulta agendada com ${medicoSelecionado.nome} para ${dataConsulta}`,
        [
          {
            text: "Ver minhas consultas",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );

      setEspecialidadeSelecionada(null);
      setMedicoSelecionado(null);
      setDataConsulta("");
      setMedicosFiltrados([]);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      Alert.alert("Erro", "Não foi possível agendar a consulta");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Agendar Consulta</Text>

        <Text style={styles.secaoTitulo}>1. Escolha a especialidade</Text>
        <View style={styles.lista}>
          {especialidades.map((esp) => (
            <TouchableOpacity
              key={esp.id}
              style={[
                styles.itemBotao,
                especialidadeSelecionada?.id === esp.id && styles.itemSelecionado,
              ]}
              onPress={() => selecionarEspecialidade(esp)}
            >
              <Text
                style={[
                  styles.itemTexto,
                  especialidadeSelecionada?.id === esp.id && styles.itemTextoSelecionado,
                ]}
              >
                {esp.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {especialidadeSelecionada && (
          <>
            <Text style={styles.secaoTitulo}>2. Escolha o médico</Text>
            <View style={styles.lista}>
              {medicosFiltrados.map((med) => (
                <TouchableOpacity
                  key={med.id}
                  style={[
                    styles.itemBotao,
                    medicoSelecionado?.id === med.id && styles.itemSelecionado,
                  ]}
                  onPress={() => setMedicoSelecionado(med)}
                >
                  <Text
                    style={[
                      styles.itemTexto,
                      medicoSelecionado?.id === med.id && styles.itemTextoSelecionado,
                    ]}
                  >
                    {med.nome} - {med.crm}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {medicoSelecionado && (
          <>
            <Text style={styles.secaoTitulo}>3. Informe a data</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataConsulta}
              onChangeText={setDataConsulta}
              keyboardType="numeric"
              maxLength={10}
            />
          </>
        )}

        <TouchableOpacity style={styles.botaoAgendar} onPress={agendarConsulta}>
          <Text style={styles.botaoTexto}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    marginTop: 10,
  },
  lista: {
    marginBottom: 16,
  },
  itemBotao: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemSelecionado: {
    backgroundColor: "#4CAF50",
  },
  itemTexto: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  itemTextoSelecionado: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  botaoAgendar: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});