import { AuthGuard } from '@/components/auth/AuthGuard'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Spike League',
  description: 'Painel de controle da Spike League - Геренcie equipes, jogadores e campeonatos',
  keywords: ['dashboard', 'valorant', 'esports', 'liga', 'gerenciamento'],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  )
}
