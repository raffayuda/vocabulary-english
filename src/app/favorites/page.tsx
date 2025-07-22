import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Heart, Search, BookOpen, Plus } from "lucide-react";

// Placeholder untuk data favorites
const favoritesList: any[] = [];

function FavoritesList() {
  if (favoritesList.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="space-y-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Belum ada kata favorit</h3>
              <p className="text-muted-foreground">
                Tandai kata-kata yang ingin Anda fokuskan sebagai favorit
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/vocabulary">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lihat Semua Kosakata
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/vocabulary/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kata Baru
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {favoritesList.map((vocab) => (
        <Card key={vocab.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{vocab.word}</h3>
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
                  <span className={`text-xs px-2 py-1 rounded ${
                    vocab.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                    vocab.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vocab.difficulty === 'BEGINNER' ? 'Pemula' :
                     vocab.difficulty === 'INTERMEDIATE' ? 'Menengah' : 'Lanjutan'}
                  </span>
                  
                  {/* Mastery Level */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Penguasaan:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full mr-1 ${
                            level <= (vocab.masteryLevel || 0)
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
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus Favorit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FavoritesStats() {
  const stats = {
    total: favoritesList.length,
    mastered: favoritesList.filter(v => (v.masteryLevel || 0) >= 4).length,
    beginner: favoritesList.filter(v => v.difficulty === 'BEGINNER').length,
    intermediate: favoritesList.filter(v => v.difficulty === 'INTERMEDIATE').length,
    advanced: favoritesList.filter(v => v.difficulty === 'ADVANCED').length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-4 text-center">
          <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Favorit</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-yellow-600 font-bold text-sm">★</span>
          </div>
          <p className="text-2xl font-bold">{stats.mastered}</p>
          <p className="text-sm text-muted-foreground">Dikuasai</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 font-bold text-xs">B</span>
          </div>
          <p className="text-2xl font-bold">{stats.beginner}</p>
          <p className="text-sm text-muted-foreground">Pemula</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-yellow-600 font-bold text-xs">I</span>
          </div>
          <p className="text-2xl font-bold">{stats.intermediate}</p>
          <p className="text-sm text-muted-foreground">Menengah</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-600 font-bold text-xs">A</span>
          </div>
          <p className="text-2xl font-bold">{stats.advanced}</p>
          <p className="text-sm text-muted-foreground">Lanjutan</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            Kosakata Favorit
          </h1>
          <p className="text-muted-foreground">
            Kumpulan kata-kata yang Anda tandai sebagai favorit untuk dipelajari lebih intensif
          </p>
        </div>
      </div>

      {/* Stats */}
      <FavoritesStats />

      {/* Search */}
      {favoritesList.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari di favorit..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites List */}
      <Suspense fallback={<div>Loading favorites...</div>}>
        <FavoritesList />
      </Suspense>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Tips Menggunakan Favorit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Tandai kata-kata yang sulit atau sering lupa sebagai favorit</li>
            <li>• Review kata favorit secara rutin setiap hari</li>
            <li>• Gunakan fitur quiz khusus untuk kata-kata favorit</li>
            <li>• Hapus dari favorit setelah Anda benar-benar menguasainya</li>
            <li>• Kelompokkan favorit berdasarkan tema atau tingkat kesulitan</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
