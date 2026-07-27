'use client';
import Link from "next/link"
import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ cpf: '', senha: '' });

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function handleCPF(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, cpf: formatCPF(e.target.value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.cpf || !form.senha) {
      setError('Preencha CPF e senha para continuar.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAction(
        form.cpf.replace(/\D/g, ''),
        form.senha
      );

      if (!result.success) {
        setError(result.message);
        return;
      }


    } catch {
      setError('Serviço indisponível. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex flex-col overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[10%] right-[5%] animate-pulse" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center bg-red-950/60 backdrop-blur border-b border-red-500/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl">ForjaBank</span>
        </Link>

        <a
          href="/clientes/cadastro"
          className="text-sm text-gray-300 hover:text-red-400 flex items-center gap-1 transition"
        >
          Não tem conta? Cadastre-se <ChevronRight size={14} />
        </a>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2">
              <Lock className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Acesse sua conta</h1>
            <p className="text-gray-400 text-sm">
              Conexão protegida com criptografia de ponta a ponta
            </p>
          </div>

          {/* CARD */}
          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* CPF */}
              <div className="space-y-1.5">
                <label htmlFor="cpf" className="block text-sm text-gray-300">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleCPF}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                />
              </div>

              {/* SENHA */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="senha" className="block text-sm text-gray-300">
                    Senha
                  </label>
                  <a href="/recuperar-senha" className="text-xs text-red-400 hover:text-red-300 transition">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.senha}
                    onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition pr-12 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-red-500/30 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Entrar com segurança
                  </>
                )}
              </button>

            </form>
          </div>

          {/* SEGURANÇA */}
          <p className="text-center text-xs text-gray-600">
            Ambiente seguro · SSL/TLS · FinanceBank nunca pede sua senha por telefone
          </p>

        </div>
      </main>
    </div>
  );
}