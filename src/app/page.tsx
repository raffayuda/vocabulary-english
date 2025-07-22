import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BookOpen, 
  Brain, 
  Heart, 
  TrendingUp,
  Plus,
  Target,
  Trophy,
  Clock
} from "lucide-react";

// Placeholder untuk data statistik
const stats = {
  total: 0,
  mastered: 0,
  learning: 0,
  favorites: 0,
  todayStudied: 0,
  streak: 0
};

function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kosakata</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            kata tersimpan
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dikuasai</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mastered}</div>
          <p className="text-xs text-muted-foreground">
            kata dikuasai
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorit</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.favorites}</div>
          <p className="text-xs text-muted-foreground">
            kata favorit
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Streak Hari Ini</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.streak}</div>
          <p className="text-xs text-muted-foreground">
            hari berturut-turut
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Kosakata Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan kata baru ke koleksi Anda
          </p>
          <Button asChild className="w-full">
            <Link href="/vocabulary/new">
              Tambah Kata
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Mulai Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Uji pengetahuan kosakata Anda
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/quiz">
              Mulai Quiz
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Review Kosakata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tinjau semua kosakata yang telah dipelajari
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/vocabulary">
              Lihat Semua
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di aplikasi pembelajaran kosakata Anda
        </p>
      </div>
      
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Aksi Cepat</h2>
        <QuickActions />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Pembelajaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Kata yang Dikuasai</span>
                <span>{stats.mastered}/{stats.total}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: stats.total > 0 ? `${(stats.mastered / stats.total) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {stats.total === 0 
                ? "Belum ada kosakata. Mulai dengan menambah kata pertama Anda!" 
                : `Terus tingkatkan! Anda sudah menguasai ${stats.mastered} dari ${stats.total} kata.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
