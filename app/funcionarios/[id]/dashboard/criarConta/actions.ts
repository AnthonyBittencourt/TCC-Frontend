'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

type TipoConta = 'CORRENTE' | 'POUPANCA' | 'UNIVERSITARIA' | 'SALARIO';

export interface ClienteResumo {
  id: number;
  nome: string;
  cpf: string;
  email: string;
}

export interface AgenciaResumo {
  id: number;
  nome: string;
  numero: string;
}

export interface CreateContaFuncionarioInput {
  tipo_conta: TipoConta;
  saldo?: number;
  data_abertura?: string;
  pix?: string;
  senha?: string;
  clienteIds: number[];
  agenciaId?: number;
}

export interface ContaCriada {
  id: number;
  tipo_conta: string;
  saldo: number;
  data_abertura: string;
  pix: string;
  [key: string]: unknown;
}

async function getTokenFuncionario() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const tipo = cookieStore.get('user_type')?.value;

  if (!token || tipo !== 'funcionario') {
    redirect('/login');
  }

  return token;
}

function gerarChavePix(): string {
  return crypto.randomUUID();
}

function gerarSenhaTemporaria(): string {
  // Senha temporária: o cliente pode trocá-la depois pelo próprio painel.
  return crypto.randomUUID().slice(0, 8);
}

/* ============================
      BUSCA DE CLIENTES/AGÊNCIAS
      (para vincular à conta)
============================ */

export async function listarClientesParaVinculo(): Promise<ClienteResumo[]> {
  const token = await getTokenFuncionario();

  const response = await fetch(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (response.status === 401) redirect('/login');
  if (!response.ok) throw new Error(await response.text());

  return response.json();
}

export async function listarAgenciasParaVinculo(): Promise<AgenciaResumo[]> {
  const token = await getTokenFuncionario();

  const response = await fetch(`${API_URL}/agencias`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (response.status === 401) redirect('/login');
  if (!response.ok) throw new Error(await response.text());

  return response.json();
}

/* ============================
            CRIAR CONTA
============================ */

export async function criarContaFuncionario(
  data: CreateContaFuncionarioInput
): Promise<ContaCriada | null> {
  try {
    const token = await getTokenFuncionario();

    if (!data.clienteIds || data.clienteIds.length === 0) {
      throw new Error('Selecione ao menos um cliente para vincular à conta.');
    }

    const response = await fetch(`${API_URL}/contas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senha: data.senha || gerarSenhaTemporaria(),
        tipo_conta: data.tipo_conta,
        saldo: data.saldo ?? 0,
        data_abertura: data.data_abertura ?? new Date().toISOString(),
        pix: data.pix || gerarChavePix(),
        clienteIds: data.clienteIds,
        ...(data.agenciaId ? { agenciaId: data.agenciaId } : {}),
      }),
      cache: 'no-store',
    });

    if (response.status === 401) redirect('/login');

    if (!response.ok) {
      const texto = await response.text();
      throw new Error(texto || 'Não foi possível abrir a conta.');
    }

    const conta = (await response.json()) as ContaCriada;

    try {
      revalidateTag('listar', "max");
    } catch (revalidateError) {
      console.error('Erro ao revalidar cache:', revalidateError);
    }

    return conta;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao criar conta (funcionário):', error);
    throw error instanceof Error
      ? error
      : new Error('Erro inesperado ao criar conta.');
  }
}