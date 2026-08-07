'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  Loader2,
  AlertCircle,
  Plus,
  Download,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { buscarContas, type Conta, type TransacaoConta } from './transferir/actions';
import { deleteConta } from '../cadastroConta/actions';

interface ContaComTransacoes extends Conta {
  transacoes?: TransacaoConta[];
}

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id;

  const [contas, setContas] = useState<ContaComTransacoes[]>([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [contaSelecionada, setContaSelecionada] = useState(0);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);

        // Busca nome do cliente (necessário para a saudação)
        const resCliente = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cliente/${clienteId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (resCliente.ok) {
          const data = await resCliente.json();
          setNomeCliente(data.nome || '');
        }

        // Busca contas com transações via server action (mesma fonte do extrato)
        const resultado = await buscarContas(Number(clienteId));
        if (resultado.sucesso && resultado.contas) {
          setContas(resultado.contas as ContaComTransacoes[]);
        } else {
          setError(resultado.erro || 'Erro ao buscar contas');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      buscarDados();
    }
  }, [clienteId]);

  const handleExcluirConta = async (e: React.MouseEvent, contaId: number) => {
    e.stopPropagation();
    const confirmar = window.confirm('Tem certeza que deseja excluir esta conta?');
    if (!confirmar) return;

    setExcluindoId(contaId);
    const sucesso = await deleteConta(contaId);
    setExcluindoId(null);

    if (sucesso) {
      setContas((prev) => prev.filter((c) => c.id !== contaId));
      setContaSelecionada(0);
    } else {
      alert('Não foi possível excluir a conta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteId');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
          <p className="text-white text-lg">Carregando suas informações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">Erro ao Carregar</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const contaAtiva = contas.length > 0 ? contas[contaSelecionada] : null;

  const saldoTotal = contas.reduce((acc, c) => acc + Number(c.saldo), 0);

  const transacoesRecentes = contaAtiva?.transacoes
    ? [...contaAtiva.transacoes]
        .sort(
          (a, b) =>
            new Date(b.dataTransacao).getTime() -
            new Date(a.dataTransacao).getTime()
        )
        .slice(0, 8)
    : [];

  // Ícone/cor pelo sinal do valor — igual ao extrato
  const obterIconeTransacao = (valor: number) =>
    valor >= 0 ? (
      <ArrowDownLeft className="w-5 h-5 text-green-400" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-red-400" />
    );

  const obterCorTransacao = (valor: number) =>
    valor >= 0 ? 'text-green-400' : 'text-red-400';

  const formatarDataHora = (data: string) =>
    new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const obterLabelTransacao = (tipo: string) => {
    const labels: Record<string, string> = {
      DEPOSITO: 'Depósito',
      SAQUE: 'Saque',
      TRANSFERENCIA: 'Transferência',
      PAGAMENTO: 'Pagamento',
    };
    return labels[tipo] || tipo;
  };

  const obterCorTipoConta = (tipo: string) => {
    const cores: Record<string, string> = {
      CORRENTE: 'from-blue-500/10 to-cyan-500/10',
      POUPANCA: 'from-green-500/10 to-emerald-500/10',
      UNIVERSITARIA: 'from-purple-500/10 to-pink-500/10',
      SALARIO: 'from-orange-500/10 to-amber-500/10',
    };
    return cores[tipo] || 'from-red-500/10 to-pink-500/10';
  };

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
          <span className="text-white font-bold text-xl">ForjaBank</span>
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
      <main className="relative z-10">
        {/* SAUDAÇÃO E RESUMO */}
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Olá, {nomeCliente.split(' ')[0] || 'usuário'}! 👋
                </h1>
                <p className="text-gray-400">Bem-vindo de volta ao ForjaBank</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Saldo Total</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold text-white">
                    {saldoVisivel
                      ? `R$ ${saldoTotal.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '••••••'}
                  </h2>
                  <button
                    onClick={() => setSaldoVisivel(!saldoVisivel)}
                    className="p-2 text-gray-400 hover:text-white transition"
                  >
                    {saldoVisivel ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AÇÕES RÁPIDAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: Send,
                  label: 'Transferir',
                  color: 'from-blue-500/20',
                  rota: `/clientes/${clienteId}/dashboard/transferir`,
                },
                {
                  icon: Plus,
                  label: 'Depositar',
                  color: 'from-green-500/20',
                  rota: `/clientes/${clienteId}/dashboard/depositar`,
                },
                {
                  icon: Download,
                  label: 'Extratos',
                  color: 'from-orange-500/20',
                  rota: `/clientes/${clienteId}/dashboard/extratos`,
                },
              ].map((acao, idx) => {
                const Icon = acao.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => router.push(acao.rota)}
                    className={`bg-linear-to-br ${acao.color} to-transparent border border-red-500/10 rounded-xl p-4 text-white font-bold hover:border-red-500/30 hover:scale-105 transition flex items-center justify-center gap-2`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{acao.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTAS */}
        <section className="px-6 py-8 border-t border-red-500/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Minhas Contas</h2>

            <button
              onClick={() => router.push(`/clientes/${clienteId}/cadastroConta`)}
              className="mb-4 p-2 text-gray-400 hover:text-white transition"
            >
              <Plus className="w-6 h-6" />
            </button>

            {contas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contas.map((conta, idx) => (
                  <div
                    key={conta.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setContaSelecionada(idx)}
                    onKeyDown={(e) => e.key === 'Enter' && setContaSelecionada(idx)}
                    className={`text-left transition-all cursor-pointer ${
                      contaSelecionada === idx ? 'ring-2 ring-red-400' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`bg-linear-to-br ${obterCorTipoConta(conta.tipo_conta)} border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm relative`}
                    >
                      <button
                        onClick={(e) => handleExcluirConta(e, conta.id)}
                        disabled={excluindoId === conta.id}
                        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                        aria-label="Excluir conta"
                      >
                        {excluindoId === conta.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">{conta.tipo_conta}</p>
                          <p className="text-white font-bold">
                            {conta.tipo_conta === 'CORRENTE'
                              ? 'Conta Corrente'
                              : conta.tipo_conta === 'POUPANCA'
                              ? 'Poupança'
                              : conta.tipo_conta === 'UNIVERSITARIA'
                              ? 'Universitária'
                              : 'Salário'}
                          </p>
                        </div>
                        <Wallet className="w-6 h-6 text-red-400" />
                      </div>

                      <p className="text-gray-400 text-xs mb-4">
                        Aberta em{' '}
                        {new Date(conta.data_abertura).toLocaleDateString('pt-BR')}
                      </p>

                      <p className="text-white text-2xl font-bold">
                        R${' '}
                        {Number(conta.saldo).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 text-center">
                <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma conta encontrada.</p>
              </div>
            )}
          </div>
        </section>

        {/* TRANSAÇÕES RECENTES */}
        <section className="px-6 py-8 border-t border-red-500/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Transações Recentes</h2>

            {contaAtiva && transacoesRecentes.length > 0 ? (
              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-red-500/10">
                        <th className="px-6 py-4 text-left text-sm text-gray-400">Tipo</th>
                        <th className="px-6 py-4 text-left text-sm text-gray-400">Data</th>
                        <th className="px-6 py-4 text-left text-sm text-gray-400">Descrição</th>
                        <th className="px-6 py-4 text-right text-sm text-gray-400">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transacoesRecentes.map((transacao) => (
                        <tr
                          key={transacao.id}
                          className="border-b border-red-500/5 hover:bg-red-500/5 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-500/10 rounded-lg">
                                {obterIconeTransacao(Number(transacao.valor))}
                              </div>
                              <div>
                                <p className="text-white font-bold">
                                  {obterLabelTransacao(transacao.tipo)}
                                </p>
                                <p className="text-gray-500 text-sm">{transacao.tipo}</p>
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
                            className={`px-6 py-4 text-right font-bold ${obterCorTransacao(Number(transacao.valor))}`}
                          >
                            {Number(transacao.valor) >= 0 ? '+' : ''}R${' '}
                            {Math.abs(Number(transacao.valor)).toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                  {contaAtiva
                    ? 'Nenhuma transação encontrada nesta conta.'
                    : 'Selecione uma conta para visualizar transações.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-red-500/10 px-6 py-8 mt-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2024 FinanceBank. Todos os direitos reservados. | Segurança 24/7</p>
          </div>
        </footer>
      </main>
    </div>
  );
}