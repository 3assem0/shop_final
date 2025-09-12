import { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory session store (in production, use Redis or database)
const sessions = new Map<string, { userId: string; expires: number }>();

interface VerifyRequest {
  token: string;
}

interface VerifyResponse {
  success: boolean;
  authenticated?: boolean;
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
    // Parse request body
    const { token }: VerifyRequest = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: 'Token is required' 
      });
    }

    // Check if session exists and is valid
    const session = sessions.get(token);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session'
      });
    }

    // Check if session has expired
    if (session.expires < Date.now()) {
      sessions.delete(token);
      return res.status(401).json({
        success: false,
        error: 'Session expired'
      });
    }

    // Extend session (optional)
    session.expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Return success
    res.status(200).json({
      success: true,
      authenticated: true
    });

  } catch (error) {
    console.error('Error verifying session:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
