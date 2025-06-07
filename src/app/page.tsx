'use client'

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <>
      <h1 className="my-4 text-red content container mx-auto">Home!</h1>
      {!session ? (
        <div className="content container mx-auto space-x-4">
          <Link href="/auth/signin">
            <button className="button">
              <span>Login</span>
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="button">
              <span>Cadastrar</span>
            </button>
          </Link>
        </div>
      ) : (
        <Link href="/dashboard">
          <button className="button">
            <span>Dashboard</span>
          </button>
        </Link>
      )}
    </>
  );
}
