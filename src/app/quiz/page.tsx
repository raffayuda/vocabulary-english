"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CheckCircle, XCircle, RotateCcw, Target, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

interface QuizQuestion {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
  phonetic?: string;
  example?: string;
}

export default function QuizPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{question: string, selected: string, correct: string, isCorrect: boolean}[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'all' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('all');
  const [loading, setLoading] = useState(false);

  // Fetch vocabularies
  const fetchVocabularies = async () => {
    try {
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      
      const response = await fetch(`/api/vocabulary?${params}`);
      if (response.ok) {
        const result = await response.json();
        setVocabularies(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      toast.error('Gagal memuat kosakata');
    }
  };

  // Generate quiz questions
  const generateQuiz = (vocabs: Vocabulary[], count: number = 10): QuizQuestion[] => {
    if (vocabs.length < 4) {
      toast.error('Minimal 4 kosakata diperlukan untuk quiz');
      return [];
    }

    const shuffled = [...vocabs].sort(() => Math.random() - 0.5);
    const quizQuestions: QuizQuestion[] = [];

    for (let i = 0; i < Math.min(count, vocabs.length); i++) {
      const question = shuffled[i];
      const wrongAnswers = vocabs
        .filter(v => v.id !== question.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.meaning);

      const options = [question.meaning, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);

      quizQuestions.push({
        id: question.id,
        word: question.word,
        correctAnswer: question.meaning,
        options,
        phonetic: question.phonetic,
        example: question.example
      });
    }

    return quizQuestions;
  };

  // Start quiz
  const startQuiz = async () => {
    setLoading(true);
    await fetchVocabularies();
    
    const filteredVocabs = difficulty === 'all' 
      ? vocabularies 
      : vocabularies.filter(v => v.difficulty === difficulty);
    
    if (filteredVocabs.length < 4) {
      toast.error(`Minimal 4 kosakata ${difficulty === 'all' ? '' : 'tingkat ' + difficulty.toLowerCase()} diperlukan untuk quiz`);
      setLoading(false);
      return;
    }

    const quiz = generateQuiz(filteredVocabs);
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setQuizStarted(true);
    setShowResult(false);
    setSelectedAnswer("");
    setLoading(false);
  };

  // Submit answer
  const submitAnswer = () => {
    if (!selectedAnswer) return;

    const currentQuestion = currentQuiz[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      question: currentQuestion.word,
      selected: selectedAnswer,
      correct: currentQuestion.correctAnswer,
      isCorrect
    }]);

    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      // Quiz finished
      setShowResult(true);
      saveQuizResult(isCorrect ? score + 1 : score);
    }
  };

  // Save quiz result
  const saveQuizResult = async (finalScore: number) => {
    try {
      const vocabularyResults = answers.map(answer => ({
        vocabularyId: currentQuiz.find(q => q.word === answer.question)?.id || '',
        isCorrect: answer.isCorrect
      }));

      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabularyResults })
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer("");
    setCurrentQuiz([]);
  };

  useEffect(() => {
    fetchVocabularies();
  }, [difficulty]);

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Kosakata</h1>
          <p className="text-muted-foreground text-lg">
            Uji penguasaan kosakata bahasa Inggris Anda
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Pengaturan Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tingkat Kesulitan</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={difficulty === 'all' ? 'default' : 'outline'}
                  onClick={() => setDifficulty('all')}
                  className="w-full"
                >
                  Semua
                </Button>
                <Button 
                  variant={difficulty === 'BEGINNER' ? 'default' : 'outline'}
                  onClick={() => setDifficulty('BEGINNER')}
                  className="w-full"
                >
                  Pemula
                </Button>
                <Button 
                  variant={difficulty === 'INTERMEDIATE' ? 'default' : 'outline'}
                  onClick={() => setDifficulty('INTERMEDIATE')}
                  className="w-full"
                >
                  Menengah
                </Button>
                <Button 
                  variant={difficulty === 'ADVANCED' ? 'default' : 'outline'}
                  onClick={() => setDifficulty('ADVANCED')}
                  className="w-full"
                >
                  Lanjutan
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {vocabularies.length > 0 ? (
                <>
                  {difficulty === 'all' 
                    ? `${vocabularies.length} kosakata tersedia`
                    : `${vocabularies.filter(v => v.difficulty === difficulty).length} kosakata tingkat ${difficulty.toLowerCase()} tersedia`
                  }
                </>
              ) : (
                'Memuat kosakata...'
              )}
            </div>

            <Button 
              onClick={startQuiz} 
              className="w-full" 
              size="lg"
              disabled={loading || vocabularies.length < 4}
            >
              <Target className="h-5 w-5 mr-2" />
              {loading ? 'Memuat...' : 'Mulai Quiz'}
            </Button>

            <div className="text-center">
              <Button variant="ghost" asChild>
                <Link href="/vocabulary">
                  Kelola Kosakata Dulu
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / currentQuiz.length) * 100);
    const isGoodScore = percentage >= 70;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
            isGoodScore ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Selesai!</h1>
          <p className="text-muted-foreground">
            Skor Anda: {score} dari {currentQuiz.length} ({percentage}%)
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Hasil Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{answer.question}</p>
                  <p className={`text-sm ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Jawaban Anda: {answer.selected}
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-sm text-green-600">
                      Jawaban Benar: {answer.correct}
                    </p>
                  )}
                </div>
                <div className={`flex-shrink-0 ml-4 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {answer.isCorrect ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button onClick={resetQuiz} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Quiz Lagi
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard">
                  Kembali ke Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentQuiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Progress</h1>
          <span className="text-muted-foreground">
            {currentQuestionIndex + 1} dari {currentQuiz.length}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Apa arti dari kata ini?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-primary capitalize">
              {currentQuestion.word}
            </h2>
            {currentQuestion.phonetic && (
              <p className="text-muted-foreground text-lg">
                /{currentQuestion.phonetic}/
              </p>
            )}
            {currentQuestion.example && (
              <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground mt-4">
                "{currentQuestion.example}"
              </blockquote>
            )}
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="h-auto p-4 text-left justify-start"
                onClick={() => setSelectedAnswer(option)}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          <Button 
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            {currentQuestionIndex < currentQuiz.length - 1 ? 'Lanjut' : 'Selesai'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
