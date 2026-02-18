"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { User, Bell, Palette, Shield, LogOut, Trash2, Check, AlertTriangle, Save, Moon, Sun, Monitor } from "lucide-react";

const TABS = [
  { id: "profile",       icon: User,    label: "Profile" },
  { id: "notifications", icon: Bell,    label: "Notifications" },
  { id: "appearance",    icon: Palette, label: "Appearance" },
  { id: "security",      icon: Shield,  label: "Security" },
  { id: "account",       icon: LogOut,  label: "Account" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider mb-1.5"
        style={{ color: "hsl(var(--muted-foreground))" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, type = "text" }: any) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-white placeholder:text-muted-foreground outline-none transition-all"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
      onFocus={e => (e.target.style.borderColor = "var(--neon)")}
      onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
    />
  );
}
function Toggle({ on, onChange }: { on: boolean; onChange(v: boolean): void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className="relative w-11 h-6 rounded-full transition-all shrink-0"
      style={{ background: on ? "var(--neon)" : "hsl(var(--muted))" }}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const lang   = (params?.lang as string) || "en";
  const router = useRouter();

  const [tab,    setTab]    = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  // Profile fields
  const user = session?.user;
  const [name,    setName]    = useState(user?.name || "");
  const [bio,     setBio]     = useState("");
  const [location,setLocation]= useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github,  setGithub]  = useState("");

  // Appearance
  const [theme, setTheme] = useState("dark");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif,  setPushNotif]  = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch("/api/user").then(r => r.json()).then(u => {
      if (!u) return;
      setName(u.name || "");
      setBio(u.bio || "");
      setLocation(u.location || "");
      setWebsite(u.website || "");
      setTwitter(u.twitter || "");
      setGithub(u.github || "");
      setTheme(u.theme || "dark");
      setEmailNotif(u.emailNotifications ?? true);
      setPushNotif(u.pushNotifications ?? true);
    }).catch(() => {});
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, location, website, twitter, github, theme, emailNotifications: emailNotif, pushNotifications: pushNotif }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  };

  const cardStyle = { borderColor: "hsl(var(--border))", background: "hsl(var(--card))" };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Manage your account and preferences</p>
      </div>

      {/* Horizontal tabs (scrollable on mobile) */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all"
            style={tab === id
              ? { background: "var(--neon-dim)", color: "var(--neon)" }
              : { color: "hsl(var(--muted-foreground))" }}>
            <Icon size={14} className="shrink-0" />{label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="space-y-4">
          {/* Avatar row */}
          <div className="rounded-2xl border p-5" style={cardStyle}>
            <h2 className="text-sm font-semibold text-white mb-4">Profile</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                {user?.image
                  ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-black"
                      style={{ background: "linear-gradient(135deg, var(--neon), var(--blue))" }}>
                      {(user?.name || "U")[0]}
                    </div>
                }
              </div>
              <div>
                <button className="px-3.5 py-2 rounded-xl border text-sm font-mono text-white transition-colors hover:bg-white/5"
                  style={{ borderColor: "hsl(var(--border))" }}>
                  Change Avatar
                </button>
                <p className="text-[11px] font-mono mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>JPG, PNG · max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Field label="Name"><Input value={name} onChange={(e: any) => setName(e.target.value)} /></Field></div>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    placeholder="Tell the community about yourself..."
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white placeholder:text-muted-foreground outline-none resize-none transition-all"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
                    onFocus={e => (e.target.style.borderColor = "var(--neon)")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                  />
                </Field>
              </div>
              <Field label="Location"><Input value={location} onChange={(e: any) => setLocation(e.target.value)} placeholder="San Francisco, CA" /></Field>
              <Field label="Website"><Input value={website} onChange={(e: any) => setWebsite(e.target.value)} placeholder="https://yoursite.dev" /></Field>
              <Field label="Twitter / X"><Input value={twitter} onChange={(e: any) => setTwitter(e.target.value)} placeholder="@handle" /></Field>
              <Field label="GitHub"><Input value={github} onChange={(e: any) => setGithub(e.target.value)} placeholder="username" /></Field>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--neon)" }}>
            {saved ? <><Check size={14} />Saved!</> : saving ? "Saving..." : <><Save size={14} />Save Changes</>}
          </button>
        </div>
      )}

      {/* Appearance tab */}
      {tab === "appearance" && (
        <div className="rounded-2xl border p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold text-white mb-4">Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "dark",   icon: Moon,    label: "Dark" },
              { value: "light",  icon: Sun,     label: "Light" },
              { value: "system", icon: Monitor, label: "System" },
            ].map(({ value, icon: Icon, label }) => (
              <button key={value} onClick={() => setTheme(value)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all"
                style={theme === value
                  ? { borderColor: "var(--neon)", background: "var(--neon-dim)", color: "var(--neon)" }
                  : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                <Icon size={20} />
                <span className="text-xs font-mono">{label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleSave}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
            style={{ background: "var(--neon)" }}>
            {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save</>}
          </button>
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="rounded-2xl border p-5 space-y-4" style={cardStyle}>
          <h2 className="text-sm font-semibold text-white mb-2">Notifications</h2>
          {[
            { label: "Email notifications", desc: "Likes, comments, follows via email", val: emailNotif, set: setEmailNotif },
            { label: "Push notifications",  desc: "Real-time browser notifications",   val: pushNotif,  set: setPushNotif },
          ].map(({ label, desc, val, set }) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
              style={{ borderColor: "hsl(var(--border))" }}>
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-[11px] font-mono mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</div>
              </div>
              <Toggle on={val} onChange={set} />
            </div>
          ))}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
            style={{ background: "var(--neon)" }}>
            {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save</>}
          </button>
        </div>
      )}

      {/* Security tab */}
      {tab === "security" && (
        <div className="rounded-2xl border p-5 space-y-3" style={cardStyle}>
          <h2 className="text-sm font-semibold text-white mb-2">Security</h2>
          {[
            { label: "Change Password", desc: "Last changed: Never", action: "Update" },
            { label: "Two-Factor Auth", desc: "Status: Not enabled", action: "Enable" },
          ].map(({ label, desc, action }) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3 rounded-xl border px-4"
              style={{ borderColor: "hsl(var(--border))" }}>
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</div>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-colors hover:bg-white/5 shrink-0"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                {action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <div className="space-y-4">
          {/* Sign out */}
          <div className="rounded-2xl border p-5" style={cardStyle}>
            <h2 className="text-sm font-semibold text-white mb-3">Session</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-white">Signed in as</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{user?.email}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: `/${lang}` })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                style={{ borderColor: "rgba(239,68,68,.3)" }}>
                <LogOut size={14} />Sign Out
              </button>
            </div>
          </div>
          {/* Danger zone */}
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(239,68,68,.3)", background: "rgba(239,68,68,.04)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-400" />
              <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
            </div>
            <p className="text-xs font-mono mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono text-red-400 hover:bg-red-500/15 transition-colors"
              style={{ borderColor: "rgba(239,68,68,.4)" }}>
              <Trash2 size={13} />Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
