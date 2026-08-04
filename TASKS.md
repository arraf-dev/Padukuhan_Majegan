# TASKS — Proker Utama Website DesaKu

**Durasi:** 6 minggu · **Tim:** 1 orang (solo dev)
**Mulai:** 23 Juli 2026

> Cara pakai: centang `- [ ]` jadi `- [x]` tiap task selesai. Kalau ada minggu yang molor, cek bagian **Rencana Cadangan** di paling bawah sebelum menggeser jadwal minggu berikutnya.

---

## Status per 28 Jul 2026

**Sudah jalan:** database Neon (9 tabel terisi) · auth + proteksi `/admin` · pengaduan warga tersimpan & bisa dilacak · **seluruh panel admin: berita, pengaduan, profil & struktur, layanan, statistik, akun & pengguna, ganti sandi** · dashboard angka nyata · **seluruh halaman publik membaca DB** · sistem gambar + ilustrasi · pass responsif mobile. `npm test`: 23 lolos, `next build` hijau.

**Belum jalan:** unggah berkas gambar (ADM-5, task 17) dan ISR. Situs belum di-deploy — **dijadwalkan Minggu 3**. Itu satu-satunya penghalang besar yang tersisa.

**Keputusan 28 Jul — lingkup dipangkas:**

| Perubahan | Akibat |
|---|---|
| Deploy VPS ditunda ke **Minggu 3** | Minggu 1 & 2 murni koding + konten; rencana deploy ada di bagian B |
| **MoM resmi dihapus** dari rencana | TBD Bab 12 (nama resmi, kebijakan anonim, siapa admin) dijawab lewat komunikasi biasa, tanpa forum formal |
| Permintaan konten asli pindah ke **Minggu 2** | Digabung sekali kirim dengan izin data statistik |
| **Modul Transparansi Anggaran (APBDes) dihapus** | APB-1/2/3 & ADM-6 keluar dari lingkup. Sudah dihapus dari kode (halaman `/anggaran`, tautan navigasi, data contoh) **dan dari PRD** (Bab 6.5, ADM-6, alur 7.4, entitas `anggaran` Bab 8) |
| Statistik penduduk **tetap** | STA-1/2 & ADM-7 jalan terus |

**Berubah lebih awal (27 Jul):** target deploy pindah dari Vercel ke **VPS** (`RAB_Infrastruktur_Website.md`). Vercel tetap dipertahankan sebagai jalan keluar bila VPS tidak terbiayai — checklist-nya di bagian B.

> **PRD sudah disesuaikan** (28 Jul): APBDes dihapus dari ringkasan produk, tujuan, peran pengguna, ruang lingkup, kebutuhan fungsional, alur pengguna, model data, TBD, dan glosarium. Bab 6 dinomori ulang jadi 6.1–6.7, tapi **ID kebutuhan sengaja tidak digeser** — ADM-6 dibiarkan kosong supaya rujukan ADM-7/ADM-8 di dokumen ini dan di komentar kode tidak berubah arti. Alasan penghapusan tercatat di tabel **Riwayat Perubahan Lingkup** di kepala PRD, jadi laporan akhir punya pembenaran tertulis.

---

## Minggu 1 (23–29 Jul) — Fondasi & Koordinasi Awal

**Teknis**
- [x] Setup Next.js (App Router) + TypeScript + Tailwind, inisialisasi repo Git
- [x] Setup Prisma + Neon Postgres, migrasi skema inti Bab 8 (`pengguna`, `halaman_profil`, `perangkat_desa`, `berita`, `kategori_berita`, `layanan`, `pengaduan`) — *migrasi `20260726000000_awal` diterapkan & seed jalan 27 Jul 2026; 9 tabel terisi*
- [x] Autentikasi admin dasar (AUTH-1, AUTH-2) — login + proteksi route `/admin`
- [x] Struktur folder: route group publik vs admin, layout dasar mobile-first (wireframe 1a–1e)
**Non-teknis / koordinasi ke kalurahan**

Kosong — seluruhnya digeser ke Minggu 2 (permintaan konten & izin data) atau dihapus (MoM resmi).

**Target minggu ini:** ✅ **tercapai** — skema DB jalan, admin bisa login, modul pengaduan tembus end-to-end. Deploy dipindah ke Minggu 3 atas keputusan 28 Jul, jadi tidak lagi dihitung sebagai target minggu ini.

---

## Minggu 2 (30 Jul–5 Ags) — Profil Desa & Berita

**Teknis**
- [x] Beranda publik (pilih varian wireframe 1a/1b/1c, atau gabungkan) — *blok berita sudah dari DB, sisanya masih `majegan.ts`*
- [x] Profil Desa publik: sejarah, visi-misi, struktur organisasi, kontak & peta (PRF-2/3/4, wireframe 1d/1e) — *tampilannya jadi, datanya masih `majegan.ts` sampai Langkah 4*
- [x] Admin: CRUD Berita + status Draft/Terbit (ADM-1)
- [x] Publik: daftar & detail berita (BRT-1/2/3/4, wireframe 2a) — *dari DB, draf tidak bocor ke publik*
- [x] Admin: kelola profil desa & struktur organisasi (ADM-2) — *`/admin/profil`, naskah + struktur dalam satu halaman*
- [ ] Upload gambar (ADM-5) — di VPS cukup tulis ke folder disk + sajikan lewat nginx; Cloudinary hanya kalau tetap di Vercel

**Non-teknis — kirim di awal minggu, jangan menunggu koding selesai**
- [ ] **Minta konten asli ke kalurahan** (pindahan dari Minggu 1): naskah sejarah dusun, foto perangkat + jabatan, daftar layanan resmi beserta syarat & alurnya, nomor WhatsApp resmi
- [ ] **Minta izin publikasi data statistik penduduk** — cukup statistik saja; permintaan data APBDes dibatalkan seiring modulnya dihapus
- [ ] Jawab TBD Bab 12 lewat percakapan biasa dengan Dukuh (nama resmi situs, kebijakan pengaduan anonim, siapa admin & super admin, target rilis) — catat jawabannya di sini, tidak perlu forum resmi
- [ ] Input konten asli begitu datanya masuk

**Target minggu ini:** Beranda, Profil Desa, Berita (publik + admin) jalan end-to-end dengan konten mendekati asli.

> Permintaan konten dan izin statistik sebaiknya **satu kali kirim** — dua permintaan terpisah ke orang yang sama dalam seminggu lebih mudah tertunda daripada satu daftar yang jelas.

---

## Minggu 3 (6–12 Ags) — Layanan Administrasi & Pengaduan

