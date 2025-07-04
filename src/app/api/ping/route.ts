/**
 * Simple ping endpoint for API health check
 */
import { NextResponse } from 'next/server';

/**
 * GET handler for the ping API
 * Returns a simple response to verify API connectivity
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
}
