# 🚀 Deployment Guide - Personal Growth Dashboard

This guide covers deploying your Personal Growth Dashboard to various platforms.

## 🌐 Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (free)

### Steps

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `NOTION_TOKEN`: Your Notion integration token
     - `NOTION_DATABASE_ID`: Your database ID

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

---

## 🐳 Docker Deployment

Deploy using Docker for any cloud provider or self-hosted environment.

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run
```bash
# Build the image
docker build -t personal-growth-dashboard .

# Run the container
docker run -p 3000:3000 \
  -e NOTION_TOKEN=your_token \
  -e NOTION_DATABASE_ID=your_db_id \
  personal-growth-dashboard
```

---

## ☁️ AWS Deployment

### AWS Amplify

1. **Push to Git Repository**
2. **Connect to AWS Amplify**
   - Go to AWS Amplify Console
   - Click "New App" → "Host web app"
   - Connect your repository

3. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Add Environment Variables**
   - In Amplify Console → App Settings → Environment Variables
   - Add `NOTION_TOKEN` and `NOTION_DATABASE_ID`

### AWS EC2 + PM2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (ports 22, 80, 443)

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd personal-growth-dashboard
   
   # Install dependencies
   npm ci
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "growth-dashboard" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 📱 Netlify Deployment

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   - Add in Site Settings → Environment Variables

3. **Redirects File**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

---

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Notion Integration
NOTION_TOKEN=secret_xxx...
NOTION_DATABASE_ID=xxxxx...

# Optional: Custom configurations
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### Security Best Practices

1. **API Keys**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates

3. **CORS**
   - Configure proper CORS headers
   - Restrict API access to your domain

---

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

---

## 🚀 Performance Optimization

### Next.js Optimizations
- Image optimization with `next/image`
- Font optimization with `next/font`
- Bundle analysis with `@next/bundle-analyzer`

### Caching Strategy
- Static assets: 1 year cache
- API responses: Short cache with revalidation
- CDN for global distribution

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version (18+)
- Clear `.next` and `node_modules`
- Verify environment variables

**API Connection Issues**
- Verify Notion token permissions
- Check database sharing settings
- Test API endpoints locally

**Performance Issues**
- Enable Next.js production mode
- Configure CDN
- Optimize images and fonts

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Platform Overview](https://vercel.com/docs)
- [Notion API Documentation](https://developers.notion.com/)

---

Ready to go live? Choose your preferred deployment method and follow the steps above! 🎉
