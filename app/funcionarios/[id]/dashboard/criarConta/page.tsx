'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
  CreditCard,
  Search,
  UserPlus,
  X,
  Check,
  Building2,
} from 'lucide-react';
import {
  criarContaFuncionario,
  listarClientesParaVinculo,
  listarAgenciasParaVinculo,
  type ClienteResumo,
  type AgenciaResumo,
} from './actions';

type TipoConta = 'CORRENTE' | 'POUPANCA' | 'UNIVERSITARIA' | 'SALARIO';

const TIPOS_CONTA: { value: TipoConta; label: string; desc: string }[] = [
  { value: 'CORRENTE', label: 'Conta Corrente', desc: 'Para o dia a dia, transferências e pagamentos' },
  { value: 'POUPANCA', label: 'Conta Poupança', desc: 'Rendimento mensal com liquidez imediata' },
  { value: 'UNIVERSITARIA', label: 'Conta Universitária', desc: 'Benefícios exclusivos para estudantes' },
  { value: 'SALARIO', label: 'Conta Salário', desc: 'Receba seu salário sem tarifas' },
];

export default function CriarContaFuncionarioPage() {
  const router = useRouter();
  const params = useParams();

  const funcionarioId = params.id as string;

  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [agencias, setAgencias] = useState<AgenciaResumo[]>([]);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<ClienteResumo[]>([]);

  const [form, setForm] = useState({
    tipo_conta: '' as TipoConta | '',
    saldo: '',
    data_abertura: '',
    agenciaId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregandoClientes(true);
        setErroCarregamento(null);
        const [listaClientes, listaAgencias] = await Promise.all([
          listarClientesParaVinculo(),
          listarAgenciasParaVinculo(),
        ]);
        if (!ativo) return;
        setClientes(Array.isArray(listaClientes) ? listaClientes : []);
        setAgencias(Array.isArray(listaAgencias) ? listaAgencias : []);
      } catch (err) {
        if (!ativo) return;
        setErroCarregamento(
          err instanceof Error ? err.message : 'Erro ao carregar clientes.'
        );
      } finally {
        if (ativo) setCarregandoClientes(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const disponiveis = clientes.filter(
      (c) => !selecionados.some((s) => s.id === c.id)
    );
    if (!termo) return disponiveis;
    return disponiveis.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.cpf.toLowerCase().includes(termo)
    );
  }, [clientes, selecionados, busca]);

  function handleAdicionarCliente(cliente: ClienteResumo) {
    setSelecionados((prev) => [...prev, cliente]);
    setError(null);
  }

  function handleRemoverCliente(id: number) {
    setSelecionados((prev) => prev.filter((c) => c.id !== id));
  }

  function validateForm(): string | null {
    if (!form.tipo_conta) return 'Selecione o tipo de conta.';
    if (form.saldo && Number(form.saldo) < 0) return 'O saldo inicial não pode ser negativo.';
    if (selecionados.length === 0) return 'Vincule ao menos um cliente à conta.';
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
    const conta = await criarContaFuncionario({
      tipo_conta: form.tipo_conta as TipoConta,
      saldo: form.saldo ? Number(form.saldo) : 0,
      data_abertura: form.data_abertura || undefined,
      agenciaId: form.agenciaId
        ? Number(form.agenciaId)
        : undefined,
      clienteIds: selecionados.map((c) => c.id),
    });

    if (!conta) {
      setError('Não foi possível abrir a conta. Tente novamente.');
      return;
    }

    // VOLTA PARA O DASHBOARD DO FUNCIONÁRIO ATUAL
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
           href={`/funcionarios/${funcionarioId}/dashboard`}
          className="text-sm text-gray-300 hover:text-red-400 flex items-center gap-1 transition"
        >
          <ChevronLeft size={14} /> Voltar ao painel
        </Link>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl space-y-8">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2">
              <CreditCard className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Abrir conta para cliente</h1>
            <p className="text-gray-400 text-sm">
              Selecione o tipo de conta e vincule um ou mais clientes já cadastrados
            </p>
          </div>

          {/* CARD */}
          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* TIPO DE CONTA */}
              <div className="space-y-1.5">
                <label htmlFor="tipo_conta" className="block text-sm text-gray-300">
                  Tipo de Conta
                </label>
                <div className="relative">
                  <select
                    id="tipo_conta"
                    value={form.tipo_conta}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tipo_conta: e.target.value as TipoConta }))
                    }
                    disabled={loading}
                    className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white appearance-none focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50 cursor-pointer"
                  >
                    <option value="" disabled className="text-gray-500">
                      Selecione o tipo de conta
                    </option>
                    {TIPOS_CONTA.map((t) => (
                      <option key={t.value} value={t.value} className="bg-red-950 text-white">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none"
                  />
                </div>
                {form.tipo_conta && (
                  <p className="text-xs text-gray-500 pl-1">
                    {TIPOS_CONTA.find((t) => t.value === form.tipo_conta)?.desc}
                  </p>
                )}
              </div>

              {/* SALDO INICIAL + AGÊNCIA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="saldo" className="block text-sm text-gray-300">
                    Saldo inicial{' '}
                    <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      R$
                    </span>
                    <input
                      id="saldo"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0,00"
                      value={form.saldo}
                      onChange={(e) => setForm((f) => ({ ...f, saldo: e.target.value }))}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="agenciaId" className="block text-sm text-gray-300">
                    Agência{' '}
                    <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <select
                      id="agenciaId"
                      value={form.agenciaId}
                      onChange={(e) => setForm((f) => ({ ...f, agenciaId: e.target.value }))}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white appearance-none focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50 cursor-pointer"
                    >
                      <option value="" className="bg-red-950 text-white">
                        Sem agência definida
                      </option>
                      {agencias.map((a) => (
                        <option key={a.id} value={a.id} className="bg-red-950 text-white">
                          {a.nome} — nº {a.numero}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CLIENTES VINCULADOS */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-300">
                  Clientes vinculados
                  <span className="text-gray-500 font-normal"> ({selecionados.length})</span>
                </label>

                {selecionados.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-1">
                    {selecionados.map((c) => (
                      <span
                        key={c.id}
                        className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full text-sm text-white"
                      >
                        {c.nome}
                        <button
                          type="button"
                          onClick={() => handleRemoverCliente(c.id)}
                          disabled={loading}
                          className="text-red-300 hover:text-white transition disabled:opacity-50"
                          aria-label={`Remover ${c.nome}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Buscar cliente por nome, e-mail ou CPF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    disabled={loading || carregandoClientes}
                    className="w-full pl-11 pr-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-red-500/10 bg-black/20 divide-y divide-red-500/5">
                  {carregandoClientes ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
                      <Loader2 size={16} className="animate-spin" />
                      Carregando clientes...
                    </div>
                  ) : erroCarregamento ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-red-300 text-sm px-4 text-center">
                      <AlertCircle size={16} className="shrink-0" />
                      {erroCarregamento}
                    </div>
                  ) : clientesFiltrados.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm px-4">
                      {busca
                        ? `Nenhum cliente encontrado para "${busca}".`
                        : 'Todos os clientes disponíveis já foram vinculados.'}
                    </div>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <button
                        key={cliente.id}
                        type="button"
                        onClick={() => handleAdicionarCliente(cliente)}
                        disabled={loading}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-red-500/10 transition disabled:opacity-50"
                      >
                        <span className="min-w-0">
                          <span className="block text-white text-sm font-medium truncate">
                            {cliente.nome}
                          </span>
                          <span className="block text-gray-500 text-xs truncate">
                            {cliente.email} · {cliente.cpf}
                          </span>
                        </span>
                        <span className="shrink-0 flex items-center gap-1 text-xs text-red-300">
                          <UserPlus size={14} />
                          Adicionar
                        </span>
                      </button>
                    ))
                  )}
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
                    <Check size={18} />
                    Abrir Conta
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-600">
            A chave Pix e a senha temporária da conta são geradas automaticamente
          </p>
        </div>
      </main>
    </div>
  );
}