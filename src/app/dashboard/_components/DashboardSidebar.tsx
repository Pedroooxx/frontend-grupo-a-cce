'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Trophy, 
  UserPlus, 
  Users, 
  User, 
  Calendar,
  BarChart3,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'DASHBOARD',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'CAMPEONATOS',
    icon: Trophy,
    href: '/dashboard/campeonatos'
  },
  {
    title: 'INSCRIÇÕES',
    icon: UserPlus,
    href: '/dashboard/inscricoes'
  },
  {
    title: 'GERENCIAR EQUIPES',
    icon: Users,
    href: '/dashboard/equipes'
  },
  {
    title: 'GERENCIAR JOGADORES',
    icon: User,
    href: '/dashboard/jogadores'
  },
  {
    title: 'GERENCIAR PARTIDAS',
    icon: Calendar,
    href: '/dashboard/partidas'
  },
  {
    title: 'ESTATÍSTICAS',
    icon: BarChart3,
    href: '/dashboard/estatisticas'
  }
];

export function DashboardSidebar({ className }: SidebarProps) {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className={cn("w-64 dashboard-sidebar border-r dashboard-border flex flex-col", className)}>
      {/* Logo/Header */}
      <div className="p-6 border-b dashboard-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">ESPORTS</div>
            <div className="text-red-500 font-bold text-sm">LEAGUE</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "dashboard-text-muted hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t dashboard-border">
        <button 
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
