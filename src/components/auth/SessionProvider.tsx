'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'

export function SessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <NextAuthSessionProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </NextAuthSessionProvider>
  )
}
