# DevCanvas - Developer Portfolio Showcase Platform

DevCanvas adalah platform showcase untuk developer yang memungkinkan mereka menampilkan proyek, code snippets, dan karya digital mereka dalam satu tempat yang terorganisir dan menarik.

## 🚀 Fitur Utama

- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 🌍 **Multi-language** - Mendukung Bahasa Indonesia dan English
- 🎨 **Dark Mode** - Theme gelap dan terang
- 🔐 **Authentication** - Login dengan GitHub/Google menggunakan NextAuth
- 📤 **Upload Projects** - Upload dan showcase karya developer
- 🔍 **Search & Filter** - Cari proyek berdasarkan bahasa, tags, dan kategori
- 👤 **User Profiles** - Profil personal untuk setiap developer
- 🛡️ **Admin Dashboard** - Panel admin untuk moderasi konten

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Cloud Storage**: Cloudinary
- **Deployment**: Vercel

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- Node.js 18+ terinstall
- MongoDB Atlas account (atau MongoDB local)
- Cloudinary account untuk image upload
- GitHub OAuth App (optional, untuk login)
- Google OAuth App (optional, untuk login)

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Cristavee/DevCanvas.git
cd DevCanvas
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devcanvas?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# GitHub OAuth (Optional)
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret

# Google OAuth (Optional)
GOOGLE_ID=your-google-oauth-id
GOOGLE_SECRET=your-google-oauth-secret
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy hasilnya ke `NEXTAUTH_SECRET`

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy ke Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Cristavee/DevCanvas)

### Manual Deploy

1. Push code ke GitHub repository
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Connect dengan GitHub repository
4. Tambahkan Environment Variables di Vercel:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (gunakan production URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Deploy!

## 📁 Project Structure

```
DevCanvas/
├── app/                      # Next.js App Router
│   ├── [lang]/              # Multi-language routes
│   │   ├── page.tsx         # Home page
│   │   ├── upload/          # Upload project page
│   │   ├── search/          # Search page
│   │   ├── profile/         # User profile
│   │   └── admin/           # Admin dashboard
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   └── projects/        # Project CRUD endpoints
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── admin/               # Admin components
│   └── modals/              # Modal components
├── lib/                     # Utility functions
│   ├── mongodb.ts           # MongoDB connection
│   ├── utils.ts             # Helper functions
│   └── get-dictionary.ts    # i18n utilities
├── models/                  # Mongoose models
│   ├── User.ts
│   └── Project.ts
├── dictionaries/            # i18n translations
│   ├── en.json
│   └── id.json
└── middleware.ts            # Next.js middleware
```

## 🐛 Troubleshooting

### Error: Module not found

Pastikan semua dependencies terinstall dengan `npm install`

### MongoDB Connection Error

1. Whitelist IP di MongoDB Atlas
2. Cek connection string format
3. Pastikan database user memiliki permission

### Vercel Build Error

1. Set environment variables di Vercel
2. Pastikan Next.js version up to date
3. Review build logs

## 📝 License

MIT License

## 👨‍💻 Author

Created by [Cristavee](https://github.com/Cristavee)
