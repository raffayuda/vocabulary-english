"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  word: string;
  meaning: string;
  phonetic: string;
  partOfSpeech: string;
  example: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isFavorite: boolean;
  masteryLevel: number;
}

export default function EditVocabularyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    word: '',
    meaning: '',
    phonetic: '',
    partOfSpeech: '',
    example: '',
    difficulty: 'BEGINNER',
    isFavorite: false,
    masteryLevel: 1
  });

  // Fetch vocabulary data
  useEffect(() => {
    if (!id) return;

    const fetchVocabulary = async () => {
      try {
        console.log('Fetching vocabulary with ID:', id);
        const response = await fetch(`/api/vocabulary/${id}`);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
          const vocab = data.data;
          setFormData({
            word: vocab.word || '',
            meaning: vocab.meaning || '',
            phonetic: vocab.phonetic || '',
            partOfSpeech: vocab.partOfSpeech || '',
            example: vocab.example || '',
            difficulty: vocab.difficulty || 'BEGINNER',
            isFavorite: vocab.isFavorite || false,
            masteryLevel: vocab.masteryLevel || 1
          });
        } else {
          console.error('API Error:', data);
          toast.error(data.error || 'Kosakata tidak ditemukan');
          router.push('/vocabulary');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Gagal memuat data kosakata');
        router.push('/vocabulary');
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [id, router]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.word.trim()) {
      toast.error('Kata tidak boleh kosong');
      return false;
    }
    if (!formData.meaning.trim()) {
      toast.error('Arti tidak boleh kosong');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/vocabulary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Kosakata berhasil diperbarui!');
        router.push('/vocabulary');
      } else {
        toast.error(data.error || 'Gagal memperbarui kosakata');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuat data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/vocabulary">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Kosakata</h1>
            <p className="text-muted-foreground">
              Perbarui informasi kosakata yang sudah ada
            </p>
          </div>
        </div>

        {/* Form */}
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
                    placeholder="Masukkan kata dalam bahasa Inggris"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meaning">Arti (Bahasa Indonesia) *</Label>
                  <Input
                    id="meaning"
                    value={formData.meaning}
                    onChange={(e) => handleInputChange("meaning", e.target.value)}
                    placeholder="Masukkan arti dalam bahasa Indonesia"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phonetic">Fonetik (Opsional)</Label>
                  <Input
                    id="phonetic"
                    value={formData.phonetic}
                    onChange={(e) => handleInputChange("phonetic", e.target.value)}
                    placeholder="Contoh: /ˈhæpi/"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partOfSpeech">Jenis Kata (Opsional)</Label>
                  <Input
                    id="partOfSpeech"
                    value={formData.partOfSpeech}
                    onChange={(e) => handleInputChange("partOfSpeech", e.target.value)}
                    placeholder="Contoh: noun, verb, adjective"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="example">Contoh Kalimat (Opsional)</Label>
                <Textarea
                  id="example"
                  value={formData.example}
                  onChange={(e) => handleInputChange("example", e.target.value)}
                  placeholder="Masukkan contoh penggunaan kata dalam kalimat"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tingkat Kesulitan</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => 
                      handleInputChange("difficulty", value)
                    }
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
                <div className="space-y-2">
                  <Label>Tingkat Penguasaan (1-5)</Label>
                  <Select
                    value={formData.masteryLevel.toString()}
                    onValueChange={(value) => 
                      handleInputChange("masteryLevel", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Baru Mengenal</SelectItem>
                      <SelectItem value="2">2 - Sedikit Paham</SelectItem>
                      <SelectItem value="3">3 - Cukup Paham</SelectItem>
                      <SelectItem value="4">4 - Paham</SelectItem>
                      <SelectItem value="5">5 - Sangat Paham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorite"
                  checked={formData.isFavorite}
                  onCheckedChange={(checked) => 
                    handleInputChange("isFavorite", checked as boolean)
                  }
                />
                <Label htmlFor="favorite">Tandai sebagai favorit</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
                <Link href="/vocabulary">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
