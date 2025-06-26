import './globals.css'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Spike League - Gerencie seu próprio campeonato de Valorant',
  description: 'Sistema de gerenciamento de campeonatos amadores de Valorant',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
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
      <body suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}