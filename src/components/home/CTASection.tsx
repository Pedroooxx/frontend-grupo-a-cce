import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const benefits = [
    "Crie campeonatos ilimitados",
    "Gerencie equipes e jogadores",
    "Acompanhe estatísticas em tempo real",
    "Sistema de rankings automático",
    "Suporte técnico dedicado"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para Organizar seu
              <span className="block">Primeiro Campeonato?</span>
            </h2>
            
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Junte-se à plataforma líder em organização de torneios de Valorant. 
              Comece hoje mesmo e leve seus campeonatos ao próximo nível.
            </p>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-red-100">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Criar Conta Gratuita
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Ver Demo
              </Button>
            </Link>
          </div>

          <p className="text-red-200 text-sm mt-6">
            Gratuito para começar • Sem cartão de crédito necessário
          </p>
        </div>
      </div>
    </section>
  );
}