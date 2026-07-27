import { Cliente } from "../../../interfaces/clientes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCliente(id: number) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  console.log("ID:", id);
  console.log("TOKEN:", token);

  const response = await fetch(`http://localhost:8080/clientes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["pegar dados"] },
  });

  console.log("STATUS:", response.status);

  const text = await response.text();
  console.log("BODY:", text);

  if (response.status === 401) {
    redirect("/login");
  }

  try {
    return JSON.parse(text) as Cliente;
  } catch (e) {
    console.error("Erro ao converter JSON:", e);
    return {} as Cliente;
  }
}