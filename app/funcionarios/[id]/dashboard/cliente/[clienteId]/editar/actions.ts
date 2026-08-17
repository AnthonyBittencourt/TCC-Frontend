"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { Cliente } from "../../../../../../interfaces/clientes";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface UpdateCliente {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  senha?: string; // opcional: só envia se o funcionário digitar uma nova
}

export async function getClienteParaEdicao(id: number): Promise<Cliente> {
  const response = await fetch(`${API_URL}/cliente/${id}`, {
    next: { tags: [`cliente-${id}`, "listar"] },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar cliente (${response.status})`);
  }

  return response.json();
}

export async function updateCliente(id: number, dados: UpdateCliente) {
  try {
    // monta o body sem a chave "senha" quando ela vier vazia,
    // pra não sobrescrever a senha atual com string vazia
    const body: Record<string, unknown> = {
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf,
      data_nascimento: dados.data_nascimento,
      telefone: dados.telefone,
    };

    if (dados.senha && dados.senha.trim() !== "") {
      body.senha = dados.senha;
    }

    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      redirect("/login");
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message ?? data?.error ?? "Erro ao atualizar cliente.",
      };
    }

revalidateTag("listar", "max");
    revalidateTag(`cliente-${id}`, "max");

    return { success: true, data };
  } catch (error) {
    console.error("[updateCliente] erro:", error);
    return { success: false, message: "Serviço indisponível. Tente novamente." };
  }
}