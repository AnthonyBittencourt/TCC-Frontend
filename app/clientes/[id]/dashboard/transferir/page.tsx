'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  LogOut,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Wallet,
  Check,
  Search,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Cliente, Conta } from '../../../../interfaces/clientes';
import { CATEGORIAS_LISTA } from '../../../lib/categorias';
import {
  getCliente,
  buscarContaPorChavePix,
  realizarTransferencia,
  ContaEncontrada,
} from './actions';

export default function TransferirPage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loadingContas, setLoadingContas] = useState(true);
  const [contaOrigem, setContaOrigem] = useState<Conta | null>(null);

  const [destinoTipo, setDestinoTipo] = useState<'propria' | 'externa'>(
    'propria'
  );
  const [contaDestinoPropria, setContaDestinoPropria] =
    useState<Conta | null>(null);
  const [chavePix, setChavePix] = useState('');
  const [contaEncontrada, setContaEncontrada] =
    useState<ContaEncontrada | null>(null);
  const [buscandoConta, setBuscandoConta] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);

  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const buscarCliente = async () => {
      try {
        setLoadingContas(true);
        const data = await getCliente(Number(clienteId));
        setCliente(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar contas');
      } finally {
        setLoadingContas(false);
      }
    };

    if (clienteId) {
      buscarCliente();
    }
  }, [clienteId]);

  const obterCorTipoConta = (tipo: string) => {
    const cores: Record<string, string> = {
      CORRENTE: 'from-blue-500/10 to-cyan-500/10',
      POUPANCA: 'from-green-500/10 to-emerald-500/10',
      UNIVERSITARIA: 'from-purple-500/10 to-pink-500/10',
      SALARIO: 'from-orange-500/10 to-amber-500/10',
    };
    return cores[tipo] || 'from-red-500/10 to-pink-500/10';
  };

  const tipoLabel = (tipo: string) => {
    if (tipo === 'CORRENTE') return 'Conta Corrente';
    if (tipo === 'POUPANCA') return 'Poupança';
    if (tipo === 'UNIVERSITARIA') return 'Universitária';
    return 'Salário';
  };

  const contasDisponiveisDestino = (cliente?.contas || []).filter(
    (c) => c.id !== contaOrigem?.id
  );

  const handleBuscarConta = async () => {
    if (!chavePix.trim()) {
      setErroBusca('Informe a chave PIX');
      return;
    }

    setBuscandoConta(true);
    setErroBusca(null);
    setContaEncontrada(null);

    try {
      const conta = await buscarContaPorChavePix(chavePix.trim());

      if (!conta) {
        setErroBusca('Nenhuma conta encontrada para essa chave PIX');
        return;
      }

      if (conta.id === contaOrigem?.id) {
        setErroBusca('Você não pode transferir para a própria conta de origem');
        return;
      }

      setContaEncontrada(conta);
    } catch (err) {
      setErroBusca(
        err instanceof Error ? err.message : 'Erro ao buscar conta'
      );
    } finally {
      setBuscandoConta(false);
    }
  };

  const contaDestinoId =
    destinoTipo === 'propria' ? contaDestinoPropria?.id : contaEncontrada?.id;

  const podeAvancarParaValor =
    destinoTipo === 'propria' ? !!contaDestinoPropria : !!contaEncontrada;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError(null);

  if (!contaOrigem) {
    setError('Selecione a conta de origem.');
    return;
  }

  if (!contaDestinoId) {
    setError('Selecione a conta de destino.');
    return;
  }

  const valorNumerico = Number(valor);

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    setError('Informe um valor válido para a transferência.');
    return;
  }

  if (valorNumerico > Number(contaOrigem.saldo)) {
    setError('Saldo insuficiente na conta de origem.');
    return;
  }

  if (contaOrigem.id === contaDestinoId) {
    setError(
      'A conta de origem e destino não podem ser iguais.'
    );
    return;
  }

  setLoading(true);

  try {
    const resultado = await realizarTransferencia({
      contaOrigemId: contaOrigem.id,
      contaDestinoId,
      valor: valorNumerico,
      descricao: descricao.trim() || undefined,
      categoria: destinoTipo === 'externa' ? categoria ?? undefined : undefined,
    });

    if (!resultado.sucesso) {
      setError(
        resultado.erro ??
          'Erro ao processar transferência.'
      );

      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push(
        `/clientes/${clienteId}/dashboard`
      );

      router.refresh();
    }, 2000);
  } catch (err) {
    console.error(
      '[TransferirPage] erro:',
      err
    );

    setError(
      err instanceof Error
        ? err.message
        : 'Erro ao processar transferência.'
    );
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteId');
    router.push('/login');
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
              <h1 className="text-3xl font-bold text-white">Transferir</h1>
              <p className="text-gray-400">Envie dinheiro para outra conta</p>
            </div>
          </div>

          {/* SUCCESS STATE */}
          {success && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Transferência Realizada!
              </h2>
              <p className="text-gray-400 mb-4">
                O valor foi transferido com sucesso.
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
              {/* STEP 1: CONTA DE ORIGEM */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    De qual conta você quer transferir?
                  </h2>

                  {loadingContas ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                    </div>
                  ) : !cliente?.contas || cliente.contas.length === 0 ? (
                    <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 text-center">
                      <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Nenhuma conta encontrada.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {cliente.contas.map((conta) => (
                        <button
                          key={conta.id}
                          onClick={() => {
                            setContaOrigem(conta);
                            setContaDestinoPropria(null);
                            setContaEncontrada(null);
                            setChavePix('');
                            setErroBusca(null);
                            setCategoria(null); 
                            setStep(2);
                            setError(null);
                          }}
                          className={`text-left rounded-2xl border-2 transition ${
                            contaOrigem?.id === conta.id
                              ? 'border-red-500'
                              : 'border-red-500/10 hover:border-red-500/30'
                          }`}
                        >
                          <div
                            className={`bg-linear-to-br ${obterCorTipoConta(conta.tipo_conta)} rounded-2xl p-6 backdrop-blur-sm`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-gray-400 text-sm">
                                  {conta.tipo_conta}
                                </p>
                                <h3 className="font-bold text-white text-lg">
                                  {tipoLabel(conta.tipo_conta)}
                                </h3>
                                <p className="text-gray-400 text-sm mt-2">
                                  Saldo disponível: R${' '}
                                  {Number(conta.saldo).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </p>
                              </div>
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  contaOrigem?.id === conta.id
                                    ? 'border-red-400 bg-red-500'
                                    : 'border-gray-500'
                                }`}
                              >
                                {contaOrigem?.id === conta.id && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CONTA DE DESTINO */}
              {step === 2 && contaOrigem && (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Para onde você quer transferir?
                  </h2>

                  {/* TOGGLE PROPRIA / EXTERNA */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => {
                        setDestinoTipo('propria');
                        setContaEncontrada(null);
                        setErroBusca(null);
                        setCategoria(null);
                      }}
                      className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${
                        destinoTipo === 'propria'
                          ? 'bg-red-900/40 border-red-500 text-white'
                          : 'bg-red-900/20 border-red-500/10 text-gray-400 hover:border-red-500/30'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      Minha conta
                    </button>
                    <button
                      onClick={() => {
                        setDestinoTipo('externa');
                        setContaDestinoPropria(null);
                      }}
                      className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${
                        destinoTipo === 'externa'
                          ? 'bg-red-900/40 border-red-500 text-white'
                          : 'bg-red-900/20 border-red-500/10 text-gray-400 hover:border-red-500/30'
                      }`}
                    >
                      <Users className="w-5 h-5" />
                      Outro cliente
                    </button>
                  </div>

                  {/* DESTINO: MINHA OUTRA CONTA */}
                  {destinoTipo === 'propria' && (
                    <>
                      {contasDisponiveisDestino.length === 0 ? (
                        <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 text-center text-gray-400 mb-8">
                          Você não tem outra conta para transferir.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 mb-8">
                          {contasDisponiveisDestino.map((conta) => (
                            <button
                              key={conta.id}
                              onClick={() => setContaDestinoPropria(conta)}
                              className={`text-left rounded-2xl border-2 transition ${
                                contaDestinoPropria?.id === conta.id
                                  ? 'border-red-500'
                                  : 'border-red-500/10 hover:border-red-500/30'
                              }`}
                            >
                              <div
                                className={`bg-linear-to-br ${obterCorTipoConta(conta.tipo_conta)} rounded-2xl p-6 backdrop-blur-sm`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-gray-400 text-sm">
                                      {conta.tipo_conta}
                                    </p>
                                    <h3 className="font-bold text-white text-lg">
                                      {tipoLabel(conta.tipo_conta)}
                                    </h3>
                                  </div>
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                      contaDestinoPropria?.id === conta.id
                                        ? 'border-red-400 bg-red-500'
                                        : 'border-gray-500'
                                    }`}
                                  >
                                    {contaDestinoPropria?.id === conta.id && (
                                      <Check className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* DESTINO: CONTA DE OUTRO CLIENTE */}
                  {destinoTipo === 'externa' && (
                    <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm mb-8">
                      <label className="block text-white font-bold mb-3">
                        Chave PIX do destinatário
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={chavePix}
                          onChange={(e) => {
                            setChavePix(e.target.value);
                            setContaEncontrada(null);
                            setErroBusca(null);
                          }}
                          placeholder="Cole a chave PIX do destinatário"
                          className="flex-1 bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleBuscarConta}
                          disabled={buscandoConta}
                          className="p-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg transition"
                        >
                          {buscandoConta ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Search className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {erroBusca && (
                        <p className="text-red-400 text-sm mt-3">{erroBusca}</p>
                      )}

                      {contaEncontrada && (
                        <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                          <div>
                            <p className="text-white font-bold">
                              {tipoLabel(contaEncontrada.tipo_conta)}
                            </p>
                            {contaEncontrada.clienteNome && (
                              <p className="text-gray-400 text-sm">
                                Titular: {contaEncontrada.clienteNome}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-red-900/30 border border-red-500/30 text-red-300 font-bold rounded-lg hover:bg-red-900/50 transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      disabled={!podeAvancarParaValor}
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold rounded-lg transition"
                    >
                      Continuar
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: VALOR, DESCRIÇÃO E CONFIRMAÇÃO */}
              {step === 3 && contaOrigem && podeAvancarParaValor && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">De</p>
                      <p className="text-white font-bold">
                        {tipoLabel(contaOrigem.tipo_conta)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Para</p>
                      <p className="text-white font-bold">
                        {destinoTipo === 'propria'
                          ? tipoLabel(contaDestinoPropria!.tipo_conta)
                          : `${tipoLabel(contaEncontrada!.tipo_conta)}${
                              contaEncontrada!.clienteNome
                                ? ` — ${contaEncontrada!.clienteNome}`
                                : ''
                            }`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                    <label className="block text-white font-bold mb-3">
                      Valor da Transferência
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xl font-bold">R$</span>
                      <input
                        type="number"
                        name="valor"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="flex-1 bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition text-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                    <label className="block text-white font-bold mb-3">
                      Descrição{' '}
                      <span className="text-gray-500 font-normal">
                        (opcional)
                      </span>
                    </label>
                    <textarea
                      name="descricao"
                      placeholder="Ex: Aluguel, divisão da conta, presente..."
                      maxLength={140}
                      rows={2}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full resize-none bg-red-950/50 border border-red-500/20 text-white placeholder-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 transition text-sm"
                    />
                    <p className="text-gray-500 text-xs mt-1 text-right">
                      {descricao.length}/140
                    </p>
                  </div>

                  {destinoTipo === 'externa' && (
                    <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm">
                      <label className="block text-white font-bold mb-1">
                        Categoria do gasto
                      </label>
                      <p className="text-gray-500 text-xs mb-4">
                        Ajuda a organizar seus gastos no ForjaBank Analytics
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {CATEGORIAS_LISTA.map(({ key, label, icon: Icon, cor }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setCategoria((atual) => (atual === key ? null : key))
                            }
                            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition ${
                              categoria === key
                                ? 'border-red-500 bg-red-900/40'
                                : 'border-red-500/10 bg-red-950/30 hover:border-red-500/30'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-full ${cor} flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4 text-white" />
                            </span>
                            <span className="text-white text-sm font-medium truncate">
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>

                      {categoria && (
                        <button
                          type="button"
                          onClick={() => setCategoria(null)}
                          className="text-gray-500 hover:text-gray-300 text-xs mt-3"
                        >
                          Limpar seleção
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(2);
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