'use client';

import Link from "next/link";
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ChevronRight, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { createConta } from './actions';
import { useRouter, useParams } from "next/navigation";

type TipoConta = 'CORRENTE' | 'POUPANÇA' | 'UNIVERSITARIA' | 'SALARIO';

const TIPOS_CONTA: { value: TipoConta; label: string; desc: string }[] = [
  { value: 'CORRENTE',      label: 'Conta Corrente',      desc: 'Para o dia a dia, transferências e pagamentos' },
  { value: 'POUPANÇA',      label: 'Conta Poupança',      desc: 'Rendimento mensal com liquidez imediata' },
  { value: 'UNIVERSITARIA', label: 'Conta Universitária', desc: 'Benefícios exclusivos para estudantes' },
  { value: 'SALARIO',       label: 'Conta Salário',       desc: 'Receba seu salário sem tarifas' },
];

export default function CadastroContaPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const clienteId = Number(params.id);

  const [form, setForm] = useState({
    tipo_conta:    '' as TipoConta | '',
    saldo:         '',
    data_abertura: '',
    senha:         '',
  });

  function validateForm() {
    if (!form.tipo_conta) return 'Selecione o tipo de conta.';
    if (Number(form.saldo) < 0) return 'O saldo não pode ser negativo.';
    if (form.senha.length < 6) return 'A senha deve ter no mínimo 6 caracteres.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const conta = await createConta(clienteId, {
        senha:         form.senha,
        tipo_conta:    form.tipo_conta as TipoConta,
        saldo:         Number(form.saldo),
        data_abertura: form.data_abertura,
      });

      if (!conta) {
        setError('Não foi possível abrir a conta. Tente novamente.');
        return;
      }

      router.push(`/clientes/${clienteId}/dashboard`);
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
        <Link href="/login" className="text-sm text-gray-300 hover:text-red-400 flex items-center gap-1 transition">
          Já tem conta? Faça login <ChevronRight size={14} />
        </Link>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg space-y-8">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2">
              <CreditCard className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Abra sua conta</h1>
            <p className="text-gray-400 text-sm">
              Escolha o tipo de conta ideal para o seu perfil
            </p>
          </div>

          {/* CARD */}
          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

            {/* BADGE */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-300">Conta protegida com criptografia de ponta</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* TIPO DE CONTA */}
              <div className="space-y-1.5">
                <label htmlFor="tipo_conta" className="block text-sm text-gray-300">
                  Tipo de Conta
                </label>
                <div className="relative">
                  <select
                    id="tipo_conta"
                    value={form.tipo_conta}
                    onChange={e => setForm(f => ({ ...f, tipo_conta: e.target.value as TipoConta }))}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white appearance-none focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50 cursor-pointer"
                  >
                    <option value="" disabled className="text-gray-500">Selecione o tipo de conta</option>
                    {TIPOS_CONTA.map(t => (
                      <option key={t.value} value={t.value} className="bg-red-950 text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
                </div>

                {form.tipo_conta && (
                  <p className="text-xs text-gray-500 pl-1">
                    {TIPOS_CONTA.find(t => t.value === form.tipo_conta)?.desc}
                  </p>
                )}
              </div>

              {/* SENHA */}
              <div className="space-y-1.5">
                <label htmlFor="senha" className="block text-sm text-gray-300">
                  Senha da Conta
                </label>
                <div className="relative">
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                    Abrindo conta...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Abrir Conta com Segurança
                  </>
                )}
              </button>

            </form>
          </div>

          <p className="text-center text-xs text-gray-600">
            Ambiente seguro · SSL/TLS · Seus dados são protegidos com criptografia
          </p>
        </div>
      </main>
    </div>
  );
}