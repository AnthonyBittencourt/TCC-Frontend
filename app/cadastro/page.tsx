'use client';

import Link from "next/link"
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ChevronRight, AlertCircle, Loader2, User } from 'lucide-react';
import { cadastroAction } from './actions';
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter()


  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    senha: '',
    confirmSenha: '',
  });

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function handleCPF(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, cpf: formatCPF(e.target.value) }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, telefone: formatPhone(e.target.value) }));
  }

  function validateForm() {
    if (!form.nome.trim()) return 'Preencha o nome completo.';
    if (!form.email.trim()) return 'Preencha o email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email inválido.';
    if (form.cpf.replace(/\D/g, '').length !== 11) return 'CPF inválido.';
    if (!form.data_nascimento) return 'Preencha a data de nascimento.';
    if (form.telefone.replace(/\D/g, '').length !== 11) return 'Telefone inválido.';
    if (form.senha.length < 6) return 'Senha deve ter no mínimo 6 caracteres.';
    if (form.senha !== form.confirmSenha) return 'Senhas não conferem.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await cadastroAction({
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: form.cpf.replace(/\D/g, ''),
        data_nascimento: form.data_nascimento,
        telefone: form.telefone.replace(/\D/g, ''),
        senha: form.senha,
      });

      
      if (!result.success) {
        setError(result.message ?? 'Erro ao criar conta. Tente novamente.');
      }
      
      router.push("/")
      
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
          <span className="text-white font-bold text-xl">FinanceBank</span>
        </Link>

        <a
          href="/login"
          className="text-sm text-gray-300 hover:text-red-400 flex items-center gap-1 transition"
        >
          Já tem conta? Faça login <ChevronRight size={14} />
        </a>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl space-y-8">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2">
              <User className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
            <p className="text-gray-400 text-sm">
              Junte-se ao FinanceBank e gerencie suas finanças com segurança
            </p>
          </div>

          {/* CARD */}
          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* NOME */}
              <div className="space-y-1.5">
                <label htmlFor="nome" className="block text-sm text-gray-300">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="João Silva"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="joao@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                />
              </div>

              {/* CPF e DATA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cpf" className="block text-sm text-gray-300">
                    CPF
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={handleCPF}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="data_nascimento" className="block text-sm text-gray-300">
                    Data de Nascimento
                  </label>
                  <input
                    id="data_nascimento"
                    type="date"
                    value={form.data_nascimento}
                    onChange={e => setForm(f => ({ ...f, data_nascimento: e.target.value }))}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* TELEFONE */}
              <div className="space-y-1.5">
                <label htmlFor="telefone" className="block text-sm text-gray-300">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={handlePhone}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                />
              </div>

              {/* SENHA e CONFIRMAÇÃO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="senha" className="block text-sm text-gray-300">
                    Senha
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

                <div className="space-y-1.5">
                  <label htmlFor="confirmSenha" className="block text-sm text-gray-300">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmSenha}
                      onChange={e => setForm(f => ({ ...f, confirmSenha: e.target.value }))}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition pr-12 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      aria-label={showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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
                    Criando conta...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Criar Conta com Segurança
                  </>
                )}
              </button>

            </form>
          </div>

          {/* SEGURANÇA */}
          <p className="text-center text-xs text-gray-600">
            Ambiente seguro · SSL/TLS · Seus dados são protegidos com criptografia
          </p>

        </div>
      </main>
    </div>
  );
}