"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface CreateFuncionario {
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}

export async function createFuncionario(funcionario: CreateFuncionario) {
  const response = await fetch("http://localhost:8080/funcionarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(funcionario),
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
    message: data?.message ?? "Erro ao criar funcionário.",
  };
}