"use client";
import React, { useState } from 'react';
import { useUploadModal } from '@/hooks/use-upload-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';

export const UploadModal = () => {
  const { isOpen, onClose } = useUploadModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description') ?? '',
      language: formData.get('language'),
      codeSnippet: formData.get('code'),
      visibility: 'Public',
    };
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onClose();
        router.refresh();
      }
    } catch {
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Creation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <Input name="title" placeholder="Project Title" required className="rounded-xl" />
          <Input name="language" placeholder="Language (TypeScript, Python...)" required className="rounded-xl" />
          <Textarea name="description" placeholder="Describe your project..." className="rounded-xl min-h-[80px]" />
          <Textarea name="code" placeholder="// Paste your code here..." required className="rounded-xl font-mono min-h-[140px]" />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl"
          >
            {loading ? "Publishing..." : "Publish to DevCanvas"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
