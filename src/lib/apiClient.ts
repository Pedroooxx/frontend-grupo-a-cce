/**
 * API client for making requests to the backend
 */

import { toast } from "react-hot-toast";
import config from "./config";

interface FetchOptions extends RequestInit {
  baseUrl?: string;
  url: string;
  data?: any;
  params?: Record<string, string>;
  withAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * Builds a URL with optional query parameters
 */
const buildUrl = (baseUrl: string, path: string, params?: Record<string, string>): string => {
  const url = new URL(path, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

/**
 * Makes a fetch request with standardized error handling
 */
export const fetchApi = async <T = any>({
  baseUrl = config.apiUrl,
  url,
  method = "GET",
  data,
  params,
  withAuth = false,
  ...customConfig
}: FetchOptions): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    // Get the token from localStorage or use the session token
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const fullUrl = buildUrl(baseUrl, url, params);
    console.log(`API Request: ${method} ${fullUrl}`);
    
    const response = await fetch(fullUrl, config);
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    let responseData;
    const contentType = response.headers.get('content-type');
    
    // Only attempt to parse JSON if the content type is application/json
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (error) {
        console.warn("Failed to parse response as JSON:", error);
        responseData = { error: "Invalid JSON response" };
      }
    } else {
      // For non-JSON responses, get text
      const text = await response.text();
      responseData = { raw: text, contentType };
      console.warn("Non-JSON response:", contentType, text.substring(0, 100));
    }
    
    if (!response.ok) {
      console.error("API Error:", response.status, responseData);
      
      // Special handling for 404 errors
      if (response.status === 404) {
        // Return empty result for 404 errors to prevent breaking the app
        if (method === "GET") {
          console.warn(`Resource not found at ${url}, returning empty result`);
          return (Array.isArray(responseData) ? [] : {}) as T;
        }
      }
      
      throw new ApiError(
        responseData.message || `Error ${response.status}: ${response.statusText}`,
        response.status,
        responseData
      );
    }
    
    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Re-throw as ApiError for consistent error handling
    console.error("API Client Error:", error);
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      500
    );
  }
};

/**
 * API client with methods for common HTTP operations
 */
export const apiClient = {
  get: <T = any>(url: string, options?: Omit<FetchOptions, "url" | "method" | "data">) => 
    fetchApi<T>({ ...options, url, method: "GET" }),
  
  post: <T = any>(url: string, data: any, options?: Omit<FetchOptions, "url" | "method" | "data">) => 
    fetchApi<T>({ ...options, url, method: "POST", data }),
  
  put: <T = any>(url: string, data: any, options?: Omit<FetchOptions, "url" | "method" | "data">) => 
    fetchApi<T>({ ...options, url, method: "PUT", data }),
  
  delete: <T = any>(url: string, options?: Omit<FetchOptions, "url" | "method" | "data">) => 
    fetchApi<T>({ ...options, url, method: "DELETE" }),
};
