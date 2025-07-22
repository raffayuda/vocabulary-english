import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BookOpen, 
  Brain,
  TrendingUp,
  Plus
} from "lucide-react";
import DashboardStatsClient from "@/components/dashboard/DashboardStats";

function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
            Quiz Interaktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Uji kemampuan Anda dengan quiz
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
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
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
    <div className="container mx-auto px-4 py-6 space-y-6 sm:space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Selamat datang di aplikasi pembelajaran kosakata Anda
        </p>
      </div>
      
      <DashboardStatsClient />
      
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Aksi Cepat</h2>
        <QuickActions />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Progress Pembelajaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Lihat progress pembelajaran Anda di statistik di atas. Terus tambahkan kosakata baru dan lakukan quiz untuk meningkatkan kemampuan!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
