'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { Cliente } from '../../../../interfaces/clientes';

export async function getCliente(id: number): Promise<Cliente> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cliente/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ['listar'] },
    }
  );

  if (response.status === 401) {
    redirect('/login');
  }

  const text = await response.text();

  try {
    return JSON.parse(text) as Cliente;
  } catch (e) {
    console.error('Erro ao converter JSON:', e);
    return {} as Cliente;
  }
}

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
  data: string; // clientesController.getById formata o campo com este nome
}

// Reaproveita o getCliente (que já traz as contas com as transações
// aninhadas) e normaliza os campos numéricos, já que o backend pode
// devolver saldo/valor como string (Decimal do Prisma serializado).
export async function buscarContas(
  clienteId: number
): Promise<BuscarContasResultado> {
  try {
    const cliente = await getCliente(clienteId);
    const contasBrutas = cliente?.contas as unknown as ContaBruta[] | undefined;

    if (!contasBrutas) {
      return { sucesso: false, erro: 'Nenhuma conta encontrada' };
    }

    const contas: Conta[] = contasBrutas.map((conta) => ({
      id: conta.id,
      tipo_conta: conta.tipo_conta,
      saldo: Number(conta.saldo),
      data_abertura: conta.data_abertura,
      pix: conta.pix,
      transacoes: Array.isArray(conta.transacoes)
        ? conta.transacoes.map((t) => ({
            id: t.id,
            tipo: t.tipo,
            valor: Number(t.valor),
            descricao: t.descricao,
            dataTransacao: t.data,
          }))
        : [],
    }));

    return { sucesso: true, contas };
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return { sucesso: false, erro: 'Erro ao buscar contas' };
  }
}

export interface ContaEncontrada {
  id: number;
  tipo_conta: string;
  clienteNome?: string;
}

// Busca a conta de destino pelo campo `pix` real da conta (não é mais
// derivado do id — o valor é o que está salvo em `conta.pix` no backend).
export async function buscarContaPorChavePix(
  chave: string
): Promise<ContaEncontrada | null> {
  const chaveLimpa = chave.trim();

  if (!chaveLimpa) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contas/pix/${encodeURIComponent(chaveLimpa)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      return null;
    }

    const conta = await response.json();

    if (!conta?.id) {
      return null;
    }

    return {
      id: conta.id,
      tipo_conta: conta.tipo_conta,
      clienteNome: conta.cliente?.nome ?? conta.clientes?.[0]?.nome,
    };
  } catch (error) {
    console.error('Erro ao buscar conta pela chave PIX:', error);
    return null;
  }
}

interface RealizarTransferencia {
  contaOrigemId: number;
  contaDestinoId: number;
  valor: number;
  descricao?: string;
}

export async function realizarTransferencia(
  dados: RealizarTransferencia
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
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
          descricao: dados.descricao || undefined,
        }),
      }
    );

    console.log('[realizarTransferencia] status:', response.status);

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      const corpo = await response.text();
      console.error('[realizarTransferencia] erro do backend:', corpo);
      return false;
    }

    try {
      revalidateTag('listar', 'max');
    } catch (revalidateError) {
      console.error('Erro ao revalidar cache:', revalidateError);
    }

    return true;
  } catch (error) {
    console.error('Erro ao realizar transferência:', error);
    return false;
  }
}