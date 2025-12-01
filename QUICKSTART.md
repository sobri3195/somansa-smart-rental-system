# 🚀 Quick Start Guide

Get Somansa up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A backend API endpoint (or use mock data)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=https://your-api-url.com
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 4: Build for Production

```bash
npm run build
```

The build output will be in `dist/` directory.

## Step 5: Deploy to Netlify

### Option A: Connect Git Repository

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your API URL
7. Deploy!

### Option B: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Testing the App

### Without Backend API

Use the mock data examples in [API_EXAMPLES.md](API_EXAMPLES.md) to set up a mock server:

```bash
# Install json-server globally
npm install -g json-server

# Create a db.json file with mock data (see API_EXAMPLES.md)
# Then run:
json-server --watch db.json --port 3000

# In another terminal, set .env:
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Start the app
npm run dev
```

## What's Next?

- Read [README.md](README.md) for detailed setup
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- See [API_EXAMPLES.md](API_EXAMPLES.md) for API documentation

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Troubleshooting

**Problem**: API calls fail
- Check `VITE_API_BASE_URL` is set correctly
- Verify backend API is running
- Check CORS is enabled on backend

**Problem**: Build fails
- Run `npm install` again
- Clear cache: `rm -rf node_modules dist && npm install`

**Problem**: Routes don't work after deployment
- Ensure `_redirects` file exists in `public/`
- Check `netlify.toml` is configured

## Support

- Check documentation files
- Review console for errors
- Verify environment variables

---

**Ready to build something amazing! 🎉**
