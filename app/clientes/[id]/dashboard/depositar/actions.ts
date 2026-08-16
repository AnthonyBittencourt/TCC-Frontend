'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
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

interface AtualizarSaldo {
  saldo: number;
}

export async function atualizarSaldo(
  contaId: number,
  dados: AtualizarSaldo
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contas/${contaId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          saldo: dados.saldo,
        }),
      }
    );

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      console.error(await response.text());
      return false;
    }

    try {
      revalidateTag('listar', 'max');
    } catch (revalidateError) {
      console.error('Erro ao revalidar cache:', revalidateError);
    }

    return true;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao atualizar saldo:', error);
    return false;
  }
}

// Cria o registro de Transacao do depósito usando contaDestinoId,
// que é o campo que o controller de transações espera com o schema atual.
// O contaIds antigo (relação muitos-para-muitos) não existe mais.
export async function criarTransacaoDeposito(
  contaId: number,
  valor: number,
  descricao?: string
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
          tipo: 'DEPOSITO',
          valor,
          descricao: descricao || 'Depósito',
          contaDestinoId: contaId,
        }),
      }
    );

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      console.error(await response.text());
      return false;
    }

    try {
      revalidateTag('listar', 'max');
    } catch (revalidateError) {
      console.error('Erro ao revalidar cache:', revalidateError);
    }

    return true;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error('Erro ao criar transação de depósito:', error);
    return false;
  }
}