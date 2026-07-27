'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  Download,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { buscarContas, type Conta } from '../transferir/actions';

interface Transacao {
  id: number;
  tipo: string;
  valor: number;
  descricao: string;
  dataTransacao: string;
}

interface ContaComTransacoes extends Conta {
  transacoes?: Transacao[];
}

export default function ExtratoPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const [contas, setContas] = useState<ContaComTransacoes[]>([]);
  const [contaSelecionada, setContaSelecionada] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    tipo: 'TODOS',
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const resultado = await buscarContas(Number(clienteId));

        if (resultado.sucesso) {
          setContas(resultado.contas as ContaComTransacoes[]);
        } else {
          setError(resultado.erro || 'Erro ao buscar dados');
        }
      } catch {
        setError('Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [clienteId]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('clienteId');
    router.push('/login');
  };

  const obterIconeTransacao = (tipo: string) => {
    switch (tipo) {
      case 'DEPOSITO':
      case 'TRANSFERENCIA':
        return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'SAQUE':
      case 'PAGAMENTO':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-400" />;
    }
  };

  const obterCorTransacao = (tipo: string) => {
    return ['DEPOSITO', 'TRANSFERENCIA'].includes(tipo)
      ? 'text-green-400'
      : 'text-red-400';
  };

  const obterLabelTransacao = (tipo: string) => {
    const labels: Record<string, string> = {
      DEPOSITO: 'Depósito',
      SAQUE: 'Saque',
      TRANSFERENCIA: 'Transferência',
      PAGAMENTO: 'Pagamento',
    };
    return labels[tipo] || tipo;
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const contaAtiva = contas.length > 0 ? contas[contaSelecionada] : null;

  let transacoesFiltradas = contaAtiva?.transacoes || [];

  if (filtros.tipo !== 'TODOS') {
    transacoesFiltradas = transacoesFiltradas.filter(
      (t) => t.tipo === filtros.tipo
    );
  }

  if (filtros.dataInicio) {
    const dataInicio = new Date(filtros.dataInicio);
    transacoesFiltradas = transacoesFiltradas.filter(
      (t) => new Date(t.dataTransacao) >= dataInicio
    );
  }

  if (filtros.dataFim) {
    const dataFim = new Date(filtros.dataFim);
    dataFim.setHours(23, 59, 59);
    transacoesFiltradas = transacoesFiltradas.filter(
      (t) => new Date(t.dataTransacao) <= dataFim
    );
  }

  transacoesFiltradas = transacoesFiltradas.sort(
    (a, b) =>
      new Date(b.dataTransacao).getTime() - new Date(a.dataTransacao).getTime()
  );

  const somaEntradas = transacoesFiltradas
    .filter((t) => ['DEPOSITO', 'TRANSFERENCIA'].includes(t.tipo))
    .reduce((acc, t) => acc + t.valor, 0);

  const somaSaidas = transacoesFiltradas
    .filter((t) => ['SAQUE', 'PAGAMENTO'].includes(t.tipo))
    .reduce((acc, t) => acc + Math.abs(t.valor), 0);

  const handleExportarTXT = () => {
    const textoExtrato = `
EXTRATO BANCÁRIO - ${contaAtiva?.tipo_conta}
Data de Geração: ${new Date().toLocaleDateString('pt-BR')}

RESUMO DO PERÍODO
Entradas: R$ ${somaEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Saídas: R$ ${somaSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

TRANSAÇÕES
${transacoesFiltradas
  .map(
    (t) =>
      `${formatarDataHora(t.dataTransacao)} | ${obterLabelTransacao(t.tipo)} | R$ ${Math.abs(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  )
  .join('\n')}
    `;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(textoExtrato)
    );
    element.setAttribute(
      'download',
      `extrato-${contaAtiva?.tipo_conta}-${new Date().getTime()}.txt`
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
          <p className="text-white text-lg">Carregando extratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black">
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[20%] right-[5%] animate-pulse" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center bg-red-950/60 backdrop-blur border-b border-red-500/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl">FinanceBank</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition">
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/20 transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Extratos</h1>
                <p className="text-gray-400">
                  Visualize suas transações e operações
                </p>
              </div>
            </div>
            {contaAtiva && (
              <button
                onClick={handleExportarTXT}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar
              </button>
            )}
          </div>

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {contas.length === 0 ? (
            <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma conta encontrada.</p>
            </div>
          ) : (
            <>
              {/* SELETOR DE CONTAS */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Selecione uma Conta
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {contas.map((conta, idx) => (
                    <button
                      key={conta.id}
                      onClick={() => setContaSelecionada(idx)}
                      className={`text-left transition-all p-4 rounded-xl border-2 ${
                        contaSelecionada === idx
                          ? 'bg-red-900/40 border-red-500'
                          : 'bg-red-900/20 border-red-500/10 hover:border-red-500/30'
                      }`}
                    >
                      <p className="text-gray-400 text-sm">
                        {conta.tipo_conta}
                      </p>
                      <p className="text-white font-bold">
                        R${' '}
                        {conta.saldo.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* FILTROS */}
              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-red-400" />
                  <h3 className="text-white font-bold">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Tipo de Transação
                    </label>
                    <select
                      value={filtros.tipo}
                      onChange={(e) =>
                        setFiltros((prev) => ({
                          ...prev,
                          tipo: e.target.value,
                        }))
                      }
                      className="w-full bg-red-950/50 border border-red-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500/50 transition"
                    >
                      <option value="TODOS">Todas</option>
                      <option value="DEPOSITO">Depósito</option>
                      <option value="TRANSFERENCIA">Transferência</option>
                      <option value="SAQUE">Saque</option>
                      <option value="PAGAMENTO">Pagamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={filtros.dataInicio}
                      onChange={(e) =>
                        setFiltros((prev) => ({
                          ...prev,
                          dataInicio: e.target.value,
                        }))
                      }
                      className="w-full bg-red-950/50 border border-red-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={filtros.dataFim}
                      onChange={(e) =>
                        setFiltros((prev) => ({
                          ...prev,
                          dataFim: e.target.value,
                        }))
                      }
                      className="w-full bg-red-950/50 border border-red-500/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500/50 transition"
                    />
                  </div>
                </div>
              </div>

              {/* RESUMO */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-red-900/20 border border-red-500/10 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Saldo Atual</p>
                  <p className="text-white text-2xl font-bold">
                    R${' '}
                    {contaAtiva?.saldo.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-300 text-sm mb-1">Entradas</p>
                  <p className="text-green-400 text-2xl font-bold">
                    R${' '}
                    {somaEntradas.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm mb-1">Saídas</p>
                  <p className="text-red-400 text-2xl font-bold">
                    R${' '}
                    {somaSaidas.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* TRANSAÇÕES */}
              {transacoesFiltradas.length > 0 ? (
                <div className="bg-red-900/20 border border-red-500/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-red-500/10">
                          <th className="px-6 py-4 text-left text-sm text-gray-400">
                            Tipo
                          </th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">
                            Data
                          </th>
                          <th className="px-6 py-4 text-left text-sm text-gray-400">
                            Descrição
                          </th>
                          <th className="px-6 py-4 text-right text-sm text-gray-400">
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoesFiltradas.map((transacao) => (
                          <tr
                            key={transacao.id}
                            className="border-b border-red-500/5 hover:bg-red-500/5 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                  {obterIconeTransacao(transacao.tipo)}
                                </div>
                                <div>
                                  <p className="text-white font-bold">
                                    {obterLabelTransacao(transacao.tipo)}
                                  </p>
                                  <p className="text-gray-500 text-sm">
                                    {transacao.tipo}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400">
                              {formatarDataHora(transacao.dataTransacao)}
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                              {transacao.descricao}
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-bold ${obterCorTransacao(transacao.tipo)}`}
                            >
                              {transacao.valor >= 0 ? '+' : ''}R${' '}
                              {Math.abs(transacao.valor).toLocaleString(
                                'pt-BR',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Nenhuma transação encontrada com os filtros aplicados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}