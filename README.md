# Website Padukuhan Majegan

Website informasi dan layanan digital Padukuhan Majegan, Kalurahan Pandowoharjo. Proyek ini dikembangkan sebagai program kerja KKN UNY agar warga dapat mengakses informasi padukuhan, layanan administrasi, berita, statistik, dan pengaduan melalui satu situs.

## Fitur

### Situs publik

- Profil padukuhan dan struktur perangkat
- Berita dan pengumuman
- Galeri kegiatan berbasis album dengan lightbox
- Potensi Majegan: Pariwisata, UMKM, dan Budaya beserta infografis
- Informasi persyaratan serta alur layanan administrasi
- Pengaduan warga dengan identitas wajib dan lampiran privat
- Statistik penduduk dalam bentuk agregat

### Panel admin

- Autentikasi berbasis peran
- Pengelolaan berita, profil, layanan, statistik, dan akun
- Pengelolaan album Galeri dengan multi-upload foto
- Pengelolaan Potensi Pariwisata, UMKM, dan Budaya beserta data infografis
- Pengelolaan pengaduan berdasarkan sudah/belum dibaca
- Dashboard ringkasan data

## Teknologi

- [Next.js 16](https://nextjs.org/) dan React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7 dengan PostgreSQL
- Neon sebagai layanan database

## Menjalankan secara lokal

### Prasyarat

- Node.js 24 atau lebih baru
- Database PostgreSQL

### Instalasi

```bash
git clone https://github.com/arraf-dev/Padukuhan_Majegan.git
cd Padukuhan_Majegan
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi seluruh variabel yang diperlukan:

```env
DATABASE_URL=""
RAHASIA_SESI=""
SUPERADMIN_EMAIL=""
SUPERADMIN_SANDI=""
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_PUBLIK="majegan-publik"
R2_BUCKET_PRIVAT="majegan-private"
R2_PUBLIC_URL="https://majegan-publik.<account-id>.r2.dev"
DATA_MODE="demo"
NEXT_PUBLIC_URL="http://localhost:3000"
```

Siapkan database dan jalankan aplikasi:

```bash
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Aplikasi tersedia di [http://localhost:3000](http://localhost:3000).

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membuat build produksi (tanpa migrasi database) |
| `npm run migrate:deploy` | Menerapkan migration ke database |
| `npm run build:monolit` | Build + migrasi dalam satu perintah (cara lama) |
| `npm start` | Menjalankan build produksi |
| `npm test` | Menjalankan unit test |
| `npm run test:e2e` | Menjalankan uji akhir Playwright (butuh `.env.e2e`, salin dari `.env.e2e.example`) |
| `npm run test:e2e:install` | Mengunduh browser Chromium untuk Playwright |
| `npm run test:e2e:ui` | Menjalankan uji dalam mode antarmuka Playwright |
| `npm run typecheck` | Memeriksa tipe TypeScript tanpa membuat berkas keluaran |
| `SMOKE_URL=https://domain-anda npm run test:smoke` | Memeriksa rute publik dan koneksi database pada deployment HTTPS |

## Menyiapkan production

Target deployment proyek ini adalah Vercel, Neon PostgreSQL, dan Cloudflare R2 untuk penyimpanan berkas. Isi environment variable berikut pada Vercel untuk Preview dan Production:

```env
DATABASE_URL="postgresql://..."
RAHASIA_SESI="rahasia-acak-minimal-32-byte"
R2_ACCOUNT_ID="account-id"
R2_ACCESS_KEY_ID="access-key-id"
R2_SECRET_ACCESS_KEY="secret-access-key"
R2_BUCKET_PUBLIK="majegan-publik"
R2_PUBLIC_URL="https://majegan-publik.<account-id>.r2.dev"
R2_BUCKET_PRIVAT="majegan-privat"
NEXT_PUBLIC_URL="https://domain-resmi-anda"
DATA_MODE="demo"
```

`DATABASE_URL` dan `RAHASIA_SESI` wajib tersedia. `NEXT_PUBLIC_URL` dianjurkan untuk domain resmi; ketika belum diisi atau masih menunjuk localhost, deployment Vercel memakai `VERCEL_PROJECT_PRODUCTION_URL` sebagai URL HTTPS kanonik. Kredensial R2 hanya dibaca saat operasi unggah — kekurangannya tidak mematikan seluruh build, melainkan menampilkan pesan konfigurasi yang aman saat admin mencoba mengunggah.

`SUPERADMIN_EMAIL` dan `SUPERADMIN_SANDI` hanya diperlukan ketika menjalankan seed pertama kali. Jangan jalankan ulang `npx prisma db seed` pada database yang sudah diisi admin karena seed memperbarui konten contoh dan mengganti daftar perangkat.

Selama informasi resmi belum lengkap, gunakan `DATA_MODE="demo"`; situs akan menampilkan penanda data contoh. Ubah menjadi `official` setelah konten diverifikasi. Production akan gagal dibangun bila `DATABASE_URL`, `RAHASIA_SESI`, atau URL HTTPS kanonik tidak tersedia.

Sebelum merilis, jalankan `npm test`, `npm run typecheck`, `npm run build`, lalu smoke test terhadap URL deployment. Lanjutkan dengan pemeriksaan manual untuk login, peran Admin/SuperAdmin, unggahan seluruh jenis berkas, pengaduan, filter baca, dan pembatasan identitas pelapor.

### Uji akhir end-to-end (Playwright)

Salin `.env.e2e.example` menjadi `.env.e2e`, isi `E2E_URL`, kredensial uji, dan `E2E_UJI_UNGGAN`, lalu:

```bash
npm run test:e2e:install
npm run test:e2e
```

Spec otomatis menguji: login & sandi salah, pembuatan akun Admin, siklus hidup berita (buat → tampil publik → hapus), serta alur pengaduan (kirim beridentitas + lampiran privat → baca oleh SuperAdmin → tandai dibaca → filter). Saat `E2E_UJI_UNGGAN=true`, unggah berkas juga benar-benar dijalankan — pastikan 7 environment `R2_*` sudah terisi di Vercel.

## Struktur proyek

```text
prisma/             Skema, migrasi, dan seed database
src/app/(publik)/   Halaman situs publik
src/app/admin/      Panel administrasi
src/components/     Komponen antarmuka bersama
src/lib/            Autentikasi, validasi, dan akses data
ERD.md              Diagram relasi database dalam Mermaid
public/gambar/      Aset ilustrasi situs
```

---

Dikembangkan untuk Padukuhan Majegan melalui program KKN Universitas Negeri Yogyakarta.
