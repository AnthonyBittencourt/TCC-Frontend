'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface CriarAgenciaInput {
  nome: string;
  numero: string;
  endereco: string;
}

export interface AgenciaCriada {
  id: number;
  nome: string;
  numero: string;
  endereco: string;
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

export async function criarAgencia(
  data: CriarAgenciaInput
): Promise<AgenciaCriada> {
  try {
    const token = await getTokenFuncionario();

    const response = await fetch(`${API_URL}/agencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (response.status === 401) redirect('/login');

    if (!response.ok) {
      const texto = await response.text();
      throw new Error(texto || 'Não foi possível criar a agência.');
    }

    const agencia = (await response.json()) as AgenciaCriada;

    try {
      revalidateTag('listar', "max");
    } catch (revalidateError) {
      console.error('Erro ao revalidar cache:', revalidateError);
    }

    return agencia;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao criar agência:', error);
    throw error instanceof Error
      ? error
      : new Error('Erro inesperado ao criar agência.');
  }
}