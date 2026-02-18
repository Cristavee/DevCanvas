import { getDictionary } from "@/lib/get-dictionary";
import { AdminTable } from "@/components/admin/AdminTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCode, ShieldAlert, BarChart3 } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

export default async function AdminPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  await dbConnect();

  // Fetch Stats
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const projects = await Project.find().populate('author', 'name email').sort({ createdAt: -1 });

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600" },
    { label: "Repositories", value: totalProjects, icon: FileCode, color: "text-emerald-600" },
    { label: "Reports", value: 0, icon: ShieldAlert, color: "text-rose-600" },
    { label: "Growth", value: "+12%", icon: BarChart3, color: "text-amber-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-slate-500">Manage your community and content moderation.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <stat.icon className={stat.color} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Moderation Table */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <AdminTable data={JSON.parse(JSON.stringify(projects))} />
      </div>
    </div>
  );
}
