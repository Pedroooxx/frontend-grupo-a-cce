'use client';

import { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import { Search, Trophy, Users, Calendar, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { publicChampionships, publicTeams, publicMatches } from '@/data/data-mock';

interface SearchResult {
  id: number;
  name: string;
  type: 'championship' | 'team' | 'match';
  subtitle?: string;
}

interface PublicSearchBarProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  searchTypes?: ('championship' | 'team' | 'match')[]; // New prop
  onQueryChange?: (query: string) => void; // New prop
}

export const PublicSearchBar = ({ 
  onResultClick, 
  placeholder = "Buscar campeonatos, equipes ou partidas...",
  className, // Use default from component if not provided by specific instance
  searchTypes,
  onQueryChange
}: PublicSearchBarProps) => {
  const [query, _setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const setQuery = (newQuery: string) => {
    _setQuery(newQuery);
    if (onQueryChange) {
      onQueryChange(newQuery);
    }
  };
  const searchAll = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    const allPossibleResults: SearchResult[] = [];

    // Search championships
    if (!searchTypes || searchTypes.includes('championship')) {
      const championshipResults = publicChampionships
        .filter(championship =>
          championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          championship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          championship.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(championship => ({
          id: championship.championship_id,
          name: championship.name,
          type: 'championship' as const,
          subtitle: `${championship.location} - ${championship.status === 'ongoing' ? 'Em andamento' : championship.status === 'completed' ? 'Finalizado' : championship.status === 'upcoming' ? 'Em breve' : 'Cancelado'}`
        }));
      allPossibleResults.push(...championshipResults);
    }

    // Search teams
    if (!searchTypes || searchTypes.includes('team')) {
      const teamResults = publicTeams
        .filter(team =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.manager_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(team => ({
          id: team.team_id,
          name: team.name,
          type: 'team' as const,
          subtitle: `Gerenciado por ${team.manager_name} - ${Math.round(team.win_rate * 100)}% taxa de vitória`
        }));
      allPossibleResults.push(...teamResults);
    }

    // Search matches
    if (!searchTypes || searchTypes.includes('match')) {
      const matchResults = publicMatches
        .filter(match =>
          match.teamA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.teamB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.map.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.stage.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(match => ({
          id: match.match_id,
          name: `${match.teamA.name} vs ${match.teamB.name}`,
          type: 'match' as const,
          subtitle: `${match.stage} - ${match.map} - ${match.status === 'completed' ? 'Finalizada' : match.status === 'live' ? 'Ao Vivo' : 'Agendada'}`
        }));
      allPossibleResults.push(...matchResults);
    }
    
    return allPossibleResults.slice(0, 8);
  }, [searchTypes]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchAll(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, searchAll]); // Added searchAll to useEffect dependency array

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation
      let path = '';
      switch (result.type) {
        case 'championship':
          path = `/campeonatos/${result.id}`;
          break;
        case 'team':
          // Find which championship the team participates in by looking at matches
          const teamMatch = publicMatches.find(match => 
            match.teamA.team_id === result.id || match.teamB.team_id === result.id
          );
          if (teamMatch) {
            path = `/campeonatos/${teamMatch.championship_id}/equipes/${result.id}`;
          } else {
            // Fallback to first championship if no matches found
            path = `/campeonatos/1/equipes/${result.id}`;
          }
          break;
        case 'match':
          // Find championship ID for the match
          const match = publicMatches.find(m => m.match_id === result.id);
          if (match) {
            path = `/campeonatos/${match.championship_id}/partidas/${result.id}`;
          }
          break;
      }
      
      if (path) {
        router.push(path);
      }
    }
    
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery(''); // Uses the wrapper to also call onQueryChange
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'championship':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'team':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'match':
        return <Calendar className="w-4 h-4 text-green-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'championship':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'team':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'match':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'championship':
        return 'Campeonato';
      case 'team':
        return 'Equipe';
      case 'match':
        return 'Partida';
      default:
        return '';
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className || 'max-w-2xl'}`}> {/* Ensure className prop is used, provide a default if needed */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Uses the wrapper
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(results.length > 0)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-700 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  selectedIndex === index
                    ? 'bg-red-500/20 border border-red-500/30'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  result.type === 'championship' 
                    ? 'bg-yellow-500/20' 
                    : result.type === 'team'
                    ? 'bg-blue-500/20'
                    : 'bg-green-500/20'
                }`}>
                  {getIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium truncate">{result.name}</p>
                    <Badge className={getBadgeColor(result.type)}>
                      {getTypeLabel(result.type)}
                    </Badge>
                  </div>
                  {result.subtitle && (
                    <p className="text-gray-400 text-sm truncate">{result.subtitle}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};