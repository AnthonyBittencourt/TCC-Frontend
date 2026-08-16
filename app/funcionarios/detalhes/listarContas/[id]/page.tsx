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
  saldo: number | string;
  pix?: string | null;
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
    valor: number | string;
    data: string;
  }[];
}

export default function ContaDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [conta, setConta] = useState<Conta | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const id = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(id) || id <= 0) {
      return;
    }

    let ativo = true;

    async function carregar() {
      try {
        const dados = await buscarConta(id);

        if (ativo) {
          setConta(dados);
        }
      } catch (error) {
        console.error('Erro ao buscar conta:', error);

        if (ativo) {
          setErro('Não foi possível carregar os dados da conta.');
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [id]);

  // ID inválido
  if (Number.isNaN(id) || id <= 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="mt-8 bg-red-900/20 border border-red-500/20 rounded-2xl p-8">
          <p className="text-red-300">
            ID da conta inválido.
          </p>
        </div>
      </div>
    );
  }

  // Carregando
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
        <p className="text-gray-400">
          Carregando conta...
        </p>
      </div>
    );
  }

  // Erro ou conta inexistente
  if (erro || !conta) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="mt-8 bg-red-900/20 border border-red-500/20 rounded-2xl p-8">
          <p className="text-red-300">
            {erro || 'Conta não encontrada.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto p-8">

        {/* VOLTAR */}

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        {/* CONTEÚDO */}

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          {/* CABEÇALHO */}

          <div className="flex items-center gap-4 mb-8">
            <Wallet
              size={40}
              className="text-red-400"
            />

            <div>
              <h1 className="text-3xl font-bold">
                Conta #{conta.id}
              </h1>

              <p className="text-gray-400">
                {conta.tipo_conta}
              </p>
            </div>
          </div>

          {/* INFORMAÇÕES DA CONTA */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* SALDO */}

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">
                Saldo
              </p>

              <p className="text-3xl font-bold text-green-400">
                R${' '}
                {Number(conta.saldo).toLocaleString(
                  'pt-BR',
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
            </div>

            {/* PIX */}

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">
                PIX
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span>
                  {conta.pix || 'Não possui'}
                </span>

                {conta.pix && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        conta.pix!
                      )
                    }
                    title="Copiar chave PIX"
                    className="hover:text-red-400"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* DATA DE ABERTURA */}

            <div className="bg-black/20 rounded-xl p-5">
              <p className="text-gray-400">
                Data de abertura
              </p>

              <p>
                {new Date(
                  conta.data_abertura
                ).toLocaleDateString('pt-BR')}
              </p>
            </div>

          </div>

          {/* CLIENTES */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Users />
              Clientes
            </h2>

            {conta.clientes.length === 0 ? (
              <p className="text-gray-400">
                Nenhum cliente vinculado.
              </p>
            ) : (
              conta.clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >
                  <p className="font-bold">
                    {cliente.nome}
                  </p>

                  <p className="text-gray-300">
                    {cliente.email}
                  </p>

                  <p className="text-gray-400">
                    CPF: {cliente.cpf}
                  </p>
                </div>
              ))
            )}

          </div>

          {/* AGÊNCIAS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Building2 />
              Agências
            </h2>

            {conta.agencias.length === 0 ? (
              <p className="text-gray-400">
                Nenhuma agência vinculada.
              </p>
            ) : (
              conta.agencias.map((agencia) => (
                <div
                  key={agencia.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >
                  <p className="font-bold">
                    {agencia.nome}
                  </p>

                  <p className="text-gray-400">
                    Número: {agencia.numero}
                  </p>
                </div>
              ))
            )}

          </div>

          {/* CARTÕES */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <CreditCard />
              Cartões
            </h2>

            {conta.cartoes.length === 0 ? (
              <p className="text-gray-400">
                Nenhum cartão vinculado.
              </p>
            ) : (
              conta.cartoes.map((cartao) => (
                <div
                  key={cartao.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >
                  <p className="font-bold">
                    {cartao.numero_cartao}
                  </p>

                  <p className="text-gray-400">
                    {cartao.tipo_cartao}
                  </p>
                </div>
              ))
            )}

          </div>

          {/* TRANSAÇÕES */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ArrowLeftRight />
              Transações
            </h2>

            {conta.transacoes.length === 0 ? (
              <p className="text-gray-400">
                Nenhuma transação encontrada.
              </p>
            ) : (
              conta.transacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="bg-black/20 rounded-xl p-4 mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">
                      {transacao.tipo}
                    </p>

                    <p className="text-gray-400">
                      {new Date(
                        transacao.data
                      ).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <span className="font-bold text-green-400">
                    R${' '}
                    {Number(
                      transacao.valor
                    ).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </div>
  );
}