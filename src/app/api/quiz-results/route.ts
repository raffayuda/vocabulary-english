import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { vocabularyResults } = await request.json();

    // vocabularyResults should be array of { vocabularyId: string, isCorrect: boolean }
    const results = await Promise.all(
      vocabularyResults.map((result: { vocabularyId: string, isCorrect: boolean }) =>
        prisma.quizResult.create({
          data: {
            vocabularyId: result.vocabularyId,
            isCorrect: result.isCorrect,
            quizType: 'MULTIPLE_CHOICE'
          }
        })
      )
    );

    return NextResponse.json({ 
      message: 'Quiz results saved successfully',
      data: results 
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const results = await prisma.quizResult.findMany({
      include: {
        vocabulary: true
      },
      orderBy: { attemptedAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}