**Teknis**
- [x] Publik: Informasi Layanan Administrasi (LYN-1/2/3, wireframe 2b) — *tampilan jadi, data masih `majegan.ts` sampai Langkah 5*
- [x] Admin: kelola layanan (ADM-3) — *`/admin/layanan`, slug lama dipertahankan saat nama disunting*
- [x] Publik: Formulir Pengaduan (LPR-1/2/4, wireframe 2c) — *tersimpan ke DB + anti-spam*
- [x] Publik: Lacak Pengaduan via kode tiket (LPR-3, wireframe 2d)
- [x] Admin: tindak lanjut pengaduan — ubah status, tulis tanggapan (ADM-4, wireframe 2j)
- [x] Tautan WhatsApp (wa.me) di titik kontak — ⚠️ **nomornya masih placeholder** (`majegan.ts:19`), ganti begitu nomor asli turun dari kalurahan
- [ ] **Deploy VPS — task 25** *(pindahan dari Minggu 1, keputusan 28 Jul)*. Rencana deploy ada di bagian B; kode sudah siap (`output: "standalone"`, build teruji 23 MB)

**Non-teknis**
- [ ] Validasi ulang syarat & alur tiap layanan bersama perangkat desa berwenang
- [ ] **5 prasyarat sebelum VPS disewa:** nama pemegang akses, mata anggaran APBDes tahun depan, metode bayar atas nama desa, pengingat perpanjangan ke 2 kontak, alasan teknis tertulis

**Target minggu ini:** Flow 7.1 (kirim & lacak pengaduan) dan 7.2 (cari info layanan) jalan penuh dari sisi warga maupun admin, **dan situs sudah hidup di alamat sungguhan**.

> ⏳ Minggu 3 sekarang jadi minggu paling padat: layanan + deploy sekaligus. Kalau harus memilih, **deploy duluan** — Minggu 5 (uji coba bareng perangkat desa) dan Minggu 6 (pelatihan) sama-sama menuntut situs yang bisa dibuka dari HP mereka, bukan dari `localhost` laptop Anda.

---

## Minggu 4 (13–19 Ags) — Statistik, Akun, Dashboard Admin

> ~~Transparansi Anggaran (APB-1/2/3, ADM-6)~~ **dihapus dari lingkup 28 Jul.** Halaman `/anggaran`, tautan navigasinya, dan data contohnya sudah dikeluarkan dari kode. Tabel `anggaran` sengaja ditinggal di skema — modulnya bisa dihidupkan lagi tanpa migrasi kalau izin kalurahan ternyata turun.

**Teknis**
- [x] Publik: Statistik Penduduk (STA-1/2, wireframe 2f) — *tampilan jadi, angka masih contoh sampai Langkah 6*
- [x] Admin: kelola statistik penduduk (ADM-7) — *`/admin/statistik`, pemilih tahun + dua kategori (ringkasan & usia)*
- [x] Dashboard admin ringkas (ADM-8, wireframe 2h) — *hitungan nyata dari DB, bukan angka statis*
- [x] AUTH-3 (super admin kelola akun admin) & AUTH-4 (ganti password) — *`/admin/akun` + `/admin/sandi`*

**Non-teknis**
- [ ] Kejar izin publikasi data statistik penduduk kalau Minggu 2 belum turun

**Target minggu ini:** Seluruh modul MVP yang tersisa punya versi publik & admin yang jalan. Minggu ini jadi lebih longgar setelah APBDes dicoret — pakai kelonggarannya untuk menutup utang cek manual dan bug dari deploy Minggu 3.

---

## Minggu 5 (20–26 Ags) — Polish, Responsif, Performa, Testing

**Teknis**
- [x] Review responsif mobile-first semua halaman vs wireframe mobile — *dikerjakan lebih awal 28 Jul: target sentuh ≥44px, skeleton pemuatan (`(publik)/loading.tsx`, `admin/loading.tsx`), bilah bawah mobile. Ulangi sekilas di Minggu 5 setelah 5 halaman admin sisa jadi*
- [ ] Terapkan ISR/static generation untuk halaman publik
- [x] Metadata & sitemap dasar (SEO) — *`robots.ts`, `sitemap.ts` dari DB, `opengraph-image.tsx` untuk pratinjau tautan di WhatsApp*
- [ ] Cek validasi input & proteksi dasar (XSS/injeksi) di semua form
- [ ] Testing manual menyeluruh: semua user flow Bab 7, semua role
- [ ] Perbaikan bug dari hasil testing

**Non-teknis**
- [ ] Sesi uji coba bareng 1–2 perangkat desa calon admin, kumpulkan feedback

**Target minggu ini:** Website stabil, minim bug kritis, sudah diuji orang di luar tim.

---

## Minggu 6 (27 Ags–2 Sep) — Pelatihan, Dokumentasi, Serah Terima

**Teknis**
- [ ] Perbaikan berdasar feedback minggu 5
- [ ] Pindahkan kepemilikan akun layanan (VPS, domain, Neon/DB, UptimeRobot) ke email resmi desa
- [ ] Final deploy & cek status domain (IP VPS langsung kalau `desa.id` belum siap)

**Non-teknis**
- [ ] Pelatihan singkat perangkat desa yang ditunjuk jadi admin
- [ ] Buat dokumentasi penggunaan (panduan admin — PDF ringkas / video singkat)
- [ ] Serah terima kredensial & akses ke admin/super admin yang ditunjuk
- [ ] Susun laporan akhir proker untuk keperluan KKN

**Target minggu ini:** Website live dipakai, perangkat desa sudah dilatih dan pegang akses sendiri, dokumentasi tersedia.

---

## Papan Task Frontend → Backend

Status: ✅ selesai · 🟡 setengah jalan (FE: UI jalan tapi data masih dummy dari `src/content/majegan.ts` · BE: kode siap tapi belum terhubung/berjalan) · ⬜ belum ada.
Urut sesuai ketergantungan — kerjakan dari atas.

