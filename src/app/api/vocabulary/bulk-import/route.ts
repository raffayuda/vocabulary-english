import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { vocabularies } = await request.json();
    
    if (!Array.isArray(vocabularies)) {
      return NextResponse.json(
        { error: 'Data harus berupa array' },
        { status: 400 }
      );
    }

    // Validate required fields
    for (const vocab of vocabularies) {
      if (!vocab.word || !vocab.meaning) {
        return NextResponse.json(
          { error: 'Field word dan meaning wajib diisi' },
          { status: 400 }
        );
      }
    }

    const BATCH_SIZE = 1000;
    let totalImported = 0;
    let totalSkipped = 0;

    // Process in batches
    for (let i = 0; i < vocabularies.length; i += BATCH_SIZE) {
      const batch = vocabularies.slice(i, i + BATCH_SIZE);
      
      try {
        const result = await prisma.vocabulary.createMany({
          data: batch.map(vocab => ({
            word: vocab.word.trim(),
            meaning: vocab.meaning.trim(),
            phonetic: vocab.phonetic?.trim() || null,
            partOfSpeech: vocab.partOfSpeech?.trim() || null,
            example: vocab.example?.trim() || null,
            difficulty: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(vocab.difficulty) 
              ? vocab.difficulty 
              : 'BEGINNER',
            isFavorite: false,
            masteryLevel: 1
          })),
          skipDuplicates: true
        });

        totalImported += result.count;
        totalSkipped += batch.length - result.count;
        
        // Progress feedback
        console.log(`Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${result.count} records imported, ${batch.length - result.count} skipped`);
        
      } catch (batchError) {
        console.error(`Error in batch ${Math.floor(i/BATCH_SIZE) + 1}:`, batchError);
        // Continue with next batch instead of failing completely
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${totalImported} imported, ${totalSkipped} skipped`,
      imported: totalImported,
      skipped: totalSkipped,
      total: vocabularies.length
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import vocabularies: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
