# Catatan Progres Website Padukuhan Majegan

Terakhir diperbarui: 10 Agustus 2026

## Status Saat Ini

Sebagian besar fitur utama website sudah selesai. Hasil audit kode menunjukkan bahwa autentikasi, database, halaman publik, dan modul admin sudah tersedia. Pekerjaan terakhir berfokus pada penyelesaian fitur unggah gambar/berkas (ADM-5) dan perapian dashboard admin.

## Yang Sudah Selesai

### Sistem utama

- Next.js, React, TypeScript, Tailwind CSS, Prisma, dan PostgreSQL sudah terpasang.
- Database dan seed data sudah tersedia.
- Login, sesi cookie, logout, dan proteksi `/admin` sudah tersedia.
- Pembagian hak akses Admin dan SuperAdmin sudah diterapkan.
- Form pengaduan menyimpan data ke database, menghasilkan kode tiket, dapat dilacak, dan memiliki anti-spam sederhana.

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

- `npm test`: **27 dari 27 test lulus**.
- `npx tsc --noEmit`: lulus.
- Build Next.js: lulus.
- `git diff --check`: lulus.
- Form unggah berita, profil, layanan, dan pengaduan sudah diperiksa melalui browser.
- Proteksi halaman admin dan tautan Aksi cepat sudah diperiksa melalui browser.

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
4. Periksa dan tangani laporan `npm audit` jika relevan (terakhir: 1 moderat dan 8 tinggi).
5. Isi data asli dari perangkat padukuhan: nomor WhatsApp, sejarah, foto perangkat, layanan, dan statistik.
6. Putuskan domain dan akun resmi pemilik Vercel/Neon.
7. Deploy ke Vercel, lakukan uji pengguna, pelatihan admin, dan serah terima.

## Catatan Penting

- Tanpa `BLOB_READ_WRITE_TOKEN`, pemilih berkas tetap terlihat tetapi unggahan ke Vercel Blob belum bisa digunakan.
- `TASKS.md` di working tree belum sepenuhnya mencerminkan kondisi kode aktual; jadikan audit kode dan catatan ini sebagai acuan sementara.
- Perubahan saat ini masih berada di working tree dan belum di-commit.
