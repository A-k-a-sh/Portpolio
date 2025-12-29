# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

```bash
# Push to your GitHub repository
git push -u origin main
```

If this is a new repository on GitHub, create it first:
1. Go to https://github.com/cross-entropy0
2. Click "New repository"
3. Name it: **Portpolio**
4. **Do NOT** initialize with README (we already have one)
5. Click "Create repository"
6. Then run: `git push -u origin main`

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)
1. Visit https://vercel.com
2. Sign in with your GitHub account
3. Click "New Project"
4. Import `cross-entropy0/Portpolio`
5. Vercel will auto-detect Vite settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"
7. Wait ~2 minutes for deployment
8. Your site will be live at: `https://portpolio-[random].vercel.app`

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: Portpolio
# - Framework: Vite
# - Confirm settings
```

## Step 3: Update README with Live URL

After deployment, update the README.md:
```markdown
## 🚀 Live Demo

**[View Live Site](https://your-actual-url.vercel.app)**
```

## Step 4: Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## 🎉 You're Done!

Your portfolio is now live! Share it:
- Add to LinkedIn
- Pin to GitHub profile
- Share on social media

## Useful Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Pull latest changes
git pull origin main

# Redeploy (Vercel auto-deploys on push)
git push origin main
```

## Troubleshooting

### Build fails on Vercel
- Check Node.js version (Vercel uses 18.x by default)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### Changes not showing
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Wait 1-2 minutes for Vercel CDN to update
- Check Vercel deployments tab

### Git push rejected
```bash
# If repository exists on GitHub but empty:
git push -f origin main

# If you need to pull first:
git pull origin main --rebase
git push origin main
```
