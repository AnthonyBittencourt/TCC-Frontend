'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  LogOut,
  Users,
  UserCog,
  Wallet,
  Building2,
  CreditCard,
  ArrowLeftRight,
  Settings,
  Bell,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  Search,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  listarClientes,
  excluirCliente,
  listarFuncionarios,
  excluirFuncionario,
  listarContas,
  excluirConta,
  listarAgencias,
  excluirAgencia,
  listarCartoes,
  excluirCartao,
  listarTransacoes,
  excluirTransacao,
} from './actions';

/* ============================
        TIPOS E CONFIG
============================ */

// Cada registro pode ter um formato diferente dependendo da entidade,
// então usamos um dicionário tipado (nunca `any`) e helpers seguros
// para ler valores dele.
type Registro = Record<string, unknown>;

type Chave =
  | 'clientes'
  | 'funcionarios'
  | 'contas'
  | 'agencias'
  | 'cartoes'
  | 'transacoes';

interface Coluna {
  header: string;
  render: (item: Registro) => React.ReactNode;
  className?: string;
}

interface AbaConfig {
  chave: Chave;
  label: string;
  labelSingular: string;
  icon: React.ElementType;
  listar: () => Promise<Registro[]>;
  excluir: (id: number) => Promise<unknown>;
  rotaNova: string;
  rotaEditar: (id: number) => string;
  colunas: Coluna[];
  buscaCampos: string[];
}

/* ============================
        HELPERS DE LEITURA
============================ */

const texto = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === '') return '—';
  return String(valor);
};

const paraObjeto = (valor: unknown): Registro | undefined =>
  typeof valor === 'object' && valor !== null ? (valor as Registro) : undefined;

const paraArray = (valor: unknown): Registro[] =>
  Array.isArray(valor) ? (valor as Registro[]) : [];

const paraId = (valor: unknown): number => Number(valor);

