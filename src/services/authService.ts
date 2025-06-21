/**
 * Authentication service with React Query integration
 */
import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/apiClient";

// Type definitions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Handles user login with React Query
 */
export const useLogin = () => {
  return useMutation<AuthResponse, ApiError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        console.log("Login attempt with:", credentials);
        const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
        
        // Store the token for future requests
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          console.log("Login successful, token stored");
        } else {
          console.warn("Login response did not contain token:", response);
        }
        
        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  });
};

/**
 * Handles user registration with React Query
 */
export const useRegister = () => {
  return useMutation<AuthResponse, ApiError, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
      
      // Store the token for future requests if registration automatically logs in
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
      
      return response;
    },
  });
};

/**
 * Handles user logout with React Query
 */
export const useLogout = () => {
  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      try {
        // Only attempt to call the logout endpoint if we have a token
        const token = localStorage.getItem("authToken");
        if (token) {
          await apiClient.post("/auth/logout", {}, { withAuth: true });
        }
      } finally {
        // Always remove the token regardless of API response
        localStorage.removeItem("authToken");
      }
    },
  });
};
