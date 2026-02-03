# Deployment Guide - Shreejyot Fashion

This guide covers deploying the application to production.

## Architecture

- **Frontend**: Vercel (Next.js) - FREE
- **Backend**: Render (Express.js) - FREE  
- **Database**: Render PostgreSQL (already configured)

---

## 1. Deploy Frontend to Vercel (FREE)

### Step 1: Push to GitHub

Make sure your frontend code is pushed to GitHub.

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your repository: `TejasGawande29/ShreeJyotFashion`

### Step 3: Configure Build Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto)
- **Install Command**: `npm install`

### Step 4: Environment Variables

Add these in Vercel Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_NAME` | Shreejyot Fashion |
| `NEXT_PUBLIC_API_URL` | https://shreejyot-fashion-api.onrender.com/api |
| `NEXT_PUBLIC_SITE_URL` | https://shreejyot-fashion.vercel.app |

### Step 5: Deploy

Click **"Deploy"**. Your site will be live at:
`https://shreejyot-fashion.vercel.app`

---

## 2. Deploy Backend to Render (FREE)

### Option A: Using Render Dashboard (Recommended)

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `shreejyot-fashion-api`
   - **Region**: Singapore (closest to your DB)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://shreejyotfashion_db_user:G6Y5Gmo6wymHqvufy05l6AOshtrbgfFI@dpg-d6045o7pm1nc73d1lubg-a.singapore-postgres.render.com/shreejyotfashion_db
   DB_SSL=true
   JWT_SECRET=<generate-secure-random-string>
   REFRESH_TOKEN_SECRET=<generate-another-secure-string>
   FRONTEND_URL=https://your-app.pages.dev
   ```

6. Click **"Create Web Service"**

---

## 3. Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your Vercel project → **"Settings"** → **"Domains"**
2. Add your domain (e.g., `www.shreejyotfashion.com`)
3. Follow DNS configuration steps

### For Render (Backend):
1. Go to your Web Service → **"Settings"** → **"Custom Domains"**
2. Add your API domain (e.g., `api.shreejyotfashion.com`)
3. Update DNS records as shown

---

## 4. Post-Deployment Checklist

- [ ] Test API health: `https://your-api.onrender.com/health`
- [ ] Test frontend loads correctly
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Update CORS settings if using custom domain
- [ ] Set up monitoring/alerts in Render

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-render-db-url>
DB_SSL=true
JWT_SECRET=<secure-random-string>
REFRESH_TOKEN_SECRET=<secure-random-string>
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_APP_NAME=Shreejyot Fashion
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://shreejyot-fashion.vercel.app
```

---

## Troubleshooting

### Backend not starting?
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Make sure all required env vars are set

### Frontend API calls failing?
- Check CORS - `FRONTEND_URL` must match your Vercel domain
- Verify `NEXT_PUBLIC_API_URL` points to your Render backend
- Check browser console for CORS errors

### Vercel build failing?
- Check build logs in Vercel dashboard
- Ensure root directory is set to `frontend`
- Verify all environment variables are set

### Database connection issues?
- Render free tier DBs sleep after 15 mins of inactivity
- First request may be slow (cold start)
- Upgrade to paid tier for always-on database
