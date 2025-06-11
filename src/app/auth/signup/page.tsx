'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    // TODO: Implement actual registration logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, just redirect to signin
      router.push('/auth/signin?message=Conta criada com sucesso!')
    } catch (error) {
      setError('Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/registerBGvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/80 backdrop-blur-sm"></div>
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[15%] right-[10%] w-28 h-28 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[60%] left-[15%] w-36 h-36 bg-red-600/20 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-[20%] right-[25%] w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 p-8 backdrop-blur-md relative z-10 animate-fade-in-up shadow-2xl">
        <div className="text-center mb-8">          <div className="flex items-center justify-center mb-4">
            <img src="/images/logo.png" alt="Esports League" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-400">Cadastre-se para gerenciar campeonatos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Confirme sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Já tem uma conta?{' '}
            <Link href="/auth/signin" className="text-red-400 hover:text-red-300">
              Faça login
            </Link>
          </p>
        </div>
      </Card>

      {/* Animated stripes */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0 opacity-30" 
           style={{ 
             background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(30, 64, 175, 0.1) 10px, rgba(30, 64, 175, 0.1) 20px)'
           }}>
      </div>
    </div>
  )
}
