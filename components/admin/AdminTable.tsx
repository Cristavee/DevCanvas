"use client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, EyeOff, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const AdminTable = ({ data: initialData }: { data: any[] }) => {
  const [data, setData] = useState(initialData);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    // Optimistic update
    setData(prev => prev.filter(p => p._id !== id));
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch {}
  };

  const handleToggleVisibility = async (id: string, currentVisibility: string) => {
    const newVisibility = currentVisibility === "Public" ? "Private" : "Public";
    setData(prev => prev.map(p => p._id === id ? { ...p, visibility: newVisibility } : p));
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });
    } catch {}
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        No projects found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900">
          <TableRow>
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold">Author</TableHead>
            <TableHead className="font-semibold">Language</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => (
            <TableRow key={project._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
              <TableCell className="font-medium max-w-[200px] truncate">{project.title}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{project.author?.name || "Unknown"}</span>
                  <span className="text-xs text-slate-400">{project.author?.email || ""}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="rounded-md font-mono text-[10px]">
                  {project.language}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={project.visibility === "Public"
                    ? "bg-emerald-500/10 text-emerald-600 border-0 hover:bg-emerald-500/20"
                    : "bg-slate-500/10 text-slate-600 border-0 hover:bg-slate-500/20"}
                >
                  {project.visibility}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => handleToggleVisibility(project._id, project.visibility)}
                    >
                      {project.visibility === "Public" ? (
                        <><EyeOff size={14} /> Make Private</>
                      ) : (
                        <><Eye size={14} /> Make Public</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 size={14} /> Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
