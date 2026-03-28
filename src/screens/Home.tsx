import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    carregarConsultas();

    const unsubscribe = navigation.addListener("focus", () => {
      carregarConsultas();
    });

    return unsubscribe;
  }, [navigation]);

  async function carregarConsultas() {
    const consultasSalvas = await obterConsultas();
    setConsultas(consultasSalvas);
  }

  async function confirmarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "confirmada" as const } : c
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  async function cancelarConsulta(consultaId: number) {
    const consultasAtualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "cancelada" as const } : c
    );

    setConsultas(consultasAtualizadas);
    await salvarConsultas(consultasAtualizadas);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas Consultas</Text>
          <Text style={styles.subtitulo}>
            {consultas.length} consulta(s) cadastrada(s)
          </Text>
        </View>

        {consultas.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#fff", marginBottom: 20 }}>
              Nenhuma consulta agendada ainda
            </Text>

            <Button
              title="Ir para Admin"
              onPress={() => navigation.navigate("Admin")}
            />
          </View>
        ) : (
          <>
            {consultas.map((consulta) => (
              <ConsultaCard
                key={consulta.id}
                consulta={consulta}
                onConfirmar={() => confirmarConsulta(consulta.id)}
                onCancelar={() => cancelarConsulta(consulta.id)}
              />
            ))}

            <View style={{ marginTop: 20 }}>
              <Button
                title="Ir para Admin"
                onPress={() => navigation.navigate("Admin")}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}