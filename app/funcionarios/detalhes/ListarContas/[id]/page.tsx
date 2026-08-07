'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Wallet,
  Users,
  Building2,
  CreditCard,
  ArrowLeftRight,
  Copy,
} from 'lucide-react';
import { buscarConta } from '../../../[id]/dashboard/actions';

interface Conta {
  id: number;
  tipo_conta: string;
  saldo: number;
  pix?: string;
  data_abertura: string;

  clientes: {
    id: number;
    nome: string;
    email: string;
    cpf: string;
  }[];

  agencias: {
    id: number;
    nome: string;
    numero: string;
  }[];

  cartoes: {
    id: number;
    numero_cartao: string;
    tipo_cartao: string;
  }[];

  transacoes: {
    id: number;
    tipo: string;
    valor: number;
    dataTransacao: string;
  }[];
}

export default function ContaDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [conta, setConta] = useState<Conta | null>(null);
  const [loading, setLoading] = useState(true);

const id = Number(params.id);

useEffect(() => {
  if (!id) return;

  async function carregar() {
    const dados = await buscarConta(id);
    setConta(dados);
    setLoading(false);
  }

  carregar();
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        Conta não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white">

      <div className="max-w-7xl mx-auto p-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18}/>
          Voltar
        </button>

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          <div className="flex items-center gap-4 mb-8">
            <Wallet size={40} className="text-red-400"/>
            <div>
              <h1 className="text-3xl font-bold">
                Conta #{conta.id}
              </h1>

              <p className="text-gray-400">
                {conta.tipo_conta}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">Saldo</p>

              <p className="text-3xl font-bold text-green-400">
                R$ {Number(conta.saldo).toLocaleString('pt-BR',{
                  minimumFractionDigits:2
                })}
              </p>
            </div>

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">PIX</p>

              <div className="flex items-center gap-2 mt-2">
                <span>{conta.pix || 'Não possui'}</span>

                {conta.pix && (
                  <button
                    onClick={() => navigator.clipboard.writeText(conta.pix!)}
                  >
                    <Copy size={16}/>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">Data de abertura</p>

              <p>
                {new Date(conta.data_abertura).toLocaleDateString('pt-BR')}
              </p>
            </div>

          </div>

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Users/>
              Clientes
            </h2>

            {conta.clientes.map(cliente=>(
              <div
                key={cliente.id}
                className="bg-black/20 rounded-xl p-4 mb-3"
              >
                <p><b>{cliente.nome}</b></p>
                <p>{cliente.email}</p>
                <p>{cliente.cpf}</p>
              </div>
            ))}

          </div>

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Building2/>
              Agências
            </h2>

            {conta.agencias.map(agencia=>(
              <div
                key={agencia.id}
                className="bg-black/20 rounded-xl p-4 mb-3"
              >
                <p>{agencia.nome}</p>
                <p>Número {agencia.numero}</p>
              </div>
            ))}

          </div>

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <CreditCard/>
              Cartões
            </h2>

            {conta.cartoes.map(cartao=>(
              <div
                key={cartao.id}
                className="bg-black/20 rounded-xl p-4 mb-3"
              >
                <p>{cartao.numero_cartao}</p>
                <p>{cartao.tipo_cartao}</p>
              </div>
            ))}

          </div>

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ArrowLeftRight/>
              Transações
            </h2>

            {conta.transacoes.length === 0 && (
              <p className="text-gray-400">
                Nenhuma transação encontrada.
              </p>
            )}

            {conta.transacoes.map(transacao=>(
              <div
                key={transacao.id}
                className="bg-black/20 rounded-xl p-4 mb-3 flex justify-between"
              >
                <div>
                  <p>{transacao.tipo}</p>

                  <p className="text-gray-400">
                    {new Date(transacao.dataTransacao).toLocaleString('pt-BR')}
                  </p>
                </div>

                <span className="font-bold text-green-400">
                  R$ {Number(transacao.valor).toLocaleString('pt-BR',{
                    minimumFractionDigits:2
                  })}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}