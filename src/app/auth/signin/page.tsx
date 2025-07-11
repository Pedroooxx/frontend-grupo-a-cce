"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/services/authService";
import { toast } from "react-hot-toast";
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Style and media loading states
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // Track when stylesheets are loaded
  useEffect(() => {
    const styleSheets = Array.from(document.styleSheets);
    if (styleSheets.length > 0) {
      setStylesLoaded(true);
    } else {
      const checkStyles = () => {
        if (document.styleSheets.length > 0) {
          setStylesLoaded(true);
        }
      };
      document.addEventListener('load', checkStyles, true);
      return () => document.removeEventListener('load', checkStyles, true);
    }
  }, []);

  // Preload and track background video loading
  useEffect(() => {
    // Add preloading hint
    const linkEl = document.createElement('link');
    linkEl.rel = 'preload';
    linkEl.as = 'video';
    linkEl.href = '/videos/loginBGvideo.mp4';
    document.head.appendChild(linkEl);

    // Create video element to track loading
    const video = document.createElement('video');
    video.src = '/videos/loginBGvideo.mp4';
    video.oncanplaythrough = () => setMediaLoaded(true);
    video.load();

    return () => {
      video.oncanplaythrough = null;
      document.head.removeChild(linkEl);
    };
  }, []);
  
  // Use React Query for login
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();
  
  // Extract error message from ApiError
  const error = loginError ? 
    (loginError as Error).message || "Erro ao fazer login" : 
    "";

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Special case for the demo credentials that bypass the API
    if (email === "admin@esports.com" && password === "admin123") {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error("Erro ao iniciar sessão com demo");
      } else {
        toast.success("Login realizado com sucesso (modo demo)!");
        router.push("/dashboard");
      }
      return;
    }
    
    try {
      // First, try direct NextAuth authentication (which will call the API)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth error - try direct API call as fallback
        console.log("NextAuth login failed, trying direct API:", result.error);
        
        // Use React Query for direct API call as fallback
        login(
          { email, password },
          {
            onSuccess: async (data) => {
              toast.success("Login realizado com sucesso!");
              router.push("/dashboard");
            },
            onError: (error) => {
              console.error("API login also failed:", error);
              toast.error("Credenciais inválidas ou problema no servidor");
            }
          }
        );
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login");
    }
  };

  // Don't render until styles are loaded to prevent FOUC
  if (!stylesLoaded) {
    return <div className="min-h-screen bg-gray-900"></div>;
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
          <source src="/videos/loginBGvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/80 backdrop-blur-none"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-red-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[40%] right-[10%] w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-[10%] left-[30%] w-36 h-36 bg-purple-500/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 p-8 backdrop-blur-sm relative z-10 animate-fade-in-up shadow-2xl">
        <div className="text-center mb-8">
          {" "}
          <div className="flex items-center justify-center mb-4">
            <img src="/images/logo.png" alt="Esports League" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400">Faça login para acessar o dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

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
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/auth/signup"
              className="text-red-400 hover:text-red-300"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <p className="text-gray-300 text-sm font-medium mb-2">
            Demo Credentials:
          </p>
          <p className="text-gray-400 text-xs">
            Email: admin@cce.com
            <br />
            Senha: 123456
          </p>
          <p className="text-gray-400 text-xs mt-2">
            <span className="text-red-400">Or use legacy demo:</span>
            <br />
            Email: admin@esports.com
            <br />
            Senha: admin123
          </p>
        </div>
      </Card>

      {/* Animated stripes */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 z-0 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200, 10, 10, 0.1) 10px, rgba(200, 10, 10, 0.1) 20px)",
        }}
      ></div>
    </div>
  );
}
