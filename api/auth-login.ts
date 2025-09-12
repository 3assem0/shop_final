import { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes } from 'crypto';

// In-memory session store (in production, use Redis or database)
const sessions = new Map<string, { userId: string; expires: number }>();

interface LoginRequest {
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://your-domain.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get the admin password from environment variables
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'assem123';
    const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret-key';
    
    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }

    // Parse request body
    const { password }: LoginRequest = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        success: false,
        error: 'Password is required' 
      });
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      // Log failed attempt (in production, use proper logging)
      console.warn(`Failed admin login attempt from IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate secure session token
    const sessionToken = randomBytes(32).toString('hex');
    const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Store session
    sessions.set(sessionToken, {
      userId: 'admin',
      expires
    });

    // Clean up expired sessions
    for (const [token, session] of sessions.entries()) {
      if (session.expires < Date.now()) {
        sessions.delete(token);
      }
    }

    // Return success with token
    res.status(200).json({
      success: true,
      token: sessionToken
    });

  } catch (error) {
    console.error('Error during login:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
