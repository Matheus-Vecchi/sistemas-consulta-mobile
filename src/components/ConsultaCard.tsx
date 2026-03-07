import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Consulta } from "../interfaces/consulta";

interface ConsultaCardProps {
  consulta: Consulta;
  onConfirmar?: () => void;
  onCancelar?: () => void;
}

export default function ConsultaCard({
  consulta,
  onConfirmar,
  onCancelar,
}: ConsultaCardProps) {
  function formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data: Date): string {
    return data.toLocaleDateString("pt-BR");
  }

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.statusBadge,
          consulta.status === "confirmada" && styles.statusConfirmada,
          consulta.status === "cancelada" && styles.statusCancelada,
        ]}
      >
        <Text style={styles.statusTexto}>{consulta.status.toUpperCase()}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.label}>👨‍⚕️ Médico</Text>
        <Text style={styles.valor}>{consulta.medico.nome}</Text>
        <Text style={styles.info}>CRM: {consulta.medico.crm}</Text>
        <Text style={styles.info}>{consulta.medico.especialidade.nome}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.label}>👤 Paciente</Text>
        <Text style={styles.valor}>{consulta.paciente.nome}</Text>
        <Text style={styles.info}>CPF: {consulta.paciente.cpf}</Text>
        <Text style={styles.info}>Email: {consulta.paciente.email}</Text>
        {consulta.paciente.telefone && (
          <Text style={styles.info}>Tel: {consulta.paciente.telefone}</Text>
        )}
      </View>

      <View style={styles.secao}>
        <Text style={styles.label}>📅 Dados da Consulta</Text>
        <Text style={styles.valor}>Data: {formatarData(consulta.data)}</Text>
        <Text style={styles.valor}>
          Valor: {formatarValor(consulta.valor)}
        </Text>
        {consulta.observacoes && (
          <Text style={styles.observacoes}>{consulta.observacoes}</Text>
        )}
      </View>

      <View style={styles.acoes}>
        {consulta.status === "agendada" && (
          <>
            {onConfirmar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Confirmar Consulta"
                  onPress={onConfirmar}
                  color="#4CAF50"
                />
              </View>
            )}

            {onCancelar && (
              <View style={styles.botaoContainer}>
                <Button
                  title="Cancelar Consulta"
                  onPress={onCancelar}
                  color="#F44336"
                />
              </View>
            )}
          </>
        )}

        {consulta.status === "confirmada" && (
          <View style={styles.mensagem}>
            <Text style={styles.mensagemTexto}>
              ✓ Consulta confirmada com sucesso!
            </Text>
          </View>
        )}

        {consulta.status === "cancelada" && (
          <View style={styles.mensagemCancelada}>
            <Text style={styles.mensagemTexto}>✗ Consulta cancelada</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadge: {
    backgroundColor: "#FFA500",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusConfirmada: {
    backgroundColor: "#4CAF50",
  },
  statusCancelada: {
    backgroundColor: "#F44336",
  },
  statusTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  secao: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  valor: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  observacoes: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 8,
  },
  acoes: {
    marginTop: 10,
  },
  botaoContainer: {
    marginBottom: 12,
  },
  mensagem: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  mensagemCancelada: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  mensagemTexto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});