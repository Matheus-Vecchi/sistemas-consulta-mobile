import AsyncStorage from "@react-native-async-storage/async-storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import { Paciente } from "../types/paciente";
import {
  especialidadesIniciais,
  medicosIniciais,
  pacientesIniciais,
} from "../data/seedData";

const KEYS = {
  ESPECIALIDADES: "@consultas:especialidades",
  MEDICOS: "@consultas:medicos",
  CONSULTAS: "@consultas:consultas",
  PACIENTES: "@consultas:pacientes",
  PACIENTE_LOGADO: "@consultas:pacienteLogado",
};

export async function salvarEspecialidades(especialidades: Especialidade[]) {
  try {
    await AsyncStorage.setItem(
      KEYS.ESPECIALIDADES,
      JSON.stringify(especialidades)
    );
  } catch (erro) {
    console.error("Erro ao salvar especialidades:", erro);
  }
}

export async function obterEspecialidades(): Promise<Especialidade[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.ESPECIALIDADES);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao obter especialidades:", erro);
    return [];
  }
}

export async function salvarMedicos(medicos: Medico[]) {
  try {
    await AsyncStorage.setItem(KEYS.MEDICOS, JSON.stringify(medicos));
  } catch (erro) {
    console.error("Erro ao salvar médicos:", erro);
  }
}

export async function obterMedicos(): Promise<Medico[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.MEDICOS);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao obter médicos:", erro);
    return [];
  }
}

export async function salvarConsultas(consultas: Consulta[]) {
  try {
    await AsyncStorage.setItem(KEYS.CONSULTAS, JSON.stringify(consultas));
  } catch (erro) {
    console.error("Erro ao salvar consultas:", erro);
  }
}

export async function obterConsultas(): Promise<Consulta[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.CONSULTAS);

    if (!dados) {
      return [];
    }

    const consultas = JSON.parse(dados);

    return consultas.map((c: any) => ({
      ...c,
      data: new Date(c.data),
    }));
  } catch (erro) {
    console.error("Erro ao obter consultas:", erro);
    return [];
  }
}

export async function salvarPacientes(pacientes: Paciente[]) {
  try {
    await AsyncStorage.setItem(KEYS.PACIENTES, JSON.stringify(pacientes));
  } catch (erro) {
    console.error("Erro ao salvar pacientes:", erro);
  }
}

export async function obterPacientes(): Promise<Paciente[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTES);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao obter pacientes:", erro);
    return [];
  }
}

export async function salvarPacienteLogado(paciente: Paciente) {
  try {
    await AsyncStorage.setItem(KEYS.PACIENTE_LOGADO, JSON.stringify(paciente));
  } catch (erro) {
    console.error("Erro ao salvar paciente logado:", erro);
  }
}

export async function obterPacienteLogado(): Promise<Paciente | null> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTE_LOGADO);
    return dados ? JSON.parse(dados) : null;
  } catch (erro) {
    console.error("Erro ao obter paciente logado:", erro);
    return null;
  }
}

export async function removerPacienteLogado() {
  try {
    await AsyncStorage.removeItem(KEYS.PACIENTE_LOGADO);
  } catch (erro) {
    console.error("Erro ao remover paciente logado:", erro);
  }
}

export async function inicializarDados() {
  try {
    const especialidades = await obterEspecialidades();
    if (especialidades.length === 0) {
      await salvarEspecialidades(especialidadesIniciais);
    }

    const medicos = await obterMedicos();
    if (medicos.length === 0) {
      await salvarMedicos(medicosIniciais);
    }

    const pacientes = await obterPacientes();
    if (pacientes.length === 0) {
      await salvarPacientes(pacientesIniciais);
    }
  } catch (erro) {
    console.error("Erro ao inicializar dados:", erro);
  }
}