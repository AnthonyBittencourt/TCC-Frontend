'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  UserCog,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { createFuncionario } from './actions';

export default function CriarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();

  const funcionarioId = String(params.id);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [admin, setAdmin] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setEnviando(true);

    try {
      const resultado = await createFuncionario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        admin,
      });

      console.log('RESULTADO:', resultado);
      console.log('ID:', funcionarioId);

      if (resultado.success) {
        router.push(`/funcionarios/${funcionarioId}/dashboard`);
        return;
      }

      setErro(
        resultado.message ?? 'Erro ao criar funcionário.'
      );
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);

      setErro(
        'Não foi possível criar o funcionário. Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black text-white">
      <div className="max-w-2xl mx-auto p-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          {/* CABEÇALHO */}
          <div className="flex items-center gap-4 mb-8">
            <UserCog size={40} className="text-red-400" />

            <div>
              <h1 className="text-3xl font-bold">Novo Funcionário</h1>
              <p className="text-gray-400">Cadastre um novo funcionário no sistema.</p>
            </div>
          </div>

          {/* ERRO */}
          {erro && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{erro}</p>
            </div>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="nome" className="block text-sm text-gray-400 mb-2">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-red-400 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@forjabank.com"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-red-400 transition"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm text-gray-400 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/20 border border-red-500/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-red-400 transition"
              />
            </div>

            <label
              htmlFor="admin"
              className="flex items-center justify-between bg-black/20 border border-red-500/20 rounded-lg px-4 py-3 cursor-pointer"
            >
              <div>
                <p className="font-bold">Administrador</p>
                <p className="text-gray-400 text-sm">
                  Concede acesso total ao painel de gestão.
                </p>
              </div>

              <input
                id="admin"
                type="checkbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
                className="w-5 h-5 accent-red-500"
              />
            </label>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 bg-black/20 border border-red-500/20 text-gray-300 rounded-lg hover:bg-black/30 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={enviando}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {enviando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Funcionário'
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}