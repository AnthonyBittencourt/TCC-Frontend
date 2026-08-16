'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Shield,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Building2,
  Hash,
  MapPin,
  Check,
} from 'lucide-react';
import { criarAgencia } from './actions';

interface FormState {
  nome: string;
  numero: string;
  endereco: string;
}

const FORM_INITIAL: FormState = {
  nome: '',
  numero: '',
  endereco: '',
};

export default function CriarAgenciaPage() {
  const router = useRouter();
    const params = useParams();
  
    const funcionarioId = params.id as string;

  const [form, setForm] = useState<FormState>(FORM_INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(null);
  }

  function validate(): string | null {
    if (!form.nome.trim()) return 'Informe o nome da agência.';
    if (!form.numero.trim()) return 'Informe o número da agência.';
    if (!form.endereco.trim()) return 'Informe o endereço da agência.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await criarAgencia({
        nome: form.nome.trim(),
        numero: form.numero.trim(),
        endereco: form.endereco.trim(),
      });

      router.push(`/funcionarios/${funcionarioId}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Serviço indisponível. Tente novamente em instantes.'
      );
    } finally {
      setLoading(false);
    }
  }

  const fields: {
    id: keyof FormState;
    label: string;
    placeholder: string;
    icon: React.ElementType;
    type?: string;
  }[] = [
    {
      id: 'nome',
      label: 'Nome da Agência',
      placeholder: 'Ex: Agência Centro',
      icon: Building2,
    },
    {
      id: 'numero',
      label: 'Número',
      placeholder: 'Ex: 0042',
      icon: Hash,
    },
    {
      id: 'endereco',
      label: 'Endereço',
      placeholder: 'Ex: Rua das Flores, 100 — Curitiba/PR',
      icon: MapPin,
    },
  ];

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
          <span className="text-gray-400 text-sm ml-2 hidden sm:inline">
            Painel do Funcionário
          </span>
        </Link>
        <Link
          href="/funcionarios"
          className="text-sm text-gray-300 hover:text-red-400 flex items-center gap-1 transition"
        >
          <ChevronLeft size={14} /> Voltar ao painel
        </Link>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-8">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2">
              <Building2 className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Nova Agência</h1>
            <p className="text-gray-400 text-sm">
              Preencha os dados para cadastrar uma nova agência no sistema
            </p>
          </div>

          {/* CARD */}
          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-300">
                Acesso restrito a funcionários autorizados
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {fields.map(({ id, label, placeholder, icon: Icon }) => (
                <div key={id} className="space-y-1.5">
                  <label htmlFor={id} className="block text-sm text-gray-300">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                      id={id}
                      name={id}
                      type="text"
                      placeholder={placeholder}
                      value={form[id]}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}

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
                className="w-full py-4 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-red-500/30 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Cadastrando agência...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Cadastrar Agência
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