| #  | Task | Lapisan | Berkas utama | Status | Butuh |
|----|------|---------|--------------|--------|-------|
| 1  | Shell situs: header, footer, layout publik & admin | FE | `components/situs.tsx`, `app/layout.tsx` | ✅ | — |
| 2  | Beranda (1a–1c) | FE | `app/(publik)/page.tsx` | ✅ | berita & statistik dari DB |
| 3  | Profil desa (PRF-2/3/4) | FE | `app/(publik)/profil/page.tsx` | ✅ | dari DB lewat `lib/profil.ts` |
| 4  | Berita: daftar + detail (BRT-1..4) | FE | `app/(publik)/berita/**` | ✅ | sumber data dari DB |
| 5  | Layanan (LYN-1/2/3) | FE | `app/(publik)/layanan/[[...slug]]/page.tsx` | ✅ | dari DB lewat `lib/layanan.ts` |
| 6  | Statistik (STA-1/2) | FE | `app/(publik)/statistik` | ✅ | ~~Anggaran~~ dihapus dari lingkup 28 Jul |
| 7  | Pengaduan: form, terkirim, lacak (LPR-1..4) | FE | `app/(publik)/pengaduan/**` | ✅ | — |
| 8  | Panel admin: 7 halaman + login | FE | `app/admin/**` | ✅ | — |
| 9  | `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, metadata | FE | `app/*` | ✅ | — |
| 10 | Prisma + Neon Postgres: skema Bab 8 + migrasi + seed dari `majegan.ts` | BE | `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db.ts` | ✅ | — |
| 11 | Auth admin: hash password, sesi cookie, `masuk`/`keluar` (AUTH-1) | BE | `lib/auth.ts`, `lib/sesi.ts`, `app/admin/aksi.ts` | ✅ | — |
| 12 | Proteksi route `/admin` + redirect ke `/admin/masuk` (AUTH-2) | BE | `src/proxy.ts` (Next 16: pengganti `middleware.ts`) | ✅ | — |
| 13 | Server action simpan pengaduan → DB, pakai `periksaPengaduan` + `buatKodeTiket` | BE | `app/(publik)/pengaduan/aksi.ts` | ✅ | — |
| 14 | Query lacak pengaduan by kode tiket (LPR-3) | BE | `app/(publik)/pengaduan/lacak` | ✅ | — |
| 15 | Rate limit + honeypot form pengaduan (anti-spam) | BE | `lib/pengaduan.ts` | ✅ | — |
| 16 | Admin CRUD berita + status Draft/Terbit (ADM-1) | BE | `app/admin/berita/**` | ✅ | — |
| 17 | Upload gambar (ADM-5) | BE | `lib/unggah.ts` | ⬜ | **satu-satunya modul tersisa** · butuh keputusan penampung berkas (disk VPS vs Blob); sementara isian URL + `remotePatterns` |
| 18 | Admin kelola profil & struktur organisasi (ADM-2) | BE | `app/admin/profil/**`, `lib/profil.ts` | ✅ | — |
| 19 | Admin kelola layanan (ADM-3) | BE | `app/admin/layanan/**`, `lib/layanan.ts` | ✅ | — |
| 20 | Admin tindak lanjut pengaduan: ubah status + tanggapan (ADM-4) | BE | `app/admin/pengaduan` | ✅ | — |
| 21 | Admin kelola statistik penduduk (ADM-7) | BE | `app/admin/statistik`, `lib/statistik.ts` | ✅ | ~~ADM-6 anggaran~~ dicoret |
| 22 | Dashboard admin: hitungan nyata dari DB (ADM-8) | BE | `app/admin/page.tsx` | ✅ | — |
| 23 | Super admin kelola akun (AUTH-3) + ganti password (AUTH-4) | BE | `app/admin/akun/**`, `app/admin/sandi` | ✅ | — |
| 24 | Ganti sumber data halaman publik: `majegan.ts` → query DB | FE+BE | `app/(publik)/**` | ✅ | `revalidate`/ISR menyusul di Minggu 5 |
| 25 | Deploy **VPS** + env (`DATABASE_URL`, `RAHASIA_SESI`, `NEXT_PUBLIC_URL`) | Infra | Bagian B | ⬜ | **dijadwalkan Minggu 3** · sewa VPS + 5 prasyarat |
| 26 | Sistem gambar: `<Foto>`, 11 ilustrasi SVG, `opengraph-image`, panduan tukar foto | FE | `components/potongan.tsx`, `public/gambar/` | ✅ | foto asli dari kalurahan |
| 27 | Responsif mobile + skeleton pemuatan | FE | `app/**/loading.tsx`, `components/situs.tsx` | ✅ | — |

Jalur kritis: **10 → 11 → 12 → 16** sudah tembus — itu yang membuka 18–23. Sisa jalur kritis sekarang **25 (deploy, Minggu 3)**, karena tanpa itu tidak ada yang bisa dilatihkan ke perangkat desa di Minggu 6.

---

## Plan Eksekusi — sisa Minggu 1 (26–29 Jul)

Target semula: task 10, 11, 12, 25 kelar. **Hasil: 10, 11, 12 selesai; task 25 (deploy) digeser ke Minggu 3.** Tiap langkah punya **cek:** — kalau ceknya gagal, jangan lanjut ke langkah berikutnya.

### Hari 1 (26 Jul) — Task 10: database

- [x] Buat project di [neon.tech](https://neon.tech), region Singapore. Salin *pooled* connection string
- [x] `.env.example` berisi nama variabel saja (tanpa nilai), `.gitignore` sudah `!.env.example`
- [x] `.env.local` → isi `DATABASE_URL`, `RAHASIA_SESI`, `SUPERADMIN_EMAIL`, `SUPERADMIN_SANDI`
- [x] `npm i @prisma/client && npm i -D prisma && npx prisma init --datasource-provider postgresql` — Prisma 7 + `@prisma/adapter-pg`, konfigurasi di `prisma.config.ts`
- [x] Tulis `prisma/schema.prisma`: 9 tabel Bab 8 PRD — `pengguna`, `halaman_profil`, `perangkat_desa`, `kategori_berita`, `berita`, `layanan`, `pengaduan`, `anggaran`, `statistik_penduduk`. **Lewati `umkm` & `galeri`** (Fase Lanjutan Bab 11)
- [x] Enum: `Peran`, `StatusBerita`, `StatusPengaduan`, `JenisAnggaran`, `KategoriStatistik` — samakan nilainya dengan tipe yang sudah ada di `src/content/majegan.ts:316,375` supaya frontend tidak perlu diubah
- [x] `@unique` pada `berita.slug`, `pengaduan.kode_tiket`, `pengguna.email`, `halaman_profil.slug`
- [x] `npx prisma migrate deploy` — SQL migrasi `20260726000000_awal` ditulis tangan, diterapkan bersih tanpa perlu `migrate dev`
- [x] `src/lib/db.ts` — singleton `PrismaClient` (tanpa ini, hot-reload dev bikin koneksi bocor sampai Neon nolak)
- [x] `prisma/seed.ts` — impor `berita`, `layanan`, `profil`, `statistik`, `peranPengguna` dari `majegan.ts`, `upsert` semuanya. Idempoten, aman dijalankan berulang *(blok anggaran dibuang 28 Jul bersama modulnya)*
- [x] **cek:** 9 tabel terisi, tidak ada yang kosong. `berita` 4 = `majegan.ts` 4, `layanan` 5 = 5. Superadmin `Sarjiman, S.Pd.` ada

### Hari 2 (27 Jul) — Task 11 & 12: auth + proteksi

- [x] `src/lib/auth.ts`:
      - `hashKataSandi` / `periksaKataSandi` pakai `scrypt` dari `node:crypto` — **tanpa bcrypt/next-auth**, cukup ~20 baris dan nol dependensi baru
      - `buatToken` / `bacaToken` (murni, mudah diuji) + `buatSesi` / `bacaSesi` di `src/lib/sesi.ts`: cookie ditandatangani HMAC-SHA256 (`RAHASIA_SESI` di env), isi `{id, nama, peran, exp}`. `httpOnly`, `secure`, `sameSite: lax`
      - bandingkan tanda tangan dengan `timingSafeEqual`, bukan `===`
- [x] `src/lib/auth.test.ts` — hash bolak-balik cocok, password salah ditolak, cookie yang diutak-atik ditolak, cookie kedaluwarsa ditolak. `npm test`: 11 lolos, 0 gagal
- [x] Server action `masuk` (di `src/app/admin/aksi.ts`) — terpasang ke `<form>` di `admin/masuk/page.tsx`, banner "Login belum aktif" sudah dihapus
- [x] Server action `keluar` — terpasang ke tombol di panel
- [x] Tambah superadmin ke `seed.ts` dari env (`SUPERADMIN_EMAIL`, `SUPERADMIN_SANDI`), jangan hardcode
- [x] `src/proxy.ts` — Next 16 mengganti nama `middleware.ts` → `proxy.ts`. `matcher: ["/admin", "/admin/((?!masuk).*)"]`; tanpa sesi valid → redirect ke `/admin/masuk`
- [x] Bonus: panel admin lepas dari `?peran=` dummy — `admin/page.tsx` & `admin/berita/baru` sekarang baca sesi via `wajibMasuk()`
- [ ] **cek:** buka `/admin` di jendela penyamaran → kelempar ke login. Masuk dengan sandi benar → tembus. Ubah 1 huruf cookie di DevTools → kelempar lagi

### Hari 3 (28 Jul) — Task 25: deploy — **digeser ke Minggu 3**

Persiapan kodenya tetap selesai di minggu ini; yang bergeser hanya pemasangan servernya.

- [x] `package.json`: `"build": "prisma generate && prisma migrate deploy && next build"`
- [x] `next.config.ts`: `output: "standalone"` — build teruji, `.next/standalone` 23 MB
- [x] Kode sudah aman: `origin/main` berisi seluruh 9 commit
- [ ] Pemasangan server — **Minggu 3**, mengikuti rencana di bagian B. Prasyarat deploy dikejar mulai Minggu 2 bareng permintaan konten

### Hari 4 (29 Jul) — Task 13–15: pengaduan masuk DB — ✅ selesai

Kodenya sudah jadi (lihat bagian **C**), tinggal cek manual lewat browser.

### Paralel — dipindah ke Minggu 2

Permintaan konten & izin statistik sekarang ada di daftar non-teknis **Minggu 2**, dikirim sekali jalan. Permintaan data APBDes dibatalkan (modulnya dihapus), MoM resmi dihapus dan diganti percakapan biasa dengan Dukuh.

---

## Langkah Berikutnya (mulai 26 Jul) — urut, jangan diacak

A dan C sudah selesai; database hidup dan seluruh cek otomatis lolos. **B (deploy) dijadwal ulang ke Minggu 3** — hambatannya bukan kode, tapi menyewa VPS dan lima prasyarat non-teknis. Kerjakan **D** dulu (Langkah 4 dst.), dan mulai kejar prasyarat deploy di Minggu 2 supaya Minggu 3 tinggal mengeksekusi rencana di bagian B.

### A. Nyalakan Neon & buktikan Hari 1–2 benar (≤ 1 jam, hari ini)

**✅ SELESAI 27 Jul 2026** — kecuali uji manual di browser (poin 6b).

1. [x] [neon.tech](https://neon.tech) → project baru, region **Singapore**, salin connection string **Pooled** (host-nya ada `-pooler`)
2. [x] `.env.local` — `RAHASIA_SESI` & `SUPERADMIN_SANDI` dibangkitkan acak, `DATABASE_URL` sudah string Neon asli
3. [x] `npx prisma migrate deploy` — diterapkan bersih, tidak perlu jatuh ke `migrate dev`
4. [x] `npx prisma db seed` — 4 berita, 5 layanan, 3 pengaduan, 1 pengguna
5. [x] **cek 1:** 9 tabel terisi, tidak ada yang kosong. `berita` & `layanan` jumlahnya sama dengan `majegan.ts`. Ada 1 `pengguna` berperan `superadmin`
6. [x] **cek 2a (otomatis):** `/`, `/berita`, `/pengaduan/lacak` balas `200` (sebelumnya `500` — inilah yang membuktikan halaman publik benar-benar membaca DB). `/admin` tanpa sesi balas `307` ke `/admin/masuk`. Hash sandi superadmin diverifikasi: sandi benar diterima, sandi salah ditolak. `npm test` 15 lolos
7. [ ] **cek 2b (manual, perlu browser):** login di `/admin/masuk` → tembus ke dashboard, nama `Sarjiman, S.Pd.` tampil. Ubah 1 huruf cookie `sesi_majegan` di DevTools → refresh → kelempar lagi. Tombol keluar → kembali ke login

> ⚠️ **Restart `npm run dev` setiap kali `.env.local` berubah.** `lib/db.ts:23` menyimpan `PrismaClient` di `globalThis`, jadi connection string lama tetap nempel di server yang sudah jalan meski berkas env-nya sudah diperbarui.

### B. Deploy — Task 25 · **dijadwalkan Minggu 3 (6–12 Ags)**

> **Jalur utama sekarang VPS, bukan Vercel.** Sebelum VPS disewa, selesaikan lima prasyarat non-teknis: pemegang akses, mata anggaran APBDes, metode pembayaran desa, dua kontak pengingat, dan alasan teknis tertulis.
>
> **B2–B6 di bawah tetap dipertahankan** sebagai jalan keluar bila VPS tidak terbiayai — kode ini netral penyedia, jadi checklist-nya tetap sahih kapan pun dibutuhkan.

#### B0. ✅ Push — selesai

- [x] Branch `fondasi-database-auth` sudah ada di `origin`
- [x] **cek:** `main` lokal = `origin/main`, 9 commit. Tidak ada lagi kerja yang cuma ada di satu laptop

#### B1. ✅ Gabungkan ke `main` — selesai

- [x] Seluruh kerja database, auth, dan panel admin sudah ada di `main`

#### B2. Hubungkan project (butuh Anda, ada login browser) — *jalur cadangan Vercel*

- [ ] `! npx vercel login` — otentikasi lewat browser, tidak bisa diwakilkan
- [ ] `! npx vercel link` — pilih scope pribadi, buat project baru, nama `padukuhan-majegan`

Setelah ini folder `.vercel/` muncul. **Sudah tercakup `.gitignore`** — jangan di-commit.

#### B3. Environment variables — 3 variabel, isi lewat dashboard

Vercel → Project → Settings → Environment Variables. Centang **Production + Preview + Development** untuk ketiganya.

| Variabel | Nilai | Catatan |
|---|---|---|
| `DATABASE_URL` | string Neon **Pooled** yang sama dengan `.env.local` | Wajib ada saat *build*, bukan cuma runtime — `prisma migrate deploy` jalan di dalam `build` |
| `RAHASIA_SESI` | **acak baru, jangan pakai punya lokal** | `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `NEXT_PUBLIC_URL` | `https://<nama-project>.vercel.app` | Baca peringatan di bawah |

