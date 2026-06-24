'use client';

import React from 'react';
import {
  Shield,
  Target,
  Heart,
  Zap,
  Users,
  Award,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  Globe,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Proteção total dos seus dados e transações é nossa prioridade máxima.',
  },
  {
    icon: Heart,
    title: 'Transparência',
    description: 'Somos claros sobre taxas, prazos e todos os termos dos nossos serviços.',
  },
  {
    icon: Zap,
    title: 'Inovação',
    description: 'Constantemente buscamos novas tecnologias para melhor servir você.',
  },
  {
    icon: Users,
    title: 'Humanidade',
    description: 'Acreditamos que tecnologia deve servir as pessoas, não o contrário.',
  },
];

const timeline = [
  {
    year: '2014',
    title: 'Fundação',
    description: 'O ForjaBank é fundado com a missão de revolucionar o banking digital no Brasil.',
  },
  {
    year: '2016',
    title: 'Primeiro Milhão',
    description: 'Atingimos 1 milhão de usuários ativos em nossa plataforma.',
  },
  {
    year: '2018',
    title: 'Expansão Internacional',
    description: 'Iniciamos operações em outros países da América Latina.',
  },
  {
    year: '2020',
    title: 'Pandemia - Crescimento',
    description: 'Durante a pandemia, crescemos 300% impulsionados por transformação digital.',
  },
  {
    year: '2022',
    title: 'Certificações Globais',
    description: 'Obtemos todas as certificações internacionais de segurança e conformidade.',
  },
  {
    year: '2024',
    title: 'Liderança de Mercado',
    description: 'Consolidamos nossa posição como principal banco digital da região.',
  },
];

const stats = [
  { number: '10+', label: 'Anos de Experiência' },
  { number: '500K+', label: 'Clientes Ativos' },
  { number: 'R$ 2B+', label: 'em Transações' },
  { number: '15', label: 'Prêmios Conquistados' },
];

const awards = [
  'Melhor App Bancário - TechAwards 2023',
  'Fintech mais Confiável - FinancialTimes 2023',
  'Inovação em Segurança - SecurityExpo 2022',
  'Melhor Experiência do Usuário - UXAwards 2022',
  'Banco Digital do Ano - Banking Innovation 2021',
  'Empresa Sustentável - EcoAwards 2021',
];

const team = [
  { name: 'Carlos Silva', role: 'CEO & Fundador', emoji: '👨‍💼' },
  { name: 'Marina Costa', role: 'CTO - Tecnologia', emoji: '👩‍💻' },
  { name: 'João Santos', role: 'CFO - Financeiro', emoji: '👨‍💼' },
  { name: 'Ana Oliveira', role: 'Chief Security Officer', emoji: '👩‍💼' },
  { name: 'Pedro Ferreira', role: 'VP Produtos', emoji: '👨‍💼' },
  { name: 'Fernanda Lima', role: 'Head de Pessoas', emoji: '👩‍💼' },
];

export default function SobreNosPage() {
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
              <Globe className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Sobre o <span className="bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">ForjaBank</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Somos um banco digital que acredita que a tecnologia deve servir as pessoas. Há mais de 10 anos, transformamos vidas através de finanças mais acessíveis e seguras.
            </p>
          </div>
        </section>

        {/* MISSÃO, VISÃO, VALORES */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* MISSÃO */}
              <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4">
                  <Target className="text-blue-400 w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Nossa Missão</h3>
                <p className="text-gray-300">
                  Democratizar o acesso ao sistema financeiro através de tecnologia segura, transparente e inovadora.
                </p>
              </div>

              {/* VISÃO */}
              <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
                  <Lightbulb className="text-purple-400 w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Nossa Visão</h3>
                <p className="text-gray-300">
                  Ser o banco digital mais confiável e inovador, presente na vida de milhões de brasileiros.
                </p>
              </div>

              {/* PROPÓSITO */}
              <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                  <TrendingUp className="text-green-400 w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Nosso Propósito</h3>
                <p className="text-gray-300">
                  Empoderar pessoas e empresas a alcançar sua liberdade financeira através da tecnologia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Nossos Valores</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 hover:border-red-500/30 transition"
                  >
                    <div className="flex gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-lg shrink-0">
                        <Icon className="text-red-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
                        <p className="text-gray-400">{value.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ESTATÍSTICAS */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Números que Falam por Nós</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-8 text-center"
                >
                  <p className="text-4xl font-bold text-transparent bg-linear-to-r from-red-400 to-pink-400 bg-clip-text mb-2">
                    {stat.number}
                  </p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Nossa Jornada</h2>
            <p className="text-gray-400 text-center mb-12">
              Uma década de inovação, crescimento e transformação digital no sistema financeiro brasileiro.
            </p>

            <div className="relative space-y-8">
              {/* Linha vertical */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-1 h-full bg-linear-to-b from-red-500 to-pink-500" />

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex gap-6 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-8 h-8 bg-red-500 border-4 border-red-950 rounded-full flex items-center justify-center z-10">
                    <Clock className="text-white w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 hover:border-red-500/30 transition">
                      <span className="text-red-400 font-bold text-lg">{item.year}</span>
                      <h3 className="text-white font-bold text-xl mt-2">{item.title}</h3>
                      <p className="text-gray-400 mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRÊMIOS */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Prêmios e Reconhecimentos</h2>
            <p className="text-gray-400 text-center mb-12">
              Nossa dedicação à excelência tem sido reconhecida por importantes instituições.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <Award className="text-yellow-400 w-5 h-5 shrink-0" />
                  <span className="text-white">{award}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIME */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Conheça Nossa Liderança</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 text-center hover:border-red-500/30 transition"
                >
                  <div className="text-5xl mb-4">{member.emoji}</div>
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-red-400 text-sm mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NOSSA CULTURA */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Nossa Cultura</h2>

            <div className="space-y-6">
              {[
                {
                  title: 'Pessoas em Primeiro Lugar',
                  description: 'Acreditamos que nossos colaboradores são o maior ativo. Oferecemos ambiente acolhedor, benefícios competitivos e oportunidades de crescimento.',
                },
                {
                  title: 'Inovação Contínua',
                  description: 'Encorajamos experimentação, aprendizado e criatividade. Cada ideia é valorizada e nosso time está sempre buscando novas soluções.',
                },
                {
                  title: 'Diversidade e Inclusão',
                  description: 'Celebramos as diferenças e acreditamos que equipes diversas produzem melhores resultados. Somos um lugar seguro para todos.',
                },
                {
                  title: 'Responsabilidade Social',
                  description: 'Atuamos com propósito social, investindo em educação financeira e programas de inclusão econômica em comunidades carentes.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-red-900/20 border border-red-500/10 rounded-2xl p-6 hover:border-red-500/30 transition"
                >
                  <CheckCircle className="text-green-400 w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Faça Parte da Nossa História
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de milhares de pessoas que já confiam no ForjaBank para suas necessidades financeiras.
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
                  href="/servicos"
                  className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-300 font-bold rounded-xl hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                >
                  Conhecer Serviços
                  <ArrowRight size={18} />
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
                  <span className="text-white font-bold">ForjaBank</span>
                </div>
                <p className="text-gray-400 text-sm">Seu banco digital inovador e confiável</p>
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
              <p>© 2024 ForjaBank. Todos os direitos reservados. | Inovação · Confiança · Crescimento</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}