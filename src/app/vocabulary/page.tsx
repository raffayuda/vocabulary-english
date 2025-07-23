"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus, Search, Heart, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  partOfSpeech?: string;
  example?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isFavorite: boolean;
  masteryLevel: number;
  createdAt: string;
}

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [favoriteFilter, setFavoriteFilter] = useState("all");

  // Fetch vocabularies
  const fetchVocabularies = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);
      
      const response = await fetch(`/api/vocabulary?${params}`);
      if (response.ok) {
        const result = await response.json();
        let data = result.data || [];
        
        // Filter favorites on client side
        if (favoriteFilter === 'favorites') {
          data = data.filter((vocab: Vocabulary) => vocab.isFavorite);
        }
        
        setVocabularies(data);
      }
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      toast.error('Gagal memuat kosakata');
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/vocabulary/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentState })
      });

      if (response.ok) {
        setVocabularies(prev => 
          prev.map(vocab => 
            vocab.id === id 
              ? { ...vocab, isFavorite: !currentState }
              : vocab
          )
        );
        toast.success(currentState ? 'Dihapus dari favorit' : 'Ditambah ke favorit');
      }
    } catch {
      toast.error('Gagal mengupdate favorit');
    }
  };

  // Delete vocabulary
  const deleteVocabulary = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kosakata ini?')) return;
    
    try {
      const response = await fetch(`/api/vocabulary/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVocabularies(prev => prev.filter(vocab => vocab.id !== id));
        toast.success('Kosakata berhasil dihapus');
      }
    } catch {
      toast.error('Gagal menghapus kosakata');
    }
  };

  useEffect(() => {
    fetchVocabularies();
  }, [searchTerm, difficultyFilter, favoriteFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'Pemula';
      case 'INTERMEDIATE': return 'Menengah';
      case 'ADVANCED': return 'Lanjutan';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kosakata Saya</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Kelola koleksi kosakata bahasa Inggris Anda
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/vocabulary/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/vocabulary/new">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kata
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari kosakata..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tingkat Kesulitan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="BEGINNER">Pemula</SelectItem>
                <SelectItem value="INTERMEDIATE">Menengah</SelectItem>
                <SelectItem value="ADVANCED">Lanjutan</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter Favorit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kata</SelectItem>
                <SelectItem value="favorites">Hanya Favorit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary List */}
      {vocabularies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <p className="text-lg">
                  {searchTerm || difficultyFilter !== 'all' || favoriteFilter !== 'all'
                    ? 'Tidak ada kosakata yang sesuai dengan filter'
                    : 'Belum ada kosakata tersimpan'
                  }
                </p>
                <p>
                  {searchTerm || difficultyFilter !== 'all' || favoriteFilter !== 'all'
                    ? 'Coba ubah filter pencarian Anda'
                    : 'Mulai dengan menambahkan kata pertama Anda!'
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/vocabulary/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kosakata
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vocabularies.map((vocab) => (
            <Card key={vocab.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-lg sm:text-xl font-semibold capitalize break-words">{vocab.word}</h3>
                      {vocab.phonetic && (
                        <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded self-start">
                          {vocab.phonetic}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-base sm:text-lg break-words">{vocab.meaning}</p>
                    
                    {vocab.example && (
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-sm break-words">
                        &quot;{vocab.example}&quot;
                      </blockquote>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {vocab.partOfSpeech && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {vocab.partOfSpeech}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(vocab.difficulty)}`}>
                        {getDifficultyLabel(vocab.difficulty)}
                      </span>
                      
                      {/* Mastery Level */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Penguasaan:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 rounded-full mr-1 ${
                                level <= vocab.masteryLevel
                                  ? 'bg-yellow-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 sm:ml-4 flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                      <Link href={`/vocabulary/${vocab.id}/edit`}>
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleFavorite(vocab.id, vocab.isFavorite)}
                      className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${vocab.isFavorite ? "text-red-500 hover:text-red-700" : ""}`}
                    >
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${vocab.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteVocabulary(vocab.id)}
                      className="h-8 w-8 p-0 sm:h-9 sm:w-9 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
