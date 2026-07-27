"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Decodifica o payload do JWT (sem lib externa)
function decodeJwt(token: string) {
  const payload = token.split(".")[1];
  const decoded = Buffer.from(payload, "base64url").toString("utf-8");
  return JSON.parse(decoded);
}

export async function loginAction(cpf: string, password: string) {
  let tipo: "cliente" | "funcionario" | null = null;
  let accessToken: string | null = null;
  let userId: number | null = null;

  try {
    let response = await fetch("http://localhost:8080/funcionarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, senha: password }),
    });

    if (response.ok) {
      const data = await response.json();
      tipo = "funcionario";
      accessToken = data.access_token;
      const payload = decodeJwt(data.access_token);
      console.log(payload);

      userId = payload.id;
    } else {
      response = await fetch("http://localhost:8080/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha: password }),
      });

      if (response.ok) {
        const data = await response.json();
        tipo = "cliente";
        accessToken = data.access_token;
        const payload = decodeJwt(data.access_token);
        userId = payload.sub ?? payload.id ?? payload.userId; // ajuste conforme seu JWT
      }
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return { success: false, message: "Erro interno do servidor." };
  }

  if (!tipo || !accessToken || !userId) {
    return { success: false, message: "CPF ou senha inválidos." };
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken);
  cookieStore.set("user_type", tipo);
  cookieStore.set("user_id", String(userId)); 

  if (tipo === "funcionario") {
    redirect("/dashboard/funcionario");
  }

  redirect(`/clientes/${userId}/dashboard`); 
}