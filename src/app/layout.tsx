import './globals.css'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esports League',
  description: 'Sistema de gerenciamento de campeonatos de esports',
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