const formatarMoeda = (valor: unknown) =>
  `R$ ${Number(valor ?? 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatarData = (valor: unknown) => {
  if (!valor) return '—';
  const data = new Date(String(valor));
  return isNaN(data.getTime()) ? String(valor) : data.toLocaleDateString('pt-BR');
};

/* ============================
              ABAS
============================ */

const ABAS: AbaConfig[] = [
  {
    chave: 'clientes',
    label: 'Clientes',
    labelSingular: 'cliente',
    icon: Users,
    listar: listarClientes,
    excluir: excluirCliente,
    rotaNova: '/funcionario/clientes/novo',
    rotaEditar: (id) => `/funcionario/clientes/${id}`,
    buscaCampos: ['nome', 'email', 'cpf'],
    colunas: [
      { header: 'Nome', render: (i) => texto(i.nome) },
      { header: 'Email', render: (i) => texto(i.email) },
      { header: 'CPF', render: (i) => texto(i.cpf) },
      { header: 'Telefone', render: (i) => texto(i.telefone) },
      { header: 'Nascimento', render: (i) => formatarData(i.data_nascimento) },
    ],
  },
  {
    chave: 'funcionarios',
    label: 'Funcionários',
    labelSingular: 'funcionário',
    icon: UserCog,
    listar: listarFuncionarios,
    excluir: excluirFuncionario,
    rotaNova: '/funcionario/funcionarios/novo',
    rotaEditar: (id) => `/funcionario/funcionarios/${id}`,
    buscaCampos: ['nome', 'email'],
    colunas: [
      { header: 'Nome', render: (i) => texto(i.nome) },
      { header: 'Email', render: (i) => texto(i.email) },
      {
        header: 'Perfil',
        render: (i) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              i.admin
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}
          >
            {i.admin ? 'Administrador' : 'Atendente'}
          </span>
        ),
      },
      {
        header: 'Agências',
        render: (i) => {
          const agencias = paraArray(i.agencias);
          if (agencias.length === 0) return '—';
          return agencias.map((a) => texto(a.nome ?? a.id)).join(', ');
        },
      },
    ],
  },
  {
    chave: 'contas',
    label: 'Contas',
    labelSingular: 'conta',
    icon: Wallet,
    listar: listarContas,
    excluir: excluirConta,
    rotaNova: '/funcionario/contas/novo',
    rotaEditar: (id) => `/funcionario/contas/${id}`,
    buscaCampos: ['tipo_conta', 'cliente_nome'],
    colunas: [
      { header: 'ID', render: (i) => `#${texto(i.id)}` },
      { header: 'Tipo', render: (i) => texto(i.tipo_conta) },
      {
        header: 'Cliente',
        render: (i) =>
          texto(paraObjeto(i.cliente)?.nome ?? i.cliente_nome ?? i.clienteId),
      },
      {
        header: 'Saldo',
        render: (i) => formatarMoeda(i.saldo),
        className: 'text-right font-bold',
      },
      { header: 'Aberta em', render: (i) => formatarData(i.data_abertura) },
    ],
  },
  {
    chave: 'agencias',
    label: 'Agências',
    labelSingular: 'agência',
    icon: Building2,
    listar: listarAgencias,
    excluir: excluirAgencia,
    rotaNova: '/funcionario/agencias/novo',
    rotaEditar: (id) => `/funcionario/agencias/${id}`,
    buscaCampos: ['nome', 'numero', 'endereco'],
    colunas: [
      { header: 'Nome', render: (i) => texto(i.nome) },
      { header: 'Número', render: (i) => texto(i.numero) },
      { header: 'Endereço', render: (i) => texto(i.endereco) },
    ],
  },
  {
    chave: 'cartoes',
    label: 'Cartões',
    labelSingular: 'cartão',
    icon: CreditCard,
    listar: listarCartoes,
    excluir: excluirCartao,
    rotaNova: '/funcionario/cartoes/novo',
    rotaEditar: (id) => `/funcionario/cartoes/${id}`,
    buscaCampos: ['numero_cartao', 'tipoCartao'],
    colunas: [
      {
        header: 'Número',
        render: (i) => `•••• •••• •••• ${texto(i.numero_cartao).slice(-4)}`,
      },
      {
        header: 'Tipo',
        render: (i) => (i.tipoCartao === 'DEBITO' ? 'Débito' : 'Crédito'),
      },
      { header: 'Validade', render: (i) => formatarData(i.validade) },
      {
        header: 'Conta',
        render: (i) => texto(paraObjeto(i.conta)?.id ?? i.contaId),
      },
    ],
  },
  {
    chave: 'transacoes',
    label: 'Transações',
    labelSingular: 'transação',
    icon: ArrowLeftRight,
    listar: listarTransacoes,
    excluir: excluirTransacao,
    rotaNova: '/funcionario/transacoes/novo',
    rotaEditar: (id) => `/funcionario/transacoes/${id}`,
    buscaCampos: ['tipo'],
    colunas: [
      { header: 'Tipo', render: (i) => texto(i.tipo) },
      {
        header: 'Valor',
        render: (i) => formatarMoeda(i.valor),
        className: 'text-right font-bold',
      },
      { header: 'Data', render: (i) => formatarData(i.data) },
      {
        header: 'Conta',
        render: (i) => texto(paraObjeto(i.conta)?.id ?? i.contaId),
      },
    ],
  },
];

/* ============================
              PÁGINA
============================ */

export default function PainelFuncionarioPage() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<Chave>('clientes');
  const [dados, setDados] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const config = useMemo(() => ABAS.find((a) => a.chave === abaAtiva)!, [abaAtiva]);

const carregarDados = useCallback(async (aba: AbaConfig) => {
  try {
    setCarregando(true);
    setErro(null);

    const resultado = await aba.listar();

    setDados(Array.isArray(resultado) ? resultado : []);
  } catch (err) {
    setErro(
      err instanceof Error
        ? err.message
        : 'Erro ao carregar dados'
    );
    setDados([]);
  } finally {
    setCarregando(false);
  }
}, []);

  // O efeito só busca os dados da aba atual; ele nunca dispara um
  // setState "de reset" (como limpar a busca) — isso acontece no
  // próprio manipulador de clique da aba, então não há setState
  // síncrono e incondicional no início do efeito.
