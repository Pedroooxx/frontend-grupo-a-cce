import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  id: number;
  name: string;
  type: string;
  subtitle?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

export interface SearchConfig {
  searchTypes: string[];
  placeholder?: string;
  maxResults?: number;
  minQueryLength?: number;
  debounceMs?: number;
}

export interface UseSearchProps {
  searchFunction: (query: string, types: string[]) => SearchResult[];
  config: SearchConfig;
  onResultClick?: (result: SearchResult) => void;
  onQueryChange?: (query: string) => void;
}

export const useSearch = ({
  searchFunction,
  config,
  onResultClick,
  onQueryChange
}: UseSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const {
    searchTypes,
    maxResults = 8,
    minQueryLength = 1,
    debounceMs = 300
  } = config;

  // Debounced search function
  const performSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim().length < minQueryLength) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults = searchFunction(searchQuery, searchTypes)
        .slice(0, maxResults);
      
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchFunction, searchTypes, maxResults, minQueryLength]);

  // Handle query changes with debouncing
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    onQueryChange?.(newQuery);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(newQuery);
    }, debounceMs);
  }, [performSearch, debounceMs, onQueryChange]);

  // Handle result selection
  const handleResultClick = useCallback((result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation logic can be customized per implementation
      console.log('Result clicked:', result);
    }
    
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [onResultClick]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex, handleResultClick]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (query.trim().length >= minQueryLength && results.length > 0) {
      setIsOpen(true);
    }
  }, [query, minQueryLength, results.length]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onQueryChange?.('');
    inputRef.current?.focus();
  }, [onQueryChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    // State
    query,
    results,
    isOpen,
    selectedIndex,
    isLoading,
    
    // Refs
    searchRef,
    inputRef,
    
    // Handlers
    updateQuery,
    handleResultClick,
    handleKeyDown,
    handleFocus,
    clearSearch,
    
    // Actions
    setIsOpen,
    setSelectedIndex
  };
};