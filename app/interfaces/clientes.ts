export interface Conta {
  id: number;
  senha: string;
  tipo_conta: "CORRENTE" | "POUPANCA" | "UNIVERSITARIA" | "SALARIO";
  saldo: number;
  data_abertura: Date;
  pix: string;

  clientes: Cliente[];
  agencias: Agencia[];
  transacoes: Transacao[];
  cartoes: Cartao[];
}

export interface Cartao {
  id: string;
  tipoCartao: "DEBITO" | "CREDITO";
  numero_cartao: number;
  cvv: string;  
  validade: Date;
}

export interface Transacao {
  id: string;
  valor: number; // positivo = entrada, negativo = saída
  tipo: "DEPOSITO" | "SAQUE" | "TRANSFERENCIA" | "PAGAMENTO";
  data: string; // ISO 8601
  descricao?: string
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
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
