import { Vocabulary, Category, QuizResult, Level, QuizType } from '@prisma/client'

// Type untuk Vocabulary dengan relasi
export type VocabularyWithRelations = Vocabulary & {
  categories?: Category[]
  quizResults?: QuizResult[]
}

// Type untuk form input vocabulary
export type VocabularyFormData = {
  word: string
  meaning: string
  phonetic?: string
  partOfSpeech?: string
  example?: string
  difficulty: Level
  categoryIds?: string[]
}

// Type untuk quiz
export type QuizQuestion = {
  id: string
  word: string
  correctAnswer: string
  options: string[]
  type: QuizType
}

// Type untuk statistik
export type VocabularyStats = {
  total: number
  mastered: number
  learning: number
  favorites: number
  byDifficulty: {
    beginner: number
    intermediate: number
    advanced: number
  }
}

// Export types dari Prisma
export type { Vocabulary, Category, QuizResult, Level, QuizType }
