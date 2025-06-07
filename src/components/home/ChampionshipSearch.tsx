'use client';
import React, { useState } from 'react';
import { Filter, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicSearchBar } from '@/components/public/PublicSearchBar';
import { useRouter } from 'next/navigation';

export function ChampionshipSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Mock data baseado no que existe no DER
  
  // Mock data baseado no que existe no DER
  const campeonatos = [
    {
      id: 1,
      name: "Liga de Verão 2024",
      location: "Curitiba - PR",
      format: "Single Elimination",
      start_date: "2024-12-15",
      end_date: "2024-12-22",
      status: "Em andamento",
      teams_registered: 16,
      max_teams: 32
    },
    {
      id: 2,
      name: "Torneio Nacional",
      location: "Londrina - PR",
      format: "Double Elimination",
      start_date: "2025-01-01",
      end_date: "2025-01-15",
      status: "Inscrições abertas",
      teams_registered: 8,
      max_teams: 16
    },
    {
      id: 3,
      name: "Copa Regional",
      location: "Cornélio Procópio - PR",
      format: "Round Robin",
      start_date: "2024-11-01",
      end_date: "2024-11-30",
      status: "Finalizado",
      teams_registered: 24,
      max_teams: 24
    }
  ];

  const filteredCampeonatos = campeonatos.filter(campeonato =>
    campeonato.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campeonato.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em andamento":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Em andamento</Badge>;
      case "Inscrições abertas":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Inscrições abertas</Badge>;
      case "Finalizado":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Finalizado</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{status}</Badge>;
    }
  };

  return (
    <section id="campeonatos" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Encontre <span className="text-red-500">Campeonatos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubra torneios de Valorant em andamento ou com inscrições abertas
          </p>
        </div>        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <PublicSearchBar 
            placeholder="Buscar por nome do campeonato ou localização..."
          />
        </div>

        {/* Championships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampeonatos.map((campeonato) => (
            <Card key={campeonato.id} className="bg-gray-800/50 border-gray-700 p-6 hover:border-red-500/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">{campeonato.name}</h3>
                  {getStatusBadge(campeonato.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{campeonato.location}</span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      {new Date(campeonato.start_date).toLocaleDateString('pt-BR')} - {new Date(campeonato.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      {campeonato.teams_registered}/{campeonato.max_teams} equipes
                    </span>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Filter className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{campeonato.format}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    disabled={campeonato.status === "Finalizado"}
                    onClick={() => router.push(`/campeonatos/${campeonato.id}`)}
                  >
                    {campeonato.status === "Finalizado" ? "Ver Resultados" : "Ver Detalhes"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCampeonatos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nenhum campeonato encontrado com os critérios de busca.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}