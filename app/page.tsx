'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, Smartphone, TrendingUp, Lock } from 'lucide-react';

export default function BancoLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-red-950 via-red-900 to-black overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-[10%] left-[5%] animate-pulse" />
        <div className="absolute w-96 h-96 bg-linear-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl bottom-[10%] right-[5%] animate-pulse" />
      </div>

      {/* NAV */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-red-950/90 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-white font-bold text-xl">ForjaBank</span>
          </div>

          {/* MENU */}
          <div className="hidden md:flex gap-8 text-sm">
            <a href="/sobre" className="text-gray-300 hover:text-red-400">Sobre</a>
            <a href="/servicos" className="text-gray-300 hover:text-red-400">Serviços</a>
            <a href="/seguranca" className="text-gray-300 hover:text-red-400">Segurança</a>
          </div>

          {/* CTA */}
          <a
            href="/clientes/cadastro"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
          >
            Cadastrar <ChevronRight size={16} />
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <span className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-300 text-sm">
              Segurança Bancária 24/7
            </span>

            <h1 className="text-5xl font-bold text-white mt-2">
              Seu banco
              <span className="block text-transparent bg-linear-to-r from-red-400 to-pink-400 bg-clip-text">
                sempre à mão
              </span>
            </h1>

            <p className="text-gray-300 max-w-lg">
              Transações seguras, rápidas e confiáveis. Seu dinheiro protegido com tecnologia de ponta.
            </p>

            <div className="flex gap-4">
              <a
                href="/login"
                className="px-8 py-4 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-red-500/40"
              >
                <Lock size={18} />
                Fazer Login
              </a>

              <button className="px-8 py-4 border border-gray-500 rounded-xl text-gray-300 hover:border-red-400 hover:text-white">
                Saiba mais
              </button>
            </div>
          </div>

          {/* CARD VISUAL */}
          <div className="hidden lg:flex justify-center">
            <div className="w-80 h-48 bg-linear-to-br from-red-900 to-black rounded-2xl p-6 border border-red-500/20 shadow-xl">
              <p className="text-gray-400 text-xs">Conta Corrente</p>
              <p className="text-white text-2xl font-bold mt-2">•••• 4829</p>

              <div className="mt-6">
                <p className="text-gray-400 text-xs">Saldo</p>
                <p className="text-white text-xl font-bold">R$ 25.450,00</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            { icon: Shield, title: 'Segurança', desc: 'Criptografia avançada' },
            { icon: Smartphone, title: 'App', desc: 'Controle total no celular' },
            { icon: TrendingUp, title: 'Investimentos', desc: 'Alta performance' },
          ].map((f, i) => (
            <div key={i} className="p-6 bg-red-900/20 border border-red-500/10 rounded-xl hover:border-red-500/40 transition">
              <f.icon className="text-red-400 mb-3" />
              <h3 className="text-white font-bold">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}