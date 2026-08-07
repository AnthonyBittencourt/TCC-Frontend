"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface CreateCliente {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  senha: string;
  telefone: string;
}

export async function createCliente(cliente: CreateCliente) {
  const response = await fetch("http://localhost:8080/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  const data = await response.json();

  if (response.status === 201) {
    revalidateTag("listar", "max");

    return {
      success: true,
      data,
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  return {
    success: false,
    message: data?.message ?? "Erro ao criar conta.",
  };
}