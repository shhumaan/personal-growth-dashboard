# Supabase Setup Guide

This app can run in two modes:
1. **Demo Mode** (default) - Uses mock data, no database required
2. **Supabase Mode** - Connects to a real Supabase database

## Current Status: Running in Demo Mode

Your app is currently running in demo mode because no Supabase credentials are configured. This is perfect for testing and development!

## To Connect to Real Supabase Database:

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Fill in your project details and wait for setup to complete

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to Settings > API
2. Copy your project URL and anon key

### 3. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Set Up Database Schema
Run the following SQL scripts in your Supabase SQL editor (in order):

1. **Main Schema**: `scripts/supabase-schema.sql`
2. **Motivation Features**: `scripts/motivation-features-schema.sql`
3. **Goals System**: `scripts/goals-schema.sql`

### 5. Restart the Development Server
```bash
npm run dev
```

## Features Available in Each Mode:

### Demo Mode (Current)
✅ All UI components work  
✅ Form submissions update local state  
✅ Mock data for testing  
✅ Achievement system with demo data  
✅ Goals section with sample goals  
✅ Weekly analytics with mock data  
❌ Data persistence (resets on page refresh)  
❌ Real user authentication  
❌ Multi-user support  

### Supabase Mode
✅ All Demo Mode features  
✅ Real data persistence  
✅ User authentication  
✅ Multi-user support  
✅ Data backup and sync  
✅ Real-time updates  
✅ Advanced analytics  

## Troubleshooting

### "supabase.from(...).update(...).eq is not a function"
This error has been fixed! The mock Supabase client now properly chains query methods.

### Data Not Persisting
This is normal in Demo Mode. To persist data, set up Supabase connection.

### Environment Variables Not Working
Make sure your `.env.local` file is in the root directory and restart the dev server.

## Need Help?
- Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Ensure your `.env.local` file is properly formatted
- Make sure you've run all the SQL setup scripts