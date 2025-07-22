import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil statistik dasar
    const [
      total,
      mastered,
      favorites,
      beginnerCount,
      intermediateCount,
      advancedCount,
    ] = await Promise.all([
      prisma.vocabulary.count(),
      prisma.vocabulary.count({
        where: { masteryLevel: { gte: 4 } } // Dianggap dikuasai jika mastery level >= 4
      }),
      prisma.vocabulary.count({
        where: { isFavorite: true }
      }),
      prisma.vocabulary.count({
        where: { difficulty: 'BEGINNER' }
      }),
      prisma.vocabulary.count({
        where: { difficulty: 'INTERMEDIATE' }
      }),
      prisma.vocabulary.count({
        where: { difficulty: 'ADVANCED' }
      }),
    ]);

    // Hitung quiz hari ini (placeholder)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayQuizCount = await prisma.quizResult.count({
      where: {
        attemptedAt: {
          gte: todayStart
        }
      }
    });

    // Hitung streak (placeholder - bisa dikembangkan lebih lanjut)
    const streak = 0; // Implementasi streak counting bisa ditambahkan nanti

    const stats = {
      total,
      mastered,
      learning: total - mastered,
      favorites,
      todayStudied: todayQuizCount,
      streak,
      byDifficulty: {
        beginner: beginnerCount,
        intermediate: intermediateCount,
        advanced: advancedCount,
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}
