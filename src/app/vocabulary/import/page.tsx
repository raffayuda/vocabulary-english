"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{imported: number, skipped: number, total: number} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 200 * 1024 * 1024) { // 200MB limit
        toast.error('File terlalu besar. Maksimal 200MB');
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  interface VocabularyInput {
    word: string;
    meaning: string;
    phonetic?: string;
    partOfSpeech?: string;
    example?: string;
    difficulty?: string;
  }

  const processCSV = (csvText: string): VocabularyInput[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const vocabularies: VocabularyInput[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 2 && values[0] && values[1]) { // At least word and meaning
        const vocab: VocabularyInput = {
          word: '',
          meaning: ''
        };
        
        headers.forEach((header, index) => {
          const value = values[index] || '';
          if (header === 'word') vocab.word = value;
          else if (header === 'meaning') vocab.meaning = value;
          else if (header === 'phonetic') vocab.phonetic = value;
          else if (header === 'partOfSpeech') vocab.partOfSpeech = value;
          else if (header === 'example') vocab.example = value;
          else if (header === 'difficulty') vocab.difficulty = value;
        });
        
        if (vocab.word && vocab.meaning) {
          vocabularies.push(vocab);
        }
      }
    }

    return vocabularies;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResults(null);

    try {
      const text = await file.text();
      let vocabularies: VocabularyInput[] = [];

      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text);
          vocabularies = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          toast.error('Format JSON tidak valid');
          return;
        }
      } else if (file.name.endsWith('.csv')) {
        vocabularies = processCSV(text);
      } else {
        toast.error('Format file tidak didukung. Gunakan JSON atau CSV');
        return;
      }

      if (vocabularies.length === 0) {
        toast.error('File kosong atau format tidak valid');
        return;
      }

      // Validate data structure
      const hasValidStructure = vocabularies.every(vocab => 
        vocab && typeof vocab === 'object' && vocab.word && vocab.meaning
      );

      if (!hasValidStructure) {
        toast.error('Data tidak valid. Pastikan setiap record memiliki field word dan meaning');
        return;
      }

      // Split into chunks for progress tracking
      const CHUNK_SIZE = 5000;
      const chunks = [];
      for (let i = 0; i < vocabularies.length; i += CHUNK_SIZE) {
        chunks.push(vocabularies.slice(i, i + CHUNK_SIZE));
      }

      let totalImported = 0;
      let totalSkipped = 0;

      for (let i = 0; i < chunks.length; i++) {
        const response = await fetch('/api/vocabulary/bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vocabularies: chunks[i] })
        });

        if (response.ok) {
          const result = await response.json();
          totalImported += result.imported;
          totalSkipped += result.skipped;
          setProgress(((i + 1) / chunks.length) * 100);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
      }

      setResults({
        imported: totalImported,
        skipped: totalSkipped,
        total: vocabularies.length
      });

      toast.success(`Import selesai! ${totalImported} berhasil, ${totalSkipped} dilewati`);
      setFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengimpor data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const downloadTemplate = (format: 'json' | 'csv') => {
    const templateData = {
      json: JSON.stringify([
        {
          word: "example",
          meaning: "contoh",
          phonetic: "/ɪɡˈzæmpəl/",
          partOfSpeech: "noun",
          example: "This is an example sentence",
          difficulty: "BEGINNER"
        },
        {
          word: "beautiful",
          meaning: "indah, cantik",
          phonetic: "/ˈbjuːtɪfʊl/",
          partOfSpeech: "adjective",
          example: "She has a beautiful smile",
          difficulty: "BEGINNER"
        }
      ], null, 2),
      csv: `word,meaning,phonetic,partOfSpeech,example,difficulty
example,contoh,/ɪɡˈzæmpəl/,noun,This is an example sentence,BEGINNER
beautiful,"indah, cantik",/ˈbjuːtɪfʊl/,adjective,She has a beautiful smile,BEGINNER`
    };

    const blob = new Blob([templateData[format]], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vocabulary">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Import Kosakata</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Upload file JSON atau CSV untuk mengimpor kosakata dalam jumlah besar
          </p>
        </div>
      </div>

      {/* Results Card */}
      {results && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Import Berhasil!</p>
                <p className="text-sm text-green-700">
                  {results.imported} berhasil diimpor, {results.skipped} dilewati dari {results.total} total data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8 text-center">
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-medium">
                {file ? file.name : 'Pilih file untuk diupload'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Format yang didukung: JSON, CSV (maksimal 200MB)
              </p>
              {file && (
                <p className="text-xs text-muted-foreground">
                  Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="mt-4"
              />
            </Label>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress Upload</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground text-center">
                Sedang memproses data dalam batch...
              </p>
            </div>
          )}

          <Button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? 'Mengimpor...' : 'Import Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Template Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download template untuk memastikan format data yang benar
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate('json')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Template JSON
            </Button>
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate('csv')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Panduan Format Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Field Wajib:</p>
              <p className="text-yellow-700">
                <strong>word</strong> (kata dalam bahasa Inggris) dan <strong>meaning</strong> (arti dalam bahasa Indonesia) harus diisi
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Field yang Tersedia:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>word</strong> - Kata bahasa Inggris (wajib)</li>
                <li><strong>meaning</strong> - Arti bahasa Indonesia (wajib)</li>
                <li><strong>phonetic</strong> - Pelafalan (opsional)</li>
                <li><strong>partOfSpeech</strong> - Jenis kata (opsional)</li>
                <li><strong>example</strong> - Contoh kalimat (opsional)</li>
                <li><strong>difficulty</strong> - BEGINNER/INTERMEDIATE/ADVANCED</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tips Import:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Data duplikat akan dilewati otomatis</li>
                <li>• Proses dilakukan dalam batch untuk performa optimal</li>
                <li>• File besar akan dibagi menjadi beberapa chunk</li>
                <li>• Progress akan ditampilkan secara real-time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