Tiga hal yang benar-benar menggigit di sini:

- **`RAHASIA_SESI` produksi harus beda dari lokal.** Rahasia yang sama = cookie sesi dev Anda sah di produksi. Beda rahasia juga berarti sesi lokal otomatis ditolak produksi — itu memang yang diinginkan.
- **`NEXT_PUBLIC_*` dibekukan saat build, bukan dibaca saat runtime.** `situsUrl` (`majegan.ts:29`) adalah `const` tingkat modul, jadi nilainya ikut ter-*inline* ke bundel. Mengubahnya di dashboard **tidak berefek sampai ada redeploy**. Ada masalah ayam-telur: URL produksi baru diketahui setelah deploy pertama. Urutannya: deploy sekali → catat URL yang diberikan → isi `NEXT_PUBLIC_URL` → **Redeploy** dari dashboard.
- **Kalau `NEXT_PUBLIC_URL` kosong, fallback-nya `https://majegan.pandowoharjo.desa.id`** (`majegan.ts:15,29`) — domain yang belum aktif, bukan `localhost`. Akibatnya `sitemap.xml` & `robots.txt` menunjuk alamat mati dan Google mengindeks yang salah. Diam-diam, tanpa error.

#### B4. Deploy & cek

Merge ke `main` di B1 sudah otomatis memicu deploy. Kalau env baru diisi sesudahnya, picu ulang lewat **Redeploy**.

