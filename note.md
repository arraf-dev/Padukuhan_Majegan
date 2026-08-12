# Catatan Progres Website Padukuhan Majegan

Terakhir diperbarui: 12 Agustus 2026

## Status Saat Ini

Sebagian besar fitur utama website sudah selesai. Hasil audit kode menunjukkan bahwa autentikasi, database, halaman publik, dan modul admin sudah tersedia. Pekerjaan terakhir menambahkan pagar kesiapan production: validasi environment, mode data demo, health check, dan smoke test deployment.

## Yang Sudah Selesai

### Sistem utama

- Next.js, React, TypeScript, Tailwind CSS, Prisma, dan PostgreSQL sudah terpasang.
- Database dan seed data sudah tersedia.
- Login, sesi cookie, logout, dan proteksi `/admin` sudah tersedia.
- Pembagian hak akses Admin dan SuperAdmin sudah diterapkan.
- Form pengaduan menyimpan data ke database, menghasilkan kode tiket, dapat dilacak, dan memiliki anti-spam sederhana.
- Production memvalidasi `DATABASE_URL`, `RAHASIA_SESI`, `NEXT_PUBLIC_URL`, dan `BLOB_READ_WRITE_TOKEN` tanpa membocorkan nilainya.
- Mode `DATA_MODE=demo|official` tersedia; mode demo menampilkan penanda bahwa informasi publik masih berupa data contoh.
- Endpoint `GET /api/health` memeriksa koneksi aplikasi dan database tanpa menampilkan secret.
- Lampiran pengaduan baru disimpan sebagai Blob privat dan hanya dapat dibuka melalui panel admin yang sudah masuk.

### Halaman publik

- Beranda membaca data aktual dari database.
- Daftar dan detail berita membaca data dari database.
- Profil dan struktur perangkat membaca data dari database.
- Informasi layanan membaca data dari database.
- Statistik membaca data dari database.
- Pengaduan dapat dikirim dan dilacak oleh warga.

### Panel admin

- CRUD berita dan status Draft/Terbit.
- Kelola profil, sejarah, visi-misi, dan struktur perangkat.
- Kelola layanan dan persyaratannya.
- Tindak lanjut pengaduan dan perubahan status.
- Kelola statistik penduduk.
- Kelola akun pengguna dan ganti kata sandi.
- Dashboard menggunakan hitungan aktual dari database.
- Menu **Aksi cepat** sudah menjadi tautan aktif ke Profil, Layanan, Akun, dan Statistik.

### Unggah gambar dan berkas

Vercel Blob sudah diintegrasikan ke kode untuk:

- foto sampul berita;
- foto perangkat dusun;
- lampiran foto pengaduan;
- templat layanan seperti PDF.

Ketentuan berkas:

- gambar: JPG, PNG, atau WEBP;
- templat layanan: PDF, JPG, PNG, atau WEBP;
- ukuran maksimal 4 MB;
- format dan ukuran diperiksa di server.

File utama yang ditambahkan:

- `src/lib/berkas.ts`
- `src/lib/unggah.ts`
- `src/components/isian-berkas.tsx`
- `src/lib/berkas.test.ts`

### Perapian repository

- Worktree sisa dari percobaan agent yang gagal sudah dihapus.
- Tidak ada commit atau deployment baru yang dibuat selama pekerjaan terakhir.

## Hasil Verifikasi Terakhir

- `git diff --check`: lulus.
- Form unggah berita, profil, layanan, dan pengaduan sudah diperiksa melalui browser.
- Proteksi halaman admin dan tautan Aksi cepat sudah diperiksa melalui browser.
- `npm test`: **31 dari 31 test lulus** (termasuk validasi environment).
- `npm run typecheck`: lulus.
- Build Next.js production dengan environment contoh: lulus.
- `npm run test:smoke` tersedia untuk memeriksa rute publik, sitemap, robots, dan health check pada URL HTTPS deployment.

## Yang Masih Perlu Dikerjakan

### Prioritas berikutnya

1. Buat Blob Store di dashboard Vercel.
2. Isi environment variable berikut di `.env.local` dan Vercel:

   ```env
   BLOB_READ_WRITE_TOKEN="token-dari-vercel"
   ```

3. Uji unggahan end-to-end setelah token tersedia:
   - unggah sampul berita lalu cek halaman publik;
   - unggah foto perangkat lalu cek halaman profil;
   - kirim pengaduan dengan lampiran lalu cek panel admin;
   - unggah templat layanan lalu coba tombol Unduh.
4. Tangani laporan `npm audit`: saat ini ditemukan 1 moderat dan 8 tinggi pada dependency transitif Next.js/Prisma. Simulasi `npm audit fix` belum dapat berjalan di lingkungan ini karena npm menolak pengambilan paket remote (`EALLOWREMOTE`); ulangi dari lingkungan npm yang mengizinkan unduhan, lalu jalankan test, typecheck, dan build kembali.
5. Isi data asli dari perangkat padukuhan: nomor WhatsApp, sejarah, foto perangkat, layanan, dan statistik.
6. Putuskan domain dan akun resmi pemilik Vercel/Neon.
7. Deploy ke Vercel, lakukan uji pengguna, pelatihan admin, dan serah terima.

## Catatan Penting

- Tanpa `BLOB_READ_WRITE_TOKEN`, pemilih berkas tetap terlihat tetapi unggahan ke Vercel Blob belum bisa digunakan.
- Lampiran pengaduan yang pernah diunggah sebagai Blob publik sebelum perubahan ini perlu diunggah ulang bila masih diperlukan; endpoint panel tidak meneruskan URL publik lama.
- Tanpa seluruh environment variable wajib, build production sekarang sengaja dihentikan dengan pesan konfigurasi yang jelas.
- Gunakan `DATA_MODE="demo"` selama data resmi belum lengkap; ubah menjadi `official` hanya setelah konten diverifikasi.
- `TASKS.md` di working tree belum sepenuhnya mencerminkan kondisi kode aktual; jadikan audit kode dan catatan ini sebagai acuan sementara.
- Perubahan saat ini masih berada di working tree dan belum di-commit.
