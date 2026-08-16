'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UserCog,
  Mail,
  Shield,
  Building2,
  Calendar,
} from 'lucide-react';

import { buscarFuncionario } from '../../../[id]/dashboard/actions';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  createdAt?: string;
  updateAt?: string;

  agencias: {
    id: number;
    nome: string;
    numero: string;
    endereco?: string;
  }[];
}

export default function FuncionarioDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [funcionario, setFuncionario] =
    useState<Funcionario | null>(null);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const id = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(id)) {
      return;
    }

    async function carregar() {
      try {
        const dados = await buscarFuncionario(id);
        setFuncionario(dados);
      } catch (error) {
        console.error(
          'Erro ao buscar funcionário:',
          error
        );

        setErro(
          'Não foi possível carregar os dados do funcionário.'
        );
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
            ID do funcionário inválido.
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
          Carregando funcionário...
        </div>
      </div>
    );
  }

  if (erro || !funcionario) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">

          <p className="mb-6">
            {erro || 'Funcionário não encontrado.'}
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

            <UserCog
              size={40}
              className="text-red-400"
            />

            <div>

              <h1 className="text-3xl font-bold">
                {funcionario.nome}
              </h1>

              <p className="text-gray-400">
                Funcionário #{funcionario.id}
              </p>

            </div>

          </div>

          {/* INFORMAÇÕES */}

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Mail
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Email
                </p>

              </div>

              <p>
                {funcionario.email}
              </p>

            </div>

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Shield
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Permissão
                </p>

              </div>

              <p>
                {funcionario.admin
                  ? 'Administrador'
                  : 'Funcionário'}
              </p>

            </div>

            {funcionario.createdAt && (
              <div className="bg-black/20 rounded-xl p-5">

                <div className="flex items-center gap-2 mb-2">

                  <Calendar
                    size={18}
                    className="text-red-400"
                  />

                  <p className="text-gray-400">
                    Data de cadastro
                  </p>

                </div>

                <p>
                  {new Date(
                    funcionario.createdAt
                  ).toLocaleDateString('pt-BR')}
                </p>

              </div>
            )}

          </div>

          {/* AGÊNCIAS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Building2 />
              Agências
            </h2>

            {funcionario.agencias.length === 0 ? (

              <p className="text-gray-400">
                Nenhuma agência vinculada.
              </p>

            ) : (

              funcionario.agencias.map((agencia) => (

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

                  {agencia.endereco && (
                    <p className="text-gray-400">
                      Endereço: {agencia.endereco}
                    </p>
                  )}

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}