'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  roles?: string[]
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  roles = []
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (requireAuth && !session) {
      router.push('/auth/signin')
      return
    }

    if (roles.length > 0 && session && !roles.includes(session.user.role)) {
      router.push('/unauthorized')
      return
    }
  }, [session, status, router, requireAuth, roles])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (roles.length > 0 && session && !roles.includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
