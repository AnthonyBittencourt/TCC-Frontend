'use server';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface CadastroPayload {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  senha: string;
}

interface CadastroResponse {
  success: boolean;
  message?: string;
  data?: Cliente;
}

export async function cadastroAction(
  payload: CadastroPayload
): Promise<CadastroResponse> {
  console.log("API:", process.env.NEXT_PUBLIC_API_URL);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clientes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("STATUS:", response.status);

    const body = await response.text();
    console.log("BODY:", body);

    if (!response.ok) {
      return {
        success: false,
        message: body || "Erro ao criar conta.",
      };
    }

    let data: Cliente | undefined;

    try {
      data = JSON.parse(body);
    } catch (e) {
      console.error("Erro ao converter JSON:", e);
      return {
        success: false,
        message: "Resposta inválida do servidor.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("ERRO NO FETCH:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}