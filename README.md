# Personal Growth Dashboard

A web application for tracking your daily habits, emotions, and personal development journey.

## Features

- 📊 Daily session tracking (Morning, Midday, Evening, Bedtime)
- 📈 Progress visualization with charts and heatmaps
- 🧠 Emotional state and health monitoring
- 🎯 Goal tracking for job applications, study hours, and fitness
- 📝 Daily journal entries and gratitude practice

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (PostgreSQL + Authentication)
- Tailwind CSS
- Zustand for state management
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

### Supabase Setup

The SQL schema for this project is available in the `/scripts` directory. Run this in your Supabase SQL editor to set up the required tables, views, and functions.

## Deployment

This project is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the required environment variables
3. Deploy!

## License

MIT
