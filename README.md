
  # E-Commerce Website - INOUT Fashion

This is a full-stack e-commerce application for INOUT Fashion, built with React, TypeScript, Node.js, and PostgreSQL.

**Live Demo:** https://inoutsite.netlify.app  
**Backend API:** https://clothing-store-backend-51k7.onrender.com

## Features

- 🛍️ Product catalog with filtering and search
- 👨‍💼 Admin panel for managing products, orders, inventory
- 💳 Payment integration with Razorpay
- 🎨 3D carousel for featured products
- 📱 Responsive design
- 🔐 JWT-based authentication
- 📊 Analytics and sales tracking
- 🎬 Shoppable video content
- ☁️ Cloudinary image storage

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Vite build tool
- React Router for navigation
- Lucide icons

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- Cloudinary for image storage
- Razorpay for payments

## Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure environment variables**
   ```bash
   # Frontend (.env.local)
   VITE_API_BASE_URL=http://localhost:4000/api
   
   # Backend (.env)
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
   JWT_SECRET=your-secret-key
   CLIENT_ORIGIN=http://localhost:5173
   # Add other variables from backend/.env.example
   ```

3. **Start development servers**
   ```bash
   npm run dev:full
   ```

   This starts:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## Deployment

### Frontend (Netlify)

1. Push to GitHub repository
2. Connect to Netlify
3. **Set environment variable in Netlify dashboard:**
   ```
   VITE_API_BASE_URL=https://clothing-store-backend-51k7.onrender.com/api
   ```
4. Deploy

⚠️ **Critical:** Without setting `VITE_API_BASE_URL`, the frontend will try to fetch from `/api` relative to the Netlify domain, causing "Internal server error" on admin pages.

### Backend (Render)

1. Backend is configured in `render.yaml`
2. Set environment variables in Render dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (secure random string)
   - `CLOUDINARY_*` credentials
   - `RAZORPAY_*` credentials
   - Other variables from `render.yaml`

3. Render will auto-deploy on push to main branch

## Admin Access

**URL:** https://inoutsite.netlify.app/admin/login

Default credentials (change in production):
- Email: admin@inout.com
- Password: (check backend seed script)

## Troubleshooting

### Admin Products Page Shows "Internal Server Error"

**This is usually caused by incorrect API URL configuration.**

**Solution:**
1. Check that `VITE_API_BASE_URL` is set in Netlify environment variables
2. Verify it matches your backend URL: `https://clothing-store-backend-51k7.onrender.com/api`
3. Rebuild the site: Netlify > Deploys > Trigger Deploy
4. Check browser console for detailed error messages

### API Connection Issues

- Frontend can't reach backend → Check `VITE_API_BASE_URL`
- Backend returns CORS error → Check `CLIENT_ORIGIN` environment variable
- 404 errors → Check that backend is running and API endpoint exists

### Database Connection Errors

- Make sure `DATABASE_URL` is correct in backend environment
- Verify PostgreSQL is running
- Check database credentials

## Project Structure

```
├── src/                    # Frontend React code
│   ├── app/
│   │   ├── pages/         # Page components (including admin)
│   │   ├── components/    # Reusable components
│   │   ├── lib/api.ts     # API client with environment setup
│   │   └── context/       # React context (auth, etc)
│   └── styles/            # Global styles
├── backend/               # Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── config/        # Database and env config
│   │   ├── middleware/    # Auth, error handling
│   │   └── sql/           # Database schema
│   └── package.json
├── .env.production        # Production environment config
├── .env.local            # Local development config
├── vite.config.ts        # Vite configuration with proxy
├── netlify.toml          # Netlify deployment config
└── render.yaml           # Render backend deployment config
```

## Key Files

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [render.yaml](render.yaml) - Backend deployment config
- [netlify.toml](netlify.toml) - Frontend deployment config
- [src/app/lib/api.ts](src/app/lib/api.ts) - API client with environment setup

## Environment Variables Reference

### Frontend (`.env.production` or Netlify dashboard)
```
VITE_API_BASE_URL=https://your-backend.com/api
```

### Backend (`render.yaml` or `.env`)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLIENT_ORIGIN=https://your-frontend.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

## Support

For issues or questions, check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) or review the configuration files.

  