- [ ] Deploy pertama hijau. Kalau merah, buka Build Logs — tersangka pertama `prisma migrate deploy` (biasanya `DATABASE_URL` belum tercentang untuk environment yang dipakai build)
- [ ] Isi `NEXT_PUBLIC_URL` dengan URL asli → **Redeploy**
- [ ] **cek 1:** situs produksi terbuka, beranda menampilkan berita dari DB (bukan halaman error)
- [ ] **cek 2:** `/admin` di jendela penyamaran → kelempar ke `/admin/masuk`
- [ ] **cek 3:** login dengan `SUPERADMIN_EMAIL` → tembus. Ini sekaligus membuktikan cookie `secure: true` (`lib/sesi.ts:23`) jalan — di lokal flag itu mati karena bukan HTTPS, jadi **produksi adalah pertama kalinya jalur itu benar-benar diuji**
- [ ] **cek 4:** `/sitemap.xml` & `/robots.txt` menyebut domain produksi, bukan `.desa.id` maupun `localhost`
- [ ] **cek 5:** kirim 1 pengaduan dari produksi → kode tiket keluar → ketemu di `/pengaduan/lacak`

#### B5. Yang sengaja TIDAK dilakukan

- **Seed tidak ikut `build`.** Database produksi = database yang sama dengan lokal (satu project Neon), jadi isinya sudah ada. Menjalankan seed lagi tidak merusak (semuanya `upsert`) tapi tidak perlu. **Kalau nanti Neon dipisah jadi dua project** (dev & prod terpisah), seed produksi dijalankan sekali manual dari lokal dengan `DATABASE_URL` produksi.
- **Domain `desa.id` belum dipasang** — masih TBD di PRD. Subdomain `.vercel.app` sah untuk dipakai dan dilatihkan ke perangkat desa.
- **`engines.node` belum diset di `package.json`.** Vercel memakai Node default-nya; lokal jalan di Node 24. Kalau build gagal dengan galat sintaks yang aneh, itu tersangka pertama — set `"engines": { "node": ">=22" }`.

#### B6. Kepemilikan (jangan ditunda ke Minggu 6)

Akun VPS/Vercel & Neon sekarang atas nama pribadi Anda. PRD `:231` (TBD Bab 12) sudah menandai ini sebagai risiko keberlanjutan. Begitu email resmi desa tersedia, pindahkan kepemilikan — jangan tunggu minggu terakhir, transfer butuh email tujuan aktif dan itu sering yang paling lama ditunggu.

### C. Pengaduan masuk DB — Task 13, 14, 15 (28–29 Jul, 1 hari)

Ini modul *Wajib* pertama yang jadi utuh end-to-end, dan tidak bergantung ke CRUD admin.

- [x] **13** — server action `kirimPengaduan` di `src/app/(publik)/pengaduan/aksi.ts` (pola sama dengan `app/admin/aksi.ts`), `lib/pengaduan.ts` tetap bebas impor Prisma. Tabrakan `kodeTiket` ditangani: tangkap `P2002`, ulang maks 3×. Kolom `lokasi` ditambahkan ke model `Pengaduan` + SQL migrasi — form sudah punya isiannya tapi tabelnya belum
- [x] **14** — `pengaduan/lacak/page.tsx` pakai `db.pengaduan.findUnique` dengan `select` sempit (`kodeTiket, kategori, isi, status, tanggapan, dibuatPada`); nama & kontak pelapor tidak pernah ikut ke browser
- [x] **15** — jebakan bot (`NAMA_JEBAKAN` dipakai bersama form & action; terisi → sukses palsu, tidak disimpan) + rate limit `bolehKirim(ip)` 60 detik per IP di `lib/pengaduan.ts`, ada tesnya. `npm test`: 12 lolos
- [ ] **cek (DB sudah siap — tinggal dijalankan di browser):** kirim laporan → dapat kode tiket → muncul di `prisma studio` → kode itu ketemu di `/pengaduan/lacak`, kode ngawur tidak ketemu, dan **View Source** halaman lacak tidak memuat nama/kontak pelapor. Kirim 2× beruntun → yang kedua ditolak

