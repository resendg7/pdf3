# Netlify Deployment Guide

## Overview
This project is a full-stack application with a React frontend and Express backend. Netlify will host the frontend, while the backend needs to be deployed separately.

## Frontend Deployment to Netlify

### 1. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize access to your repository
4. Select your repository

### 3. Configure Build Settings
Netlify will automatically detect the `netlify.toml` file with these settings:
- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist/public`

### 4. Environment Variables
Add these environment variables in Netlify dashboard:
- `VITE_SUPABASE_URL` (from your .env SUPABASE_URL)
- `VITE_SUPABASE_ANON_KEY` (from your .env SUPABASE_ANON_KEY)

### 5. Deploy
Click "Deploy site" and Netlify will build and deploy your frontend.

## Backend Deployment Options

Since this is a full Express server with database connections, you need to deploy the backend separately. Recommended options:

### Option 1: Render (Recommended)
1. Create a [Render](https://render.com) account
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables from your `.env` file
7. Deploy

### Option 2: Railway
1. Create a [Railway](https://railway.app) account
2. Create a new project
3. Deploy from GitHub
4. Add environment variables
5. Railway will automatically detect and deploy

### Option 3: VPS (DigitalOcean, AWS, etc.)
1. Get a VPS with Node.js installed
2. Clone your repository
3. Install dependencies: `npm install`
4. Set up environment variables
5. Build: `npm run build`
6. Start: `npm start`
7. Use PM2 for process management

## Update API Redirects

After deploying your backend, update the API redirect in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR_BACKEND_URL/api/:splat"
  status = 200
```

Replace `YOUR_BACKEND_URL` with your actual backend deployment URL.

## Important Notes

- The frontend will be deployed to Netlify
- The backend must be deployed separately to a service that supports Node.js/Express
- Update the API redirect in `netlify.toml` after backend deployment
- Ensure CORS is configured on your backend to allow requests from your Netlify domain
