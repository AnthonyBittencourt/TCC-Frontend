'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { Cliente } from '../../../../interfaces/clientes';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// =========================================================
// TIPOS
// =========================================================

export interface TransacaoConta {
  id: number;
  tipo: string;
  valor: number;
  descricao?: string;
  dataTransacao: string;
}

export interface Conta {
  id: number;
  tipo_conta: string;
  saldo: number;
  data_abertura: string;
  pix: string;
  transacoes?: TransacaoConta[];
}

interface BuscarContasResultado {
  sucesso: boolean;
  contas?: Conta[];
  erro?: string;
}

interface ContaBruta {
  id: number;
  tipo_conta: string;
  saldo: number | string;
  data_abertura: string;
  pix: string;
  transacoes?: TransacaoBruta[];
}

interface TransacaoBruta {
  id: number;
  tipo: string;
  valor: number | string;
  descricao?: string;
  dataTransacao?: string;
  data?: string;
  contaOrigemId?: number | null;
  contaDestinoId?: number | null;
}

export interface ContaEncontrada {
  id: number;
  tipo_conta: string;
  clienteNome?: string;
}

interface RealizarTransferencia {
  contaOrigemId: number;
  contaDestinoId: number;
  valor: number;
  descricao?: string;
}

interface ErroBackend {
  error?: string;
  message?: string;
}

// =========================================================
// GET CLIENTE
// =========================================================

export async function getCliente(
  id: number
): Promise<Cliente> {
  const cookieStore = await cookies();

  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(
    `${API_URL}/cliente/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      next: {
        tags: [`cliente-${id}`, 'listar'],
      },
    }
  );

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    const texto = await response.text();

    console.error(
      '[getCliente] erro:',
      response.status,
      texto
    );

    throw new Error(
      `Erro ao buscar cliente (${response.status})`
    );
  }

  const text = await response.text();

  try {
    return JSON.parse(text) as Cliente;
  } catch (error) {
    console.error(
      '[getCliente] erro ao converter JSON:',
      error
    );

    throw new Error('Resposta inválida do servidor');
  }
}

// =========================================================
// BUSCAR CONTAS
// =========================================================

export async function buscarContas(
  clienteId: number
): Promise<BuscarContasResultado> {
  try {
    const cliente = await getCliente(clienteId);

    const contasBrutas =
      cliente?.contas as unknown as
        | ContaBruta[]
        | undefined;

    if (!Array.isArray(contasBrutas)) {
      return {
        sucesso: false,
        erro: 'Nenhuma conta encontrada',
      };
    }

    const contas: Conta[] = contasBrutas.map((conta) => ({
      id: conta.id,
      tipo_conta: conta.tipo_conta,
      saldo: Number(conta.saldo),
      data_abertura: conta.data_abertura,
      pix: conta.pix,

      transacoes: Array.isArray(conta.transacoes)
        ? conta.transacoes.map((transacao) => {
            const valorAbsoluto = Math.abs(
              Number(transacao.valor)
            );

            const ehSaida =
              Number(transacao.contaOrigemId) ===
              Number(conta.id);

            return {
              id: transacao.id,
              tipo: transacao.tipo,
              valor: ehSaida
                ? -valorAbsoluto
                : valorAbsoluto,
              descricao: transacao.descricao,
              dataTransacao:
                transacao.dataTransacao ??
                transacao.data ??
                '',
            };
          })
        : [],
    }));

    return {
      sucesso: true,
      contas,
    };
  } catch (error) {
    console.error(
      '[buscarContas] erro:',
      error
    );

    return {
      sucesso: false,
      erro: 'Erro ao buscar contas',
    };
  }
}

// =========================================================
// BUSCAR CONTA POR PIX
// =========================================================

export async function buscarContaPorChavePix(
  chave: string
): Promise<ContaEncontrada | null> {
  const chaveLimpa = chave.trim();

  if (!chaveLimpa) {
    return null;
  }

  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    const response = await fetch(
      `${API_URL}/contas/pix/${encodeURIComponent(
        chaveLimpa
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      redirect('/login');
    }

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(
        '[buscarContaPorChavePix] status:',
        response.status
      );

      return null;
    }

    const conta = await response.json();

    if (!conta?.id) {
      return null;
    }

    return {
      id: Number(conta.id),
      tipo_conta: conta.tipo_conta,
      clienteNome:
        conta.cliente?.nome ??
        conta.clientes?.[0]?.nome,
    };
  } catch (error) {
    console.error(
      '[buscarContaPorChavePix] erro:',
      error
    );

    return null;
  }
}

// =========================================================
// REALIZAR TRANSFERÊNCIA
// =========================================================

export async function realizarTransferencia(
  dados: RealizarTransferencia
): Promise<{
  sucesso: boolean;
  erro?: string;
}> {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    // -----------------------------------------
    // VALIDAÇÕES FRONT/BACK
    // -----------------------------------------

    if (
      !Number.isInteger(dados.contaOrigemId) ||
      !Number.isInteger(dados.contaDestinoId)
    ) {
      return {
        sucesso: false,
        erro: 'IDs das contas inválidos.',
      };
    }

    if (
      !Number.isFinite(dados.valor) ||
      dados.valor <= 0
    ) {
      return {
        sucesso: false,
        erro: 'O valor deve ser maior que zero.',
      };
    }

    if (
      dados.contaOrigemId ===
      dados.contaDestinoId
    ) {
      return {
        sucesso: false,
        erro:
          'A conta de origem e destino não podem ser iguais.',
      };
    }

    // -----------------------------------------
    // REQUEST
    // -----------------------------------------

    const response = await fetch(
      `${API_URL}/transacoes`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          tipo: 'TRANSFERENCIA',

          contaOrigemId:
            dados.contaOrigemId,

          contaDestinoId:
            dados.contaDestinoId,

          valor: dados.valor,

          descricao:
            dados.descricao?.trim() ||
            undefined,
        }),
      }
    );

    console.log(
      '[realizarTransferencia] status:',
      response.status
    );

    // -----------------------------------------
    // TOKEN EXPIRADO
    // -----------------------------------------

    if (response.status === 401) {
      redirect('/login');
    }

    // -----------------------------------------
    // RESPOSTA DO BACKEND
    // -----------------------------------------

    const texto = await response.text();

    let resposta: ErroBackend = {};

    try {
      resposta = texto
        ? JSON.parse(texto)
        : {};
    } catch {
      console.error(
        '[realizarTransferencia] resposta não JSON:',
        texto
      );
    }

    if (!response.ok) {
      console.error(
        '[realizarTransferencia] erro backend:',
        resposta
      );

      return {
        sucesso: false,
        erro:
          resposta.error ??
          resposta.message ??
          'Erro ao realizar transferência.',
      };
    }

    // -----------------------------------------
    // ATUALIZA CACHE
    // -----------------------------------------

    try {
      revalidateTag('listar', 'max');
    } catch (error) {
      console.error(
        '[realizarTransferencia] erro ao revalidar cache:',
        error
      );
    }

    return {
      sucesso: true,
    };
  } catch (error) {
    console.error(
      '[realizarTransferencia] erro:',
      error
    );

    return {
      sucesso: false,
      erro:
        error instanceof Error
          ? error.message
          : 'Erro ao realizar transferência.',
    };
  }
}