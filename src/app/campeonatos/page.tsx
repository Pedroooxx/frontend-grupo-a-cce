'use client'
import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, Target, Crown } from 'lucide-react';
import { publicChampionships } from '@/data/data-mock';
import PublicLayout from '@/components/layout/PublicLayout';
import { useState } from 'react';
import { PublicSearchBar } from '@/components/public/PublicSearchBar';

export default function ChampionshipsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const filteredChampionships = publicChampionships.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         championship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || championship.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Em Breve' },
      ongoing: { color: 'bg-green-500/20 text-green-400', label: 'Em Andamento' },
      completed: { color: 'bg-blue-500/20 text-blue-400', label: 'Finalizado' },
      cancelled: { color: 'bg-red-500/20 text-red-400', label: 'Cancelado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <PublicLayout title="Campeonatos">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Campeonatos de Valorant
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Acompanhe todos os campeonatos, desde torneios locais até competições nacionais
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}            <div className="flex-1 relative">
              <PublicSearchBar
                searchTypes={['championship', 'team', 'match']}
                placeholder="Buscar campeonatos, equipes ou partidas..."
                onQueryChange={setSearchQuery}
                className="w-full" 
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todos os Status</option>
                <option value="upcoming">Em Breve</option>
                <option value="ongoing">Em Andamento</option>
                <option value="completed">Finalizados</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-slate-400">
              {filteredChampionships.length} campeonato{filteredChampionships.length !== 1 ? 's' : ''} encontrado{filteredChampionships.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Championships Grid */}          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChampionships.map((championship) => (
              <div key={championship.championship_id} className="bg-slate-800 border border-slate-700 rounded-md p-6 hover:bg-slate-750 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex-1 mr-3">
                    {championship.name}
                  </h3>
                  {getStatusBadge(championship.status)}
                </div>

                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  {championship.description.length > 120 
                    ? `${championship.description.substring(0, 120)}...`
                    : championship.description
                  }
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-slate-300 text-sm">
                    <Calendar className="w-4 h-4 text-red-500 mr-2" />
                    <span>{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</span>
                  </div>
                  <div className="flex items-center text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-red-500 mr-2" />
                    <span>{championship.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-red-500 mr-2" />
                      <span>{championship.teams_count} equipes</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-red-500 mr-2" />
                      <span>{championship.matches_count} partidas</span>
                    </div>
                  </div>
                  {championship.prize_pool && (
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Crown className="w-4 h-4 mr-2" />
                      <span>{championship.prize_pool}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/campeonatos/${championship.championship_id}`}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors font-medium text-center block"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredChampionships.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Nenhum campeonato encontrado
              </h3>
              <p className="text-slate-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}