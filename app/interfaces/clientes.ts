export interface Conta {
  id: number;
  senha: string;
  tipo_conta: "CORRENTE" | "POUPANCA" | "UNIVERSITARIA" | "SALARIO";
  saldo: number;
  data_abertura: string;
  pix: string;

  clientes: Cliente[];
  agencias: Agencia[];
  transacoes: Transacao[];
  cartoes: Cartao[];
}

export interface Cartao {
  id: number;
  tipoCartao: "DEBITO" | "CREDITO";
  numero_cartao: number;
  cvv: string;
  validade: Date;
}

export interface Transacao {
  id: number;
  tipo:
    | "DEPOSITO"
    | "SAQUE"
    | "TRANSFERENCIA"
    | "PAGAMENTO"
    | "RENDIMENTO";

  valor: number;

  descricao: string | null;

  // O backend realmente retorna "data"
  data: string;

  contaOrigemId?: number | null;
  contaDestinoId?: number | null;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  contas: Conta[];
}

export interface Agencia {
  id: number;
  nome: string;
  numero: string;
  endereco: string;

  contas: Conta[];
  funcionarios: Funcionario[];
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  senha: string;
  agencias: Agencia[];
}

export interface GastoCategoria {
  categoria: string;
  valor: number;
}

export interface ResumoFinanceiro {
  saldoTotal: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoPeriodo: number;
  gastosPorCategoria: GastoCategoria[];
}

export interface DadosMensais {
  mes: string;
  entradas: number;
  saidas: number;
  saldo: number;
  quantidadeTransacoes: number;
}

export interface EstatisticasFinanceiras {
  mediaEntradas: number;
  desvioPadraoEntradas: number;

  mediaSaidas: number;
  desvioPadraoSaidas: number;

  mediaSaldoMensal: number;
  desvioPadraoSaldoMensal: number;
}

export interface AnaliseFinanceira {
  resumo: {
    saldoTotal: number;
    totalEntradas: number;
    totalSaidas: number;
    saldoPeriodo: number;
  };

  mensal: DadosMensais[];

  estatisticas: EstatisticasFinanceiras;

  categorias: GastoCategoria[];

  maiorEntrada: DadosMensais | null;

  maiorSaida: DadosMensais | null;
}