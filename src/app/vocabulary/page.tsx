import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";

// Placeholder untuk data vocabulary
const vocabularyList: any[] = [];

function VocabularyList() {
  if (vocabularyList.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg">Belum ada kosakata tersimpan</p>
              <p>Mulai dengan menambahkan kata pertama Anda!</p>
            </div>
            <Button asChild>
              <Link href="/vocabulary/new">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kosakata Pertama
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {vocabularyList.map((vocab) => (
        <Card key={vocab.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{vocab.word}</h3>
                  {vocab.phonetic && (
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {vocab.phonetic}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{vocab.meaning}</p>
                {vocab.example && (
                  <p className="text-sm italic border-l-2 border-muted pl-3">
                    "{vocab.example}"
                  </p>
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
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  ♥
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kosakata Saya</h1>
          <p className="text-muted-foreground">
            Kelola koleksi kosakata bahasa Inggris Anda
          </p>
        </div>
        
        <Button asChild>
          <Link href="/vocabulary/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kata
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari kosakata..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary List */}
      <Suspense fallback={<div>Loading vocabulary...</div>}>
        <VocabularyList />
      </Suspense>
    </div>
  );
}
