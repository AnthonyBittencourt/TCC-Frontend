"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Cliente } from "../../../interfaces/clientes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

  export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");

  redirect("/login");
}

export async function getCliente(id: number): Promise<Cliente> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  console.log("=================================");
  console.log("[DASHBOARD] BUSCAR CLIENTE");
  console.log("ID:", id);
  console.log("TOKEN:", token ? "OK" : "NÃO ENCONTRADO");
  console.log("URL:", `${API_URL}/cliente/${id}`);
  console.log("=================================");

  const response = await fetch(`${API_URL}/cliente/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: {
      tags: [`cliente-${id}`],
    },
  });

  console.log("[DASHBOARD] STATUS:", response.status);

  if (response.status === 401) {
    redirect("/login");
  }

  const text = await response.text();

  console.log("[DASHBOARD] BODY:", text);

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar cliente. Status: ${response.status}`,
    );
  }

  try {
    return JSON.parse(text) as Cliente;
  } catch (error) {
    console.error(
      "[DASHBOARD] Erro ao converter JSON:",
      error,
    );

    throw new Error("Resposta inválida do servidor");
  }
  
}