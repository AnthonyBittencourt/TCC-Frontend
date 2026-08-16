"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = "http://localhost:8080";

async function request(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
  }
) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;
  const tipo = cookieStore.get("user_type")?.value;

  if (!token || tipo !== "funcionario") {
    redirect("/login");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) return null;

  return response.json();
}

/* ============================
          CLIENTES
============================ */

export async function listarClientes() {
  return request("/clientes");
}

export async function buscarCliente(id: number) {
  return request(`/cliente/${id}`);
}

export async function criarCliente(data: {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
  senha: string;
}) {
  return request("/clientes", {
    method: "POST",
    body: data,
  });
}

export async function atualizarCliente(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/clientes/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirCliente(id: number) {
  return request(`/clientes/${id}`, {
    method: "DELETE",
  });
}

/* ============================
          FUNCIONÁRIOS
============================ */

export async function listarFuncionarios() {
  return request("/funcionarios");
}

export async function buscarFuncionario(id: number) {
  return request(`/funcionario/${id}`);
}

export async function criarFuncionario(data: {
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
  agenciaIds?: number[];
}) {
  return request("/funcionarios", {
    method: "POST",
    body: data,
  });
}

export async function atualizarFuncionario(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/funcionarios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirFuncionario(id: number) {
  return request(`/funcionarios/${id}`, {
    method: "DELETE",
  });
}

/* ============================
            CONTAS
============================ */

export async function listarContas() {
  return request("/contas");
}

export async function buscarConta(id: number) {
    const dados = await request(`/conta/${id}`);

  console.log("🔥 BUSCAR CONTA:", JSON.stringify(dados, null, 2));

  return dados;
}

export async function criarConta(data: Record<string, unknown>) {
  return request("/contas", {
    method: "POST",
    body: data,
  });
}

export async function atualizarConta(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/contas/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirConta(id: number) {
  return request(`/contas/${id}`, {
    method: "DELETE",
  });
}


/* ============================
            AGÊNCIAS
============================ */

export async function listarAgencias() {
  return request("/agencias");
}

export async function buscarAgencia(id: number) {
  const dados = await request(`/agencia/${id}`);

  console.log("🔥 BUSCAR AGENCIA:", JSON.stringify(dados, null, 2));

  return dados;
}

export async function criarAgencia(data: {
  nome: string;
  numero: string;
  endereco: string;
}) {
  return request("/agencias", {
    method: "POST",
    body: data,
  });
}

export async function atualizarAgencia(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/agencias/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirAgencia(id: number) {
  return request(`/agencias/${id}`, {
    method: "DELETE",
  });
}

/* ============================
            CARTÕES
============================ */

export async function listarCartoes() {
  return request("/cartoes");
}

export async function buscarCartao(id: number) {
  return request(`/cartao/${id}`);
}

export async function criarCartao(data: Record<string, unknown>) {
  return request("/cartoes", {
    method: "POST",
    body: data,
  });
}

export async function atualizarCartao(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/cartoes/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirCartao(id: number) {
  return request(`/cartoes/${id}`, {
    method: "DELETE",
  });
}

/* ============================
          TRANSAÇÕES
============================ */

export async function listarTransacoes() {
  return request("/transacoes");
}

export async function buscarTransacao(id: number) {
  return request(`/transacao/${id}`);
}

export async function criarTransacao(data: Record<string, unknown>) {
  return request("/transacoes", {
    method: "POST",
    body: data,
  });
}

export async function atualizarTransacao(
  id: number,
  data: Record<string, unknown>
) {
  return request(`/transacoes/${id}`, {
    method: "PUT",  
    body: data,
  });
}

export async function excluirTransacao(id: number) {
  return request(`/transacoes/${id}`, {
    method: "DELETE",
  });
}