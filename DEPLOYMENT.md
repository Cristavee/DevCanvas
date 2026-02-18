# 🚀 Panduan Deployment DevCanvas ke Vercel

Panduan lengkap untuk deploy aplikasi DevCanvas ke Vercel.

## 📝 Checklist Sebelum Deploy

- [ ] Semua file sudah di-commit ke Git
- [ ] Environment variables sudah disiapkan
- [ ] MongoDB Atlas sudah setup
- [ ] Cloudinary account sudah ready
- [ ] NextAuth secret sudah di-generate

## 🔧 Setup Environment Variables

### 1. MongoDB Atlas

1. Buka [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (atau gunakan existing)
3. Database Access → Add Database User
4. Network Access → Add IP (0.0.0.0/0 untuk allow semua)
5. Connect → Connect your application → Copy connection string
6. Replace `<password>` dengan password user Anda

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devcanvas?retryWrites=true&w=majority
```

### 2. NextAuth Secret

Generate secret key:

```bash
openssl rand -base64 32
```

Atau gunakan online generator: https://generate-secret.vercel.app/32

```
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Cloudinary

1. Buka [Cloudinary](https://cloudinary.com)
2. Sign up / Login
3. Dashboard → Copy credentials:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. NextAuth URL (Production)

```
NEXTAUTH_URL=https://your-app-name.vercel.app
```

## 🚀 Deploy ke Vercel

### Metode 1: Via GitHub (Recommended)

1. **Push ke GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import di Vercel**

- Buka [Vercel Dashboard](https://vercel.com/new)
- Click "Import Project"
- Select GitHub repository: `Cristavee/DevCanvas`
- Click "Import"

3. **Configure Project**

- Framework Preset: Next.js (auto-detect)
- Root Directory: `./`
- Build Command: `next build` (default)
- Output Directory: `.next` (default)

4. **Add Environment Variables**

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

**PENTING**: Pilih environment: Production, Preview, Development (check all)

5. **Deploy**

- Click "Deploy"
- Tunggu build selesai (±2-3 menit)
- Done! 🎉

### Metode 2: Via Vercel CLI

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login**

```bash
vercel login
```

3. **Deploy**

```bash
cd DevCanvas-fixed
vercel
```

4. **Tambahkan Environment Variables**

```bash
vercel env add MONGODB_URI
# Paste value, tekan Enter
vercel env add NEXTAUTH_SECRET
# Paste value, tekan Enter
# Ulangi untuk semua env variables
```

5. **Deploy Production**

```bash
vercel --prod
```

## 🔄 Update Production (Redeploy)

### Auto Deploy (jika menggunakan GitHub integration)

Setiap push ke branch `main` akan otomatis trigger deployment:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel akan otomatis build dan deploy.

### Manual Redeploy

Di Vercel Dashboard:
- Deployments → Click pada deployment terakhir
- Click tombol "Redeploy"

## 🐛 Troubleshooting

### Build Failed: Module not found

**Problem**: Error seperti `Can't resolve '@/components/ui/button'`

**Solution**:
1. Pastikan semua file UI components ada di `components/ui/`
2. Check `tsconfig.json` paths configuration
3. Commit dan push semua file yang missing

```bash
git status  # Cek file yang belum di-commit
git add .
git commit -m "Add missing files"
git push
```

### MongoDB Connection Error

**Problem**: `MongoServerError: bad auth`

**Solution**:
1. Cek username dan password di connection string
2. Pastikan IP whitelist di MongoDB Atlas
3. Update environment variable `MONGODB_URI` di Vercel

### NextAuth Error: [next-auth][error][JWT_SESSION_ERROR]

**Problem**: JWT session error

**Solution**:
1. Generate new `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
2. Update di Vercel environment variables
3. Redeploy

### Cloudinary Upload Failed

**Problem**: Image upload tidak berfungsi

**Solution**:
1. Verify Cloudinary credentials
2. Check upload preset configuration
3. Pastikan CORS settings di Cloudinary dashboard

### Production URL tidak match

**Problem**: Redirect error setelah login

**Solution**:
Update `NEXTAUTH_URL` di Vercel environment variables dengan production URL yang benar:
```
NEXTAUTH_URL=https://your-actual-domain.vercel.app
```

## 📊 Monitoring

### View Logs

Di Vercel Dashboard:
- Click project name
- Deployments → Click latest deployment
- Functions → View function logs
- Runtime Logs → Real-time server logs

### Performance Monitoring

Vercel menyediakan Web Analytics gratis:
- Settings → Analytics
- Enable Web Analytics
- View real-time metrics

## 🔐 Security Best Practices

1. **Environment Variables**
   - JANGAN commit `.env` atau `.env.local` ke Git
   - Gunakan environment variables di Vercel untuk secrets
   - Rotate secrets secara berkala

2. **MongoDB**
   - Gunakan strong password
   - Whitelist hanya IP yang diperlukan
   - Enable MongoDB audit logs

3. **API Rate Limiting**
   - Implement rate limiting di API routes
   - Monitor suspicious activity

## 🎯 Next Steps

Setelah deploy berhasil:

1. **Setup Custom Domain** (Optional)
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records

2. **Setup OAuth Providers**
   - Configure GitHub OAuth callback URL
   - Configure Google OAuth callback URL
   - Update environment variables

3. **Monitor Performance**
   - Enable Analytics
   - Check Core Web Vitals
   - Optimize images dan assets

## 📞 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Support](https://www.mongodb.com/support)

---

Good luck dengan deployment Anda! 🚀