useEffect(() => {
  let ativo = true;

  async function carregar() {
    try {
      setCarregando(true);
      setErro(null);

      const resultado = await config.listar();

      if (!ativo) return;

      setDados(Array.isArray(resultado) ? resultado : []);
    } catch (err) {
      if (!ativo) return;

      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar dados'
      );

      setDados([]);
    } finally {
      if (ativo) {
        setCarregando(false);
      }
    }
  }

  carregar();

  return () => {
    ativo = false;
  };
}, [config]);

  const handleSelecionarAba = (chave: Chave) => {
    if (chave === abaAtiva) return;
    setBusca('');
    setAbaAtiva(chave);
  };

  const handleExcluir = async (item: Registro) => {
    const id = paraId(item.id);
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir este ${config.labelSingular}?`
    );
    if (!confirmar) return;

    setExcluindoId(id);
    try {
      await config.excluir(id);
      setDados((prev) => prev.filter((atual) => paraId(atual.id) !== id));
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : `Não foi possível excluir este ${config.labelSingular}. Tente novamente.`
      );
    } finally {
      setExcluindoId(null);
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados;
    const termo = busca.trim().toLowerCase();
    return dados.filter((item) =>
      config.buscaCampos.some((campo) =>
        texto(item[campo]).toLowerCase().includes(termo)
      )
    );
  }, [dados, busca, config]);

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
          <span className="text-gray-400 text-sm ml-2 hidden sm:inline">
            Painel do Funcionário
          </span>
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

      <main className="relative z-10">
        {/* CABEÇALHO */}
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">
              Central de Gestão 🛠️
            </h1>
            <p className="text-gray-400">
              Gerencie clientes, contas, agências, cartões e transações do banco.
            </p>
          </div>
        </section>

        {/* ABAS */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              {ABAS.map((aba) => {
                const Icon = aba.icon;
                const ativo = aba.chave === abaAtiva;
                return (
                  <button
                    key={aba.chave}
                    onClick={() => handleSelecionarAba(aba.chave)}
                    className={`rounded-xl p-4 font-bold transition flex flex-col items-center justify-center gap-2 border ${
                      ativo
                        ? 'bg-linear-to-br from-red-500/30 to-pink-500/20 border-red-400 text-white'
                        : 'bg-red-900/20 border-red-500/10 text-gray-400 hover:border-red-500/30 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{aba.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTEÚDO DA ABA */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-900/20 border border-red-500/10 rounded-2xl overflow-hidden">
              {/* TOOLBAR */}
              <div className="p-6 border-b border-red-500/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <config.icon className="w-5 h-5 text-red-400" />
                  {config.label}
                  <span className="text-gray-500 text-sm font-normal">
                    ({dadosFiltrados.length})
                  </span>
                </h2>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder={`Buscar ${config.label.toLowerCase()}...`}
                      className="pl-9 pr-3 py-2 bg-black/20 border border-red-500/20 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-red-400 w-56"
                    />
                  </div>

                  <button
                    onClick={() => carregarDados(config)}
                    className="p-2 text-gray-400 hover:text-white border border-red-500/20 rounded-lg hover:bg-red-500/10 transition"
                    aria-label="Atualizar"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => router.push(config.rotaNova)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Novo</span>
                  </button>
                </div>
              </div>

              {/* CORPO */}
              {carregando ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                  <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
                  <p className="text-gray-400">Carregando {config.label.toLowerCase()}...</p>
                </div>
              ) : erro ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                  <p className="text-white font-bold">Erro ao carregar dados</p>
                  <p className="text-gray-400 max-w-md">{erro}</p>
                  <button
                    onClick={() => carregarDados(config)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : dadosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
                  <Inbox className="w-10 h-10 text-gray-500" />
                  <p className="text-gray-400">
                    {busca
                      ? `Nenhum resultado para "${busca}".`
                      : `Nenhum registro de ${config.label.toLowerCase()} encontrado.`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-red-500/10">
                        {config.colunas.map((coluna) => (
                          <th
                            key={coluna.header}
                            className={`px-6 py-4 text-left text-sm text-gray-400 whitespace-nowrap ${coluna.className ?? ''}`}
                          >
                            {coluna.header}
                          </th>
                        ))}
                        <th className="px-6 py-4 text-right text-sm text-gray-400">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFiltrados.map((item) => {
                        const id = paraId(item.id);
                        return (
                          <tr
                            key={id}
                            className="border-b border-red-500/5 hover:bg-red-500/5 transition"
                          >
                            {config.colunas.map((coluna) => (
                              <td
                                key={coluna.header}
                                className={`px-6 py-4 text-white whitespace-nowrap ${coluna.className ?? ''}`}
                              >
                                {coluna.render(item)}
                              </td>
                            ))}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => router.push(config.rotaEditar(id))}
                                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                                  aria-label={`Editar ${config.labelSingular}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleExcluir(item)}
                                  disabled={excluindoId === id}
                                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                                  aria-label={`Excluir ${config.labelSingular}`}
                                >
                                  {excluindoId === id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-red-500/10 px-6 py-8">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2024 ForjaBank. Todos os direitos reservados. | Segurança 24/7</p>
          </div>
        </footer>
      </main>
    </div>
  );
}