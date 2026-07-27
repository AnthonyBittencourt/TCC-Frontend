'use client';

import React, { useState } from 'react';
import {
  Shield,
  LogOut,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bell,
  Settings,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function DepositarPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    valor: '',
    metodo: 'TRANSFERENCIA_BANCARIA',
  });

  const metodos = [
    {
      id: 'TRANSFERENCIA_BANCARIA',
      nome: 'Transferência Bancária',
      descricao: 'PIX ou TED/DOC',
      icone: '🏦',
    },
    {
      id: 'BOLETO',
      nome: 'Boleto Bancário',
      descricao: 'Gere um boleto para pagar',
      icone: '📄',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.valor) {
      setError('Informe o valor do depósito');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deposito`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            valor: parseFloat(formData.valor),
            metodo: formData.metodo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao processar depósito');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/clientes/${clienteId}/dashboard`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar depósito');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteId');
    router.push('/login');
  };

  const pixKey = `chave-pix-${clienteId}@financebank`;
  const agencia = '0001';
  const conta = '0001234567';

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
        <div className="max-w-2xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Depositar</h1>
              <p className="text-gray-400">Adicione fundos à sua conta</p>
            </div>
          </div>

          {/* SUCCESS STATE */}
          {success && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Depósito Iniciado!
              </h2>
              <p className="text-gray-400 mb-4">
                Você receberá uma confirmação em breve.
              </p>
              <p className="text-gray-500 text-sm">
                Redirecionando para o dashboard...
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!success && (
            <>
              {/* STEP 1: SELECIONAR MÉTODO */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Escolha o método de depósito
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {metodos.map((metodo) => (
                      <button
                        key={metodo.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            metodo: metodo.id,
                          }));
                          setStep(2);
                          setError(null);
                        }}
                        className={`text-left p-6 rounded-2xl border-2 transition ${
                          formData.metodo === metodo.id
                            ? 'bg-red-900/40 border-red-500'
                            : 'bg-red-900/20 border-red-500/10 hover:border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-3xl mb-2">{metodo.icone}</div>
                            <h3 className="font-bold text-white text-lg">
                              {metodo.nome}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {metodo.descricao}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.metodo === metodo.id
                                ? 'border-red-400 bg-red-500'
                                : 'border-gray-500'
                            }`}
                          >
                            {formData.metodo === metodo.id && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 2: DETALHES DO DEPÓSITO */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* DADOS DA CONTA */}
                  <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4">Dados da sua Conta</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Agência</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={agencia}
                            readOnly
                            className="flex-1 bg-red-950/50 border border-red-500/20 text-white rounded-lg px-4 py-2 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(agencia)}
                            className="p-2 text-gray-400 hover:text-white transition"
                          >
                            {copied ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-1">Conta</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={conta}
                            readOnly
                            className="flex-1 bg-red-950/50 border border-red-500/20 text-white rounded-lg px-4 py-2 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(conta)}
                            className="p-2 text-gray-400 hover:text-white transition"
                          >
                            {copied ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {formData.metodo === 'TRANSFERENCIA_BANCARIA' && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Chave PIX</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={pixKey}
                              readOnly
                              className="flex-1 bg-red-950/50 border border-red-500/20 text-white rounded-lg px-4 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleCopy(pixKey)}
                              className="p-2 text-gray-400 hover:text-white transition"
                            >
                              {copied ? (
                                <Check className="w-5 h-5 text-green-400" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VALOR */}
                  <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                    <label className="block text-white font-bold mb-3">
                      Valor do Depósito
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xl font-bold">R$</span>
                      <input
                        type="number"
                        name="valor"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={formData.valor}
                        onChange={handleInputChange}
                        className="flex-1 bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition text-lg"
                      />
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">
                      💡 Utilize as informações acima para enviar seu depósito. O crédito
                      geralmente aparece em até 1-2 horas úteis.
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError(null);
                      }}
                      className="flex-1 py-3 bg-red-900/30 border border-red-500/30 text-red-300 font-bold rounded-lg hover:bg-red-900/50 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      Confirmar
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}