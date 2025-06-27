/**
 * Application configuration object with type-safe environment variables
 */
export const config = {
  /**
   * API base URL - uses environment variable with fallback
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  /**
   * Auth configuration
   */
  auth: {
    /**
     * NextAuth secret key
     */
    secret: process.env.NEXTAUTH_SECRET || 'your-development-secret',
    
    /**
     * Session token expiration in seconds (30 days)
     */
    sessionMaxAge: 30 * 24 * 60 * 60,

    /**
     * JSON Web Token secret key
     */
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret', // Add JWT_SECRET
  },
  
  /**
   * Application environment
   */
  env: process.env.NODE_ENV || 'development',
  
  /**
   * Determines if running in development mode
   */
  isDevelopment: process.env.NODE_ENV === 'development',
  
  /**
   * Determines if running in production mode
   */
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
