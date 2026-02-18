"use client";
import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Save, Check, Moon, Sun, Monitor } from "lucide-react";

const TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'privacy', icon: Shield, label: 'Privacy' },
  { id: 'language', icon: Globe, label: 'Language' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('system');
  const [name, setName] = useState('Your Name');
  const [bio, setBio] = useState('Full-stack developer passionate about clean code.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('github.com/yourhandle');

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="hidden sm:flex flex-col w-44 gap-0.5 shrink-0">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                activeTab === id
                  ? 'bg-primary/8 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 w-full scrollbar-hide mb-2">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="font-semibold text-foreground mb-4">Public Profile</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                    {name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <button className="text-sm text-primary font-medium hover:underline">Change photo</button>
                    <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or GIF. 5MB max.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Full name', value: name, setter: setName, placeholder: 'Your name' },
                    { label: 'Location', value: location, setter: setLocation, placeholder: 'City, Country' },
                    { label: 'Website', value: website, setter: setWebsite, placeholder: 'github.com/yourhandle' },
                  ].map(({ label, value, setter, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
                      <input
                        value={value}
                        onChange={e => setter(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell the community about yourself..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
              >
                {saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-semibold text-foreground mb-4">Appearance</h2>
              <p className="text-xs text-muted-foreground mb-4">Choose your preferred theme</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', icon: Sun, label: 'Light' },
                  { value: 'dark', icon: Moon, label: 'Dark' },
                  { value: 'system', icon: Monitor, label: 'System' },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      theme === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${theme === value ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-xs font-medium ${theme === value ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-foreground mb-2">Notifications</h2>
              {[
                { label: 'New likes on your snippets', desc: 'Get notified when someone likes your code' },
                { label: 'Comments on your snippets', desc: 'When developers comment on your work' },
                { label: 'New followers', desc: 'When someone starts following you' },
                { label: 'Direct messages', desc: 'New DM and group chat notifications' },
                { label: 'Community mentions', desc: 'When someone @mentions you' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <button className="w-10 h-6 bg-primary rounded-full relative transition-all flex-shrink-0">
                    <div className="w-4.5 h-4.5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'privacy' || activeTab === 'language') && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-semibold text-foreground mb-4 capitalize">{activeTab}</h2>
              <p className="text-sm text-muted-foreground">Settings coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
