'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Cliente, Conta } from '../../../../interfaces/clientes';

export type { Conta };

interface ResultadoBuscarContas {
  sucesso: boolean;
  contas: Conta[];
  erro?: string;
}

export async function buscarContasExtrato(
  clienteId: number
): Promise<ResultadoBuscarContas> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('access_token')?.value;

    const response = await fetch(`http://localhost:8080/clientes/${clienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ['pegar dados'] },
    });

    if (response.status === 401) {
      redirect('/login');
    }

    const text = await response.text();

    let cliente: Cliente;
    try {
      cliente = JSON.parse(text) as Cliente;
    } catch (e) {
      console.error('Erro ao converter JSON:', e);
      return {
        sucesso: false,
        contas: [],
        erro: 'Erro ao processar dados do cliente.',
      };
    }

    if (!cliente?.contas) {
      return {
        sucesso: false,
        contas: [],
        erro: 'Não foi possível carregar as contas do cliente.',
      };
    }

    return {
      sucesso: true,
      contas: cliente.contas,
    };
  } catch (error) {
    console.error('Erro ao buscar contas para extrato:', error);
    return {
      sucesso: false,
      contas: [],
      erro: 'Erro ao buscar dados das contas.',
    };
  }
}