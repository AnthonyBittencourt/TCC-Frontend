"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Cliente,
  ResumoFinanceiro,
  AnaliseFinanceira,
} from "../../../interfaces/clientes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

// =========================================================
// RESUMO FINANCEIRO
// =========================================================

export async function getResumoCliente(
  id: number,
  inicio?: string,
  fim?: string,
): Promise<ResumoFinanceiro> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const params = new URLSearchParams();

  if (inicio) {
    params.set("inicio", inicio);
  }

  if (fim) {
    params.set("fim", fim);
  }

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  const url =
    `${API_URL}/clientes/${id}/resumo${query}`;

  console.log("=================================");
  console.log("[DASHBOARD] BUSCAR RESUMO");
  console.log("CLIENTE ID:", id);
  console.log("INÍCIO:", inicio ?? "não informado");
  console.log("FIM:", fim ?? "não informado");
  console.log("URL:", url);
  console.log("TOKEN:", token ? "OK" : "NÃO ENCONTRADO");
  console.log("=================================");

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    next: {
      tags: [`resumo-${id}`],
    },
  });

  console.log(
    "[DASHBOARD] STATUS RESUMO:",
    response.status,
  );

  if (response.status === 401) {
    redirect("/login");
  }

  const text = await response.text();

  console.log(
    "[DASHBOARD] RESPOSTA BRUTA RESUMO:",
    text,
  );

  if (!response.ok) {
    console.error(
      "[DASHBOARD] ERRO AO BUSCAR RESUMO:",
      response.status,
      text,
    );

    throw new Error(
      `Erro ao buscar resumo financeiro. Status: ${response.status}`,
    );
  }

  try {
    const resumo =
      JSON.parse(text) as ResumoFinanceiro;

    console.log(
      "[DASHBOARD] RESUMO CONVERTIDO:",
      resumo,
    );

    return resumo;
  } catch (error) {
    console.error(
      "[DASHBOARD] Erro ao converter JSON do resumo:",
      error,
    );

    throw new Error(
      "Resposta inválida do servidor",
    );
  }
}

// =========================================================
// ANÁLISE FINANCEIRA
// =========================================================

export async function getAnaliseFinanceiraCliente(
  id: number,
  inicio?: string,
  fim?: string,
): Promise<AnaliseFinanceira> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const params = new URLSearchParams();

  if (inicio) {
    params.set("inicio", inicio);
  }

  if (fim) {
    params.set("fim", fim);
  }

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  const url =
    `${API_URL}/transacoes/cliente/${id}/analise${query}`;

  console.log("=================================");
  console.log("[DASHBOARD] ANÁLISE FINANCEIRA");
  console.log("CLIENTE ID:", id);
  console.log("INÍCIO:", inicio ?? "não informado");
  console.log("FIM:", fim ?? "não informado");
  console.log("URL:", url);
  console.log("TOKEN:", token ? "OK" : "NÃO ENCONTRADO");
  console.log("=================================");

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    next: {
      tags: [`analise-financeira-${id}`],
    },
  });

  console.log(
    "[DASHBOARD] STATUS ANÁLISE:",
    response.status,
  );

  if (response.status === 401) {
    redirect("/login");
  }

  const text = await response.text();

  console.log(
    "[DASHBOARD] RESPOSTA BRUTA ANÁLISE:",
    text,
  );

  if (!response.ok) {
    console.error(
      "[DASHBOARD] ERRO NA ANÁLISE FINANCEIRA:",
      response.status,
      text,
    );

    throw new Error(
      `Erro ao buscar análise financeira. Status: ${response.status}`,
    );
  }

  try {
    const analise =
      JSON.parse(text) as AnaliseFinanceira;

    console.log(
      "[DASHBOARD] ANÁLISE CONVERTIDA:",
      analise,
    );

    return analise;
  } catch (error) {
    console.error(
      "[DASHBOARD] Erro ao converter JSON da análise:",
      error,
    );

    throw new Error(
      "Resposta inválida do servidor",
    );
  }
}

// =========================================================
// LOGOUT
// =========================================================

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");

  redirect("/login");
}

// =========================================================
// BUSCAR CLIENTE
// =========================================================