### D. ✅ Seluruh modul admin — selesai 28 Jul

Task 16, 18, 19, 20, 21, 22, 23, 24 semuanya jadi. Empat lapisan yang sama di tiap modul:
`lib/<modul>.ts` (query + pemetaan) → `app/admin/<modul>/aksi.ts` (server action) → `app/admin/<modul>/page.tsx` (daftar/form) → halaman publik ganti impor.

Diverifikasi lawan Neon: `next build` hijau, seluruh halaman publik balas `200` dan memuat isi dari DB, seluruh halaman admin balas `307` ke `/admin/masuk` tanpa sesi, dan dengan sesi superadmin menampilkan data sungguhan. `npm test`: 23 lolos.

**Sisa satu: task 17 (unggah gambar).** Sengaja ditahan — penampung berkasnya bergantung pada tempat situs berjalan, dan itu belum ditentukan sampai VPS disewa. Sampai saat itu komposer & form perangkat memakai isian URL, dengan daftar host yang diizinkan di `next.config.ts`.

---

## Plan Frontend — halaman admin yang belum ada + lepas dari data dummy

Prasyarat: **langkah A (Neon) sudah jalan**. Semua di bawah ini menulis/membaca DB; dibangun sebelum itu = UI kosong yang tidak bisa diuji.

### Aturan main — berlaku di semua langkah, tulis sekali di sini biar tidak diulang

- **Sesi:** panggil `wajibMasuk()` (atau `wajibSuperadmin()`) di awal tiap page. Keduanya sudah ada di `lib/sesi.ts` — jangan bikin pengecekan peran versi baru
- **Form:** `<form action={serverAction}>` biasa + `revalidatePath`. Tanpa react-hook-form, tanpa `useState`, tanpa API route — server action sudah cukup dan halamannya tetap jalan tanpa JS
- **Server action:** satu `aksi.ts` per modul (`app/admin/<modul>/aksi.ts`), pola persis `app/admin/aksi.ts` & `app/(publik)/pengaduan/aksi.ts`
- **Validasi:** fungsi murni di `lib/`, tanpa impor Prisma, seperti `periksaPengaduan` — supaya bisa dites lewat `npm test`
- **Hapus:** tanpa `confirm()` JS. Tombol Hapus → `?konfirmasi=<id>` → panel konfirmasi muncul di halaman yang sama → tombol kedua benar-benar menghapus
- **Daftar:** server component, query langsung di page-nya. Tabel di `md:` ke atas, kartu di mobile — sama seperti halaman publik
- **Slug & kode unik:** tangani `P2002` dengan mengulang, seperti `kodeTiket` di `pengaduan/aksi.ts`

### Langkah 0 — ✅ shell admin jadi satu komponen

- [x] `app/admin/kerangka.tsx` — `<Kerangka>` (sidebar + menu atas + kolom isi) dan `<BilahKomposer>` (bilah atas halaman penuh)
- [x] `admin/page.tsx` pakai `<Kerangka>`; halaman baru cukup 2 baris untuk dapat bingkai yang sama

> Menyimpang dari rencana awal: **bukan** route group + `layout.tsx`. Komposer berita sengaja tampil penuh tanpa sidebar (sesuai mockup), dan layout bersama akan memaksakan sidebar ke sana. Komponen dipanggil per halaman lebih jujur daripada layout yang harus diakali.

### Langkah 1 — ✅ `/admin/berita`: daftar, sunting, Draft↔Terbit, hapus (ADM-1, task 16)

- [x] `app/admin/berita/page.tsx` — daftar semua berita + lencana DRAF/TERBIT, tombol Lihat, Sunting, Hapus
- [x] `app/admin/berita/[id]/page.tsx` — sunting memakai `<Komposer>` yang sama, lewat prop `awal`
- [x] `komposer.tsx` jadi `<form action={simpanBerita}>`; "Tayangkan" & "Simpan Draf" = dua tombol submit `name="status"`
- [x] `berita/aksi.ts` — `simpanBerita` (create/update), `hapusBerita`, `revalidatePath` halaman publik
- [x] Slug dari judul (`lib/teks.ts`), unik dengan sufiks `-2`, `-3`; **slug lama dipertahankan** saat judul disunting supaya tautan yang sudah tersebar di WhatsApp tidak mati
- [x] `menuAdmin` — "Berita" mengarah ke `/admin/berita`
- [ ] **cek (DB sudah siap — tinggal dijalankan di browser):** simpan draf → muncul di daftar berlencana DRAF, tidak muncul di `/berita`. Terbitkan → muncul. Sunting judul → slug tidak berubah. Hapus → hilang dari keduanya

Dua hal yang berubah dari mockup, sengaja:

- **Pemilih berkas foto dihapus**, diganti isian tautan gambar. File-nya belum bisa dikirim ke mana pun sampai ADM-5, jadi dropzone yang membuang berkas diam-diam lebih berbahaya daripada tidak ada. Foto jadi opsional supaya berita tetap bisa terbit
- **Lencana angka "3" di menu Pengaduan dihapus** — angkanya hardcoded; hitungan nyata sudah ada di dashboard

### Langkah 2 — ✅ berita publik lepas dari `majegan.ts` (task 24, sebagian)

- [x] `lib/berita.ts` — satu sumber query (`beritaTerbit`, `beritaSlug`), hasilnya dipetakan ke tipe `Berita` yang sudah dipakai `KartuAlbum`/`KartuRingkas`/halaman detail, jadi **nol komponen tampilan disentuh**
- [x] `(publik)/berita/page.tsx`, `berita/[slug]/page.tsx`, blok berita di beranda → dari DB, hanya `status: "terbit"`
- [x] Draf tidak bisa dibuka warga meski slug-nya ketebak
- [x] `sitemap.ts` juga dari DB — sebelumnya menyebut slug dummy, jadi berita baru tidak terdaftar dan yang dihapus tetap tercatat
- [ ] **cek (DB sudah siap — tinggal dijalankan di browser):** terbitkan berita dari panel → refresh `/berita` → langsung ada

> `generateStaticParams` + `revalidate` **ditunda**, halaman publik dirender on-demand dulu (`dynamic = "force-dynamic"`). Alasannya: prerender saat build menuntut koneksi DB, dan itu bikin `next build` gagal selama Neon belum ada. Pasang ISR di Minggu 5 — sudah jadi task di daftar Minggu 5.

### Langkah 3 — ✅ `/admin/pengaduan` (ADM-4, task 20) + dashboard nyata (ADM-8, task 22)

