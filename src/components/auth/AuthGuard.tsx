'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (status !== 'loading') {
      setIsInitialLoad(false)
    }
  }, [status])

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

  // Only show loading on initial load when there's no session data
  const shouldShowLoading = status === 'loading' && isInitialLoad && !session

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session && status !== 'loading') {
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
