# DevCanvas v3 — Implementation Notes

## Responsive Layout Architecture

### Breakpoints
- **Mobile** (< 1024px): hamburger menu → left drawer, bottom nav bar, centered logo header
- **Tablet** (768-1023px): same as mobile (hamburger + bottom nav)  
- **Desktop** (≥ 1024px): fixed left sidebar 240px, top-right header bar, no bottom nav

### Layout Stack
```
app/layout.tsx              ← root: html+body+SessionProvider+Geist fonts
app/[lang]/layout.tsx       ← lang: NavClient server component wrapper
components/layout/NavClient.tsx  ← ALL nav logic (client)
  ├── DesktopSidebar        ← hidden on mobile, fixed left
  ├── DesktopTopBar         ← hidden on mobile, sticky top-right
  ├── MobileHeader          ← shown on mobile: hamburger + logo + search + user
  ├── MobileDrawer          ← left drawer with full nav + user info
  ├── MobileBottomNav       ← fixed bottom: Home/Explore/New/Chat/Me
  ├── CommandPalette        ← ⌘K overlay
  ├── UserDropdown          ← logged-in menu: profile/analytics/settings/signout
  └── GuestDropdown         ← guest menu: signup + signin buttons
```

## Auth System

### How it works
1. `NextAuth` with **Credentials** (email+password) + **GitHub OAuth**
2. Session passed server-side via `getServerSession(authOptions)` in `app/layout.tsx`
3. Session injected into `AuthSessionProvider` (client wrapper for `useSession`)
4. `NavClient` receives `session` as prop — no `useSession` hook needed in layout
5. Upload/Settings pages use `useSession()` for client-side auth check

### Required .env variables
```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

### Auth flow — Upload page
1. User lands on `/upload`
2. If not logged in → shows "Sign in to share code" wall with Register/Sign In buttons
3. If logged in → full upload form with DB save
4. On success → `POST /api/projects` → saves to MongoDB → awards +50 XP → success screen

### User model v3 additions
- `xp` — reputation points (starts at 0, +50 XP per snippet)
- `streak` — consecutive days active
- `tier` — Bronze/Silver/Gold/Platinum/Diamond (calculated from XP)
- `badges` — array of badge IDs
- `twitter`, `github` — social links
- `theme` — dark/light/system preference
- `isVerified`, `isBanned`, `banReason` — moderation fields
- GitHub OAuth auto-creates user + awards 50 XP on first login

## Hamburger Menu (Mobile)

### Location: top-left on mobile header
- Opens `MobileDrawer` (left-to-right slide animation)
- Drawer contains: user block, all nav items, communities, settings, sign out
- **Guest state**: shows "Create Account" + "Sign In" buttons
- **Logged in**: shows avatar, XP, tier, profile link, sign out button

## User Menu (Top-right, all screens)

### Desktop top-right header
- Shows avatar + name + XP on button (xl breakpoint)
- Opens `UserDropdown` with: Profile, Analytics, Saved, Settings, Admin (if admin), Sign Out

### Mobile header (right side)
- Shows user avatar (or ghost icon for guests)
- Opens same dropdown on tap

## Settings Page
Tabs: **Profile** · **Notifications** · **Appearance** · **Privacy & Security** · **Account**
- **Profile**: name, bio, location, website, twitter, github, avatar
- **Appearance**: dark/light/system theme toggle
- **Notifications**: email + push toggles
- **Privacy**: change password, 2FA setup
- **Account**: sign out button, danger zone (delete account)

## Database — Projects API

### POST /api/projects (requires auth)
- Returns 401 if not logged in
- Validates title + codeSnippet + language
- Saves to MongoDB
- Awards +50 XP to author
- Populates author field in response

### GET /api/projects
- Public, no auth required
- Supports: `?page=1&limit=12&language=TypeScript&q=search&sort=createdAt`

## Landscape Mode
- CSS handles `@media (max-height: 500px) and (orientation: landscape)`
- Bottom nav reduces to 48px height
- Sidebar spacing tightens

## ⌘K Command Palette
- Global keyboard shortcut: `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- Lists: Home, Explore, New Snippet, Chat, Communities, Code Runner, Analytics, Leaderboard, Profile, Settings
- Filter by typing
- Navigate with ↑↓, open with ↵, close with ESC