- [x] `app/admin/pengaduan/page.tsx` — daftar + saring per status, tanda peringatan bila laporan diproses tapi belum ada tanggapan tertulis
- [x] `app/admin/pengaduan/[id]/page.tsx` — detail + form ubah status & tulis tanggapan (wireframe 2j)
- [x] Nama & kontak pelapor tampil **hanya** di panel ini; laporan anonim menampilkan penjelasan bahwa kontaknya memang tidak pernah disimpan
- [x] **Status SELESAI ditolak tanpa tanggapan** — tanggapan itu satu-satunya yang dibaca warga di halaman Lacak
- [x] Dashboard: `ringkasanAdmin` & `pengaduanTerbaru` statis diganti `count()` per status + 5 pengaduan terakhir dari DB
- [x] `LencanaStatus` di `components/potongan.tsx` — satu komponen, menggantikan 3 salinan peta warna status
- [ ] **cek (DB sudah siap — tinggal dijalankan di browser):** ubah status di panel → warga melihat perubahannya di `/pengaduan/lacak` dengan kode tiketnya

### Langkah 4–7 — sisa modul, pola sama persis

Tiap langkah punya bentuk yang identik, jadi ditulis sekali di sini:

> **daftar/form admin** (`app/admin/<modul>/page.tsx`) → **`aksi.ts`** (server action + `revalidatePath`) → **`lib/<modul>.ts`** (query publik, hasilnya dipetakan ke tipe yang sudah dipakai komponen) → **ganti impor di halaman publik** → **buka `belum: true` di `menuAdmin`** → **cek admin-ke-publik**.

`lib/berita.ts` + `admin/berita/aksi.ts` adalah contoh lengkapnya — tiru struktur berkasnya, jangan bikin pola baru. Aturan main di atas (sesi, form, validasi, hapus, `P2002`) berlaku penuh dan tidak diulang di bawah.

---

#### Langkah 4 — ✅ `/admin/profil` (ADM-2, task 18) · selesai 28 Jul

Dua tabel dalam satu halaman: `halaman_profil` (naskah) dan `perangkat_desa` (struktur).

- [ ] `app/admin/profil/page.tsx` — `wajibSuperadmin()`. Dua bagian dalam satu `<Kerangka>`:
      - **Naskah**: `db.halamanProfil.findMany()` → satu `<form>` per baris (`sejarah`, `visi-misi`). Isian: judul, `<textarea>` konten, checkbox **Draft**
      - **Struktur**: `db.perangkatDesa.findMany({ orderBy: { urutan: "asc" } })` → tabel (md:) / kartu (mobile), tiap baris punya form sunting inline + tombol Hapus. Satu form kosong di bawah untuk menambah
- [ ] `app/admin/profil/aksi.ts` — `simpanHalaman`, `simpanPerangkat` (`id` kosong → `create`, ada → `update`), `hapusPerangkat`. Semua `revalidatePath("/profil")` + `revalidatePath("/")`
- [ ] `lib/profil.ts` — rakit objek berbentuk sama dengan `profil` di `majegan.ts` (`sejarah: string[]`, `visi`, `misi[]`, `visiMisiDraft`, `dukuh`, `perangkat[]`) supaya `(publik)/profil/page.tsx` cuma ganti satu baris impor
- [ ] `(publik)/profil/page.tsx` → pakai `lib/profil.ts`

Keputusan yang diambil di muka:

- **Konten = `<textarea>` polos, paragraf dipisah baris kosong** — persis perlakuan `konten` berita (`split(/\n{2,}/)` di `lib/berita.ts`). Tanpa editor rich text; kalau nanti benar-benar perlu tebal/miring, baru pertimbangkan
- **`visi` & `misi` disimpan sebagai satu naskah `visi-misi`**, baris kosong pertama memisah visi dari butir misi — begitu cara `seed.ts:88` menulisnya. Jangan pecah jadi dua tabel
- **Urutan perangkat pakai isian angka**, bukan drag & drop. `urutan: 0` = Dukuh (tampil di kartu kepala halaman)
- **Foto perangkat menunggu task 17**; sampai itu jadi, kolomnya isian URL dan `<Foto>` menampilkan placeholder saat kosong

- [ ] **cek:** ubah 1 kalimat sejarah di panel → refresh `/profil` → berubah. Centang Draft di visi-misi → label DRAFT muncul di halaman publik. Tambah 1 Ketua RT → muncul di struktur organisasi, urut sesuai angkanya. Hapus → hilang

---

#### Langkah 5 — ✅ `/admin/layanan` (ADM-3, task 19) · selesai 28 Jul

- [ ] `app/admin/layanan/page.tsx` — daftar layanan (nama, durasi, biaya, urutan) + tombol Sunting/Hapus, tombol "Layanan Baru"
- [ ] `app/admin/layanan/[id]/page.tsx` + `baru/page.tsx` — satu komponen form dipakai keduanya lewat prop `awal`, persis cara `<Komposer>` dipakai `berita/baru` dan `berita/[id]`
- [ ] `app/admin/layanan/aksi.ts` — `simpanLayanan`, `hapusLayanan`. Slug dari nama pakai `slugkan()`; **slug lama dipertahankan saat disunting** (alasan sama dengan berita: tautan sudah tersebar)
- [ ] `lib/layanan.ts` — pemetaan ke tipe `Layanan` yang sudah ada di `majegan.ts:207`
- [ ] `(publik)/layanan/[[...slug]]/page.tsx` → pakai `lib/layanan.ts`

Dua celah skema yang harus diputuskan **sebelum** menulis formnya (`seed.ts:107` diam-diam membuang keduanya):

- **`namaSingkat` tidak punya kolom.** Dipakai di daftar samping halaman layanan. → turunkan dari `namaLayanan` di pemetaan, jangan tambah kolom. Kalau nanti ada nama yang benar-benar kepanjangan, baru tambah `nama_singkat`
- **`berkas.ukuran` tidak punya kolom**, hanya `fileTemplat` (namanya). → buang tampilan ukurannya. Angka ukuran yang tidak pernah bisa diperbarui admin lebih menyesatkan daripada tidak ada
- **`persyaratan` (`String[]`) & `alur` (`Json`)**: satu `<textarea>` masing-masing, satu baris = satu item. `alur` dipecah `judul | detail` dengan pemisah `|`. Parsernya fungsi murni di `lib/layanan-teks.ts` + satu tes — ini satu-satunya bagian modul ini yang bisa salah diam-diam

