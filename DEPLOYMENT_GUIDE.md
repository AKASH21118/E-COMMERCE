# Deployment Configuration Guide

## Frontend Deployment (Netlify)

### Required Environment Variables

Set these in Netlify Dashboard → Site Settings → Build & Deploy → Environment

```
VITE_API_BASE_URL=https://clothing-store-backend-51k7.onrender.com/api
```

**Why this is required:**
- Vite's dev proxy (`/api` → `http://localhost:4000`) only works during local development
- In production, Netlify is a static site host and cannot proxy requests
- The frontend MUST know the absolute URL of the backend API
- Without this, the frontend tries to fetch from `https://inoutsite.netlify.app/api` which doesn't exist

### Build Command

Ensure Netlify uses:
```bash
npm run build
```

This will:
1. Pick up the `VITE_API_BASE_URL` environment variable
2. Build the frontend with the correct API URL baked in
3. Generate optimized assets in the `dist` folder

### Netlify Configuration

The `netlify.toml` file is already configured:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing: redirects all `/*` to `/index.html`

## Backend Deployment (Render)

### Deployed URL
```
https://clothing-store-backend-51k7.onrender.com
```

### Environment Variables (Set in Render Dashboard)

```
NODE_ENV=production
CLIENT_ORIGIN=https://inoutsite.netlify.app
DATABASE_URL=<your-postgresql-url>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
FAST2SMS_API_KEY=<your-fast2sms-key>
```

### CORS Configuration

The backend allows requests from:
- `https://inoutsite.netlify.app` (production)
- Netlify preview deployments (`https://*--inoutsite.netlify.app`)
- Localhost (for development)

## Troubleshooting

### "Internal server error" on `/admin/products`

**Symptoms:** Admin panel shows error when loading products

**Solution:**
1. Check that `VITE_API_BASE_URL` is set in Netlify environment variables
2. Rebuild the site after changing environment variables
3. Check browser console for actual error messages
4. Verify backend is running: `curl https://clothing-store-backend-51k7.onrender.com/api/products`

### API requests failing with 404

**Check:**
- Frontend `VITE_API_BASE_URL` matches your backend URL
- Backend `CLIENT_ORIGIN` matches your frontend URL
- Both backend and frontend are deployed and running

### CORS errors

**Check:**
- Backend `CLIENT_ORIGIN` environment variable is set correctly
- CSP headers in `netlify.toml` allow the backend domain

## Local Development

### Prerequisites
```bash
npm install
cd backend && npm install
```

### Start Development Servers
```bash
npm run dev:full
```

This starts:
- Frontend: `http://localhost:5173` (with Vite proxy to backend)
- Backend: `http://localhost:4000`

### Environment Setup
- `.env.local` is used for local development (git-ignored)
- `.env.production` is used when building for production
- Both files use the same variable names

## Deployment Checklist

- [ ] Backend deployed on Render with all environment variables set
- [ ] Frontend `.env.production` has correct `VITE_API_BASE_URL`
- [ ] Netlify environment variable `VITE_API_BASE_URL` matches backend URL
- [ ] Frontend rebuilt after changing environment variables
- [ ] Backend `CLIENT_ORIGIN` set to Netlify frontend URL
- [ ] Database migrations applied on backend
- [ ] Cloudinary credentials configured on backend
- [ ] SSL certificates are valid (HTTPS working)
