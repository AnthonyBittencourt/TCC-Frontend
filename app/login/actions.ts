"use server";

import { cookies } from "next/headers";


type LoginResponse =
  | {
      success: true;
      type: "cliente" | "funcionario";
    }
  | {
      success: false;
      message: string;
    };

export async function loginAction(cpf: string, password: string): Promise<LoginResponse> {
  
  let response = await fetch("http://localhost:8080/funcionarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cpf,
      senha: password,
    }),
  });

  let data = await response.json();

  if (response.ok) {
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access_token);
    cookieStore.set("user_type", "funcionario");

    return {
      success: true,
      type: "funcionario",
    };
  }

  response = await fetch("http://localhost:8080/clientes/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cpf,
      senha: password,
    }),
  });

  data = await response.json();

  if (response.ok) {
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access_token);
    cookieStore.set("user_type", "cliente");

    return {
      success: true,
      type: "cliente",
    };
  }

  return {
    success: false,
    message: "Email ou senha inválidos.",
  };
}