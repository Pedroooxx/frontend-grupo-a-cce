import './globals.css'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spike League - Gerencie seu próprio campeonato de Valorant',
  description: 'Sistema de gerenciamento de campeonatos amadores de Valorant',
  icons: [
    {
      rel: 'icon',
      url: '/images/favicon.png',
    },
    {
      rel: 'shortcut icon',
      url: '/images/favicon.png',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}