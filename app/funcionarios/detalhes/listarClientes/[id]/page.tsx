'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Hash,
  Wallet,
  Users,
  Shield,
  Mail,
} from 'lucide-react';

import { buscarAgencia } from '../../../[id]/dashboard/actions';

interface Agencia {
  id: number;
  nome: string;
  numero: string;
  endereco: string;

  contas: {
    id: number;
    tipo_conta: string;
    saldo: number | string;
    pix?: string | null;
    data_abertura: string;
  }[];

  funcionarios: {
    id: number;
    nome: string;
    email: string;
    admin: boolean;
  }[];
}

export default function AgenciaDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const id = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(id)) {
      return;
    }

    async function carregar() {
      try {
        const dados = await buscarAgencia(id);
        setAgencia(dados);
      } catch (error) {
        console.error('Erro ao buscar agencia:', error);
        setErro('Não foi possível carregar os dados da agencia.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">

          <p className="mb-6">
            ID da agência inválido.
          </p>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">
          Carregando agência...
        </div>
      </div>
    );
  }

  if (erro || !agencia) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">

          <p className="mb-6">
            {erro || 'Agência não encontrada.'}
          </p>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <div className="max-w-7xl mx-auto p-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          {/* CABEÇALHO */}

          <div className="flex items-center gap-4 mb-8">

            <Building2
              size={40}
              className="text-red-400"
            />

            <div>

              <h1 className="text-3xl font-bold">
                {agencia.nome}
              </h1>

              <p className="text-gray-400">
                Agência #{agencia.id}
              </p>

            </div>

          </div>

          {/* INFORMAÇÕES */}

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Hash
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Número
                </p>

              </div>

              <p>
                {agencia.numero}
              </p>

            </div>

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <MapPin
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Endereço
                </p>

              </div>

              <p>
                {agencia.endereco}
              </p>

            </div>

          </div>

          {/* CONTAS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Wallet />
              Contas
            </h2>

            {!agencia.contas || agencia.contas.length === 0 ? (

              <p className="text-gray-400">
                Nenhuma conta vinculada.
              </p>

            ) : (

              agencia.contas.map((conta) => (

                <div
                  key={conta.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-bold">
                        Conta #{conta.id}
                      </p>

                      <p className="text-gray-400">
                        {conta.tipo_conta}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-green-400">
                        R${' '}
                        {Number(
                          conta.saldo
                        ).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {conta.pix || 'Sem PIX'}
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 text-sm text-gray-400">

                    <p>
                      Abertura:{' '}
                      {new Date(
                        conta.data_abertura
                      ).toLocaleDateString('pt-BR')}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* FUNCIONÁRIOS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Users />
              Funcionários
            </h2>

            {!agencia.funcionarios || agencia.funcionarios.length === 0 ? (

              <p className="text-gray-400">
                Nenhum funcionário vinculado.
              </p>

            ) : (

              agencia.funcionarios.map((funcionario) => (

                <div
                  key={funcionario.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-bold">
                        {funcionario.nome}
                      </p>

                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Mail size={14} />
                        <p>
                          {funcionario.email}
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      {funcionario.admin && (
                        <span className="flex items-center gap-1 text-red-400 text-sm font-bold">
                          <Shield size={14} />
                          Admin
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}