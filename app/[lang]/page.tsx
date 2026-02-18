import { getDictionary } from '@/lib/get-dictionary';
import { ProjectCard } from '@/components/ProjectCard';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export default async function HomePage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  await dbConnect();
  
  // Fetch latest public projects
  const projects = await Project.find({ visibility: 'Public' })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('author', 'name avatar');

  return (
    <main className="min-h-screen pb-20 pt-6 px-4 max-w-7xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {dict.home.heroTitle}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {dict.home.heroSubtitle}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project._id.toString()} 
            project={JSON.parse(JSON.stringify(project))} 
          />
        ))}
      </section>
    </main>
  );
}
