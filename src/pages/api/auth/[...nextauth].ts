import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace with actual authentication logic
        // This is a mock implementation for development
        if (credentials?.email === "admin@esports.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@esports.com",
            name: "Admin User",
            role: "admin"
          }
        }
        
        // For demo purposes, accept any email/password combo
        if (credentials?.email && credentials?.password) {
          return {
            id: "2",
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: "user"
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
