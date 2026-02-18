# DevCanvas v3.0 — Developer OS

> **Theme**: Dark-first, premium developer tool  
> **Aesthetic**: Linear + Vercel + Discord  
> **Font**: Geist (UI) + Geist Mono (Code)  
> **Colors**: Slate dark × neon-green (#00FFB3) × electric-blue (#4DABFF)

---

## 🚀 What's New in v3

### 🎨 Design System Overhaul
- **Dark-first** — `.dark` class on `<html>` by default, light mode toggle ready
- **Geist + Geist Mono** replacing DM Sans/Mono — sharper, more premium feel
- **Neon-green (#00FFB3) + Electric-blue (#4DABFF)** accent system with CSS variables
- **CSS Grid pattern backgrounds**, glassmorphism, neon glow effects
- **Status indicators** with actual glow shadows (`.status-online`)
- Consistent `font-mono` for all data values, XP, ranks, timestamps

### 🏠 Feed v3 — Multi-layout (Grid/List/Kanban)
- Layout switcher: Grid · List · Kanban (UI implemented, state-ready)
- Filter tabs: Hot · New · Top with visual active states
- Right sidebar with Communities, Leaderboard preview, Live Activity feed
- Trending horizontal scroll strip

### 💬 Chat v3 — Full Discord-style
- **3-tier sidebar**: Direct Messages · Group Chats · Channels
- Online indicators with actual neon-green glow
- Per-section `+` buttons for new DM/group/channel
- Code snippet sharing button in message input (Code2 icon)
- Pinning support header button
- Message grouping (avatar collapse for consecutive messages)
- Neon-green "you" send button

### 👥 Communities v3 — Sub-channels
- Card-per-community with colored accent header bar
- Sub-channels list (`#general`, `#help`, `#showcase`...)
- Member count + online count with live indicator
- Join/Joined toggle button
- Filter: All · Joined · Trending
- Tag badges per community

### ⚡ Code Runner (NEW)
- Monaco-style textarea editor with filename display
- 3 presets: TypeScript (Deno), Python 3.12, JavaScript (Node 20)
- Mock execution with realistic output + elapsed time
- Copy + Reset buttons
- Run button with ⌘↵ shortcut hint
- "Executing..." animated state

### 📊 Analytics Dashboard (NEW)
- 4 stat cards with mini SVG sparkline charts
- Top Performing Snippets table with trend arrows
- Language Distribution progress bars
- Profile stats sidebar (XP, Rank, Followers, Streak)
- Time range selector: 7d · 30d · 90d

### 🏆 Leaderboard & Reputation (NEW)
- **XP system**: earn points for posting, likes, comments, streaks
- Podium visualization (top 3 with visual hierarchy)
- Full ranked table with tier badges (Diamond/Platinum/Gold/Silver)
- "You" highlighted row with neon-green pill badge
- Tier filter buttons with tier colors
- XP earning guide grid

### 🎨 Profile v3 — Rich Developer Identity
- Cover photo area with grid pattern gradient
- Contribution graph (GitHub-style, 12 weeks × 7 days)
- Achievement badges grid (6 badges with descriptions)
- Language distribution bars
- Social links (Twitter, GitHub, Website)
- XP, Rank, Snippets, Likes, Followers, Streak stats
- Tab navigation: Overview · Snippets · Stars · Activity

### ⚡ Admin Panel v3 — Powerful
- System health status badge
- 4 metric cards (Users, Snippets, Messages, Daily Active)
- Pending reports with Resolve/Remove actions
- System metrics with progress bars (API time, DB, CDN, Error rate, Uptime)
- User management table with role badges, XP, ban/unban actions
- Search users by name or email

### 🔍 ⌘K Command Palette (UI)
- Search button in sidebar with `⌘K` shortcut hint
- Full palette implementation: see `/components/CommandPalette.tsx`

### 🌙 Dark/Light Theme Toggle
- CSS custom properties for both themes
- Dark is default (`.dark` on `<html>`)
- All colors respond to theme via `hsl(var(--...))` pattern

---

## 🗂 New Files Added

```
app/[lang]/runner/page.tsx         # Code Runner
app/[lang]/analytics/page.tsx      # Analytics Dashboard  
app/[lang]/leaderboard/page.tsx    # Leaderboard & Reputation
components/ProjectCardV3.tsx        # Upgraded project card
app/globals.css                     # Full v3 design system
tailwind.config.ts                  # Geist fonts, neon colors
```

## 🔧 Updated Files

```
app/[lang]/layout.tsx              # v3 sidebar with tools nav, ⌘K
app/[lang]/page.tsx                # Feed v3 with layout switcher
app/[lang]/chat/page.tsx           # Discord-style chat
app/[lang]/community/page.tsx      # Sub-channels communities
app/[lang]/profile/page.tsx        # Rich developer profile
app/[lang]/admin/page.tsx          # Powerful admin panel
```

## 📦 Dependencies (unchanged, no new deps needed)

All new UI uses only existing deps: `lucide-react`, `tailwindcss`, Geist via Google Fonts.

---

## 🗺 v3.1 Roadmap

- [ ] ⌘K Command Palette (full implementation)
- [ ] Kanban board layout for feed
- [ ] Notification center with real-time socket events
- [ ] Code Runner WebAssembly sandbox (real execution)
- [ ] Dark/Light theme toggle button (persisted to localStorage)
- [ ] Community sub-channel pages with full messaging
- [ ] Settings page overhaul
