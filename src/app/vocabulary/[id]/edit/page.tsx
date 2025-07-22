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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch vocabulary data
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await fetch(`/api/vocabulary/${id}`);
        if (response.ok) {
          const result = await response.json();
          const vocab = result.data;
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
          toast.error('Kosakata tidak ditemukan');
          router.push('/vocabulary');
        }
      } catch {
        console.error('Error fetching vocabulary');
        toast.error('Gagal memuat data kosakata');
        router.push('/vocabulary');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVocabulary();
    }
  }, [id, router]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.word.trim()) {
      newErrors.word = 'Kata wajib diisi';
    }

    if (!formData.meaning.trim()) {
      newErrors.meaning = 'Arti wajib diisi';
    }

    if (formData.phonetic && !formData.phonetic.match(/^[a-zA-Z\s\/\[\]əɪɛɔɑʊʌɜːɒθðʃʒŋ]+$/)) {
      newErrors.phonetic = 'Format phonetic tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki error pada form');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/vocabulary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: formData.word.trim(),
          meaning: formData.meaning.trim(),
          phonetic: formData.phonetic.trim() || null,
          partOfSpeech: formData.partOfSpeech || null,
          example: formData.example.trim() || null,
          difficulty: formData.difficulty,
          isFavorite: formData.isFavorite,
          masteryLevel: formData.masteryLevel
        }),
      });

      if (response.ok) {
        toast.success('Kosakata berhasil diperbarui!');
        router.push('/vocabulary');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Gagal memperbarui kosakata');
      }
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      toast.error('Terjadi kesalahan saat memperbarui');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vocabulary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Kosakata</h1>
          <p className="text-muted-foreground">
            Perbarui informasi kosakata &quot;{formData.word}&quot;
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kosakata</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Word */}
              <div className="space-y-2">
                <Label htmlFor="word">
                  Kata <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="word"
                  value={formData.word}
                  onChange={(e) => handleInputChange('word', e.target.value)}
                  placeholder="Masukkan kata dalam bahasa Inggris"
                  className={errors.word ? 'border-red-500' : ''}
                />
                {errors.word && (
                  <p className="text-sm text-red-500">{errors.word}</p>
                )}
              </div>

              {/* Phonetic */}
              <div className="space-y-2">
                <Label htmlFor="phonetic">Phonetic (Opsional)</Label>
                <Input
                  id="phonetic"
                  value={formData.phonetic}
                  onChange={(e) => handleInputChange('phonetic', e.target.value)}
                  placeholder="Contoh: /ˈhæpi/"
                  className={errors.phonetic ? 'border-red-500' : ''}
                />
                {errors.phonetic && (
                  <p className="text-sm text-red-500">{errors.phonetic}</p>
                )}
              </div>
            </div>

            {/* Meaning */}
            <div className="space-y-2">
              <Label htmlFor="meaning">
                Arti <span className="text-red-500">*</span>
              </Label>
              <Input
                id="meaning"
                value={formData.meaning}
                onChange={(e) => handleInputChange('meaning', e.target.value)}
                placeholder="Masukkan arti dalam bahasa Indonesia"
                className={errors.meaning ? 'border-red-500' : ''}
              />
              {errors.meaning && (
                <p className="text-sm text-red-500">{errors.meaning}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Part of Speech */}
              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">Jenis Kata (Opsional)</Label>
                <Select 
                  value={formData.partOfSpeech || "none"} 
                  onValueChange={(value) => handleInputChange('partOfSpeech', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak dipilih</SelectItem>
                    <SelectItem value="noun">Noun (Kata Benda)</SelectItem>
                    <SelectItem value="verb">Verb (Kata Kerja)</SelectItem>
                    <SelectItem value="adjective">Adjective (Kata Sifat)</SelectItem>
                    <SelectItem value="adverb">Adverb (Kata Keterangan)</SelectItem>
                    <SelectItem value="preposition">Preposition (Kata Depan)</SelectItem>
                    <SelectItem value="conjunction">Conjunction (Kata Sambung)</SelectItem>
                    <SelectItem value="pronoun">Pronoun (Kata Ganti)</SelectItem>
                    <SelectItem value="interjection">Interjection (Kata Seru)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => 
                    handleInputChange('difficulty', value)
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
            </div>

            {/* Example */}
            <div className="space-y-2">
              <Label htmlFor="example">Contoh Kalimat (Opsional)</Label>
              <Textarea
                id="example"
                value={formData.example}
                onChange={(e) => handleInputChange('example', e.target.value)}
                placeholder="Masukkan contoh penggunaan kata dalam kalimat"
                rows={3}
              />
            </div>

            {/* Mastery Level */}
            <div className="space-y-2">
              <Label htmlFor="masteryLevel">Tingkat Penguasaan</Label>
              <div className="space-y-2">
                <Select 
                  value={formData.masteryLevel.toString()} 
                  onValueChange={(value) => handleInputChange('masteryLevel', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Baru Mengenal</SelectItem>
                    <SelectItem value="2">2 - Sedikit Paham</SelectItem>
                    <SelectItem value="3">3 - Cukup Paham</SelectItem>
                    <SelectItem value="4">4 - Paham dengan Baik</SelectItem>
                    <SelectItem value="5">5 - Sangat Menguasai</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Level saat ini:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-full mr-1 ${
                          level <= formData.masteryLevel
                            ? 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="favorite"
                checked={formData.isFavorite}
                onCheckedChange={(checked) => handleInputChange('isFavorite', checked)}
              />
              <Label 
                htmlFor="favorite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tandai sebagai favorit
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={saving}
                className="flex-1 md:flex-initial"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                asChild
                className="flex-1 md:flex-initial"
              >
                <Link href="/vocabulary">
                  Batal
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
