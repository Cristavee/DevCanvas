import { getDictionary } from "@/lib/get-dictionary";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { ProjectCard } from "@/components/ProjectCard";
import Project from "@/models/Project";
import dbConnect from "@/lib/mongodb";

export default async function SearchPage({ 
  params: { lang },
  searchParams 
}: { 
  params: { lang: string },
  searchParams: { q?: string, langTag?: string } 
}) {
  const dict = await getDictionary(lang);
  await dbConnect();

  // Basic MongoDB search query
  const query = searchParams.q 
    ? { title: { $regex: searchParams.q, $options: 'i' }, visibility: 'Public' }
    : { visibility: 'Public' };

  const results = await Project.find(query).populate('author', 'name').limit(12);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-24">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder={dict.search.placeholder}
            className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FilterDrawer dict={dict} />
      </div>

      {searchParams.q && (
        <p className="mb-6 text-slate-500 italic">
          {dict.search.results} "{searchParams.q}"
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((project) => (
          <ProjectCard 
            key={project._id.toString()} 
            project={JSON.parse(JSON.stringify(project))} 
          />
        ))}
      </div>
    </div>
  );
}