- [ ] **cek:** bikin layanan baru → muncul di `/layanan` dan punya halaman sendiri. Sunting syarat (tambah 1 baris) → bertambah di publik. Sunting nama → slug tidak berubah. Hapus → 404 di publik

---

#### Langkah 6 — ✅ `/admin/statistik` (ADM-7, task 21) · selesai 28 Jul

> ~~`/admin/anggaran` (ADM-6)~~ **dicoret 28 Jul** bersama modul publiknya. Langkah ini jadi tinggal separuh — bagian yang paling banyak jebakannya (BigInt, kolom `diperbarui` yang tidak ada) ikut hilang.

- [ ] `app/admin/statistik/page.tsx` + `aksi.ts` — tabel `tahun × kategori × label → nilai`. `@@unique([tahun, kategori, label])` sudah ada, jadi pakai `upsert`, bukan create+cek
- [ ] `lib/statistik.ts` → bentuknya sama dengan `statistik` & `kelompokUsia` di `majegan.ts`
- [ ] `(publik)/statistik/page.tsx` dan teaser statistik di beranda → pakai lib baru
- [ ] `menuAdmin` — buka `belum: true` pada entri Statistik (`majegan.ts`)

Jebakan konkret:

- **Kategori statistik `jenis_kelamin`, `pekerjaan`, `pendidikan` ada di enum tapi tidak ditampilkan di UI mana pun.** Form admin hanya melayani `ringkasan` & `usia` — yang benar-benar dipakai. Menambah isian untuk data yang tidak pernah tampil = form yang membuang isian admin diam-diam
- **`kelompokUsia.persen`** disimpan sebagai `nilai` (0–100), bukan jumlah jiwa. Beri label jelas di form supaya admin tidak mengisi jumlah orang
- **Tahun data ditulis tetap `2026` di `seed.ts`**, bukan tahun berjalan — kunci upsert harus stabil. Form admin perlu isian tahun yang eksplisit, jangan diam-diam memakai `new Date().getFullYear()`

- [ ] **cek:** ubah jumlah jiwa di panel → angka di beranda & `/statistik` ikut berubah. Ubah 1 persen kelompok usia → panjang bar berubah

---

#### Langkah 7 — ✅ `/admin/akun` (AUTH-3/4, task 23) · selesai 28 Jul

- [ ] `app/admin/akun/page.tsx` — `wajibSuperadmin()`. Daftar pengguna (nama, email, peran, aktif) + form tambah admin
- [ ] `app/admin/akun/aksi.ts` — `simpanPengguna` (peran, aktif/nonaktif), `hapusPengguna`, `gantiSandi`. Hash pakai `hashKataSandi()` yang sudah ada di `lib/auth.ts` — jangan tulis ulang
- [ ] `app/admin/sandi/page.tsx` (AUTH-4) — ganti sandi sendiri, terbuka untuk peran `admin` juga. Wajib isi sandi lama, verifikasi dengan `periksaKataSandi()`

Pengaman yang **tidak boleh disederhanakan**:

- **Superadmin terakhir tidak boleh dihapus atau diturunkan perannya.** `count({ where: { peran: "superadmin", aktif: true } }) <= 1` → tolak. Tanpa ini panel bisa terkunci permanen dan hanya bisa dipulihkan lewat Neon console
- **Jangan hapus akun yang pernah menulis berita** — relasi `penulis` sudah `onDelete: SetNull`, jadi beritanya selamat, tapi lebih jujur pakai `aktif: false` supaya nama penulis tetap terbaca. Hapus permanen hanya untuk akun yang belum pernah menulis
- **Sandi baru minimal 12 karakter**, dicek fungsi murni di `lib/auth.ts` + tes. Ini satu-satunya pintu masuk panel

- [ ] **cek:** bikin admin baru → bisa login → tidak melihat menu bertanda `superadmin: true` → langsung buka `/admin/akun` lewat URL tetap dilempar ke `/admin`. Ganti sandi sendiri → sandi lama ditolak. Coba hapus superadmin terakhir → ditolak

### Langkah 8 — sisa kecil (Minggu 5, saat polish)

- [ ] Unggah gambar (ADM-5, task 17) — sampai ini jadi, komposer pakai isian URL manual (host yang diizinkan diatur di `next.config.ts`) dan 11 ilustrasi SVG di `public/gambar/` menutupi slot yang kosong. Ganti ilustrasi dengan foto asli memakai nama berkas dan rasio yang sama.
- [ ] Hitungan suka & tanggapan di detail berita (sekarang statis) — atau buang saja kalau tidak ada yang memakainya
- [ ] URL sosial media & WhatsApp di footer, begitu datanya turun dari kalurahan

### Peta ke jadwal mingguan

| Minggu | Langkah | Status |
|---|---|---|
| 2 (30 Jul–5 Ags) | 0, 1, 2, 4 | ✅ semua · tersisa **kirim permintaan konten & izin statistik** |
| 3 (6–12 Ags) | 5, 3 | ✅ semua · tersisa **deploy VPS (bagian B)** |
| 4 (13–19 Ags) | 6, 7 | ✅ semua |
| 5 (20–26 Ags) | 8 + polish | responsif ✅ · sisa unggah gambar, ISR, testing |

**Seluruh Langkah 0–7 selesai pada 28 Jul — tiga minggu di depan jadwal.** Yang tersisa bukan lagi soal koding: deploy, konten asli dari kalurahan, dan pelatihan. Jangan pakai kelonggaran ini untuk menambah fitur; pakai untuk **deploy lebih awal**, supaya uji coba bareng perangkat desa (Minggu 5) berlangsung di situs sungguhan dan bukan di laptop.

---

## Rencana Cadangan (kalau ada minggu yang molor)

- **Sudah dikorbankan 28 Jul:** modul Transparansi Anggaran (APBDes) — dihapus seluruhnya, bukan sekadar disederhanakan.
- **Boleh dikorbankan berikutnya:** modul Statistik Penduduk (prioritas *Penting*, bukan *Wajib*) — kalau Minggu 4 mepet, biarkan angkanya diperbarui lewat `prisma studio` dan lewati `/admin/statistik`. Sesudah itu tidak ada lagi yang aman dicoret; sisanya semua *Wajib*.
- **Tidak boleh dikorbankan:** Minggu 6 (pelatihan + serah terima) — inti dari tujuan keberlanjutan proker. Deploy Minggu 3 juga tidak boleh molor lagi, karena Minggu 5 dan 6 sama-sama menuntut situs yang sudah hidup.
- **Blocker paling mungkin bukan soal koding**, tapi kelengkapan & izin konten dari kalurahan. Sekarang dikejar mulai Minggu 2 — jangan mundur lagi.
