'use server';

import { cookies } from 'next/headers';

export interface Conta {
  id: number;
  numero: string;
  tipo_conta: string;
  saldo: number;
  data_abertura: string;
  [key: string]: unknown;
}

interface DadosTransferencia {
  contaOrigemId: number;
  contaDestinoId: number;
  valor: number;
  descricao?: string;
}

interface ResultadoTransferencia {
  sucesso: boolean;
  mensagem: string;
  dados?: unknown;
  erro?: string;
}

interface ClienteData {
  contas?: Conta[];
  [key: string]: unknown;
}

type ApiResponse<T = unknown> = {
  error?: string;
  message?: string;
  mensagem?: string;
  dados?: T;
  sucesso?: boolean;
  contas?: T[];
};

export async function realizarTransferencia(
  dados: DadosTransferencia
): Promise<ResultadoTransferencia> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return {
        sucesso: false,
        mensagem: '',
        erro: 'Autenticação necessária',
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transacoes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo: 'TRANSFERENCIA',
          contaOrigemId: dados.contaOrigemId,
          contaDestinoId: dados.contaDestinoId,
          valor: dados.valor,
          descricao: dados.descricao ?? '',
        }),
        cache: 'no-store',
      }
    );

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const parsedData = data as ApiResponse;

    if (!response.ok) {
      return {
        sucesso: false,
        mensagem: '',
        erro:
          parsedData.error ||
          parsedData.message ||
          parsedData.mensagem ||
          'Erro ao realizar transferência',
      };
    }

    return {
      sucesso: true,
      mensagem:
        parsedData.mensagem ||
        parsedData.message ||
        'Transferência realizada com sucesso',
      dados: parsedData.dados ?? parsedData,
    };
  } catch (error) {
    console.error('Erro ao realizar transferência:', error);

    return {
      sucesso: false,
      mensagem: '',
      erro:
        error instanceof Error
          ? error.message
          : 'Erro ao processar transferência',
    };
  }
}

export async function buscarContas(clienteId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return {
        sucesso: false,
        erro: 'Autenticação necessária',
        contas: [] as Conta[],
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cliente/${clienteId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const parsedData = data as ApiResponse;

    if (!response.ok) {
      return {
        sucesso: false,
        erro:
          parsedData.error ||
          parsedData.message ||
          parsedData.mensagem ||
          'Erro ao buscar contas',
        contas: [] as Conta[],
      };
    }

    const clienteData = parsedData.dados ?? parsedData;
    const contas = isClienteData(clienteData)
      ? (clienteData.contas ?? parsedData.contas ?? [])
      : (parsedData.contas ?? []);

    return {
      sucesso: true,
      contas: (contas as Conta[]) ?? [],
    };
  } catch (error) {
    console.error('Erro ao buscar contas:', error);

    return {
      sucesso: false,
      erro:
        error instanceof Error ? error.message : 'Erro ao buscar contas',
      contas: [] as Conta[],
    };
  }
}

// Type guard para validar ClienteData
function isClienteData(data: unknown): data is ClienteData {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('contas' in data || Object.keys(data).length > 0)
  );
}