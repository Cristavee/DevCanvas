import { getDictionary } from "@/lib/get-dictionary";
import { ProjectCard } from "@/components/ProjectCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Github, Globe, Twitter, Link2 } from "lucide-react";

// Demo user for when no session/DB
const DEMO_USER = {
  name: "Alex Rivera",
  email: "alex@devcanvas.dev",
  avatar: "",
  bio: "Full-stack developer passionate about open source and beautiful code. TypeScript, Rust & Go enthusiast.",
  role: "user",
  githubId: "alexrivera",
};

const DEMO_PROJECTS = [
  {
    _id: "p1",
    title: "FastAPI Auth Middleware",
    description: "JWT authentication middleware for FastAPI.",
    codeSnippet: `async def get_current_user(token: str = Depends(oauth2)):
    payload = jwt.decode(token, SECRET_KEY)
    return payload.get("sub")`,
    language: "Python",
    tags: ["fastapi", "jwt", "auth"],
    likes: ["u1", "u2"],
    visibility: "Public",
    author: { name: "Alex Rivera", _id: "u2" },
  },
  {
    _id: "p2",
    title: "Go HTTP Rate Limiter",
    description: "Token bucket rate limiter middleware.",
    codeSnippet: `func RateLimiter(rps float64) func(http.Handler) http.Handler {
    limiter := rate.NewLimiter(rate.Limit(rps), 5)
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            if !limiter.Allow() {
                http.Error(w, "Too Many Requests", 429)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}`,
    language: "Go",
    tags: ["http", "middleware"],
    likes: ["u1"],
    visibility: "Public",
    author: { name: "Alex Rivera", _id: "u2" },
  },
];

export default async function ProfilePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);

  let user = DEMO_USER;
  let userProjects: any[] = DEMO_PROJECTS;

  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const { default: dbConnect } = await import("@/lib/mongodb");
    const { default: Project } = await import("@/models/Project");
    const { default: User } = await import("@/models/User");

    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email }).lean() as any;
      if (dbUser) {
        user = dbUser;
        const dbProjects = await Project.find({ author: dbUser._id })
          .sort({ createdAt: -1 })
          .lean();
        userProjects = JSON.parse(JSON.stringify(dbProjects));
      }
    }
  } catch {
    // fallback to demo data
  }

  const stats = [
    { label: "Projects", value: userProjects.length },
    { label: "Likes", value: userProjects.reduce((acc, p) => acc + (p.likes?.length || 0), 0) },
    { label: "Languages", value: Array.from(new Set(userProjects.map((p) => p.language))).length },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover */}
        <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 mb-0" />

        {/* Profile info card */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm px-6 pt-16 pb-6 -mt-6 mx-2">
          <div className="absolute -mt-28 ml-0">
            <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-950 shadow-xl">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-violet-500 text-white">
                {user.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{user.email}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-md text-sm">
                {(user as any).bio || "No bio yet. Click Edit Profile to add one."}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {(user as any).githubId && (
                  <a
                    href={`https://github.com/${(user as any).githubId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Github size={13} />
                    {(user as any).githubId}
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
                <Settings size={13} /> Edit Profile
              </Button>
              <Button size="sm" className="rounded-xl gap-2 text-xs bg-blue-600 hover:bg-blue-700">
                <Link2 size={13} /> Share
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Canvas</h2>
          <a
            href={`/${lang}/upload`}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            + Upload New
          </a>
        </div>

        {userProjects.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Your canvas is empty</h3>
            <p className="text-slate-500 text-sm mt-1 mb-4">Share your code and let the world see your work.</p>
            <a
              href={`/${lang}/upload`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Upload First Project
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {userProjects.map((project) => (
              <ProjectCard
                key={project._id?.toString?.() || project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
