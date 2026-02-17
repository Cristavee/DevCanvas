"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      language: formData.get('language'),
      codeSnippet: formData.get('code'),
      // Logic untuk convert file gambar ke base64 bisa ditambahkan di sini
    };

    // Contoh hit ke API yang kita buat tadi
    const res = await fetch('/api/projects/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Proyek berhasil diunggah!");
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Upload Karya Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Proyek</label>
              <Input name="title" placeholder="Contoh: Awesome Dashboard" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bahasa Pemrograman</label>
              <Input name="language" placeholder="TypeScript, Python, etc." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Potongan Kode (Snippet)</label>
              <Textarea name="code" className="font-mono" placeholder="Paste kode terbaikmu di sini..." required />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Sedang Mengunggah..." : "Publish ke DevCanvas"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
