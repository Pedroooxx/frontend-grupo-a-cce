'use client'
import React, { useState } from "react";
// import { Search, Trophy, Users, Calendar, Target, ArrowRight, UserPlus, LogIn, Menu, X, MapPin, Crown, Play, CheckCircle, Circle } from "lucide-react";
// Assuming Search was only for the removed input. If other components on this page use it, it should remain.
// PublicSearchBar imports its own Search icon.
import { Trophy, Users, Calendar, Target, ArrowRight, UserPlus, LogIn, Menu, X, MapPin, Crown, Play, CheckCircle, Circle } from "lucide-react"; // Search removed
import Link from "next/link";
import { publicChampionships, publicMatches } from '@/data/public-mock';
import { PublicSearchBar } from '@/components/public/PublicSearchBar'; // Added

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (<div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">ESPORTS</div>
                <div className="text-red-500 font-bold text-lg leading-none">LEAGUE</div>
              </div>
            </div>            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/campeonatos" className="text-slate-300 hover:text-white transition-colors">
                Campeonatos
              </Link>
              <Link href="#sobre" className="text-slate-300 hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="#contato" className="text-slate-300 hover:text-white transition-colors">
                Contato
              </Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className={`absolute right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>            {/* Navigation Links */}
            <nav className="space-y-4 mb-8">
              <Link 
                href="/campeonatos" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Campeonatos
              </Link>
              <Link 
                href="#sobre" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="#contato" 
                className="block text-slate-300 hover:text-white text-lg py-2 border-b border-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full px-4 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </button>
              <button className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Hero Banner */}
      <section className="relative bg-gradient-to-b from-slate-800 to-slate-900 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/videos/homeBGvideo.mp4" type="video/mp4" />
            <source src="/videos/homeBGvideo.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Gerencie Campeonatos de 
              <span className="text-red-500"> Valorant</span>
            </h1>
            <p className="text-base md:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed px-4">
              A plataforma completa para criar, gerenciar e acompanhar campeonatos de Valorant. 
              Controle estatísticas, organize equipes e monitore o desempenho dos jogadores em tempo real.
            </p>
              
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-base md:text-lg">
                <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                Criar Meu Campeonato
              </button>
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md text-base md:text-lg">
                Ver Campeonatos Ativos
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">15+</div>                
                <div className="text-slate-400 text-xs md:text-sm">Campeonatos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">120+</div>
                <div className="text-slate-400 text-xs md:text-sm">Equipes Registradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">500+</div>
                <div className="text-slate-400 text-xs md:text-sm">Jogadores Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1 md:mb-2">1.2K+</div>
                <div className="text-slate-400 text-xs md:text-sm">Partidas Jogadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Search Section */}
      <section id="campeonatos" className="py-12 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Encontre Campeonatos
            </h2>            
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              Busque por campeonatos ativos, equipes participantes ou jogadores. 
              Acompanhe estatísticas em tempo real e veja os melhores desempenhos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-4">            
            {/* 
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                placeholder="Buscar campeonatos, equipes..."
                className="w-full pl-12 pr-20 md:pr-24 py-3 md:py-4 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-md transition-colors text-sm md:text-base">
                Buscar
              </button>
            </div>
            */}
            <PublicSearchBar
              searchTypes={['championship']}
              placeholder="Buscar campeonatos..."
              // className prop will use PublicSearchBar's default "max-w-2xl" which fits this parent div.
              // Or pass "w-full" if PublicSearchBar's default is removed/changed.
              // Given parent is "max-w-2xl mx-auto", PublicSearchBar's default "max-w-2xl" is fine.
            />
          </div>          {/* Featured Championships */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Liga de Verão 2024</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Em andamento
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Campeonato principal da temporada com 32 equipes participantes
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span><Users className="w-4 h-4 inline mr-1" />32 equipes</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />12 partidas</span>
              </div>
              <Link 
                href="/campeonatos/1"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-2 rounded-md flex items-center justify-center"
              >
                Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Copa Regional</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Finalizado
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Torneio regional com foco em equipes emergentes
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span><Users className="w-4 h-4 inline mr-1" />16 equipes</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />8 partidas</span>
              </div>
              <Link 
                href="/campeonatos/2"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-2 rounded-md flex items-center justify-center"
              >
                Ver Resultados <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Torneio Universitário</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Inscrições Abertas
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Competição exclusiva para equipes universitárias
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span><Users className="w-4 h-4 inline mr-1" />24 vagas</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />Início em breve</span>
              </div>
              <Link 
                href="/campeonatos/3"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-2 rounded-md flex items-center justify-center"
              >
                Inscrever-se <ArrowRight className="w-4 h-4 ml-2" />              </Link>
            </div>
          </div>
          
          {/* View All Link */}
          <div className="text-center mt-8">
            <Link 
              href="/campeonatos"
              className="inline-flex items-center px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md"
            >
              Ver Todos os Campeonatos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>{/* Features Section */}
      <section className="py-12 md:py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              Tudo que você precisa para organizar campeonatos profissionais de Valorant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Gestão de Campeonatos</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Crie e gerencie campeonatos completos com chaveamentos automáticos, 
                controle de inscrições e acompanhamento de resultados.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Estatísticas Detalhadas</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Acompanhe KDA, MVPs, performance por mapa e agente. 
                Análises completas para jogadores e equipes.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Gestão de Equipes</h3>
              <p className="text-slate-400 text-sm md:text-base">
                Organize equipes, gerencie jogadores e coaches. 
                Controle completo sobre participantes e permissões.
              </p>
            </div>
          </div>
        </div>
      </section>{/* CTA Section */}
      <section className="py-16 bg-gradient-to-t from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuitamente e comece a organizar seus próprios campeonatos de Valorant hoje mesmo.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center text-lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Criar Conta Gratuita
            </button>
            <button className="px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center text-lg">
              <LogIn className="w-5 h-5 mr-2" />
              Fazer Login
            </button>
          </div>
        </div>
      </section>      {/* Featured Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Matches */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Partidas em Destaque
              </h3>
              <div className="space-y-4">                <Link href="/campeonatos/1/partidas/3" className="block bg-slate-700 rounded-md p-4 hover:bg-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Final - Liga de Verão</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Finalizada</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span>Valorant Kings</span>
                      <span className="ml-2 text-red-500 font-semibold">13</span>
                    </div>
                    <div className="text-slate-400 text-sm">VS</div>
                    <div className="text-white text-right">
                      <span className="mr-2 text-red-500 font-semibold">9</span>
                      <span>Sage Warriors</span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm mt-2">
                    Ascent • 18/02 19:00
                  </div>
                </Link>

                <Link href="/campeonatos/1/partidas/1" className="block bg-slate-700 rounded-md p-4 hover:bg-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Semifinal - Liga de Verão</span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Finalizada</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span>Valorant Kings</span>
                      <span className="ml-2 text-red-500 font-semibold">13</span>
                    </div>
                    <div className="text-slate-400 text-sm">VS</div>
                    <div className="text-white text-right">
                      <span className="mr-2 text-red-500 font-semibold">11</span>
                      <span>Phoenix Squad</span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm mt-2">
                    Haven • 15/02 19:00
                  </div>
                </Link>
              </div>
              
              <Link 
                href="/campeonatos" 
                className="inline-flex items-center mt-4 text-red-500 hover:text-red-400 transition-colors"
              >
                Ver todos os campeonatos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Top Teams */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Equipes em Destaque</h3>
              <div className="space-y-4">
                <Link href="/campeonatos/1/equipes/1" className="flex items-center justify-between p-3 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Valorant Kings</div>
                      <div className="text-slate-400 text-sm">15V - 3D • 83% WR</div>
                    </div>
                  </div>
                  <div className="text-yellow-500 font-semibold">#1</div>
                </Link>

                <Link href="/campeonatos/1/equipes/2" className="flex items-center justify-between p-3 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Phoenix Squad</div>
                      <div className="text-slate-400 text-sm">12V - 6D • 67% WR</div>
                    </div>
                  </div>
                  <div className="text-slate-400 font-semibold">#2</div>
                </Link>

                <Link href="/campeonatos/1/equipes/3" className="flex items-center justify-between p-3 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Sage Warriors</div>
                      <div className="text-slate-400 text-sm">8V - 8D • 50% WR</div>
                    </div>
                  </div>
                  <div className="text-orange-600 font-semibold">#3</div>
                </Link>
              </div>
              
              <Link 
                href="/campeonatos/1" 
                className="inline-flex items-center mt-4 text-red-500 hover:text-red-400 transition-colors"
              >
                Ver classificação completa
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">ESPORTS</div>
                  <div className="text-red-500 font-bold text-lg leading-none">LEAGUE</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-xs">
                A plataforma definitiva para campeonatos de Valorant profissionais e organizados.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 md:mb-4">Plataforma</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Campeonatos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Equipes</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Estatísticas</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Ranking</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 md:mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Regras</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 md:mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="text-slate-400 text-xs md:text-sm">
              © 2024 Esports League. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
