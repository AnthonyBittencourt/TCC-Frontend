'use client';

import React from 'react';
import {
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Smartphone,
  Server,
  Key,
  Zap,
  FileText,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Criptografia de Ponta a Ponta',
    description: 'Todos os seus dados são criptografados com padrão AES-256-bit, o mesmo usado por governos.',
    details: ['Segurança em trânsito', 'Segurança em repouso', 'Certificado SSL/TLS'],
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Key,
    title: 'Autenticação Multifator',
    description: 'Dupla camada de proteção para sua conta com biometria e códigos únicos.',
    details: ['Biometria (Impressão digital)', 'Código de segurança SMS', 'Token de autenticação'],
    color: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Eye,
    title: 'Monitoramento 24/7',
    description: 'Sistema inteligente de detecção de fraudes que monitora suas transações em tempo real.',
    details: ['IA detecta anomalias', 'Alertas em tempo real', 'Bloqueio de transações suspeitas'],
    color: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Server,
    title: 'Infraestrutura Segura',
    description: 'Servidores em data centers certificados com redundância total de sistemas.',
    details: ['Data centers ISO 27001', 'Backup contínuo', 'Recuperação de desastres'],
    color: 'from-orange-500/10 to-amber-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: Shield,
    title: 'Proteção contra Fraudes',
    description: 'Tecnologias avançadas para prevenir roubo de identidade e fraude online.',
    details: ['Análise comportamental', 'Detecção de phishing', 'Proteção contra malware'],
    color: 'from-red-500/10 to-rose-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    icon: Smartphone,
    title: 'App Seguro',
    description: 'Aplicativo com certificação de segurança de classe empresarial.',
    details: ['Sandboxing seguro', 'Atualização automática', 'Isolamento de dados'],
    color: 'from-indigo-500/10 to-blue-500/10',
    borderColor: 'border-indigo-500/30',
  },
];

const bestPractices = [
  {
    icon: AlertTriangle,
    title: 'Não compartilhe sua senha',
    description: 'O ForjaBank nunca pedirá sua senha por email, telefone ou mensagem.',
  },
  {
    icon: CheckCircle,
    title: 'Use biometria',
    description: 'Ative a autenticação biométrica para maior segurança no seu dispositivo.',
  },
  {
    icon: Zap,
    title: 'Atualize seu app',
    description: 'Mantenha o app do ForjaBank sempre atualizado para as versões mais recentes.',
  },
  {
    icon: Eye,
    title: 'Verifique URLs',
    description: 'Sempre acesse o ForjaBank através de forjabank.com.br ou do app oficial.',
  },
  {
    icon: Lock,
    title: 'WiFi público com cuidado',
    description: 'Evite acessar sua conta em redes WiFi públicas sem VPN.',
  },
  {
    icon: FileText,
    title: 'Revise transações',
    description: 'Acompanhe regularmente seu extrato para identificar atividades suspeitas.',
  },
];

const certifications = [
  'ISO 27001 - Segurança da Informação',
  'PCI DSS - Proteção de Dados de Cartão',
  'LGPD - Lei Geral de Proteção de Dados',
  'SOC 2 Type II - Controles de Segurança',
  'Certificado SSL/TLS EV',
  'BCB - Banco Central do Brasil',
];

export default function SegurancaPage() {
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
              <Shield className="text-red-400 w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Sua <span className="bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Segurança</span> é Nossa Prioridade
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              No ForjaBank, protegemos seus dados com tecnologia de ponta e protocolos de segurança internacionais. Confie em nossa expertise.
            </p>
          </div>
        </section>

        {/* SECURITY FEATURES */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Nossas Camadas de Proteção</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Implementamos múltiplas camadas de segurança para garantir a proteção total dos seus dados e transações.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`group bg-linear-to-br ${feature.color} border ${feature.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300`}
                  >
                    <div className="space-y-4">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-lg group-hover:bg-red-500/20 transition">
                        <Icon className="text-red-400 w-6 h-6" />
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
                      </div>

                      {/* Details */}
                      <ul className="space-y-2">
                        {feature.details.map((detail, dIndex) => (
                          <li key={dIndex} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="text-green-400 w-4 h-4 mt-0.5 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BEST PRACTICES */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Boas Práticas de Segurança</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Você também é responsável pela segurança da sua conta. Siga estas recomendações:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestPractices.map((practice, index) => {
                const Icon = practice.icon;
                return (
                  <div
                    key={index}
                    className="bg-red-900/20 border border-red-500/10 rounded-2xl p-6 hover:border-red-500/30 transition"
                  >
                    <div className="flex gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-lg shrink-0">
                        <Icon className="text-red-400 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-1">{practice.title}</h3>
                        <p className="text-gray-400 text-sm">{practice.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Certificações e Conformidade</h2>
            <p className="text-gray-400 text-center mb-12">
              O ForjaBank é certificado e segue rigorosamente padrões internacionais de segurança:
            </p>

            <div className="bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 w-5 h-5 shrink-0" />
                    <span className="text-white">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="px-6 py-20 border-t border-red-500/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Dúvidas Frequentes sobre Segurança</h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Minha conta está protegida se alguém roubar meu telefone?',
                  a: 'Sim, você tem múltiplas camadas de proteção. A biometria é vinculada ao seu dispositivo, e mesmo com acesso ao telefone, seria necessário a sua biometria. Além disso, qualquer acesso suspeito é bloqueado automaticamente.',
                },
                {
                  q: 'O ForjaBank rastreia meus dados de localização?',
                  a: 'Usamos localização apenas para segurança (detecção de fraude). Você controla quais permissões o app pode acessar. Nunca compartilhamos sua localização com terceiros.',
                },
                {
                  q: 'Como faço se suspeitar de fraude na minha conta?',
                  a: 'Entre em contato imediatamente pelo app, ligando para o suporte ou visitando uma agência. Bloqueamos transações suspeitas automaticamente e investiga qualquer atividade fraudulenta.',
                },
                {
                  q: 'Meus dados serão vendidos para terceiros?',
                  a: 'Nunca. Obedecemos rigorosamente a LGPD. Seus dados são apenas para fins operacionais e nunca são vendidos ou compartilhados sem seu consentimento explícito.',
                },
              ].map((item, index) => (
                <details
                  key={index}
                  className="group bg-red-900/20 border border-red-500/10 rounded-xl p-6 cursor-pointer hover:border-red-500/30 transition"
                >
                  <summary className="flex items-start gap-3 font-bold text-white">
                    <ArrowRight className="w-5 h-5 mt-1 shrink-0 group-open:rotate-90 transition" />
                    {item.q}
                  </summary>
                  <p className="text-gray-400 mt-4 ml-8">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">
                Segurança Confiável e Comprovada
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Abra sua conta no ForjaBank e aproveite a segurança de ponta que você merece. Seus dados estão em boas mãos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cadastro"
                  className="px-8 py-3 bg-linear-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:scale-105 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                >
                  Abrir Conta Segura
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
                  <span className="text-white font-bold">ForjaBank</span>
                </div>
                <p className="text-gray-400 text-sm">Seu banco digital seguro e confiável</p>
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
              <p>© 2024 ForjaBank. Todos os direitos reservados. | Segurança 24/7 · Privacidade Garantida · LGPD Compliant</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}