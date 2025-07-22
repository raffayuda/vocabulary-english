import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Hapus data existing (jika ada)
    await prisma.quizResult.deleteMany();
    await prisma.vocabularyCategory.deleteMany();
    await prisma.vocabulary.deleteMany();
    await prisma.category.deleteMany();

    // Buat categories
    const adjCategory = await prisma.category.create({
      data: { name: 'Adjectives', description: 'Descriptive words' }
    });
    
    const businessCategory = await prisma.category.create({
      data: { name: 'Business', description: 'Business related terms' }
    });
    
    const dailyCategory = await prisma.category.create({
      data: { name: 'Daily Life', description: 'Everyday vocabulary' }
    });
    
    const academicCategory = await prisma.category.create({
      data: { name: 'Academic', description: 'Academic and formal terms' }
    });

    // Buat vocabulary data
    const vocab1 = await prisma.vocabulary.create({
      data: {
        word: 'Beautiful',
        meaning: 'Indah, cantik',
        phonetic: '/ˈbjuːtɪfʊl/',
        partOfSpeech: 'adjective',
        example: 'She has a beautiful smile.',
        difficulty: 'BEGINNER',
        isFavorite: true,
        masteryLevel: 3,
        categories: {
          create: [{ categoryId: adjCategory.id }]
        }
      }
    });

    const vocab2 = await prisma.vocabulary.create({
      data: {
        word: 'Journey',
        meaning: 'Perjalanan',
        phonetic: '/ˈdʒɜːni/',
        partOfSpeech: 'noun',
        example: 'Life is a beautiful journey.',
        difficulty: 'BEGINNER',
        isFavorite: true,
        masteryLevel: 5,
        categories: {
          create: [{ categoryId: dailyCategory.id }]
        }
      }
    });

    const vocab3 = await prisma.vocabulary.create({
      data: {
        word: 'Magnificent',
        meaning: 'Megah, luar biasa',
        phonetic: '/mæɡˈnɪfɪsənt/',
        partOfSpeech: 'adjective',
        example: 'The view from the mountain was magnificent.',
        difficulty: 'INTERMEDIATE',
        isFavorite: true,
        masteryLevel: 2,
        categories: {
          create: [{ categoryId: adjCategory.id }]
        }
      }
    });

    const vocab4 = await prisma.vocabulary.create({
      data: {
        word: 'Entrepreneur',
        meaning: 'Pengusaha, wirausaha',
        phonetic: '/ˌɒntrəprəˈnɜː/',
        partOfSpeech: 'noun',
        example: 'She is a successful entrepreneur.',
        difficulty: 'ADVANCED',
        isFavorite: false,
        masteryLevel: 1,
        categories: {
          create: [{ categoryId: businessCategory.id }]
        }
      }
    });

    const vocab5 = await prisma.vocabulary.create({
      data: {
        word: 'Serendipity',
        meaning: 'Keberuntungan yang tidak terduga',
        phonetic: '/ˌserənˈdɪpɪti/',
        partOfSpeech: 'noun',
        example: 'Meeting you was pure serendipity.',
        difficulty: 'ADVANCED',
        isFavorite: true,
        masteryLevel: 2,
        categories: {
          create: [{ categoryId: academicCategory.id }]
        }
      }
    });

    await prisma.vocabulary.createMany({
      data: [
        {
          word: 'Diligent',
          meaning: 'Rajin, tekun',
          phonetic: '/ˈdɪlɪdʒənt/',
          partOfSpeech: 'adjective',
          example: 'He is a diligent student.',
          difficulty: 'INTERMEDIATE',
          isFavorite: false,
          masteryLevel: 5
        },
        {
          word: 'Perseverance',
          meaning: 'Ketekunan, kegigihan',
          phonetic: '/ˌpɜːsɪˈvɪərəns/',
          partOfSpeech: 'noun',
          example: 'Success requires perseverance.',
          difficulty: 'ADVANCED',
          isFavorite: false,
          masteryLevel: 1
        },
        {
          word: 'Enthusiastic',
          meaning: 'Antusias, bersemangat',
          phonetic: '/ɪnˌθjuːziˈæstɪk/',
          partOfSpeech: 'adjective',
          example: 'She was enthusiastic about the project.',
          difficulty: 'INTERMEDIATE',
          isFavorite: true,
          masteryLevel: 3
        },
        {
          word: 'Collaborate',
          meaning: 'Berkolaborasi, bekerja sama',
          phonetic: '/kəˈlæbəreɪt/',
          partOfSpeech: 'verb',
          example: 'We need to collaborate on this project.',
          difficulty: 'INTERMEDIATE',
          isFavorite: false,
          masteryLevel: 2
        },
        {
          word: 'Resilient',
          meaning: 'Tahan banting, tangguh',
          phonetic: '/rɪˈzɪliənt/',
          partOfSpeech: 'adjective',
          example: 'Children are remarkably resilient.',
          difficulty: 'ADVANCED',
          isFavorite: false,
          masteryLevel: 1
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      data: {
        categories: 4,
        vocabularies: 10
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
