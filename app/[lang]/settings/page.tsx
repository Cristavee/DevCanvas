"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { User, Bell, Shield, Palette, Globe, Save, Check, Moon, Sun, Monitor, LogOut, Trash2, AlertTriangle } from "lucide-react";

const TABS = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "privacy", icon: Shield, label: "Privacy & Security" },
  { id: "account", icon: Trash2, label: "Account" },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [name, setName] = useState(session?.user?.name || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const handleSave = async () => {
    setSaved(true);
    // In production: POST /api/user/settings
    setTimeout(() => setSaved(false), 2500);
  };

  const user = session?.user;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5 font-mono">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Sidebar */}
        <div className="flex flex-row md:flex-col gap-1 md:w-44 shrink-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap flex-shrink-0 md:w-full ${activeTab === id ? "" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              style={activeTab === id ? { background: "var(--neon-green-dim)", color: "var(--neon-green)" } : {}}>
              <Icon size={15} className="flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Profile Information</h2>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-black"
                        style={{ background: "linear-gradient(135deg, var(--neon-green), var(--electric-blue))" }}>
                        {(user?.name || "U").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <button className="px-3.5 py-2 rounded-xl border border-border text-sm font-mono text-foreground hover:bg-muted transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono">JPG, PNG, GIF up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Display Name</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}
                      rows={3} placeholder="Tell the community about yourself..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Location</label>
                    <input value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Website</label>
                    <input value={website} onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yoursite.dev"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Twitter / X</label>
                    <input value={twitter} onChange={e => setTwitter(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">GitHub</label>
                    <input value={github} onChange={e => setGithub(e.target.value)}
                      placeholder="username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-[var(--neon-green)]/50 transition-all" />
                  </div>
                </div>
              </div>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-mono text-black transition-all hover:opacity-90"
                style={{ background: "var(--neon-green)" }}>
                {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save Changes</>}
              </button>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map(({ value, icon: Icon, label }) => (
                    <button key={value} onClick={() => setTheme(value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === value ? "border-[var(--neon-green)] bg-[var(--neon-green-dim)]" : "border-border hover:bg-muted/50"}`}>
                      <Icon size={20} style={theme === value ? { color: "var(--neon-green)" } : { color: "hsl(var(--muted-foreground))" }} />
                      <span className={`text-sm font-mono ${theme === value ? "" : "text-muted-foreground"}`}
                        style={theme === value ? { color: "var(--neon-green)" } : {}}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-3">
                  <span style={{ color: "var(--electric-blue)" }}>ℹ</span> Persistent theme stored in DB for logged-in users. Coming in v3.1.
                </p>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
              {[
                { label: "Email Notifications", desc: "Receive emails for likes, comments, follows", val: emailNotif, set: setEmailNotif },
                { label: "Push Notifications", desc: "Browser notifications for real-time events", val: pushNotif, set: setPushNotif },
              ].map(({ label, desc, val, set }) => (
                <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{desc}</div>
                  </div>
                  <button onClick={() => set((v: boolean) => !v)}
                    className={`relative w-12 h-6 rounded-full transition-all ${val ? "" : "bg-muted"}`}
                    style={val ? { background: "var(--neon-green)" } : {}}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? "left-7" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Privacy */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Security</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">Change Password</div>
                      <div className="text-xs text-muted-foreground font-mono">Last changed: Never</div>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-mono text-foreground hover:bg-muted transition-colors">
                      Update
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">Two-Factor Auth</div>
                      <div className="text-xs text-muted-foreground font-mono">Not enabled</div>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-colors"
                      style={{ borderColor: "var(--neon-green)", color: "var(--neon-green)", background: "var(--neon-green-dim)" }}>
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account */}
          {activeTab === "account" && (
            <div className="space-y-4">
              {/* Sign out */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Session</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-foreground">Signed in as</div>
                    <div className="text-xs font-mono text-muted-foreground">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: `/${lang}` })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-mono">
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
              {/* Danger zone */}
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-red-400" />
                  <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/15 transition-colors text-sm font-mono">
                  <Trash2 size={13} />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
