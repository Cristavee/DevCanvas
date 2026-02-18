import { getDictionary } from "@/lib/get-dictionary";
import { ProjectCard } from "@/components/ProjectCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Github } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export default async function ProfilePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  const session = await getServerSession(); // Assuming you have your auth config
  await dbConnect();

  // In a real app, you'd fetch the profile user ID from the URL, not just the session
  const user = await User.findOne({ email: session?.user?.email });
  const userProjects = await Project.find({ author: user?._id }).sort({ createdAt: -1 });

  if (!user) return <div>User not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-8 mb-10 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-xl">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-3xl font-bold bg-slate-100 dark:bg-slate-800">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{user.bio || "No bio yet."}</p>
          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            <Button variant="outline" className="rounded-xl gap-2">
              <Github size={16} /> GitHub
            </Button>
            <Button variant="outline" className="rounded-xl gap-2">
              <Settings size={16} /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">My Canvas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProjects.map((project) => (
          <ProjectCard 
            key={project._id.toString()} 
            project={JSON.parse(JSON.stringify(project))} 
          />
        ))}
        {userProjects.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No projects uploaded yet. Click the [+] button to start!
          </div>
        )}
      </div>
    </div>
  );
}
