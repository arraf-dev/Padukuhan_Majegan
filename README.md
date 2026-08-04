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