export async function getCliente(
  id: number,
): Promise<Cliente> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const url =
    `${API_URL}/cliente/${id}`;

  console.log("");
  console.log("=================================");
  console.log("[DASHBOARD] BUSCAR CLIENTE");
  console.log("=================================");
  console.log("ID:", id);
  console.log("TOKEN:", token ? "OK" : "NÃO ENCONTRADO");
  console.log("URL:", url);
  console.log("=================================");

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    next: {
      tags: [`cliente-${id}`],
    },
  });

  console.log(
    "[DASHBOARD] STATUS CLIENTE:",
    response.status,
  );

  if (response.status === 401) {
    console.error(
      "[DASHBOARD] TOKEN NÃO AUTORIZADO",
    );

    redirect("/login");
  }

  const text = await response.text();

  // =======================================================
  // LOG DA RESPOSTA CRUA
  // =======================================================

  console.log("");
  console.log("=================================");
  console.log("[DASHBOARD] RESPOSTA BRUTA DO BACKEND");
  console.log("=================================");
  console.log(text);
  console.log("=================================");
  console.log("");

  if (!response.ok) {
    console.error(
      "[DASHBOARD] ERRO AO BUSCAR CLIENTE:",
      response.status,
      text,
    );

    throw new Error(
      `Erro ao buscar cliente. Status: ${response.status}`,
    );
  }

  try {
    const cliente =
      JSON.parse(text) as Cliente;

    // =====================================================
    // LOG DO OBJETO COMPLETO
    // =====================================================

    console.log("");
    console.log("=================================");
    console.log("[DASHBOARD] CLIENTE CONVERTIDO");
    console.log("=================================");

    console.dir(cliente, {
      depth: null,
    });

    console.log("=================================");
    console.log("");

    // =====================================================
    // LOG DAS CONTAS
    // =====================================================

    console.log("");
    console.log("=================================");
    console.log("[DASHBOARD] CONTAS DO CLIENTE");
    console.log("=================================");

    console.log(
      "Quantidade de contas:",
      cliente.contas?.length ?? 0,
    );

    cliente.contas?.forEach(
      (conta, contaIndex) => {
        console.log("");
        console.log(
          `---------- CONTA ${contaIndex + 1} ----------`,
        );

        console.log("ID:", conta.id);
        console.log(
          "Tipo:",
          conta.tipo_conta,
        );
        console.log(
          "Saldo:",
          conta.saldo,
        );

        console.log(
          "Quantidade de transações:",
          conta.transacoes?.length ?? 0,
        );

        // ===============================================
        // TRANSAÇÕES
        // ===============================================

        conta.transacoes?.forEach(
          (transacao, transacaoIndex) => {
            console.log("");

            console.log(
              `TRANSACAO ${transacaoIndex + 1}:`,
            );

            console.log(
              "Objeto completo:",
              transacao,
            );

            console.log(
              "ID:",
              transacao.id,
            );

            console.log(
              "TIPO:",
              transacao.tipo,
            );

            console.log(
              "VALOR:",
              transacao.valor,
            );

            console.log(
              "DESCRIÇÃO:",
              transacao.descricao,
            );

            console.log(
              "DATA:",
              transacao.data,
            );

            console.log(
              "TIPO DA DATA:",
              typeof transacao.data,
            );

            // =========================================
            // TENTATIVA DE DESCOBRIR O NOME REAL DA DATA
            // =========================================

            const transacaoQualquer =
              transacao as unknown as Record<
                string,
                unknown
              >;

            console.log(
              "dataTransacao:",
              transacaoQualquer.dataTransacao,
            );

            console.log(
              "data_transacao:",
              transacaoQualquer.data_transacao,
            );

            console.log(
              "data:",
              transacaoQualquer.data,
            );

            console.log(
              "createdAt:",
              transacaoQualquer.createdAt,
            );

            console.log(
              "created_at:",
              transacaoQualquer.created_at,
            );

            console.log(
              "updatedAt:",
              transacaoQualquer.updatedAt,
            );

            console.log(
              "updated_at:",
              transacaoQualquer.updated_at,
            );
          },
        );
      },
    );

    console.log("=================================");
    console.log(
      "[DASHBOARD] FIM DOS LOGS DAS TRANSAÇÕES",
    );
    console.log("=================================");
    console.log("");

    // =====================================================
    // LOG RESUMIDO
    // =====================================================

    const todasTransacoes =
      cliente.contas?.flatMap(
        (conta) =>
          conta.transacoes || [],
      ) ?? [];

    console.log("");
    console.log("=================================");
    console.log(
      "[DASHBOARD] TRANSAÇÕES RECEBIDAS - RESUMO",
    );
    console.log("=================================");

    console.table(
      todasTransacoes.map(
        (transacao) => ({
          id: transacao.id,
          tipo: transacao.tipo,
          valor: transacao.valor,
          dataTransacao:
            transacao.data,
          tipoData:
            typeof transacao.data,
          descricao:
            transacao.descricao,
        }),
      ),
    );

    console.log("=================================");
    console.log("");

    return cliente;
  } catch (error) {
    console.error(
      "[DASHBOARD] Erro ao converter JSON:",
      error,
    );

    console.error(
      "[DASHBOARD] Texto recebido:",
      text,
    );

    throw new Error(
      "Resposta inválida do servidor",
    );
  }
}