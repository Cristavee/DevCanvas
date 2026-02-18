"use client";
import React from 'react';
import { useUploadModal } from '@/hooks/use-upload-modal';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const UploadModal = () => {
  const { isOpen, onClose } = useUploadModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Creation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input 
            placeholder="Project Title" 
            className="rounded-xl border-slate-200 dark:border-slate-800 focus:ring-blue-500"
          />
          <Textarea 
            placeholder="Describe your masterpiece..." 
            className="rounded-xl min-h-[120px] border-slate-200 dark:border-slate-800"
          />
          <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
            <span className="text-sm">Drag & drop your code snippet image</span>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Publish to DevCanvas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
