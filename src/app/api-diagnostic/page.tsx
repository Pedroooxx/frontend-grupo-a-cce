"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import config from "@/lib/config";

/**
 * API Diagnostic page to test and debug API connections
 */
export default function ApiDiagnostic() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  
  const addResult = (message: string) => {
    setTestResults((prev) => [message, ...prev]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult(`🔍 Testing API connection to ${config.apiUrl}...`);
    
    try {
      // Test basic API connection
      const response = await fetch(`${config.apiUrl}/ping`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ API connection successful: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ API connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ API connection error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    addResult(`🔍 Testing login with admin@cce.com/123456...`);
    
    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: "admin@cce.com",
          password: "123456"
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addResult(`✅ Login successful: ${JSON.stringify(data)}`);
      } else {
        addResult(`❌ Login failed: ${response.status} ${response.statusText}`);
        addResult(`Response: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      addResult(`❌ Login error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    addResult(`🔍 Testing auth token: ${token ? "Present" : "Not found"}`);
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${config.apiUrl}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Auth token valid, users API call successful`);
      } else {
        addResult(`❌ Auth token test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult(`❌ Auth token test error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEnvironment = () => {
    addResult(`🌐 Environment: ${config.env}`);
    addResult(`🔗 API URL: ${config.apiUrl}`);
    addResult(`📝 Session: ${session ? "Active" : "None"}`);
    if (session) {
      addResult(`👤 User: ${session.user?.name || "Unknown"}`);
      addResult(`📧 Email: ${session.user?.email || "Unknown"}`);
      addResult(`🔑 Role: ${(session.user as any)?.role || "Unknown"}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-white mb-6">API Diagnostic Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test API Connection
          </Button>
          
          <Button 
            onClick={testLogin} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Test Login API
          </Button>
          
          <Button 
            onClick={testToken}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Test Auth Token
          </Button>
          
          <Button 
            onClick={testEnvironment}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Check Environment
          </Button>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={clearResults}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Clear Results
          </Button>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-96 overflow-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Test Results</h2>
          
          {testResults.length === 0 ? (
            <p className="text-gray-400 italic">No test results yet. Click a test button above.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-300 border-l-4 border-blue-500 pl-3 py-1">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
