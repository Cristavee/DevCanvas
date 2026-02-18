# DevCanvas — Code Community Platform

A modern community platform for developers to share code, join communities, and chat — like Reddit + Discord for coders.

## ✨ Features

### 🏠 Feed & Discovery
- Beautiful card-based code snippet feed with syntax preview
- Trending page with most-liked snippets
- Full-text search with language filters
- Follow system and personalized following feed

### 👥 Communities
- Language-specific communities (JavaScript, Python, Rust, etc.)
- Community discovery with member counts
- Create your own communities

### 💬 Chat System
- **Private DMs** — Direct messaging with any developer
- **Group Chats** — Multi-person conversations
- **Channels** — Public community discussion channels
- Real-time message delivery with read receipts
- Online presence indicators

### 📝 Code Sharing
- Share snippets with syntax highlighting preview
- Multi-language support (15+ languages)
- Like, save, and comment on snippets
- Public/Private visibility control
- Tags and categorization

### 🔐 Authentication
- Email/password registration
- GitHub OAuth
- Secure sessions with NextAuth.js

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS + DM Sans font
- **Real-time**: Socket.IO (for production chat)
- **Image upload**: Cloudinary
- **State**: Zustand

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Fill in your environment variables
# - MONGODB_URI (MongoDB Atlas or local)
# - NEXTAUTH_SECRET (random 32+ char string)
# - GITHUB_ID/SECRET (optional, for GitHub login)

# 4. Run development server
npm run dev
```

Visit http://localhost:3000/en

## 📁 Project Structure

```
app/
├── [lang]/          # Internationalized routes
│   ├── page.tsx     # Home feed
│   ├── search/      # Explore & search
│   ├── trending/    # Trending snippets
│   ├── community/   # Community listing + pages
│   ├── chat/        # Messaging (DMs, groups, channels)
│   ├── upload/      # Share code snippet
│   ├── profile/     # User profile
│   ├── saved/       # Bookmarked snippets
│   ├── following/   # Following feed
│   └── auth/        # Sign in / Sign up
├── api/             # API routes
components/
├── ProjectCard.tsx  # Code snippet card
├── layout/          # Layout components
├── ui/              # Shadcn UI components
models/
├── User.ts          # User model
├── Project.ts       # Snippet model
├── Message.ts       # Chat message model
├── Conversation.ts  # Chat room model
└── Community.ts     # Community model
```

## 🌐 Deployment

Deploy to Vercel with one click:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See DEPLOYMENT.md for detailed instructions.
