# Sistema de Busca Universal

Este sistema de busca foi desenvolvido para ser reutilizado em diferentes páginas da aplicação, proporcionando uma experiência consistente e flexível.

## Arquitetura

### 1. Hook `useSearch`
O hook principal que gerencia toda a lógica de busca:
- Debouncing automático
- Navegação por teclado
- Estados de loading
- Limpeza automática

### 2. Componente `UniversalSearchBar`
Componente visual reutilizável que utiliza o hook `useSearch`.

### 3. Funções de Busca
Funções especializadas para diferentes contextos:
- `searchStatistics`: Busca geral (jogadores, equipes, campeonatos)
- `searchPlayers`: Busca específica para jogadores
- `searchTeams`: Busca específica para equipes
- `searchChampionships`: Busca específica para campeonatos

## Como Usar

### Exemplo Básico

```tsx
import { UniversalSearchBar } from '@/components/common/UniversalSearchBar';
import { searchPlayers } from '@/data/search-functions';
import { SearchResult } from '@/hooks/useSearch';

const MinhaComponente = () => {
  const handleResultClick = (result: SearchResult) => {
    // Lógica customizada
    console.log('Resultado selecionado:', result);
  };

  return (
    <UniversalSearchBar
      searchFunction={searchPlayers}
      config={{
        searchTypes: ['player'],
        placeholder: "Buscar jogadores...",
        maxResults: 6,
        minQueryLength: 1,
        debounceMs: 300
      }}
      onResultClick={handleResultClick}
    />
  );
};
```

### Configurações Disponíveis

#### `SearchConfig`
```typescript
interface SearchConfig {
  searchTypes: string[];          // Tipos de busca permitidos
  placeholder?: string;           // Placeholder do input
  maxResults?: number;           // Máximo de resultados (padrão: 8)
  minQueryLength?: number;       // Mínimo de caracteres (padrão: 1)
  debounceMs?: number;          // Delay do debounce (padrão: 300ms)
}
```

#### `SearchResult`
```typescript
interface SearchResult {
  id: number;
  name: string;
  type: string;
  subtitle?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}
```

## Exemplos de Uso por Página

### 1. Página de Estatísticas
Busca geral por jogadores, equipes e campeonatos:

```tsx
<UniversalSearchBar
  searchFunction={searchStatistics}
  config={{
    searchTypes: ['player', 'team', 'championship'],
    placeholder: "Buscar jogadores, equipes ou campeonatos...",
    maxResults: 8
  }}
  onResultClick={(result) => {
    // Navegar para página específica baseada no tipo
  }}
/>
```

### 2. Página de Gerenciar Jogadores
Busca específica para jogadores:

```tsx
<UniversalSearchBar
  searchFunction={searchPlayers}
  config={{
    searchTypes: ['player'],
    placeholder: "Buscar jogadores por nome, nickname, equipe...",
    maxResults: 6
  }}
  onResultClick={(result) => {
    // Ação específica para jogadores
  }}
/>
```

### 3. Página de Gerenciar Equipes
Busca específica para equipes:

```tsx
<UniversalSearchBar
  searchFunction={searchTeams}
  config={{
    searchTypes: ['team'],
    placeholder: "Buscar equipes por nome ou gerente...",
    maxResults: 6
  }}
  onResultClick={(result) => {
    // Ação específica para equipes
  }}
/>
```

## Funções de Busca Personalizadas

Para criar uma nova função de busca:

```typescript
export const minhaFuncaoBusca = (query: string, types: string[]): SearchResult[] => {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  const searchQuery = query.toLowerCase();

  // Implementar lógica de busca
  if (types.includes('meu_tipo')) {
    // Filtrar e mapear dados
    const meusDados = dados.filter(item =>
      item.name.toLowerCase().includes(searchQuery)
    ).map(item => ({
      id: item.id,
      name: item.name,
      type: 'meu_tipo',
      subtitle: `${item.subtitle}`,
      metadata: {
        // dados adicionais
      }
    }));
    
    results.push(...meusDados);
  }

  return results;
};
```

## Recursos Avançados

### 1. Navegação por Teclado
- ↑/↓: Navegar pelos resultados
- Enter: Selecionar resultado
- Esc: Fechar busca

### 2. Debouncing
Evita chamadas excessivas durante a digitação.

### 3. Estados de Loading
Mostra indicador de carregamento durante a busca.

### 4. Metadata
Informações adicionais podem ser passadas através do campo `metadata` para uso personalizado.

### 5. Estilos Customizáveis
Cada tipo de resultado tem cores e ícones específicos:
- Jogadores: Azul
- Equipes: Verde
- Campeonatos: Roxo
- Partidas: Laranja

## Boas Práticas

1. **Use a função de busca apropriada** para cada contexto
2. **Configure minQueryLength** para evitar buscas desnecessárias
3. **Implemente onResultClick** para ações específicas da página
4. **Use metadata** para passar informações adicionais
5. **Mantenha maxResults** razoável para performance

## Extensibilidade

O sistema é facilmente extensível:
- Adicione novos tipos de busca nas funções
- Crie novas funções de busca especializadas
- Customize os estilos dos resultados
- Adicione novos ícones e cores para tipos específicos