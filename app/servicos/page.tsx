'use client';

import React from 'react';
import {
  Shield,
  CreditCard,
  TrendingUp,
  Send,
  Lock,
  Smartphone,
  PiggyBank,
  Zap,
  Award,
  BarChart3,
  DollarSign,
  User,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: CreditCard,
    title: 'Cartões de Crédito',
    description: 'Cartões com limite personalizado, cashback e benefícios exclusivos.',
    features: ['Sem anuidade', 'Limite de até R$ 100.000', 'Cashback até 3%'],
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: PiggyBank,
    title: 'Conta Poupança',
    description: 'Rentabilidade garantida com segurança e praticidade.',
    features: ['Rendimento diário', 'Sem taxas', 'Saque a qualquer momento'],
    color: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Send,
    title: 'Transferências',
    description: 'Envie dinheiro de forma rápida, segura e sem complicações.',
    features: ['TED instantânea', 'PIX 24h', 'Transferência para qualquer banco'],
    color: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: TrendingUp,
    title: 'Investimentos',
    description: 'Invista em sua futuro com diversas opções de aplicações.',
    features: ['Renda fixa e variável', 'Assessoria especializada', 'Sem taxas de administração'],
    color: 'from-orange-500/10 to-amber-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: BarChart3,
    title: 'Empréstimos',
    description: 'Crédito rápido e com as menores taxas do mercado.',
    features: ['Aprovação em 5 minutos', 'Juros competitivos', 'Parcelas flexíveis'],
    color: 'from-rose-500/10 to-red-500/10',
    borderColor: 'border-rose-500/30',
  },
  {
    icon: Smartphone,
    title: 'App Mobile',
    description: 'Tenha seu banco na palma da sua mão, 24 horas por dia.',
    features: ['Interface intuitiva', 'Biometria segura', 'Atendimento prioritário'],
    color: 'from-indigo-500/10 to-blue-500/10',
    borderColor: 'border-indigo-500/30',
  },
  {
    icon: Lock,
    title: 'Segurança',
    description: 'Seus dados protegidos com tecnologia de ponta.',
    features: ['Criptografia 256-bit', 'Autenticação 2FA', 'Monitoramento 24/7'],
    color: 'from-slate-500/10 to-gray-500/10',
    borderColor: 'border-slate-500/30',
  },
  {
    icon: Award,
    title: 'Programa de Pontos',
    description: 'Acumule pontos em cada transação e resgate prêmios incríveis.',
    features: ['1 ponto por real gasto', 'Sem validade', 'Parcerias exclusivas'],
    color: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-500/30',
  },
];

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black">
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[20%] right-[5%] animate-pulse" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center bg-red-950/60 backdrop-blur border-b border-red-500/10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl">ForjaBank</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-red-400 transition"
          >
            Login
          </Link>
          <Link
            href="/cadastro"
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
          >
            Cadastre-se <ChevronRight size={14} />
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10">
        {/* HERO */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mb-2 mx-auto">
              <Zap className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Serviços Pensados para <span className="bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Você</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Conheça toda a gama de produtos e serviços que o ForjaBank oferece para facilitar sua vida financeira.
            </p>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className={`group bg-linear-to-br ${service.color} border ${service.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                  >
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-lg group-hover:bg-red-500/20 transition">
                        <Icon className="text-red-400 w-6 h-6" />
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-white font-bold text-lg">{service.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-300">
                            <ArrowRight className="text-red-400 w-4 h-4 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <button className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg font-medium hover:bg-red-500/20 transition mt-2">
                        Saiba Mais
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Por que escolher o FinanceBank?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: User, number: '500K+', label: 'Clientes Satisfeitos' },
                { icon: DollarSign, number: 'R$ 2B+', label: 'em Transações' },
                { icon: Award, number: '10 Anos', label: 'de Confiança' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-2xl">
                      <Icon className="text-red-400 w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stat.number}</p>
                      <p className="text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Abra sua conta no FinanceBank e comece a desfrutar de todos os nossos serviços com segurança e praticidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cadastro"
                  className="px-8 py-3 bg-linear-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:scale-105 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                >
                  Abrir Conta Agora
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-300 font-bold rounded-xl hover:bg-red-500/20 transition"
                >
                  Fazer Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-red-500/10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                    <Shield className="text-white w-6 h-6" />
                  </div>
                  <span className="text-white font-bold">FinanceBank</span>
                </div>
                <p className="text-gray-400 text-sm">Seu banco digital de confiança</p>
              </div>

              {[
                { title: 'Produtos', links: ['Contas', 'Cartões', 'Investimentos', 'Empréstimos'] },
                { title: 'Suporte', links: ['Centro de Ajuda', 'Contato', 'FAQ', 'Blog'] },
                { title: 'Companhia', links: ['Sobre Nós', 'Carreiras', 'Privacidade', 'Termos'] },
              ].map((column, idx) => (
                <div key={idx}>
                  <h4 className="text-white font-bold mb-3 text-sm">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <a href="#" className="text-gray-400 hover:text-red-400 text-sm transition">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-red-500/10 pt-8 text-center text-gray-500 text-sm">
              <p>© 2024 FinanceBank. Todos os direitos reservados. | Segurança · Privacidade · Confiança</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}