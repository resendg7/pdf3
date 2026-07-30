# Railway Deployment Guide

This project is a full-stack React + Express app. Railway can host the backend and provide PostgreSQL.

## 1. Push your repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Create a Railway project

1. Go to https://railway.app and sign in.
2. Click `New Project`.
3. Choose `Deploy from GitHub` and connect your repo.
4. Select your repository.

## 3. Configure Railway service

Railway should detect a Node project. If it does not, set:

- `Start Command`: `npm install && npm run build && npm start`
- `Environment`: `Node 20` (or latest supported)

## 4. Add required environment variables

Set these variables in Railway:

- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SESSION_SECRET` - session secret used by Express
- `APP_BASE_URL` - your Railway app URL, e.g. `https://my-app.up.railway.app`

Optional variables:

- `NODE_ENV=production`
- `PORT=5000`

## 5. Configure build and start scripts

Your `package.json` already has:

- `build`: `tsx script/build.ts`
- `start`: `cross-env NODE_ENV=production node dist/index.cjs`

Railway will run `npm install`, then `npm run build`, then `npm start`.

## 6. Database migrations

If you want Railway to provision a PostgreSQL database, create it in Railway and attach it to the project.

Then run locally or from Railway shell:

```bash
npx drizzle-kit push
```

Railway may also let you run this command from the dashboard.

## 7. Notes for production

- The app serves both frontend and backend from the same Express server.
- Railway uses `PORT` automatically; the app already reads `process.env.PORT`.
- `APP_BASE_URL` is used for generated PDF homepage links.

## 8. After deployment

- Open the Railway deployment URL.
- Test your backend API and frontend.
- If the frontend fails to load, confirm build succeeded and `dist/public` exists.
