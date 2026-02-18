# DevCanvas 🎨

**A visual portfolio platform for developers** — showcase your code snippets beautifully, discover amazing projects, and connect with the community.

## ✨ Features

- 🏠 **Home** — Hero section, trending projects strip, latest projects grid
- 🔍 **Search** — Full-text search with language + sort filters
- 👤 **Profile** — Personal canvas with stats and project gallery  
- ⬆️ **Upload** — Rich upload form with language picker, tags, visibility control
- 🌟 **Following** — Activity feed and suggested developer sidebar
- 🛡️ **Admin** — Stats dashboard + project moderation table
- 🔐 **Auth** — GitHub OAuth + Email/Password signin & registration

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Fill in your MongoDB URI and NextAuth secret at minimum
```

### 3. Run locally
```bash
npm run dev
```

Visit `http://localhost:3000` — it will redirect to `/en/` automatically.

> **💡 Works without DB!** All pages have demo data fallback so you can develop without MongoDB connected.

## 🗂️ Project Structure

```
app/
  [lang]/           # Localized routes (en / id)
    page.tsx        # Home
    search/         # Search & discovery
    upload/         # Upload new project
    profile/        # User profile
    following/      # Following feed
    admin/          # Admin dashboard
  api/
    auth/           # NextAuth + register endpoint
    projects/       # CRUD + like endpoints

components/
  ProjectCard.tsx   # Card with code preview + like
  layout/           # BottomNav
  search/           # SearchBar, FilterDrawer
  admin/            # AdminTable
  ui/               # shadcn/ui base components

models/
  Project.ts        # Mongoose schema
  User.ts           # Mongoose schema
```

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔑 Required Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret (run: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL |

## 📦 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **MongoDB + Mongoose**
- **NextAuth.js** (GitHub OAuth + credentials)
- **Tailwind CSS**
- **shadcn/ui** components
- **Zustand** (client state)
- **Framer Motion** (animations)
