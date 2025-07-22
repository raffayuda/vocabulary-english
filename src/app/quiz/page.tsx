import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Play, Target, Trophy, BarChart3 } from "lucide-react";

function QuizOptions() {
  const quizTypes = [
    {
      id: "multiple-choice",
      title: "Pilihan Ganda",
      description: "Pilih arti yang benar dari kata yang diberikan",
      icon: Target,
      difficulty: "Mudah",
      estimatedTime: "2-3 menit"
    },
    {
      id: "fill-blank",
      title: "Isi Kata",
      description: "Lengkapi kalimat dengan kata yang tepat",
      icon: Brain,
      difficulty: "Sedang",
      estimatedTime: "3-5 menit"
    },
    {
      id: "meaning-match",
      title: "Cocokkan Arti",
      description: "Cocokkan kata dengan artinya",
      icon: Trophy,
      difficulty: "Sedang",
      estimatedTime: "5-7 menit"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizTypes.map((quiz) => {
        const Icon = quiz.icon;
        return (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {quiz.difficulty} • {quiz.estimatedTime}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {quiz.description}
              </p>
              <Button className="w-full" asChild>
                <Link href={`/quiz/${quiz.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Mulai Quiz
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function QuizStats() {
  // Placeholder data
  const stats = {
    totalQuizzes: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTime: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Quiz</p>
              <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Jawaban Benar</p>
              <p className="text-2xl font-bold">{stats.correctAnswers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Akurasi</p>
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Waktu Rata-rata</p>
              <p className="text-2xl font-bold">{stats.averageTime}s</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quiz Kosakata</h1>
        <p className="text-muted-foreground">
          Uji pengetahuan kosakata Anda dengan berbagai jenis quiz
        </p>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Statistik Quiz Anda</h2>
        <Suspense fallback={<div>Loading stats...</div>}>
          <QuizStats />
        </Suspense>
      </div>

      {/* Quiz Options */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pilih Jenis Quiz</h2>
        <QuizOptions />
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tips untuk Quiz yang Efektif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Lakukan quiz secara rutin untuk meningkatkan daya ingat</li>
            <li>• Mulai dengan tingkat kesulitan yang sesuai kemampuan Anda</li>
            <li>• Jangan terburu-buru, pahami setiap kata dengan baik</li>
            <li>• Review kata-kata yang salah setelah quiz selesai</li>
            <li>• Tambahkan kata-kata sulit ke favorit untuk dipelajari lebih lanjut</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
