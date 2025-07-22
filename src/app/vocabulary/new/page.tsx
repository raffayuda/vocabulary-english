"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewVocabularyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    phonetic: "",
    partOfSpeech: "",
    example: "",
    difficulty: "BEGINNER" as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.word.trim() || !formData.meaning.trim()) {
      toast.error("Kata dan arti harus diisi!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/vocabulary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Kosakata berhasil ditambahkan!");
        router.push("/vocabulary");
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal menambahkan kosakata");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vocabulary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Kosakata Baru</h1>
          <p className="text-muted-foreground">
            Tambahkan kata bahasa Inggris baru ke koleksi Anda
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kosakata</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="word">Kata (Bahasa Inggris) *</Label>
                <Input
                  id="word"
                  value={formData.word}
                  onChange={(e) => handleInputChange("word", e.target.value)}
                  placeholder="Contoh: beautiful"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phonetic">Pengucapan (Phonetic)</Label>
                <Input
                  id="phonetic"
                  value={formData.phonetic}
                  onChange={(e) => handleInputChange("phonetic", e.target.value)}
                  placeholder="Contoh: /ˈbjuːtɪfʊl/"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meaning">Arti (Bahasa Indonesia) *</Label>
              <Input
                id="meaning"
                value={formData.meaning}
                onChange={(e) => handleInputChange("meaning", e.target.value)}
                placeholder="Contoh: indah, cantik"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">Jenis Kata</Label>
                <Select 
                  value={formData.partOfSpeech}
                  onValueChange={(value) => handleInputChange("partOfSpeech", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noun">Noun (Kata Benda)</SelectItem>
                    <SelectItem value="verb">Verb (Kata Kerja)</SelectItem>
                    <SelectItem value="adjective">Adjective (Kata Sifat)</SelectItem>
                    <SelectItem value="adverb">Adverb (Kata Keterangan)</SelectItem>
                    <SelectItem value="preposition">Preposition (Kata Depan)</SelectItem>
                    <SelectItem value="conjunction">Conjunction (Kata Sambung)</SelectItem>
                    <SelectItem value="interjection">Interjection (Kata Seru)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select 
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Pemula</SelectItem>
                    <SelectItem value="INTERMEDIATE">Menengah</SelectItem>
                    <SelectItem value="ADVANCED">Lanjutan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Contoh Kalimat</Label>
              <Input
                id="example"
                value={formData.example}
                onChange={(e) => handleInputChange("example", e.target.value)}
                placeholder="Contoh: She is a beautiful woman."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Menyimpan..." : "Simpan Kosakata"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push("/vocabulary")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
