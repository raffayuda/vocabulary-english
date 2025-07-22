import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { isFavorite } = await request.json();

    const updatedVocabulary = await prisma.vocabulary.update({
      where: { id },
      data: { isFavorite }
    });

    return NextResponse.json({ 
      message: 'Favorit berhasil diupdate',
      data: updatedVocabulary 
    });
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate favorit' },
      { status: 500 }
    );
  }
}
