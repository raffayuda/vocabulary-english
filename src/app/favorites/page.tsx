"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Heart, Search, Edit, Trash2, BookOpen, Target } from "lucide-react";
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch favorite vocabularies
  const fetchFavorites = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('favorites', 'true');
      
      const response = await fetch(`/api/vocabulary?${params}`);
      if (response.ok) {
        const result = await response.json();
        const favoriteData = (result.data || []).filter((vocab: Vocabulary) => vocab.isFavorite);
        setFavorites(favoriteData);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Gagal memuat favorit');
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (id: string) => {
    try {
      const response = await fetch(`/api/vocabulary/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: false })
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(vocab => vocab.id !== id));
        toast.success('Dihapus dari favorit');
      }
    } catch (error) {
      toast.error('Gagal menghapus dari favorit');
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
        setFavorites(prev => prev.filter(vocab => vocab.id !== id));
        toast.success('Kosakata berhasil dihapus');
      }
    } catch (error) {
      toast.error('Gagal menghapus kosakata');
    }
  };

  // Start quiz with favorites
  const startFavoritesQuiz = () => {
    if (favorites.length < 4) {
      toast.error('Minimal 4 kosakata favorit diperlukan untuk quiz');
      return;
    }
    // Redirect to quiz page with favorite filter
    window.location.href = '/quiz?favorites=true';
  };

  useEffect(() => {
    fetchFavorites();
  }, [searchTerm]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kosakata Favorit</h1>
          <p className="text-muted-foreground">
            Koleksi kosakata yang Anda tandai sebagai favorit
          </p>
        </div>
        
        <div className="flex gap-2">
          {favorites.length >= 4 && (
            <Button onClick={startFavoritesQuiz} variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Quiz Favorit
            </Button>
          )}
          <Button asChild>
            <Link href="/vocabulary">
              <BookOpen className="h-4 w-4 mr-2" />
              Kelola Kosakata
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari favorit..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <div>
                <p className="text-sm text-muted-foreground">Total Favorit</p>
                <p className="text-2xl font-bold">{favorites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata Penguasaan</p>
                <p className="text-2xl font-bold">
                  {favorites.length > 0 
                    ? Math.round(favorites.reduce((acc, v) => acc + v.masteryLevel, 0) / favorites.length * 20)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Paling Banyak</p>
                <p className="text-2xl font-bold">
                  {favorites.length > 0 ? (() => {
                    const counts = favorites.reduce((acc, v) => {
                      acc[v.difficulty] = (acc[v.difficulty] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const most = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
                    return getDifficultyLabel(most?.[0] || 'BEGINNER');
                  })() : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="text-muted-foreground">
                <p className="text-lg">
                  {searchTerm 
                    ? 'Tidak ada favorit yang sesuai dengan pencarian'
                    : 'Belum ada kosakata favorit'
                  }
                </p>
                <p>
                  {searchTerm 
                    ? 'Coba kata kunci pencarian yang berbeda'
                    : 'Tandai kosakata sebagai favorit untuk mempelajarinya lebih intensif'
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/vocabulary">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Jelajahi Kosakata
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {favorites.map((vocab) => (
            <Card key={vocab.id} className="hover:shadow-md transition-shadow border-l-4 border-l-red-400">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold capitalize">{vocab.word}</h3>
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                      {vocab.phonetic && (
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                          {vocab.phonetic}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-lg">{vocab.meaning}</p>
                    
                    {vocab.example && (
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-sm">
                        "{vocab.example}"
                      </blockquote>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
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
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/vocabulary/${vocab.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFromFavorites(vocab.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteVocabulary(vocab.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tips Belajar Favorit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Review kosakata favorit secara rutin setiap hari</li>
              <li>• Buat kalimat sendiri menggunakan kata-kata favorit</li>
              <li>• Lakukan quiz khusus favorit untuk menguji penguasaan</li>
              <li>• Praktikkan penggunaan kata dalam percakapan sehari-hari</li>
              <li>• Catat progress penguasaan setiap kata favorit</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
