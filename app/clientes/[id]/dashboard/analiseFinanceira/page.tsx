"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { type ResumoFinanceiro } from "../../../../interfaces/clientes";
import { getResumoCliente } from "../actions";
import { CATEGORIAS_INFO } from "../../../lib/categorias";

export default function AnaliseFinanceiraClientePage() {
  const params = useParams();
  const router = useRouter();

  const clienteId = Number(params.id);

  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [metaEconomia, setMetaEconomia] = useState(200);
  const [editandoMeta, setEditandoMeta] = useState(false);

  useEffect(() => {
    const buscarResumo = async () => {
      try {
        setLoading(true);
        setErro(null);

        if (!clienteId || Number.isNaN(clienteId)) {
          throw new Error("ID do cliente inválido.");
        }

        const dados = await getResumoCliente(clienteId);

        setResumo(dados);
      } catch (error) {
        console.error(
          "[ANALISE FINANCEIRA] Erro ao buscar resumo:",
          error,
        );

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a análise financeira.",
        );
      } finally {
        setLoading(false);
      }
    };

    buscarResumo();
  }, [clienteId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-400 animate-spin" />

          <p className="text-white text-lg">
            Analisando suas finanças...
          </p>

          <p className="text-gray-500 text-sm">
            Calculando seus gastos e movimentações
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERRO
  // ==========================================

  if (erro || !resumo) {
    return (
      <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500/20 rounded-2xl p-8 text-center">
          <PieChart className="w-12 h-12 text-gray-500 mx-auto mb-4" />

          <h2 className="text-white text-xl font-bold mb-2">
            Não foi possível carregar a análise
          </h2>

          <p className="text-gray-400 mb-6">
            {erro || "Nenhum dado financeiro encontrado."}
          </p>

          <button
            onClick={() =>
              router.push(`/clientes/${clienteId}/dashboard`)
            }
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PORCENTAGEM DE CATEGORIA
  // ==========================================

  const calcularPercentual = (valor: number) => {
    if (resumo.totalSaidas <= 0) {
      return 0;
    }

    return (valor / resumo.totalSaidas) * 100;
  };

  // ==========================================
  // MAIOR CATEGORIA
  // ==========================================

  const maiorCategoria =
    resumo.gastosPorCategoria.length > 0
      ? resumo.gastosPorCategoria[0]
      : null;

  const maiorCategoriaInfo = maiorCategoria
    ? CATEGORIAS_INFO[maiorCategoria.categoria] ??
      CATEGORIAS_INFO.OUTROS
    : null;

  const maiorCategoriaPercentual = maiorCategoria
    ? calcularPercentual(maiorCategoria.valor)
    : 0;

  // ==========================================
  // META
  // ==========================================

  const percentualMeta =
    metaEconomia > 0
      ? Math.min(
          Math.max(
            (resumo.saldoPeriodo / metaEconomia) * 100,
            0,
          ),
          100,
        )
      : 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black">
      {/* BACKGROUND */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />

        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[20%] right-[5%] animate-pulse" />
      </div>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* ========================================
              CABEÇALHO
          ======================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <button
                onClick={() =>
                  router.push(
                    `/clientes/${clienteId}/dashboard`,
                  )
                }
                className="text-gray-400 hover:text-white text-sm mb-3 transition"
              >
                ← Voltar para o Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-red-400" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Análise Financeira
                  </h1>

                  <p className="text-gray-400">
                    Entenda como seu dinheiro está sendo movimentado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              RESUMO GERAL
          ======================================== */}

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Resumo financeiro
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* SALDO TOTAL */}

              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm mb-2">
                  Saldo Total
                </p>

                <p className="text-white text-2xl font-bold">
                  R${" "}
                  {resumo.saldoTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* ENTRADAS */}

              <div className="bg-green-900/10 border border-green-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft className="w-4 h-4 text-green-400" />

                  <p className="text-gray-400 text-sm">
                    Entradas
                  </p>
                </div>

                <p className="text-green-400 text-2xl font-bold">
                  R${" "}
                  {resumo.totalEntradas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* SAÍDAS */}

              <div className="bg-red-900/10 border border-red-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />

                  <p className="text-gray-400 text-sm">
                    Saídas
                  </p>
                </div>

                <p className="text-red-400 text-2xl font-bold">
                  R${" "}
                  {resumo.totalSaidas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* SALDO DO PERÍODO */}

              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  {resumo.saldoPeriodo >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}

                  <p className="text-gray-400 text-sm">
                    Saldo do Período
                  </p>
                </div>

                <p
                  className={`text-2xl font-bold ${
                    resumo.saldoPeriodo >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {resumo.saldoPeriodo >= 0 ? "+" : "-"}R${" "}
                  {Math.abs(
                    resumo.saldoPeriodo,
                  ).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================
              GASTOS POR CATEGORIA
          ======================================== */}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            <div className="lg:col-span-2 bg-red-900/20 border border-red-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-red-400" />

                <h2 className="text-xl font-bold text-white">
                  Gastos por Categoria
                </h2>
              </div>

              {resumo.gastosPorCategoria.length > 0 ? (
                <div className="space-y-5">
                  {resumo.gastosPorCategoria.map((gasto) => {
                    const info =
                      CATEGORIAS_INFO[gasto.categoria] ??
                      CATEGORIAS_INFO.OUTROS;

                    const Icon = info.icon;

                    const percentual =
                      calcularPercentual(gasto.valor);

                    return (
                      <div key={gasto.categoria}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-300" />

                            <span className="text-white text-sm font-medium">
                              {info.label}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-white text-sm font-bold">
                              R${" "}
                              {gasto.valor.toLocaleString(
                                "pt-BR",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>

                            <span className="text-gray-500 text-xs ml-2">
                              {percentual.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-3 bg-red-950/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${info.cor} rounded-full transition-all duration-700`}
                            style={{
                              width: `${Math.min(
                                percentual,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <PieChart className="w-10 h-10 text-gray-600 mx-auto mb-3" />

                  <p className="text-gray-400">
                    Nenhum gasto categorizado ainda.
                  </p>
                </div>
              )}
            </div>

            {/* ========================================
                INSIGHT
            ======================================== */}

            <div className="flex flex-col gap-6">

              {maiorCategoria && maiorCategoriaInfo && (
                <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-lg mb-4">
                    🧠 Insight
                  </h2>

                  <p className="text-gray-300 text-sm leading-6">
                    Sua maior categoria de gastos é{" "}
                    <span className="text-white font-bold">
                      {maiorCategoriaInfo.label}
                    </span>
                    , representando{" "}
                    <span className="text-red-400 font-bold">
                      {maiorCategoriaPercentual.toFixed(0)}%
                    </span>{" "}
                    de tudo que você gastou.
                  </p>

                  <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <p className="text-gray-500 text-xs">
                      Valor gasto
                    </p>

                    <p className="text-white font-bold">
                      R${" "}
                      {maiorCategoria.valor.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================
                  META
              ======================================== */}

              <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />

                    Meta de Economia
                  </h2>

                  <button
                    onClick={() =>
                      setEditandoMeta(!editandoMeta)
                    }
                    className="text-gray-400 hover:text-white text-xs transition"
                  >
                    {editandoMeta ? "Salvar" : "Editar"}
                  </button>
                </div>

                {editandoMeta ? (
                  <input
                    type="number"
                    value={metaEconomia}
                    onChange={(e) =>
                      setMetaEconomia(
                        Math.max(
                          0,
                          Number(e.target.value),
                        ),
                      )
                    }
                    className="w-full bg-red-950/50 border border-red-500/20 rounded-lg px-3 py-2 text-white text-sm mb-4 outline-none focus:border-red-400"
                    min={0}
                  />
                ) : (
                  <p className="text-gray-400 text-sm mb-4">
                    Guardar R${" "}
                    {metaEconomia.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mês
                  </p>
                )}

                <div className="w-full h-3 bg-red-950/50 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-linear-to-r from-red-500 to-green-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${percentualMeta}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">
                    Progresso
                  </span>

                  <span className="text-gray-400">
                    {percentualMeta.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              INTERPRETAÇÃO
          ======================================== */}

          <section className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              📊 Interpretação financeira
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">
                  Fluxo financeiro
                </p>

                <p
                  className={`font-bold ${
                    resumo.saldoPeriodo >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {resumo.saldoPeriodo >= 0
                    ? "Positivo"
                    : "Negativo"}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {resumo.saldoPeriodo >= 0
                    ? "Você recebeu mais dinheiro do que gastou no período."
                    : "Suas saídas superaram suas entradas no período."}
                </p>
              </div>

              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">
                  Maior categoria
                </p>

                <p className="text-white font-bold">
                  {maiorCategoriaInfo?.label ||
                    "Nenhuma"}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {maiorCategoria
                    ? `Representa ${maiorCategoriaPercentual.toFixed(
                        0,
                      )}% das suas saídas.`
                    : "Ainda não existem gastos categorizados."}
                </p>
              </div>

              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-2">
                  Meta de economia
                </p>

                <p className="text-white font-bold">
                  {percentualMeta.toFixed(0)}%
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Progresso em relação à meta definida.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================
              VOLTAR
          ======================================== */}

          <div className="flex justify-center pb-8">
            <button
              onClick={() =>
                router.push(
                  `/clientes/${clienteId}/dashboard`,
                )
              }
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg hover:bg-red-500/20 transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}