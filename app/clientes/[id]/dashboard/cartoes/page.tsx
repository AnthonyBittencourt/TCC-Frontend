'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Bell,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Cartao {
  id: string;
  numero_cartao: number;
  tipoCartao: 'DEBITO' | 'CREDITO';
  validade: string;
  nome_titular: string;
  status: 'ATIVO' | 'BLOQUEADO' | 'CANCELADO';
}

export default function CartoesPage() {
  const router = useRouter();
  

  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCartao, setSelectedCartao] = useState<Cartao | null>(null);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [copiedCvv, setCopiedCvv] = useState<string | null>(null);

  const [novoCartao, setNovoCartao] = useState({
    tipo: 'DEBITO',
  });

  useEffect(() => {
    const buscarCartoes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cartoes`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar cartões');
        }

        const data = await response.json();
        setCartoes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao buscar cartões'
        );
      } finally {
        setLoading(false);
      }
    };

    buscarCartoes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteId');
    router.push('/login');
  };

  const handleSolicitarCartao = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cartao`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            tipoCartao: novoCartao.tipo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao solicitar cartão');
      }

      const data = await response.json();
      setCartoes([...cartoes, data]);
      setShowModal(false);
      setNovoCartao({ tipo: 'DEBITO' });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao solicitar cartão'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBloquearCartao = async (cartaoId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cartao/${cartaoId}/bloquear`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao bloquear cartão');
      }

      setCartoes(
        cartoes.map((c) =>
          c.id === cartaoId ? { ...c, status: 'BLOQUEADO' } : c
        )
      );
      setSelectedCartao(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao bloquear cartão'
      );
    }
  };

  const handleDeletarCartao = async (cartaoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este cartão?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cartao/${cartaoId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar cartão');
      }

      setCartoes(cartoes.filter((c) => c.id !== cartaoId));
      setSelectedCartao(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao deletar cartão'
      );
    }
  };

  const handleCopyCvv = async (cardId: string) => {
    // Simulating CVV - em produção seria do backend
    const cvv = '123';
    await navigator.clipboard.writeText(cvv);
    setCopiedCvv(cardId);
    setTimeout(() => setCopiedCvv(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      case 'BLOQUEADO':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'CANCELADO':
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300';
    }
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
                <h1 className="text-3xl font-bold text-white">Meus Cartões</h1>
                <p className="text-gray-400">
                  Gerenciar seus cartões de débito e crédito
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Solicitar Cartão
            </button>
          </div>

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-red-400 animate-spin mb-4" />
              <p className="text-white">Carregando seus cartões...</p>
            </div>
          )}

          {/* CARTÕES GRID */}
          {!loading && cartoes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cartoes.map((cartao) => (
                <button
                  key={cartao.id}
                  onClick={() => setSelectedCartao(cartao)}
                  className="text-left hover:scale-105 transition"
                >
                  <div className="bg-linear-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group h-full">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-300 text-sm">
                            Cartão de{' '}
                            {cartao.tipoCartao === 'DEBITO'
                              ? 'Débito'
                              : 'Crédito'}
                          </p>
                          <p className="text-white font-bold text-lg">
                            {cartao.tipoCartao === 'DEBITO'
                              ? '💳 Débito'
                              : '💰 Crédito'}
                          </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>

                      <div className="bg-black/20 rounded-xl p-4">
                        <p className="text-gray-400 text-xs mb-1">Número</p>
                        <p className="text-white font-mono text-lg">
                          •••• •••• •••• {String(cartao.numero_cartao).slice(-4)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs">Validade</p>
                          <p className="text-white font-bold text-sm">
                            {new Date(cartao.validade).toLocaleDateString(
                              'pt-BR'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Status</p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${getStatusColor(cartao.status)}`}
                          >
                            {cartao.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && cartoes.length === 0 && (
            <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                Nenhum cartão
              </h2>
              <p className="text-gray-400 mb-6">
                Você ainda não possui nenhum cartão. Solicite um agora!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Solicitar Cartão
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL - DETALHES DO CARTÃO */}
      {selectedCartao && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-red-950 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">
                Detalhes do Cartão
              </h2>
              <button
                onClick={() => setSelectedCartao(null)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Tipo</p>
                <p className="text-white font-bold">
                  {selectedCartao.tipoCartao === 'DEBITO'
                    ? 'Cartão de Débito'
                    : 'Cartão de Crédito'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Número</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono">
                    •••• •••• •••• {String(selectedCartao.numero_cartao).slice(-4)}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        String(selectedCartao.numero_cartao)
                      )
                    }
                    className="p-1 text-gray-400 hover:text-white transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Validade</p>
                  <p className="text-white font-bold">
                    {new Date(selectedCartao.validade).toLocaleDateString(
                      'pt-BR'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedCartao.status)}`}
                  >
                    {selectedCartao.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">CVV</p>
                <div className="flex items-center gap-2">
                  <input
                    type={visibleCards[selectedCartao.id] ? 'text' : 'password'}
                    value="123"
                    readOnly
                    className="flex-1 bg-red-950/50 border border-red-500/20 text-white rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() =>
                      setVisibleCards((prev) => ({
                        ...prev,
                        [selectedCartao.id]: !prev[selectedCartao.id],
                      }))
                    }
                    className="p-2 text-gray-400 hover:text-white transition"
                  >
                    {visibleCards[selectedCartao.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyCvv(selectedCartao.id)}
                    className="p-2 text-gray-400 hover:text-white transition"
                  >
                    {copiedCvv === selectedCartao.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
              <div className="flex gap-2">
                <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs">
                  Suas informações de cartão são protegidas e criptografadas.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedCartao.status === 'ATIVO' && (
                <button
                  onClick={() => handleBloquearCartao(selectedCartao.id)}
                  className="flex-1 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold rounded-lg hover:bg-yellow-500/30 transition"
                >
                  Bloquear Cartão
                </button>
              )}
              <button
                onClick={() => handleDeletarCartao(selectedCartao.id)}
                className="flex-1 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-bold rounded-lg hover:bg-red-500/30 transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - NOVO CARTÃO */}
      {showModal && !selectedCartao && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-red-950 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              Solicitar Novo Cartão
            </h2>

            <div className="space-y-4 mb-6">
              <label className="block">
                <p className="text-white font-bold mb-3">Tipo de Cartão</p>
                <div className="space-y-2">
                  {['DEBITO', 'CREDITO'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() =>
                        setNovoCartao((prev) => ({ ...prev, tipo }))
                      }
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        novoCartao.tipo === tipo
                          ? 'bg-red-900/40 border-red-500'
                          : 'bg-red-900/20 border-red-500/10 hover:border-red-500/30'
                      }`}
                    >
                      <p className="font-bold text-white">
                        {tipo === 'DEBITO' ? 'Cartão de Débito' : 'Cartão de Crédito'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {tipo === 'DEBITO'
                          ? 'Use para saques e compras à vista'
                          : 'Use para compras a prazo'}
                      </p>
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNovoCartao({ tipo: 'DEBITO' });
                }}
                className="flex-1 py-2 bg-red-900/30 border border-red-500/30 text-red-300 font-bold rounded-lg hover:bg-red-900/50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSolicitarCartao}
                disabled={loading}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}