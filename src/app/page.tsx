'use client'
import React, { useEffect, useState } from "react";
import { Search, Trophy, Users, Calendar, Target, ArrowRight, UserPlus, LogIn, User } from "lucide-react";
import Link from "next/link";
import { publicChampionships, publicMatches } from '@/data/public-mock';
import { PublicSearchBar } from "@/components/public/PublicSearchBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading') {
      setIsInitialLoad(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      // Don't auto-redirect, let user choose to go to dashboard
    }
  }, [status]);

  const handleAuthAction = (action: 'signin' | 'signup' | 'dashboard') => {
    if (action === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/auth/${action}`);
    }
  };

  // Only show loading on initial load when there's no session data
  const shouldShowLoading = status === "loading" && isInitialLoad && !session;

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onAuthAction={handleAuthAction} />

      {/* Hero Banner */}
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
            {session && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Bem-vindo de volta!</h3>
                </div>
                <p className="text-green-300">
                  Olá, <span className="font-bold">{session.user.name}</span>! Pronto para gerenciar seus campeonatos?
                </p>
              </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Gerencie Campeonatos de 
              <span className="text-red-500"> Valorant</span>
            </h1>
            <p className="text-base md:text-xl text-slate-300 mb-6 md:mb-8 leading-relaxed px-4">
              A plataforma completa para criar, gerenciar e acompanhar campeonatos de Valorant. 
              Controle estatísticas, organize equipes e monitore o desempenho dos jogadores em tempo real.
            </p>
              
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
              {!session ? (
                <>
                  <button 
                    onClick={() => handleAuthAction('signup')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-base md:text-lg"
                  >
                    <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Criar Meu Campeonato
                  </button>
                  <button className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md text-base md:text-lg">
                    Ver Campeonatos Ativos
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleAuthAction('dashboard')}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-base md:text-lg"
                  >
                    <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Ir para Dashboard
                  </button>
                  <button className="w-full sm:w-auto px-6 md:px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md text-base md:text-lg">
                    Ver Campeonatos Ativos
                  </button>
                </>
              )}
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
      </section>

      {/* Search Section */}
      <section id="campeonatos" className="py-12 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Encontre Campeonatos, Equipes e Partidas
            </h2>            
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              Busque por campeonatos ativos, equipes participantes ou partidas específicas. 
              Acompanhe estatísticas em tempo real e veja os melhores desempenhos.
            </p>
          </div>          <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-4">              <PublicSearchBar
              searchTypes={['championship', 'team', 'match']}
              placeholder="Buscar campeonatos, equipes ou partidas..."
              className="w-full"
            />
          </div>{/* Featured Championships */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Liga de Verão 2024</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Em andamento
                </span>
              </div>
              <p className="text-slate-400 mb-6 flex-1">
                Campeonato principal da temporada com 32 equipes participantes
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                <span><Users className="w-4 h-4 inline mr-1" />32 equipes</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />12 partidas</span>
              </div>
              <Link 
                href="/campeonatos/1"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-3 rounded-md flex items-center justify-center mt-auto"
              >
                Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Copa Regional</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Finalizado
                </span>
              </div>
              <p className="text-slate-400 mb-6 flex-1">
                Torneio regional com foco em equipes emergentes
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                <span><Users className="w-4 h-4 inline mr-1" />16 equipes</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />8 partidas</span>
              </div>
              <Link 
                href="/campeonatos/2"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-3 rounded-md flex items-center justify-center mt-auto"
              >
                Ver Resultados <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 hover:bg-slate-750 transition-colors rounded-md flex flex-col min-h-[280px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Torneio Universitário</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Inscrições Abertas
                </span>
              </div>
              <p className="text-slate-400 mb-6 flex-1">
                Competição exclusiva para equipes universitárias
              </p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                <span><Users className="w-4 h-4 inline mr-1" />24 vagas</span>
                <span><Calendar className="w-4 h-4 inline mr-1" />Início em breve</span>
              </div>
              <Link 
                href="/campeonatos/3"
                className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors py-3 rounded-md flex items-center justify-center mt-auto"
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
            {!session ? 'Pronto para Começar?' : 'Continue Organizando'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            {!session 
              ? 'Crie sua conta gratuitamente e comece a organizar seus próprios campeonatos de Valorant hoje mesmo.'
              : 'Acesse seu dashboard para continuar gerenciando seus campeonatos e equipes.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!session ? (
              <>
                <button 
                  onClick={() => handleAuthAction('signup')}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Criar Conta Gratuita
                </button>
                <button 
                  onClick={() => handleAuthAction('signin')}
                  className="px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors rounded-md flex items-center justify-center text-lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Fazer Login
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleAuthAction('dashboard')}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white transition-colors rounded-md flex items-center justify-center text-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Ir para Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Live Matches - Single Container */}
            <div className="bg-slate-800 border border-slate-700 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Partidas em Destaque
              </h3>
              <div className="space-y-4">
                <Link href="/campeonatos/1/partidas/3" className="block bg-slate-700 rounded-md p-4 hover:bg-slate-600 transition-colors">
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
                  </div>                  <div className="text-slate-400 text-sm mt-2">
                    Haven • 15/02 19:00
                  </div>
                </Link>
              </div>
              
              <Link 
                href="/campeonatos" 
                className="inline-flex items-center mt-6 text-red-500 hover:text-red-400 transition-colors"
              >
                Ver todos os campeonatos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>        </div>
      </section>

      <Footer />
    </div>
  );
}
