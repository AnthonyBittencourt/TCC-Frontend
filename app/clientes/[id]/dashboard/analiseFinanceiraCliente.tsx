"use client";

import React, { useMemo } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Calculator,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { type Conta } from "../../../interfaces/clientes";

interface AnaliseFinanceiraClienteProps {
  contas: Conta[];
}

interface TransacaoAnalise {
  id: number;
  valor: number;
  tipo:
    | "DEPOSITO"
    | "SAQUE"
    | "TRANSFERENCIA"
    | "PAGAMENTO"
    | "RENDIMENTO";

  descricao?: string | null;

  // Nome usado internamente pelo componente
  dataTransacao: string;

  contaId: number;

  contaOrigemId?: number | null;
  contaDestinoId?: number | null;
}

interface Estatisticas {
  totalTransacoes: number;
  media: number;
  mediana: number;
  desvioPadrao: number;
  maiorTransacao: number;
  menorTransacao: number;
  maiorEntrada: number;
  maiorSaida: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoPeriodo: number;
  transacoesPositivas: number;
  transacoesNegativas: number;
}

export default function AnaliseFinanceiraCliente({
  contas,
}: AnaliseFinanceiraClienteProps) {
  // ============================================================
  // TRANSFORMA TODAS AS TRANSAÇÕES DAS CONTAS EM UMA LISTA ÚNICA
  // ============================================================

const transacoes = useMemo<TransacaoAnalise[]>(() => {
  return contas.flatMap((conta) =>
    (conta.transacoes || []).map((transacao) => ({
      id: transacao.id,

      valor: Number(transacao.valor),

      tipo: transacao.tipo,

      descricao: transacao.descricao,

      // CORREÇÃO PRINCIPAL:
      // backend retorna "data"
      dataTransacao: String(transacao.data),

      contaId: conta.id,

      contaOrigemId:
        transacao.contaOrigemId ?? null,

      contaDestinoId:
        transacao.contaDestinoId ?? null,
    })),
  );
}, [contas]);
  // ============================================================
  // ORDENA TRANSAÇÕES POR DATA
  // ============================================================

  const transacoesOrdenadas = useMemo(() => {
    return [...transacoes].sort((a, b) => {
      const dataA = new Date(a.dataTransacao).getTime();
      const dataB = new Date(b.dataTransacao).getTime();

      return dataA - dataB;
    });
  }, [transacoes]);

  // ============================================================
  // ESTATÍSTICAS
  // ============================================================

  const estatisticas = useMemo<Estatisticas>(() => {
    if (transacoes.length === 0) {
      return {
        totalTransacoes: 0,
        media: 0,
        mediana: 0,
        desvioPadrao: 0,
        maiorTransacao: 0,
        menorTransacao: 0,
        maiorEntrada: 0,
        maiorSaida: 0,
        totalEntradas: 0,
        totalSaidas: 0,
        saldoPeriodo: 0,
        transacoesPositivas: 0,
        transacoesNegativas: 0,
      };
    }

    // Valores absolutos para análise estatística
    const valores = transacoes.map((transacao) =>
      Math.abs(Number(transacao.valor)),
    );

    // ============================================================
    // MÉDIA
    // ============================================================

    const soma = valores.reduce(
      (total, valor) => total + valor,
      0,
    );

    const media = soma / valores.length;

    // ============================================================
    // MEDIANA
    // ============================================================

    const valoresOrdenados = [...valores].sort(
      (a, b) => a - b,
    );

    const meio = Math.floor(
      valoresOrdenados.length / 2,
    );

    const mediana =
      valoresOrdenados.length % 2 === 0
        ? (valoresOrdenados[meio - 1] +
            valoresOrdenados[meio]) /
          2
        : valoresOrdenados[meio];

    // ============================================================
    // DESVIO PADRÃO POPULACIONAL
    // ============================================================

    const somaQuadrados = valores.reduce(
      (total, valor) =>
        total + Math.pow(valor - media, 2),
      0,
    );

    const variancia =
      somaQuadrados / valores.length;

    const desvioPadrao = Math.sqrt(variancia);

    // ============================================================
    // ENTRADAS
    // ============================================================

    const entradas = transacoes.filter(
      (transacao) => Number(transacao.valor) > 0,
    );

    // ============================================================
    // SAÍDAS
    // ============================================================

    const saidas = transacoes.filter(
      (transacao) => Number(transacao.valor) < 0,
    );

    // ============================================================
    // TOTAL DE ENTRADAS
    // ============================================================

    const totalEntradas = entradas.reduce(
      (total, transacao) =>
        total + Math.abs(Number(transacao.valor)),
      0,
    );

    // ============================================================
    // TOTAL DE SAÍDAS
    // ============================================================

    const totalSaidas = saidas.reduce(
      (total, transacao) =>
        total + Math.abs(Number(transacao.valor)),
      0,
    );

    // ============================================================
    // MAIOR ENTRADA
    // ============================================================

    const maiorEntrada =
      entradas.length > 0
        ? Math.max(
            ...entradas.map((transacao) =>
              Math.abs(Number(transacao.valor)),
            ),
          )
        : 0;

    // ============================================================
    // MAIOR SAÍDA
    // ============================================================

    const maiorSaida =
      saidas.length > 0
        ? Math.max(
            ...saidas.map((transacao) =>
              Math.abs(Number(transacao.valor)),
            ),
          )
        : 0;

    // ============================================================
    // MAIOR MOVIMENTAÇÃO
    // ============================================================

    const maiorTransacao = Math.max(
      ...valores,
    );

    // ============================================================
    // MENOR MOVIMENTAÇÃO
    // ============================================================

    const menorTransacao = Math.min(
      ...valores,
    );

    return {
      totalTransacoes: transacoes.length,
      media,
      mediana,
      desvioPadrao,
      maiorTransacao,
      menorTransacao,
      maiorEntrada,
      maiorSaida,
      totalEntradas,
      totalSaidas,
      saldoPeriodo:
        totalEntradas - totalSaidas,
      transacoesPositivas: entradas.length,
      transacoesNegativas: saidas.length,
    };
  }, [transacoes]);

  // ============================================================
  // FORMATA MOEDA
  // ============================================================

  const formatarMoeda = (valor: number) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ============================================================
  // CONVERTE DATA
  // ============================================================

  const converterData = (
    data: string | Date | null | undefined,
  ): Date | null => {
    if (!data) {
      return null;
    }

    // Se já for Date
    if (data instanceof Date) {
      if (!Number.isNaN(data.getTime())) {
        return data;
      }

      return null;
    }

    const valor = String(data).trim();

    if (!valor) {
      return null;
    }

    // ISO normal:
    // 2026-08-10T13:16:50.001Z
    // 2026-08-10T13:16:50
    // 2026-08-10
    const dataISO = new Date(valor);

    if (!Number.isNaN(dataISO.getTime())) {
      return dataISO;
    }

    // ==========================================================
    // TENTA FORMATO BRASILEIRO
    // Exemplo:
    // 10/08/2026
    // 10/08/2026 13:16:50
    // ==========================================================

    const matchBrasileiro = valor.match(
      /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
    );

    if (matchBrasileiro) {
      const [
        ,
        dia,
        mes,
        ano,
        hora = "00",
        minuto = "00",
        segundo = "00",
      ] = matchBrasileiro;

      const dataBrasileira = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        Number(segundo),
      );

      if (
        !Number.isNaN(
          dataBrasileira.getTime(),
        )
      ) {
        return dataBrasileira;
      }
    }

    return null;
  };

  // ============================================================
  // FORMATA DATA
  // ============================================================

  const formatarData = (
    data: string | Date | null | undefined,
  ) => {
    const dataConvertida = converterData(data);

    if (!dataConvertida) {
      console.warn(
        "[ANALISE] Não foi possível converter a data:",
        data,
      );

      return "--/--";
    }

    return dataConvertida.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
      },
    );
  };

  // ============================================================
  // FORMATA DATA COMPLETA
  // ============================================================

  const formatarDataCompleta = (
    data: string | Date | null | undefined,
  ) => {
    const dataConvertida = converterData(data);

    if (!dataConvertida) {
      return "Data inválida";
    }

    return dataConvertida.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
  };

  // ============================================================
  // NÍVEL DE VARIAÇÃO
  // ============================================================

  const nivelVariacao = useMemo(() => {
    if (
      estatisticas.totalTransacoes < 2 ||
      estatisticas.media === 0
    ) {
      return {
        titulo: "Poucos dados",
        texto:
          "É necessário ter mais movimentações para avaliar a variação dos valores.",
        cor: "text-gray-400",
      };
    }

    const coeficienteVariacao =
      estatisticas.desvioPadrao /
      Math.abs(estatisticas.media);

    if (coeficienteVariacao < 0.5) {
      return {
        titulo: "Baixa variação",
        texto:
          "Os valores das suas transações estão relativamente próximos da média, indicando um comportamento financeiro mais estável.",
        cor: "text-green-400",
      };
    }

    if (coeficienteVariacao < 1) {
      return {
        titulo: "Variação moderada",
        texto:
          "Existe uma diferença considerável entre os valores das suas transações, mas o comportamento ainda apresenta certa regularidade.",
        cor: "text-yellow-400",
      };
    }

    return {
      titulo: "Alta variação",
      texto:
        "Os valores apresentam grande dispersão em relação à média, indicando movimentações financeiras bastante diferentes entre si.",
      cor: "text-red-400",
    };
  }, [estatisticas]);

  // ============================================================
  // INTERPRETAÇÃO DO FLUXO
  // ============================================================

  const interpretacaoSaldo = useMemo(() => {
    if (
      estatisticas.totalEntradas === 0 &&
      estatisticas.totalSaidas === 0
    ) {
      return "Ainda não existem movimentações suficientes para gerar uma análise.";
    }

    if (
      estatisticas.totalEntradas >
      estatisticas.totalSaidas
    ) {
      return "Suas entradas superam suas saídas no período analisado. O fluxo financeiro está positivo.";
    }

    if (
      estatisticas.totalEntradas ===
      estatisticas.totalSaidas
    ) {
      return "Suas entradas e saídas estão equilibradas no período analisado.";
    }

    return "Suas saídas superam suas entradas no período analisado. Vale ficar atento ao ritmo dos gastos.";
  }, [estatisticas]);

  // ============================================================
  // DADOS DO GRÁFICO
  // ============================================================

  const dadosGrafico = useMemo(() => {
    if (
      transacoesOrdenadas.length === 0
    ) {
      return [];
    }

    let acumulado = 0;

    return transacoesOrdenadas.map(
      (transacao) => {
        acumulado += Number(
          transacao.valor,
        );

        return {
          ...transacao,
          acumulado,
        };
      },
    );
  }, [transacoesOrdenadas]);

  // ============================================================
  // CONFIGURAÇÃO DO GRÁFICO
  // ============================================================

  const grafico = useMemo(() => {
    if (dadosGrafico.length === 0) {
      return null;
    }

    const valores = dadosGrafico.map(
      (item) => item.acumulado,
    );

    let minimo = Math.min(...valores);
    let maximo = Math.max(...valores);

    if (minimo === maximo) {
      minimo -= 100;
      maximo += 100;
    }

    const margem =
      (maximo - minimo) * 0.1;

    minimo -= margem;
    maximo += margem;

    const largura = 800;
    const altura = 300;

    const paddingX = 40;
    const paddingY = 30;

    const larguraUtil =
      largura - paddingX * 2;

    const alturaUtil =
      altura - paddingY * 2;

    const pontos = dadosGrafico.map(
      (item, index) => {
        const x =
          dadosGrafico.length === 1
            ? largura / 2
            : paddingX +
              (index /
                (dadosGrafico.length - 1)) *
                larguraUtil;

        const y =
          paddingY +
          ((maximo - item.acumulado) /
            (maximo - minimo)) *
            alturaUtil;

        return {
          ...item,
          x,
          y,
        };
      },
    );

    const linha = pontos
      .map(
        (ponto, index) =>
          `${index === 0 ? "M" : "L"} ${
            ponto.x
          } ${ponto.y}`,
      )
      .join(" ");

    const area =
      pontos.length > 0
        ? `${linha} L ${
            pontos[pontos.length - 1].x
          } ${altura - paddingY} L ${
            pontos[0].x
          } ${altura - paddingY} Z`
        : "";

    return {
      pontos,
      linha,
      area,
      minimo,
      maximo,
      largura,
      altura,
      paddingX,
      paddingY,
    };
  }, [dadosGrafico]);

  // ============================================================
  // SEM TRANSAÇÕES
  // ============================================================

  if (transacoes.length === 0) {
    return (
      <section className="px-6 py-8 border-t border-red-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-red-400" />

            <h2 className="text-2xl font-bold text-white">
              Análise Estatística
            </h2>
          </div>

          <p className="text-gray-400 mb-6">
            Analise estatisticamente o comportamento
            das suas movimentações financeiras.
          </p>

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-10 text-center">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />

            <h3 className="text-white font-bold text-lg mb-2">
              Dados insuficientes
            </h3>

            <p className="text-gray-400 text-sm">
              Faça algumas movimentações para
              visualizar sua análise estatística.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <section className="px-6 py-8 border-t border-red-500/10">
      <div className="max-w-7xl mx-auto">

        {/* ======================================================
            CABEÇALHO
        ====================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-red-400" />

            <h2 className="text-2xl font-bold text-white">
              Análise Estatística Financeira
            </h2>
          </div>

          <p className="text-gray-400">
            Veja estatisticamente como estão se
            comportando suas movimentações financeiras.
          </p>
        </div>

        {/* ======================================================
            CARDS PRINCIPAIS
        ====================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-400" />

              <p className="text-gray-400 text-sm">
                Média
              </p>
            </div>

            <p className="text-white text-xl font-bold">
              {formatarMoeda(
                estatisticas.media,
              )}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Valor médio das transações
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-purple-400" />

              <p className="text-gray-400 text-sm">
                Mediana
              </p>
            </div>

            <p className="text-white text-xl font-bold">
              {formatarMoeda(
                estatisticas.mediana,
              )}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Valor central das transações
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-orange-400" />

              <p className="text-gray-400 text-sm">
                Desvio padrão
              </p>
            </div>

            <p className="text-white text-xl font-bold">
              {formatarMoeda(
                estatisticas.desvioPadrao,
              )}
            </p>

            <p
              className={`text-xs mt-2 font-medium ${nivelVariacao.cor}`}
            >
              {nivelVariacao.titulo}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CircleDollarSign className="w-5 h-5 text-green-400" />

              <p className="text-gray-400 text-sm">
                Transações
              </p>
            </div>

            <p className="text-white text-xl font-bold">
              {estatisticas.totalTransacoes}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              Movimentações analisadas
            </p>
          </div>
        </div>

        {/* ======================================================
            GRÁFICO
        ====================================================== */}

        <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 mb-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />

                Evolução financeira
              </h3>

              <p className="text-gray-500 text-xs mt-1">
                Saldo acumulado das movimentações
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-xs">
                Resultado
              </p>

              <p
                className={`font-bold ${
                  estatisticas.saldoPeriodo >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {estatisticas.saldoPeriodo >= 0
                  ? "+"
                  : ""}
                {formatarMoeda(
                  estatisticas.saldoPeriodo,
                )}
              </p>
            </div>
          </div>

          {grafico && (
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${grafico.largura} ${grafico.altura}`}
                className="w-full min-w-[600px] h-[300px]"
                preserveAspectRatio="none"
              >
                {grafico.minimo < 0 &&
                  grafico.maximo > 0 && (
                    <line
                      x1={grafico.paddingX}
                      x2={
                        grafico.largura -
                        grafico.paddingX
                      }
                      y1={
                        grafico.paddingY +
                        ((grafico.maximo - 0) /
                          (grafico.maximo -
                            grafico.minimo)) *
                          (grafico.altura -
                            grafico.paddingY * 2)
                      }
                      y2={
                        grafico.paddingY +
                        ((grafico.maximo - 0) /
                          (grafico.maximo -
                            grafico.minimo)) *
                          (grafico.altura -
                            grafico.paddingY * 2)
                      }
                      stroke="currentColor"
                      strokeDasharray="5 5"
                      className="text-red-500/20"
                    />
                  )}

                <path
                  d={grafico.area}
                  className="fill-red-500/5"
                />

                <path
                  d={grafico.linha}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-400"
                />

                {grafico.pontos.map(
                  (ponto, index) => (
                    <circle
                      key={`${ponto.id}-${index}`}
                      cx={ponto.x}
                      cy={ponto.y}
                      r="4"
                      className="fill-red-400"
                    />
                  ),
                )}
              </svg>
            </div>
          )}

          {/* ====================================================
              DATAS DO PERÍODO
          ==================================================== */}

          <div className="flex justify-between text-gray-500 text-xs mt-2">
            <span>
              {dadosGrafico.length > 0
                ? formatarData(
                    dadosGrafico[0]
                      .dataTransacao,
                  )
                : "--/--"}
            </span>

            <span>
              {dadosGrafico.length > 0
                ? formatarData(
                    dadosGrafico[
                      dadosGrafico.length - 1
                    ].dataTransacao,
                  )
                : "--/--"}
            </span>
          </div>

          {/* ====================================================
              DEBUG TEMPORÁRIO DAS DATAS
          ==================================================== */}

          <div className="mt-4 border-t border-red-500/10 pt-3">
            <p className="text-gray-600 text-[10px] mb-2">
              Período analisado
            </p>

            <div className="flex justify-between text-gray-500 text-xs">
              <span>
                Início:{" "}
                {dadosGrafico.length > 0
                  ? formatarDataCompleta(
                      dadosGrafico[0]
                        .dataTransacao,
                    )
                  : "Sem data"}
              </span>

              <span>
                Fim:{" "}
                {dadosGrafico.length > 0
                  ? formatarDataCompleta(
                      dadosGrafico[
                        dadosGrafico.length - 1
                      ].dataTransacao,
                    )
                  : "Sem data"}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================
            ENTRADAS / SAÍDAS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* ENTRADAS */}

          <div className="bg-green-900/10 border border-green-500/10 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                </div>

                <div>
                  <h3 className="text-white font-bold">
                    Entradas
                  </h3>

                  <p className="text-gray-500 text-xs">
                    {estatisticas.transacoesPositivas}{" "}
                    transações
                  </p>
                </div>
              </div>

              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>

            <p className="text-green-400 text-2xl font-bold mb-4">
              {formatarMoeda(
                estatisticas.totalEntradas,
              )}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Maior entrada
                </span>

                <span className="text-white font-medium">
                  {formatarMoeda(
                    estatisticas.maiorEntrada,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Participação
                </span>

                <span className="text-green-400 font-medium">
                  {estatisticas.totalEntradas +
                    estatisticas.totalSaidas >
                  0
                    ? (
                        (estatisticas.totalEntradas /
                          (estatisticas.totalEntradas +
                            estatisticas.totalSaidas)) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* SAÍDAS */}

          <div className="bg-red-900/10 border border-red-500/10 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                </div>

                <div>
                  <h3 className="text-white font-bold">
                    Saídas
                  </h3>

                  <p className="text-gray-500 text-xs">
                    {estatisticas.transacoesNegativas}{" "}
                    transações
                  </p>
                </div>
              </div>

              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>

            <p className="text-red-400 text-2xl font-bold mb-4">
              {formatarMoeda(
                estatisticas.totalSaidas,
              )}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Maior saída
                </span>

                <span className="text-white font-medium">
                  {formatarMoeda(
                    estatisticas.maiorSaida,
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Participação
                </span>

                <span className="text-red-400 font-medium">
                  {estatisticas.totalEntradas +
                    estatisticas.totalSaidas >
                  0
                    ? (
                        (estatisticas.totalSaidas /
                          (estatisticas.totalEntradas +
                            estatisticas.totalSaidas)) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            ESTATÍSTICAS DETALHADAS
        ====================================================== */}

        <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 mb-6">

          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-400" />

            Estatísticas detalhadas
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-red-950/40 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">
                Maior movimentação
              </p>

              <p className="text-white font-bold">
                {formatarMoeda(
                  estatisticas.maiorTransacao,
                )}
              </p>
            </div>

            <div className="bg-red-950/40 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">
                Menor movimentação
              </p>

              <p className="text-white font-bold">
                {formatarMoeda(
                  estatisticas.menorTransacao,
                )}
              </p>
            </div>

            <div className="bg-red-950/40 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">
                Média por transação
              </p>

              <p className="text-white font-bold">
                {formatarMoeda(
                  estatisticas.media,
                )}
              </p>
            </div>

            <div className="bg-red-950/40 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">
                Mediana
              </p>

              <p className="text-white font-bold">
                {formatarMoeda(
                  estatisticas.mediana,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            INSIGHTS
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* VARIAÇÃO */}

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-red-400" />

              <h3 className="text-white font-bold">
                O que o desvio padrão mostra?
              </h3>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              O desvio padrão mede o quanto os
              valores das suas transações se
              afastam da média.
            </p>

            <div className="bg-red-950/40 rounded-xl p-4">
              <p
                className={`font-bold mb-2 ${nivelVariacao.cor}`}
              >
                {nivelVariacao.titulo}
              </p>

              <p className="text-gray-400 text-sm leading-relaxed">
                {nivelVariacao.texto}
              </p>
            </div>
          </div>

          {/* FLUXO */}

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-4">
              {estatisticas.saldoPeriodo >=
              0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}

              <h3 className="text-white font-bold">
                Análise do fluxo
              </h3>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {interpretacaoSaldo}
            </p>

            <div
              className={`rounded-xl p-4 ${
                estatisticas.saldoPeriodo >= 0
                  ? "bg-green-500/5 border border-green-500/10"
                  : "bg-red-500/5 border border-red-500/10"
              }`}
            >
              <p className="text-gray-500 text-xs mb-1">
                Saldo líquido das movimentações
              </p>

              <p
                className={`text-xl font-bold ${
                  estatisticas.saldoPeriodo >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {estatisticas.saldoPeriodo >= 0
                  ? "+"
                  : ""}
                {formatarMoeda(
                  estatisticas.saldoPeriodo,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}