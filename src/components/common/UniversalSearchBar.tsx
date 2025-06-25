'use client';

import React from 'react';
import { Search, User, Users, Trophy, X, Calendar, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearch, SearchResult, SearchConfig } from '@/hooks/useSearch';

interface UniversalSearchBarProps {
  searchFunction: (query: string, types: string[]) => SearchResult[];
  config: SearchConfig;
  onResultClick?: (result: SearchResult) => void;
  onQueryChange?: (query: string) => void;
  className?: string;
}

export const UniversalSearchBar = ({
  searchFunction,
  config,
  onResultClick,
  onQueryChange,
  className = 'max-w-2xl'
}: UniversalSearchBarProps) => {
  const {
    query,
    results,
    isOpen,
    selectedIndex,
    isLoading,
    searchRef,
    inputRef,
    updateQuery,
    handleResultClick,
    handleKeyDown,
    handleFocus,
    clearSearch
  } = useSearch({
    searchFunction,
    config,
    onResultClick,
    onQueryChange
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'team':
        return <Users className="w-4 h-4 text-green-400" />;
      case 'championship':
      case 'championship_participation':
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case 'match':
        return <Calendar className="w-4 h-4 text-orange-400" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'team':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'championship':
      case 'championship_participation':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'match':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'player':
        return 'Jogador';
      case 'team':
        return 'Equipe';
      case 'championship':
        return 'Campeonato';
      case 'championship_participation':
        return 'Participação';
      case 'match':
        return 'Partida';
      default:
        return type;
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={config.placeholder || "Buscar..."}
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-700 shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-400">Buscando...</span>
              </div>
            ) : (
              results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedIndex === index
                      ? 'bg-red-500/20 border border-red-500/30'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    result.type === 'player' 
                      ? 'bg-blue-500/20' 
                      : result.type === 'team'
                      ? 'bg-green-500/20'
                      : result.type === 'championship' || result.type === 'championship_participation'
                      ? 'bg-purple-500/20'
                      : 'bg-orange-500/20'
                  }`}>
                    {getIcon(result.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-medium truncate">{result.name}</p>
                      <Badge className={getBadgeColor(result.type)}>
                        {getTypeLabel(result.type)}
                      </Badge>
                    </div>
                    {result.subtitle && (
                      <p className="text-gray-400 text-sm truncate">{result.subtitle}</p>
                    )}
                  </div>
                  
                  {/* Metadata adicional se necessário */}
                  {result.metadata && (
                    <div className="text-right text-xs text-gray-500 hidden md:block">
                      {result.type === 'player' && result.metadata.teamName && (
                        <div>Equipe: {result.metadata.teamName}</div>
                      )}
                      {result.type === 'team' && result.metadata.winRate && (
                        <div>{Math.round(result.metadata.winRate * 100)}% WR</div>
                      )}
                      {result.type === 'championship' && result.metadata.totalTeams && (
                        <div>{result.metadata.totalTeams} equipes</div>
                      )}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
          
          {!isLoading && results.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
              {results.length === config.maxResults ? `Mostrando ${config.maxResults} resultados` : `${results.length} resultado(s) encontrado(s)`}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};