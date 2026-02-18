"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (tab === "signin") {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/" + lang);
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        await signIn("credentials", { email, password, redirect: false });
        router.push("/" + lang);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-xl">DC</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {tab === "signin" ? "Welcome back" : "Join DevCanvas"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {tab === "signin" ? "Sign in to your account" : "Create your account to share code"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={
                  "flex-1 py-2 text-sm font-semibold rounded-lg transition-all " +
                  (tab === t
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700")
                }
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 rounded-xl gap-2 mb-4 border-slate-200 dark:border-slate-700"
            onClick={() => signIn("github", { callbackUrl: "/" + lang })}
          >
            <Github size={18} />
            Continue with GitHub
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          <form onSubmit={handleCredentials} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : tab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
