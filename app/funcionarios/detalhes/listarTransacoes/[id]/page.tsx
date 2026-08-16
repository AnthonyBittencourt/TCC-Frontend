'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowLeftRight,
  Wallet,
  Calendar,
  CircleDollarSign,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

import { buscarTransacao } from '../../../[id]/dashboard/actions';

interface Conta {
  id: number;
  tipo_conta: string;
  saldo: number | string;
  pix?: string | null;
}

interface Transacao {
  id: number;
  tipo: string;
  valor: number | string;
  descricao?: string | null;
  dataTransacao: string;

  contaOrigem?: Conta | null;
  contaDestino?: Conta | null;
}

export default function TransacaoDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [transacao, setTransacao] = useState<Transacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const id = Number(params.id);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      return;
    }

    async function carregar() {
      try {
        const dados = await buscarTransacao(id);
        setTransacao(dados);
      } catch (error) {
        console.error('Erro ao buscar transação:', error);
        setErro(
          'Não foi possível carregar os dados da transação.'
        );
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  /*
   * O ID é inválido.
   *
   * Não usamos setErro/setLoading aqui porque isso aconteceria
   * sincronamente dentro do useEffect.
   */
  if (!id || Number.isNaN(id)) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 text-red-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">
            <p className="text-red-300">
              ID da transação inválido.
            </p>
          </div>

        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">
          Carregando transação...
        </p>
      </div>
    );
  }

  if (erro || !transacao) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-8 text-red-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">
            <p className="text-red-300">
              {erro || 'Transação não encontrada.'}
            </p>
          </div>

        </div>
      </div>
    );
  }

  const valor = Number(transacao.valor);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* VOLTAR */}

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          {/* CABEÇALHO */}

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-red-500/10 p-3 rounded-xl">
              <ArrowLeftRight
                size={40}
                className="text-red-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Transação #{transacao.id}
              </h1>

              <p className="text-gray-400">
                {transacao.tipo}
              </p>
            </div>

          </div>

          {/* INFORMAÇÕES */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* VALOR */}

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Valor
                </p>
              </div>

              <p className="text-3xl font-bold text-green-400">
                R${' '}
                {valor.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

            </div>

            {/* TIPO */}

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Tipo da transação
                </p>
              </div>

              <p className="text-xl font-bold">
                {transacao.tipo}
              </p>

            </div>

            {/* DATA */}

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Data da realização
                </p>
              </div>

              <p>
                {new Date(
                  transacao.dataTransacao
                ).toLocaleString('pt-BR')}
              </p>

            </div>

            {/* DESCRIÇÃO */}

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">
                <FileText
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Descrição
                </p>
              </div>

              <p>
                {transacao.descricao || 'Sem descrição'}
              </p>

            </div>

          </div>

          {/* CONTA ORIGEM */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ArrowUpRight className="text-red-400" />
              Conta de origem
            </h2>

            {transacao.contaOrigem ? (

              <div className="bg-black/20 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-4">

                  <Wallet
                    size={24}
                    className="text-red-400"
                  />

                  <div>
                    <p className="font-bold text-lg">
                      Conta #{transacao.contaOrigem.id}
                    </p>

                    <p className="text-gray-400">
                      {transacao.contaOrigem.tipo_conta}
                    </p>
                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <p className="text-gray-400 text-sm">
                      Número da conta
                    </p>

                    <p>
                      #{transacao.contaOrigem.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Tipo
                    </p>

                    <p>
                      {transacao.contaOrigem.tipo_conta}
                    </p>
                  </div>

                </div>

              </div>

            ) : (

              <div className="bg-black/20 rounded-xl p-5">
                <p className="text-gray-400">
                  Nenhuma conta de origem informada.
                </p>
              </div>

            )}

          </div>

          {/* CONTA DESTINO */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ArrowDownLeft className="text-red-400" />
              Conta de destino
            </h2>

            {transacao.contaDestino ? (

              <div className="bg-black/20 rounded-xl p-5">

                <div className="flex items-center gap-3 mb-4">

                  <Wallet
                    size={24}
                    className="text-red-400"
                  />

                  <div>
                    <p className="font-bold text-lg">
                      Conta #{transacao.contaDestino.id}
                    </p>

                    <p className="text-gray-400">
                      {transacao.contaDestino.tipo_conta}
                    </p>
                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <p className="text-gray-400 text-sm">
                      Número da conta
                    </p>

                    <p>
                      #{transacao.contaDestino.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Tipo
                    </p>

                    <p>
                      {transacao.contaDestino.tipo_conta}
                    </p>
                  </div>

                </div>

              </div>

            ) : (

              <div className="bg-black/20 rounded-xl p-5">
                <p className="text-gray-400">
                  Nenhuma conta de destino informada.
                </p>
              </div>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}