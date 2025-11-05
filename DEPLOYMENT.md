# Eferno Deployment Guide

## Vercel Deployment Setup

Your project is now configured for Vercel deployment with the following files:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Updated `vite.config.ts` - Optimized build settings

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `winzerprince/Eferno`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected from vercel.json)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables** (CRITICAL)
   Click "Environment Variables" and add these:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
   | `VITE_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
   | `VITE_SUPABASE_PROJECT_REF` | Your Supabase project ref | Production, Preview, Development |

   > ⚠️ **Important**: Get these values from your `.env` file locally. DO NOT commit `.env` to Git!

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at: `https://eferno-[random].vercel.app`

6. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `eferno.com`)
   - Follow DNS configuration instructions

---

### Option 2: Deploy via Vercel CLI (Alternative)

If you want to deploy via CLI later (requires disk space):

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Environment Variables Reference

Your app requires these environment variables to function:

### 1. Gemini AI API Key
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
- Get from: https://makersuite.google.com/app/apikey
- Used for: AI product recommendations

### 2. Supabase Configuration
```bash
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_REF=your_project_ref
```
- Get from: https://app.supabase.com/ → Your Project → Settings → API
- Used for: Database, authentication, storage

---

## Post-Deployment Checklist

After your first deployment:

- [ ] ✅ Verify app loads at Vercel URL
- [ ] ✅ Test login/signup functionality
- [ ] ✅ Test AI chat recommendations
- [ ] ✅ Verify product images load correctly
- [ ] ✅ Test conversation history
- [ ] ✅ Check theme toggle (dark/light mode)
- [ ] ✅ Test on mobile devices
- [ ] ✅ Verify all environment variables are set
- [ ] ✅ Check Vercel deployment logs for errors

---

## Continuous Deployment

Your repository is now set up for automatic deployments:

- **Push to `main` branch** → Deploys to **Production**
- **Push to other branches** → Creates **Preview Deployment**
- **Pull Requests** → Automatic preview deployments with unique URLs

---

## Troubleshooting

### Build Fails

1. Check Vercel build logs in dashboard
2. Verify all environment variables are set
3. Check if `package.json` scripts are correct

### Environment Variables Not Working

1. Ensure variables start with `VITE_` prefix (required for Vite)
2. Redeploy after adding variables (click "Redeploy" in dashboard)
3. Check for typos in variable names

### Images Not Loading

1. Verify LoremFlickr URLs are in database
2. Check CORS settings in Vercel
3. Verify Supabase storage bucket permissions

### Authentication Issues

1. Add Vercel deployment URL to Supabase Auth allowed URLs:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL (e.g., `https://eferno-[random].vercel.app`)

---

## Vercel Configuration Details

### `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": null,
  "routes": [...],  // SPA routing support
  "headers": [...], // Asset caching
  "env": {...}      // Environment variables
}
```

### Build Optimization

The `vite.config.ts` has been optimized with:
- Code splitting for vendors (React, Supabase, Gemini)
- Source maps disabled for production
- Path aliases for cleaner imports

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html#vercel
- Supabase Docs: https://supabase.com/docs

---

## Next Steps

1. Deploy to Vercel using Option 1 above
2. Test the production deployment thoroughly
3. Share the live URL! 🎉
4. (Optional) Set up custom domain
5. (Optional) Configure analytics in Vercel dashboard
