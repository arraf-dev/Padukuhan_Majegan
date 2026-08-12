# Website Padukuhan Majegan

Website informasi dan layanan digital Padukuhan Majegan, Kalurahan Pandowoharjo. Proyek ini dikembangkan sebagai program kerja KKN UNY agar warga dapat mengakses informasi padukuhan, layanan administrasi, berita, statistik, dan pengaduan melalui satu situs.

## Fitur

### Situs publik

- Profil padukuhan dan struktur perangkat
- Berita dan pengumuman
- Informasi persyaratan serta alur layanan administrasi
- Pengaduan warga dengan kode pelacakan
- Statistik penduduk dalam bentuk agregat

### Panel admin

- Autentikasi berbasis peran
- Pengelolaan berita, profil, layanan, statistik, dan akun
- Pemantauan serta tindak lanjut pengaduan
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
BLOB_READ_WRITE_TOKEN=""
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
| `npm run build` | Membuat build produksi dan menjalankan migrasi |
| `npm start` | Menjalankan build produksi |
| `npm test` | Menjalankan unit test |
| `npm run typecheck` | Memeriksa tipe TypeScript tanpa membuat berkas keluaran |
| `SMOKE_URL=https://domain-anda npm run test:smoke` | Memeriksa rute publik dan koneksi database pada deployment HTTPS |

## Menyiapkan production

Target deployment proyek ini adalah Vercel, Neon PostgreSQL, dan Vercel Blob. Isi environment variable berikut pada Vercel untuk Preview dan Production:

```env
DATABASE_URL="postgresql://..."
RAHASIA_SESI="rahasia-acak-minimal-32-byte"
BLOB_READ_WRITE_TOKEN="token Blob Store Vercel"
NEXT_PUBLIC_URL="https://domain-resmi-anda"
DATA_MODE="demo"
```

`SUPERADMIN_EMAIL` dan `SUPERADMIN_SANDI` hanya diperlukan ketika menjalankan seed pertama kali. Jangan jalankan ulang `npx prisma db seed` pada database yang sudah diisi admin karena seed memperbarui konten contoh dan mengganti daftar perangkat.

Selama informasi resmi belum lengkap, gunakan `DATA_MODE="demo"`; situs akan menampilkan penanda data contoh. Ubah menjadi `official` setelah konten diverifikasi. Production akan gagal dibangun bila variabel wajib belum lengkap atau URL kanonik belum menggunakan HTTPS.

Sebelum merilis, jalankan `npm test`, `npm run typecheck`, `npm run build`, lalu smoke test terhadap URL deployment. Lanjutkan dengan pemeriksaan manual untuk login, peran Admin/SuperAdmin, unggahan seluruh jenis berkas, pengaduan, dan pelacakan tiket.

## Struktur proyek

```text
prisma/             Skema, migrasi, dan seed database
src/app/(publik)/   Halaman situs publik
src/app/admin/      Panel administrasi
src/components/     Komponen antarmuka bersama
src/lib/            Autentikasi, validasi, dan akses data
public/gambar/      Aset ilustrasi situs
```

## Dokumentasi

- [`PRD_Website_Desa_KKN_v0.1.md`](PRD_Website_Desa_KKN_v0.1.md) — kebutuhan produk
- [`TASKS.md`](TASKS.md) — rencana dan progres pengerjaan
- [`RAB_Infrastruktur_Website.md`](RAB_Infrastruktur_Website.md) — estimasi biaya infrastruktur

---

Dikembangkan untuk Padukuhan Majegan melalui program KKN Universitas Negeri Yogyakarta.
