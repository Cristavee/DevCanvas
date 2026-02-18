import { getDictionary } from "@/lib/get-dictionary";
import { AdminTable } from "@/components/admin/AdminTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCode, ShieldAlert, BarChart3 } from "lucide-react";

const DEMO_PROJECTS = [
  { _id: "1", title: "Animated Gradient Button", language: "TypeScript", visibility: "Public", author: { name: "Sarah Chen", email: "sarah@dev.io" }, createdAt: new Date().toISOString() },
  { _id: "2", title: "FastAPI Auth Middleware", language: "Python", visibility: "Public", author: { name: "Alex Rivera", email: "alex@dev.io" }, createdAt: new Date().toISOString() },
  { _id: "3", title: "Rust File Processor", language: "Rust", visibility: "Public", author: { name: "Marcus Wei", email: "marcus@dev.io" }, createdAt: new Date().toISOString() },
  { _id: "4", title: "useDebounce Hook", language: "TypeScript", visibility: "Private", author: { name: "Priya Sharma", email: "priya@dev.io" }, createdAt: new Date().toISOString() },
];

export default async function AdminPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);

  let projects = DEMO_PROJECTS;
  let totalUsers = 4;
  let totalProjects = 8;

  try {
    const { default: dbConnect } = await import("@/lib/mongodb");
    const { default: Project } = await import("@/models/Project");
    const { default: User } = await import("@/models/User");
    await dbConnect();
    totalUsers = await User.countDocuments();
    totalProjects = await Project.countDocuments();
    const dbProjects = await Project.find().populate("author", "name email").sort({ createdAt: -1 }).lean();
    if (dbProjects.length > 0) projects = JSON.parse(JSON.stringify(dbProjects));
  } catch {
    // use demo data
  }

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Total Projects", value: totalProjects, icon: FileCode, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Reports", value: 0, icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: "Growth", value: "+12%", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage community and content moderation.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={16} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Signups */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Recent Developer Signups</h2>
        <div className="space-y-3">
          {["Sarah Chen", "Alex Rivera", "Marcus Wei", "Priya Sharma"].map((name, i) => (
            <div key={name} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-900 last:border-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800 dark:text-white">{name}</div>
                <div className="text-xs text-slate-500">{i + 1} day{i > 0 ? "s" : ""} ago</div>
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white">All Projects</h2>
        </div>
        <AdminTable data={projects} />
      </div>
    </div>
  );
}
