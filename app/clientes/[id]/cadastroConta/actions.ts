'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { cookies } from 'next/headers';

interface CreateConta {
  senha: string;
  tipo_conta: 'CORRENTE' | 'POUPANCA' | 'UNIVERSITARIA' | 'SALARIO';
  saldo?: number;
  data_abertura?: string;
  pix: string;
}

interface ResponseConta {
  id: number;
  senha: string;
  tipo_conta: string;
  saldo: number;
  data_abertura: string;
  pix: string;
  [key: string]: unknown;
}

export async function createConta(
  clienteId: number,
  conta: CreateConta
): Promise<ResponseConta | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) redirect('/login');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senha: conta.senha,
        tipo_conta: conta.tipo_conta,
        saldo: conta.saldo ?? 0,
        data_abertura: conta.data_abertura ?? new Date().toISOString(),
        pix: conta.pix,
        clienteIds: [clienteId],
      }),
    });

    if (response.status === 401) redirect('/login');

    if (!response.ok) {
      console.error(await response.text());
      return null;
    }

    const contaData = (await response.json()) as ResponseConta;

    revalidateTag('listar', 'max');

    return contaData;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao criar conta:', error);
    return null;
  }
}

export async function deleteConta(contaId: number): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) redirect('/login');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contas/${contaId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) redirect('/login');

    if (!response.ok) {
      console.error(await response.text());
      return false;
    }

    revalidateTag('listar', 'max');

    return true;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao deletar conta:', error);
    return false;
  }
}