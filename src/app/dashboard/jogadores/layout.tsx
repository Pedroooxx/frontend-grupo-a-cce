import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gerenciar Jogadores | Spike League',
  description: 'Gerenciamento de jogadores da liga Spike League - Adicione, edite e visualize estatísticas dos participantes',
  keywords: ['valorant', 'jogadores', 'esports', 'liga', 'gerenciamento'],
};

export default function JogadoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
