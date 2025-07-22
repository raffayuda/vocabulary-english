import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema validasi untuk vocabulary
const vocabularySchema = z.object({
  word: z.string().min(1, "Kata harus diisi").trim(),
  meaning: z.string().min(1, "Arti harus diisi").trim(),
  phonetic: z.string().optional(),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
});

// GET - Mengambil semua vocabulary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const [vocabularies, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: {
            include: {
              category: true
            }
          },
          _count: {
            select: {
              quizResults: true
            }
          }
        }
      }),
      prisma.vocabulary.count({ where })
    ]);

    return NextResponse.json({
      data: vocabularies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vocabularies:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kosakata' },
      { status: 500 }
    );
  }
}

// POST - Menambah vocabulary baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const validatedData = vocabularySchema.parse(body);
    
    // Cek apakah kata sudah ada
    const existingVocab = await prisma.vocabulary.findUnique({
      where: { word: validatedData.word.toLowerCase() }
    });
    
    if (existingVocab) {
      return NextResponse.json(
        { error: 'Kata ini sudah ada dalam koleksi Anda' },
        { status: 400 }
      );
    }
    
    // Buat vocabulary baru
    const vocabulary = await prisma.vocabulary.create({
      data: {
        ...validatedData,
        word: validatedData.word.toLowerCase(), // Simpan dalam lowercase untuk konsistensi
      }
    });
    
    return NextResponse.json(vocabulary, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error creating vocabulary:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan kosakata' },
      { status: 500 }
    );
  }
}
