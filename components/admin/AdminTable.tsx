"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AdminTable = ({ data }: { data: any[] }) => {
  return (
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
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">{project.author.name}</span>
                <span className="text-xs text-slate-400">{project.author.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-md font-mono text-[10px]">
                {project.language}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge 
                className={project.visibility === 'Public' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-600'}
              >
                {project.visibility}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem className="gap-2">
                    <EyeOff size={14} /> Hide Project
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                    <Trash2 size={14} /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
