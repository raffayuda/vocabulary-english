import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleVocabularies = [
  {
    word: "beautiful",
    meaning: "indah, cantik",
    phonetic: "/ˈbjuːtɪfʊl/",
    partOfSpeech: "adjective",
    example: "She is a beautiful woman.",
    difficulty: "BEGINNER" as const,
    isFavorite: true,
    masteryLevel: 3
  },
  {
    word: "eloquent",
    meaning: "fasih berbicara, pandai berkata-kata",
    phonetic: "/ˈeləkwənt/",
    partOfSpeech: "adjective", 
    example: "The speaker was eloquent and persuasive.",
    difficulty: "ADVANCED" as const,
    isFavorite: false,
    masteryLevel: 1
  },
  {
    word: "journey",
    meaning: "perjalanan",
    phonetic: "/ˈdʒɜːrni/",
    partOfSpeech: "noun",
    example: "Life is a long journey full of surprises.",
    difficulty: "BEGINNER" as const,
    isFavorite: true,
    masteryLevel: 4
  },
  {
    word: "accomplish",
    meaning: "mencapai, menyelesaikan",
    phonetic: "/əˈkʌmplɪʃ/",
    partOfSpeech: "verb",
    example: "She accomplished her goals through hard work.",
    difficulty: "INTERMEDIATE" as const,
    isFavorite: false,
    masteryLevel: 2
  },
  {
    word: "magnificent",
    meaning: "megah, luar biasa",
    phonetic: "/mæɡˈnɪfɪsənt/",
    partOfSpeech: "adjective",
    example: "The view from the mountain was magnificent.",
    difficulty: "INTERMEDIATE" as const,
    isFavorite: true,
    masteryLevel: 3
  },
  {
    word: "serendipity",
    meaning: "keberuntungan tak terduga",
    phonetic: "/ˌserənˈdɪpɪti/",
    partOfSpeech: "noun",
    example: "Meeting you here was pure serendipity.",
    difficulty: "ADVANCED" as const,
    isFavorite: true,
    masteryLevel: 1
  },
  {
    word: "diligent",
    meaning: "rajin, tekun",
    phonetic: "/ˈdɪlɪdʒənt/",
    partOfSpeech: "adjective",
    example: "The diligent student always completed homework on time.",
    difficulty: "INTERMEDIATE" as const,
    isFavorite: false,
    masteryLevel: 4
  },
  {
    word: "perspective",
    meaning: "sudut pandang, perspektif",
    phonetic: "/pərˈspektɪv/",
    partOfSpeech: "noun",
    example: "Everyone has a different perspective on this issue.",
    difficulty: "INTERMEDIATE" as const,
    isFavorite: false,
    masteryLevel: 2
  },
  {
    word: "innovative",
    meaning: "inovatif, kreatif",
    phonetic: "/ˈɪnəveɪtɪv/",
    partOfSpeech: "adjective",
    example: "The company introduced innovative solutions to the market.",
    difficulty: "ADVANCED" as const,
    isFavorite: false,
    masteryLevel: 1
  },
  {
    word: "enthusiastic",
    meaning: "antusias, bersemangat",
    phonetic: "/ɪnˌθuziˈæstɪk/",
    partOfSpeech: "adjective",
    example: "The team was enthusiastic about the new project.",
    difficulty: "INTERMEDIATE" as const,
    isFavorite: true,
    masteryLevel: 3
  }
];

const sampleCategories = [
  {
    name: "Adjectives",
    description: "Kata sifat dalam bahasa Inggris",
    color: "#3B82F6"
  },
  {
    name: "Business",
    description: "Kosakata dunia bisnis",
    color: "#10B981"
  },
  {
    name: "Daily Life",
    description: "Kata-kata sehari-hari",
    color: "#F59E0B"
  },
  {
    name: "Academic",
    description: "Kosakata akademik",
    color: "#8B5CF6"
  }
];

async function main() {
  console.log('🌱 Mulai seeding database...');

  // Clear existing data
  await prisma.quizResult.deleteMany();
  await prisma.vocabularyCategory.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.category.deleteMany();

  console.log('🗑️ Data lama berhasil dihapus');

  // Seed categories
  console.log('📁 Membuat categories...');
  const categories = await Promise.all(
    sampleCategories.map(category =>
      prisma.category.create({
        data: category
      })
    )
  );
  console.log(`✅ ${categories.length} categories berhasil dibuat`);

  // Seed vocabularies
  console.log('📚 Membuat vocabularies...');
  const vocabularies = await Promise.all(
    sampleVocabularies.map(vocab =>
      prisma.vocabulary.create({
        data: vocab
      })
    )
  );
  console.log(`✅ ${vocabularies.length} vocabularies berhasil dibuat`);

  // Create some quiz results for statistics
  console.log('🧠 Membuat quiz results...');
  const quizResults = [];
  for (let i = 0; i < 20; i++) {
    const randomVocab = vocabularies[Math.floor(Math.random() * vocabularies.length)];
    const isCorrect = Math.random() > 0.3; // 70% correct rate
    
    const result = await prisma.quizResult.create({
      data: {
        vocabularyId: randomVocab.id,
        isCorrect,
        quizType: Math.random() > 0.5 ? 'MULTIPLE_CHOICE' : 'FILL_IN_BLANK',
        attemptedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date in last 7 days
      }
    });
    quizResults.push(result);
  }
  console.log(`✅ ${quizResults.length} quiz results berhasil dibuat`);

  // Link some vocabularies to categories
  console.log('🔗 Menghubungkan vocabularies dengan categories...');
  const adjectives = vocabularies.filter(v => v.partOfSpeech === 'adjective');
  const adjectiveCategory = categories.find(c => c.name === 'Adjectives');
  
  if (adjectiveCategory) {
    await Promise.all(
      adjectives.map(adj =>
        prisma.vocabularyCategory.create({
          data: {
            vocabularyId: adj.id,
            categoryId: adjectiveCategory.id
          }
        })
      )
    );
    console.log(`✅ ${adjectives.length} vocabularies dihubungkan dengan category Adjectives`);
  }

  console.log('🎉 Seeding selesai!');
  console.log('\n📊 Ringkasan:');
  console.log(`• ${categories.length} Categories`);
  console.log(`• ${vocabularies.length} Vocabularies`);
  console.log(`• ${quizResults.length} Quiz Results`);
  console.log(`• ${vocabularies.filter(v => v.isFavorite).length} Favorites`);
  console.log(`• ${vocabularies.filter(v => v.masteryLevel >= 4).length} Mastered words`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
