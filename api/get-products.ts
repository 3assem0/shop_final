// api/get-products.ts
// Vercel serverless function to fetch products from GitHub repository

import { VercelRequest, VercelResponse } from '@vercel/node';

// Define interfaces for type safety
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
    image?: string;
    // Add other product properties as needed
}

interface ProductsData {
    products: Product[];
    lastUpdated: string;
}

interface ErrorResponse {
    error: string;
    details?: string;
}

export default async function handler(
    req: VercelRequest, 
    res: VercelResponse
): Promise<void> {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        // Get environment variables with type assertions
        const GITHUB_USERNAME: string | undefined = process.env.GITHUB_USERNAME;
        const GITHUB_REPO: string | undefined = process.env.GITHUB_REPO;
        const GITHUB_BRANCH: string = process.env.GITHUB_BRANCH || 'main';

        if (!GITHUB_USERNAME || !GITHUB_REPO) {
            res.status(500).json({ 
                error: 'GITHUB_USERNAME and GITHUB_REPO environment variables are required' 
            });
            return;
        }

        // Construct GitHub raw URL
        const githubUrl: string = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/data.json`;

        // Fetch data.json from GitHub repository
        const response: Response = await fetch(githubUrl);

        if (!response.ok) {
            if (response.status === 404) {
                // File doesn't exist yet, return empty products
                res.status(200).json({
                    products: [],
                    lastUpdated: new Date().toISOString()
                });
                return;
            }
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        // Parse JSON response with type assertion
        const data: ProductsData = await response.json() as ProductsData;
        
        // Validate the data structure
        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Invalid data structure: products array is required');
        }

        // Return the products data
        res.status(200).json(data);

    } catch (error: unknown) {
        console.error('Error fetching products:', error);
        
        // Type-safe error handling
        const errorMessage: string = error instanceof Error ? error.message : 'Internal server error';
        const errorStack: string | undefined = error instanceof Error ? error.stack : undefined;

        res.status(500).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? errorStack : undefined
        });
    }
}