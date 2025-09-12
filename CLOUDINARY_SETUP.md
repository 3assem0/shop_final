# Cloudinary Setup Instructions

## Required Environment Variables

Add these environment variables to your Vercel deployment:

### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### GitHub Configuration (for data storage)
```
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=your_username
GITHUB_REPO=your_repo_name
GITHUB_BRANCH=main
```

### Admin Configuration
```
ADMIN_PASSWORD=your_admin_password
```

## How to Get Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its value
5. Redeploy your project

## Testing the Image Upload

1. Go to your admin panel: `https://your-domain.vercel.app/admin?password=your_admin_password`
2. Try adding a new product with an image
3. The image should upload to Cloudinary and display correctly on the main site
