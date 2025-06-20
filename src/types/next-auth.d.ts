import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      token?: string // API token
    }
  }

  interface User {
    role: string
    token?: string // API token
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    token?: string // API token
  }
}
