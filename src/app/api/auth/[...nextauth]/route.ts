import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import config from "@/lib/config"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("NextAuth authorize with:", credentials);
          
          // Support for the demo credentials in UI
          if (credentials?.email === "admin@esports.com" && credentials?.password === "admin123") {
            console.log("Using demo credentials");
            return {
              id: "demo-1",
              email: "admin@esports.com",
              name: "Admin User",
              role: "admin"
            };
          }
          
          // Call the actual API for authentication using config
          const response = await fetch(`${config.apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }
          
          // Return user data with token
          if (data && data.token) {
            return {
              id: data.user?.user_id?.toString() || "0", // Use user_id from API response
              email: credentials?.email || "",
              name: data.user?.name || credentials?.email?.split('@')[0] || "",
              role: "user", // You can add role handling if your API provides roles
              token: data.token // Store the token in the user object
            };
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    // NextAuth doesn't have a signUp page by default
    // We'll handle registration separately
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token; // Store the API token in the JWT
        token.userId = user.id; // Store the actual user ID from our API
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string || token.sub! // Use our custom userId or fallback to sub
        session.user.role = token.role as string
        session.user.token = token.token as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: config.auth.sessionMaxAge, // Use from config
  },
  secret: config.auth.secret,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
