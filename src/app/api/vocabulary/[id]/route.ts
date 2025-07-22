import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for validation
const updateVocabularySchema = z.object({
  word: z.string().min(1, 'Kata tidak boleh kosong').max(100),
  meaning: z.string().min(1, 'Arti tidak boleh kosong').max(500),
  phonetic: z.string().optional().nullable(),
  partOfSpeech: z.string().optional().nullable(),
  example: z.string().optional().nullable(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  isFavorite: z.boolean().optional(),
  masteryLevel: z.number().min(1).max(5).optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id }
    });

    if (!vocabulary) {
      return NextResponse.json(
        { error: 'Kosakata tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vocabulary
    });
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kosakata' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateVocabularySchema.parse(body);

    // Check if vocabulary exists
    const existingVocabulary = await prisma.vocabulary.findUnique({
      where: { id }
    });

    if (!existingVocabulary) {
      return NextResponse.json(
        { error: 'Kosakata tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if word already exists (excluding current record)
    const existingWord = await prisma.vocabulary.findFirst({
      where: {
        word: {
          equals: validatedData.word,
          mode: 'insensitive'
        },
        id: {
          not: id
        }
      }
    });

    if (existingWord) {
      return NextResponse.json(
        { error: 'Kata sudah ada dalam database' },
        { status: 400 }
      );
    }

    // Update vocabulary
    const updatedVocabulary = await prisma.vocabulary.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kosakata berhasil diperbarui',
      data: updatedVocabulary
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Data tidak valid' },
        { status: 400 }
      );
    }

    console.error('Error updating vocabulary:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kosakata' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if vocabulary exists
    const existingVocabulary = await prisma.vocabulary.findUnique({
      where: { id }
    });

    if (!existingVocabulary) {
      return NextResponse.json(
        { error: 'Kosakata tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.vocabulary.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Kosakata berhasil dihapus' 
    });
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kosakata' },
      { status: 500 }
    );
  }
}
