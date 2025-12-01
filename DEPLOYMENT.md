# Deployment Guide - Somansa on Netlify

This guide walks you through deploying the Somansa Smart Rental System to Netlify.

## Prerequisites

- Netlify account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)
- Backend API already deployed and accessible

## Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Push Code to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Somansa rental system"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/somansa-rental.git

# Push to main branch
git push -u origin main
```

### Step 2: Import to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

### Step 3: Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add the following:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend API URL (e.g., `https://api.yourdomain.com`)

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at `https://random-name-123456.netlify.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Build the Project

```bash
# Set environment variable
export VITE_API_BASE_URL=https://api.yourdomain.com

# Build
npm run build
```

### Step 4: Deploy

**For the first deployment:**

```bash
netlify deploy --prod
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name (optional)
- Publish directory: `dist`

**For subsequent deployments:**

```bash
netlify deploy --prod
```

## Method 3: Deploy via Drag & Drop

### Step 1: Build Locally

```bash
# Set API URL in .env file
echo "VITE_API_BASE_URL=https://api.yourdomain.com" > .env

# Build
npm run build
```

### Step 2: Deploy to Netlify

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the `dist` folder
3. Your site will be deployed instantly

**Note:** This method doesn't support environment variables or continuous deployment.

## Netlify Configuration Files

The project includes these files for Netlify:

### netlify.toml

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### public/_redirects

```
/*    /index.html   200
```

Both ensure proper SPA routing (all routes resolve to index.html).

## Environment Variables

### Required

- `VITE_API_BASE_URL` - Your backend API base URL

### Example Values

**Development:**
```
VITE_API_BASE_URL=http://localhost:3000
```

**Production:**
```
VITE_API_BASE_URL=https://api.somansa.com
```

**Staging:**
```
VITE_API_BASE_URL=https://staging-api.somansa.com
```

## Build Settings Summary

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18.x (auto-detected) |
| Install command | `npm install` |

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (home, properties, booking lookup, etc.)
- [ ] API calls connect to backend successfully
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify PWA installation works
- [ ] Test service worker (check offline capability)
- [ ] Configure custom domain (if applicable)
- [ ] Set up HTTPS (automatic on Netlify)
- [ ] Configure CORS on backend API

## Continuous Deployment

Once connected to Git, Netlify automatically:
- Builds and deploys on every push to main branch
- Creates preview deployments for pull requests
- Provides deploy previews for branches

### Branch Deploys

Configure different environments:

**Production** (main branch):
```
VITE_API_BASE_URL=https://api.somansa.com
```

**Staging** (staging branch):
```
VITE_API_BASE_URL=https://staging-api.somansa.com
```

## Troubleshooting

### Build Fails

**Error: Module not found**
- Solution: Run `npm install` locally to ensure package.json is correct
- Clear build cache in Netlify: Deploy settings → Clear cache and retry

**Error: Command failed with exit code 1**
- Check ESLint errors: Run `npm run lint` locally
- Check build locally: Run `npm run build`

### Routes Return 404

**Problem**: Direct navigation to `/properties` returns 404

**Solution**: Ensure `_redirects` file exists in `public/` directory or `netlify.toml` has redirect rules

### API Calls Fail

**Problem**: Network errors or CORS issues

**Solutions**:
1. Verify `VITE_API_BASE_URL` is set correctly
2. Check backend API is accessible from browser
3. Enable CORS on backend for Netlify domain
4. Check browser console for specific errors

### PWA Not Installing

**Problem**: App doesn't show "Install" prompt

**Solutions**:
1. Ensure site is served over HTTPS (automatic on Netlify)
2. Check manifest.json is accessible at `/manifest.webmanifest`
3. Verify service worker registers correctly (check Application tab in DevTools)
4. Check for console errors

### Environment Variables Not Working

**Problem**: API calls go to wrong URL

**Solutions**:
1. Environment variables must start with `VITE_` to be exposed
2. Redeploy after changing environment variables
3. Clear cache and rebuild

## Performance Optimization

### Netlify Settings

1. **Enable Asset Optimization**
   - Site settings → Build & deploy → Post processing
   - Enable: Bundle CSS, Minify CSS, Minify JS, Compress images

2. **Enable HTTPS**
   - Automatic on Netlify

3. **Configure Headers** (Optional)

Create `public/_headers`:
```
/*
  Cache-Control: public, max-age=31536000, immutable
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/index.html
  Cache-Control: no-cache
```

## Monitoring

### Netlify Analytics (Optional Paid Feature)

- Real-time visitor analytics
- Page views and unique visitors
- Top pages and resources
- Geographic data

### Alternative Free Options

- Google Analytics
- Plausible Analytics
- Cloudflare Web Analytics

## Rollback

If a deployment has issues:

1. Go to **Deploys** tab
2. Find the last working deployment
3. Click on it
4. Click **"Publish deploy"**

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forum](https://answers.netlify.com/)
- [Netlify Status](https://www.netlifystatus.com/)

## Cost

**Netlify Free Tier includes:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- HTTPS
- Continuous deployment
- Deploy previews

**Perfect for this project!**
