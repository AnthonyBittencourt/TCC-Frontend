'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bell,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { realizarTransferencia, buscarContas, type Conta } from './actions';

export default function TransferirPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasCarregando, setContasCarregando] = useState(true);

  const [formData, setFormData] = useState({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: '',
    descricao: '',
  });

  useEffect(() => {
    const carregarContas = async () => {
      try {
        const resultado = await buscarContas(Number(clienteId));
        if (resultado.sucesso) {
          setContas(resultado.contas);
          if (resultado.contas.length > 0) {
            setFormData((prev) => ({
              ...prev,
              contaOrigemId: String(resultado.contas[0].id),
            }));
          }
        } else {
          setError(resultado.erro || 'Erro ao carregar contas');
        }
      } catch {
        setError('Erro ao carregar contas');
      } finally {
        setContasCarregando(false);
      }
    };

    carregarContas();
  }, [clienteId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.contaOrigemId || !formData.contaDestinoId) {
        setError('Selecione as contas de origem e destino');
        return;
      }

      if (formData.contaOrigemId === formData.contaDestinoId) {
        setError('As contas de origem e destino devem ser diferentes');
        return;
      }

      setError(null);
      setStep(2);
      return;
    }

    if (!formData.valor) {
      setError('Informe o valor da transferência');
      return;
    }

    const valorNumerico = parseFloat(formData.valor);
    if (valorNumerico <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    const contaOrigem = contas.find(
      (c) => c.id === Number(formData.contaOrigemId)
    );
    if (contaOrigem && contaOrigem.saldo < valorNumerico) {
      setError('Saldo insuficiente nesta conta');
      return;
    }

    setLoading(true);
    try {
      const resultado = await realizarTransferencia({
        contaOrigemId: Number(formData.contaOrigemId),
        contaDestinoId: Number(formData.contaDestinoId),
        valor: valorNumerico,
        descricao: formData.descricao,
      });

      if (!resultado.sucesso) {
        setError(resultado.erro || 'Erro ao realizar transferência');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/clientes/${clienteId}/dashboard`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao realizar transferência'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('clienteId');
    router.push('/login');
  };

  const contaOrigemSelecionada = contas.find(
    (c) => c.id === Number(formData.contaOrigemId)
  );
  const contaDestinoSelecionada = contas.find(
    (c) => c.id === Number(formData.contaDestinoId)
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[20%] right-[5%] animate-pulse" />
      </div>

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

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  setError(null);
                } else {
                  router.back();
                }
              }}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Transferência</h1>
              <p className="text-gray-400">
                {step === 1 ? 'Escolha as contas' : 'Confirmação e envio'}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            {[1, 2].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full transition ${
                  num <= step ? 'bg-red-500' : 'bg-red-900/30'
                }`}
              />
            ))}
          </div>

          {success && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Transferência Realizada!
              </h2>
              <p className="text-gray-400">
                Redirecionando para o dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {contasCarregando ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-400 animate-spin mb-2" />
                  <p className="text-gray-400">Carregando suas contas...</p>
                </div>
              ) : contas.length === 0 ? (
                <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Você não possui contas para realizar transferências.
                  </p>
                </div>
              ) : (
                <>
                  {step === 1 && (
                    <>
                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <label className="block text-white font-bold mb-3">
                          Conta de Origem
                        </label>
                        <select
                          name="contaOrigemId"
                          value={formData.contaOrigemId}
                          onChange={handleInputChange}
                          className="w-full bg-red-950/50 border border-red-500/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition"
                        >
                          <option value="">Selecione uma conta</option>
                          {contas.map((conta) => (
                            <option key={conta.id} value={conta.id}>
                              {conta.tipo_conta} - R${' '}
                              {conta.saldo.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </option>
                          ))}
                        </select>
                      </div>

                      {contaOrigemSelecionada && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300">
                              Saldo disponível:
                            </span>
                            <span className="font-bold text-blue-300">
                              R${' '}
                              {contaOrigemSelecionada.saldo.toLocaleString(
                                'pt-BR',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <label className="block text-white font-bold mb-3">
                          Conta de Destino
                        </label>
                        <select
                          name="contaDestinoId"
                          value={formData.contaDestinoId}
                          onChange={handleInputChange}
                          className="w-full bg-red-950/50 border border-red-500/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition"
                        >
                          <option value="">Selecione uma conta</option>
                          {contas
                            .filter(
                              (c) =>
                                c.id !== Number(formData.contaOrigemId)
                            )
                            .map((conta) => (
                              <option key={conta.id} value={conta.id}>
                                {conta.tipo_conta} - R${' '}
                                {conta.saldo.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </option>
                            ))}
                        </select>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-white font-bold mb-4">
                          De (Origem)
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tipo:</span>
                            <span className="text-white font-bold">
                              {contaOrigemSelecionada?.tipo_conta}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Saldo:</span>
                            <span className="text-white font-bold">
                              R${' '}
                              {contaOrigemSelecionada?.saldo.toLocaleString(
                                'pt-BR',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-white font-bold mb-4">
                          Para (Destino)
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tipo:</span>
                            <span className="text-white font-bold">
                              {contaDestinoSelecionada?.tipo_conta}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Saldo:</span>
                            <span className="text-white font-bold">
                              R${' '}
                              {contaDestinoSelecionada?.saldo.toLocaleString(
                                'pt-BR',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <label className="block text-white font-bold mb-3">
                          Valor
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xl font-bold">
                            R$
                          </span>
                          <input
                            type="number"
                            name="valor"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            value={formData.valor}
                            onChange={handleInputChange}
                            className="flex-1 bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition"
                          />
                        </div>
                      </div>

                      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                        <label className="block text-white font-bold mb-3">
                          Descrição (opcional)
                        </label>
                        <textarea
                          name="descricao"
                          placeholder="Motivo da transferência..."
                          value={formData.descricao}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition resize-none"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {step === 1 ? 'Continuar' : 'Confirmar Transferência'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}