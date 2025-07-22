# 📚 KosKata - Aplikasi Pembelajaran Kosakata Bahasa Inggris

Aplikasi web untuk mencatat, mengelola, dan mempelajari kosakata bahasa Inggris dengan fitur quiz interaktif. Dibangun menggunakan Next.js 15, shadcn/ui, dan PostgreSQL Vercel.

## ✨ Fitur Utama

- 📝 **Manajemen Kosakata**: Tambah, edit, hapus kosakata dengan detail lengkap
- 🧠 **Quiz Interaktif**: Berbagai jenis quiz untuk melatih pemahaman
- ⭐ **Sistem Favorit**: Tandai kata-kata penting untuk dipelajari lebih intensif
- 📊 **Dashboard Statistik**: Pantau progress pembelajaran Anda
- 🎯 **Tingkat Kesulitan**: Klasifikasi kata berdasarkan tingkat kesulitan
- 📱 **Responsive Design**: Optimal di desktop dan mobile
- 🎨 **UI Modern**: Menggunakan shadcn/ui dengan design yang clean

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Git
- Akun Vercel (untuk database PostgreSQL)

## 🚀 Panduan Installation Step by Step

### Step 1: Clone Repository
```bash
git clone [repository-url]
cd kosakata-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database PostgreSQL di Vercel

1. **Login ke Vercel**:
   ```bash
   npx vercel login
   ```

2. **Buat Database PostgreSQL**:
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Pilih "Storage" → "Create Database"
   - Pilih "Postgres" dan ikuti instruksi
   - Salin connection string yang diberikan

3. **Setup Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dan tambahkan:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database_name?sslmode=require"
   ```

### Step 4: Setup Database Schema

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push Schema ke Database**:
   ```bash
   npx prisma db push
   ```

3. **Seed Database (Opsional)**:
   ```bash
   npx prisma db seed
   ```

### Step 5: Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Proyek

```
kosakata-app/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── api/               # API Routes
│   │   │   ├── vocabulary/    # CRUD Vocabulary
│   │   │   └── stats/         # Dashboard Statistics
│   │   ├── vocabulary/        # Halaman Vocabulary
│   │   │   ├── new/          # Tambah Vocabulary
│   │   │   └── page.tsx      # List Vocabulary
│   │   ├── quiz/             # Halaman Quiz
│   │   ├── favorites/        # Halaman Favorit
│   │   ├── layout.tsx        # Root Layout
│   │   └── page.tsx          # Dashboard
│   ├── components/
│   │   ├── ui/               # shadcn/ui Components
│   │   └── layout/           # Layout Components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma Client
│   │   └── utils.ts          # Utility Functions
│   └── types/
│       └── index.ts          # TypeScript Types
├── prisma/
│   └── schema.prisma         # Database Schema
├── public/                   # Static Assets
└── package.json
```

## 🗄️ Database Schema

### Model Vocabulary
- `word`: Kata dalam bahasa Inggris
- `meaning`: Arti dalam bahasa Indonesia
- `phonetic`: Pengucapan (phonetic notation)
- `partOfSpeech`: Jenis kata (noun, verb, dll)
- `example`: Contoh kalimat
- `difficulty`: Tingkat kesulitan (BEGINNER, INTERMEDIATE, ADVANCED)
- `isFavorite`: Status favorit
- `masteryLevel`: Tingkat penguasaan (0-5)

### Model QuizResult
- Menyimpan hasil quiz untuk tracking progress
- Relasi dengan Vocabulary

### Model Category
- Kategori/tag untuk mengelompokkan vocabulary
- Many-to-many relationship dengan Vocabulary

## 🎯 Cara Menggunakan Aplikasi

### 1. Dashboard
- Lihat statistik pembelajaran Anda
- Akses cepat ke fitur-fitur utama
- Monitor progress penguasaan vocabulary

### 2. Menambah Vocabulary Baru
1. Klik "Tambah Kata" di navbar atau dashboard
2. Isi form dengan informasi lengkap:
   - **Kata**: Vocabulary bahasa Inggris
   - **Arti**: Terjemahan bahasa Indonesia
   - **Phonetic**: Pengucapan (opsional)
   - **Jenis Kata**: Noun, verb, adjective, dll
   - **Contoh**: Kalimat contoh penggunaan
   - **Tingkat Kesulitan**: Pemula, menengah, lanjutan
3. Klik "Simpan Vocabulary"

### 3. Mengelola Vocabulary
- **Lihat Semua**: Akses daftar lengkap vocabulary Anda
- **Search**: Cari kata berdasarkan kata atau arti
- **Filter**: Filter berdasarkan tingkat kesulitan
- **Edit**: Ubah informasi vocabulary
- **Favorit**: Tandai kata penting

### 4. Quiz
- Pilih jenis quiz yang tersedia
- **Multiple Choice**: Pilih arti yang benar
- **Fill in Blank**: Lengkapi kalimat
- **Meaning Match**: Cocokkan kata dengan arti
- Lihat hasil dan tingkatkan skor Anda

### 5. Favorit
- Kumpulkan kata-kata yang perlu fokus ekstra
- Review secara intensif
- Track progress kata-kata sulit

## 🔧 Konfigurasi Lanjutan

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: API Keys untuk fitur tambahan
OPENAI_API_KEY="sk-..."  # Untuk AI features
```

### Deployment ke Vercel

1. **Push ke GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy di Vercel**:
   - Import project dari GitHub di Vercel Dashboard
   - Set environment variables
   - Deploy otomatis akan berjalan

3. **Setup Database Production**:
   ```bash
   npx prisma db push --preview-feature
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 Pengembangan Lebih Lanjut

### Fitur yang Bisa Ditambahkan:
1. **Audio Pronunciation**: Integrate dengan text-to-speech API
2. **Spaced Repetition**: Algoritma untuk review optimal
3. **Progress Tracking**: Grafik progress pembelajaran
4. **Social Features**: Share vocabulary dengan teman
5. **Offline Support**: PWA untuk akses offline
6. **AI Integration**: Generate contoh kalimat otomatis
7. **Export/Import**: Backup dan restore data
8. **Themes**: Dark mode dan custom themes

### API Endpoints:
- `GET /api/vocabulary` - List vocabulary
- `POST /api/vocabulary` - Create vocabulary
- `PUT /api/vocabulary/[id]` - Update vocabulary
- `DELETE /api/vocabulary/[id]` - Delete vocabulary
- `GET /api/stats` - Dashboard statistics
- `POST /api/quiz` - Submit quiz results

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Prisma](https://prisma.io/) - Database ORM
- [Vercel](https://vercel.com/) - Deployment Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Cek [Issues](../../issues) yang sudah ada
2. Buat issue baru dengan detail yang lengkap
3. Sertakan error message dan steps to reproduce

---

**Happy Learning! 🎉**

*Aplikasi ini dibuat untuk membantu pembelajaran bahasa Inggris menjadi lebih terstruktur dan menyenangkan.*
