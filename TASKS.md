# TASKS — Proker Utama Website DesaKu

**Durasi:** 6 minggu · **Tim:** 1 orang (solo dev)
**Mulai:** 23 Juli 2026

> Cara pakai: centang `- [ ]` jadi `- [x]` tiap task selesai. Kalau ada minggu yang molor, cek bagian **Rencana Cadangan** di paling bawah sebelum menggeser jadwal minggu berikutnya.

---

## Minggu 1 (23–29 Jul) — Fondasi & Koordinasi Awal

**Teknis**
- [x] Setup Next.js (App Router) + TypeScript + Tailwind, inisialisasi repo Git
- [ ] Setup Prisma + Neon Postgres, migrasi skema inti Bab 8 (`pengguna`, `halaman_profil`, `perangkat_desa`, `berita`, `kategori_berita`, `layanan`, `pengaduan`) — *skema, migrasi & seed sudah ditulis; project Neon belum dibuat sehingga belum pernah dijalankan*
- [x] Autentikasi admin dasar (AUTH-1, AUTH-2) — login + proteksi route `/admin`
- [x] Struktur folder: route group publik vs admin, layout dasar mobile-first (wireframe 1a–1e)
- [ ] Deploy awal ke Vercel (Hobby)

**Non-teknis / koordinasi ke kalurahan**
- [ ] MoM resmi dengan pemerintah desa — jawab TBD Bab 12 (nama resmi, kebijakan anonim, admin/super admin, target rilis)
- [ ] Minta konten: naskah sejarah desa, foto perangkat, daftar layanan resmi
- [ ] Minta izin publikasi data APBDes & statistik penduduk (blocker paling umum — kejar dari sekarang)

**Target minggu ini:** project ter-deploy (skeleton), skema DB jalan, admin bisa login, TBD PRD mulai terjawab.

---

## Minggu 2 (30 Jul–5 Ags) — Profil Desa & Berita

**Teknis**
- [ ] Beranda publik (pilih varian wireframe 1a/1b/1c, atau gabungkan)
- [ ] Profil Desa publik: sejarah, visi-misi, struktur organisasi, kontak & peta (PRF-2/3/4, wireframe 1d/1e)
- [ ] Admin: CRUD Berita + status Draft/Terbit (ADM-1)
- [ ] Publik: daftar & detail berita (BRT-1/2/3/4, wireframe 2a)
- [ ] Admin: kelola profil desa & struktur organisasi (ADM-2)
- [ ] Upload gambar (ADM-5) — setup Vercel Blob / Cloudinary

**Non-teknis**
- [ ] Input konten asli begitu data dari kalurahan masuk

**Target minggu ini:** Beranda, Profil Desa, Berita (publik + admin) jalan end-to-end dengan konten mendekati asli.

---

## Minggu 3 (6–12 Ags) — Layanan Administrasi & Pengaduan

**Teknis**
- [ ] Publik: Informasi Layanan Administrasi (LYN-1/2/3, wireframe 2b)
- [ ] Admin: kelola layanan (ADM-3)
- [ ] Publik: Formulir Pengaduan (LPR-1/2/4, wireframe 2c)
- [ ] Publik: Lacak Pengaduan via kode tiket (LPR-3, wireframe 2d)
- [ ] Admin: tindak lanjut pengaduan — ubah status, tulis tanggapan (ADM-4, wireframe 2j)
- [ ] Tautan WhatsApp (wa.me) di titik kontak

**Non-teknis**
- [ ] Validasi ulang syarat & alur tiap layanan bersama perangkat desa berwenang

**Target minggu ini:** Flow 7.1 (kirim & lacak pengaduan) dan 7.2 (cari info layanan) jalan penuh dari sisi warga maupun admin.

---

## Minggu 4 (13–19 Ags) — Anggaran, Statistik, Dashboard Admin

**Teknis**
- [ ] Publik: Transparansi Anggaran (APB-1/2/3, wireframe 2e)
- [ ] Publik: Statistik Penduduk (STA-1/2, wireframe 2f)
- [ ] Admin: kelola anggaran per tahun (ADM-6)
- [ ] Admin: kelola statistik penduduk (ADM-7) — belum ada di wireframe admin, cukup form input sederhana
- [ ] Dashboard admin ringkas (ADM-8, wireframe 2h)
- [ ] AUTH-3 (super admin kelola akun admin) & AUTH-4 (ganti password)

**Non-teknis**
- [ ] Kejar izin publikasi data APBDes & statistik kalau minggu 1 belum turun

**Target minggu ini:** Seluruh modul MVP (Wajib + sebagian besar Penting) punya versi publik & admin yang jalan.

---

## Minggu 5 (20–26 Ags) — Polish, Responsif, Performa, Testing

**Teknis**
- [ ] Review responsif mobile-first semua halaman vs wireframe mobile
- [ ] Terapkan ISR/static generation untuk halaman publik
- [ ] Metadata & sitemap dasar (SEO)
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
- [ ] Pindahkan kepemilikan akun layanan (Vercel, Neon, dll) ke email resmi desa
- [ ] Final deploy & cek status domain (subdomain `.vercel.app` kalau `desa.id` belum siap)

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
| 2  | Beranda (1a–1c) | FE | `app/(publik)/page.tsx` | 🟡 | 10 |
| 3  | Profil desa (PRF-2/3/4) | FE | `app/(publik)/profil/page.tsx` | 🟡 | 10 |
| 4  | Berita: daftar + detail (BRT-1..4) | FE | `app/(publik)/berita/**` | 🟡 | 10 |
| 5  | Layanan (LYN-1/2/3) | FE | `app/(publik)/layanan/[[...slug]]/page.tsx` | 🟡 | 10 |
| 6  | Anggaran (APB-1/2/3) & Statistik (STA-1/2) | FE | `app/(publik)/anggaran`, `/statistik` | 🟡 | 10 |
| 7  | Pengaduan: form, terkirim, lacak (LPR-1..4) | FE | `app/(publik)/pengaduan/**` | 🟡 | 13, 14 |
| 8  | Panel admin: login, dashboard, form berita | FE | `app/admin/**` | 🟡 | 16, 22 |
| 9  | `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, metadata | FE | `app/*` | ✅ | — |
| 10 | Prisma + Neon Postgres: skema Bab 8 + migrasi + seed dari `majegan.ts` | BE | `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db.ts` | 🟡 | Neon |
| 11 | Auth admin: hash password, sesi cookie, `masuk`/`keluar` (AUTH-1) | BE | `lib/auth.ts`, `lib/sesi.ts`, `app/admin/aksi.ts` | ✅ | — |
| 12 | Proteksi route `/admin` + redirect ke `/admin/masuk` (AUTH-2) | BE | `src/proxy.ts` (Next 16: pengganti `middleware.ts`) | ✅ | — |
| 13 | Server action simpan pengaduan → DB, pakai `periksaPengaduan` + `buatKodeTiket` | BE | `app/(publik)/pengaduan/aksi.ts` | 🟡 | Neon |
| 14 | Query lacak pengaduan by kode tiket (LPR-3) | BE | `app/(publik)/pengaduan/lacak` | 🟡 | Neon |
| 15 | Rate limit + honeypot form pengaduan (anti-spam) | BE | `lib/pengaduan.ts` | ✅ | — |
| 16 | Admin CRUD berita + status Draft/Terbit (ADM-1) | BE | `app/admin/berita/**` | ⬜ | 10, 12 |
| 17 | Upload gambar via Vercel Blob (ADM-5) | BE | `lib/unggah.ts` | ⬜ | 12 |
| 18 | Admin kelola profil & struktur organisasi (ADM-2) | BE | `app/admin/profil` | ⬜ | 16, 17 |
| 19 | Admin kelola layanan (ADM-3) | BE | `app/admin/layanan` | ⬜ | 16 |
| 20 | Admin tindak lanjut pengaduan: ubah status + tanggapan (ADM-4) | BE | `app/admin/pengaduan` | ⬜ | 13, 16 |
| 21 | Admin kelola anggaran (ADM-6) & statistik (ADM-7) | BE | `app/admin/anggaran`, `/statistik` | ⬜ | 16 |
| 22 | Dashboard admin: hitungan nyata dari DB (ADM-8) | BE | `app/admin/page.tsx` | ⬜ | 16, 20 |
| 23 | Super admin kelola akun (AUTH-3) + ganti password (AUTH-4) | BE | `app/admin/pengguna` | ⬜ | 11 |
| 24 | Ganti sumber data halaman publik: `majegan.ts` → query DB, pasang `revalidate` | FE+BE | `app/(publik)/**` | ⬜ | 16–21 |
| 25 | Deploy Vercel + env (`DATABASE_URL`, secret sesi, token Blob) | Infra | — | ⬜ | 10, 11 |

Jalur kritis: **10 → 11 → 12 → 16** membuka hampir semua sisa task admin. Task 13–15 bisa jalan paralel setelah 10.

---

## Plan Eksekusi — sisa Minggu 1 (26–29 Jul)

Target: task 10, 11, 12, 25 kelar. Tiap langkah punya **cek:** — kalau ceknya gagal, jangan lanjut ke langkah berikutnya.

### Hari 1 (26 Jul) — Task 10: database

- [ ] Buat project di [neon.tech](https://neon.tech), region Singapore. Salin *pooled* connection string
- [x] `.env.example` berisi nama variabel saja (tanpa nilai), `.gitignore` sudah `!.env.example`
- [ ] `.env.local` → isi `DATABASE_URL`, `RAHASIA_SESI`, `SUPERADMIN_EMAIL`, `SUPERADMIN_SANDI` (berkasnya belum ada)
- [x] `npm i @prisma/client && npm i -D prisma && npx prisma init --datasource-provider postgresql` — Prisma 7 + `@prisma/adapter-pg`, konfigurasi di `prisma.config.ts`
- [x] Tulis `prisma/schema.prisma`: 9 tabel Bab 8 PRD — `pengguna`, `halaman_profil`, `perangkat_desa`, `kategori_berita`, `berita`, `layanan`, `pengaduan`, `anggaran`, `statistik_penduduk`. **Lewati `umkm` & `galeri`** (Fase Lanjutan Bab 11)
- [x] Enum: `Peran`, `StatusBerita`, `StatusPengaduan`, `JenisAnggaran`, `KategoriStatistik` — samakan nilainya dengan tipe yang sudah ada di `src/content/majegan.ts:316,375` supaya frontend tidak perlu diubah
- [x] `@unique` pada `berita.slug`, `pengaduan.kode_tiket`, `pengguna.email`, `halaman_profil.slug`
- [ ] `npx prisma migrate dev --name awal` — SQL migrasi `20260726000000_awal` sudah ditulis tangan, **belum pernah diterapkan ke database**
- [x] `src/lib/db.ts` — singleton `PrismaClient` (tanpa ini, hot-reload dev bikin koneksi bocor sampai Neon nolak)
- [x] `prisma/seed.ts` — impor `berita`, `layanan`, `profil`, `anggaran`, `statistik`, `peranPengguna` dari `majegan.ts`, `upsert` semuanya. Idempoten, aman dijalankan berulang
- [ ] **cek:** `npx prisma studio` → tiap tabel ada isinya, jumlah berita cocok dengan `majegan.ts`

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

### Hari 3 (28 Jul) — Task 25: deploy

- [x] `package.json`: `"build": "prisma generate && prisma migrate deploy && next build"`
- [ ] `vercel link` lalu set env di dashboard: `DATABASE_URL`, `RAHASIA_SESI`, `NEXT_PUBLIC_URL`
- [ ] Push ke `main` → deploy jalan
- [ ] **cek:** situs produksi kebuka, `/admin` masih terkunci, login jalan di produksi, `/sitemap.xml` & `/robots.txt` merujuk domain yang benar

### Hari 4 (29 Jul) — Task 13–15: pengaduan masuk DB

Rinciannya di bagian **Langkah Berikutnya** di bawah — tidak butuh auth, jadi aman dikerjakan duluan sebelum CRUD admin.

### Paralel — kirim hari ini juga, jangan nunggu koding

- [ ] Surat/pesan ke kalurahan: izin publikasi APBDes & statistik penduduk
- [ ] Minta naskah sejarah desa, foto perangkat + jabatan, daftar layanan resmi beserta syaratnya
- [ ] Ajukan jadwal MoM untuk jawab TBD Bab 12 (nama resmi, kebijakan anonim, siapa admin/super admin, target rilis)

---

## Langkah Berikutnya (mulai 26 Jul) — urut, jangan diacak

Kode Hari 1 & 2 sudah ditulis semua. Yang menghambat sekarang **satu hal**: belum ada database sungguhan, jadi tidak ada satu pun cek yang bisa dijalankan. Selesaikan A dulu — B, C, D semuanya menunggu di belakangnya.

### A. Nyalakan Neon & buktikan Hari 1–2 benar (≤ 1 jam, hari ini)

1. [ ] [neon.tech](https://neon.tech) → project baru, region **Singapore**, salin connection string **Pooled** (host-nya ada `-pooler`)
2. [x] `.env.local` sudah dibuat — `RAHASIA_SESI` & `SUPERADMIN_SANDI` sudah dibangkitkan acak. **Tinggal ganti `DATABASE_URL`** (sekarang masih placeholder) dengan string dari langkah 1
3. [ ] `npx prisma migrate deploy` — SQL-nya sudah ditulis tangan, jadi `deploy` bukan `dev`. Kalau ditolak, hapus folder `prisma/migrations/20260726000000_awal` lalu `npx prisma migrate dev --name awal` supaya Prisma yang membuat sendiri
4. [ ] `npx prisma db seed`
5. [ ] **cek 1:** `npx prisma studio` → 9 tabel terisi, jumlah baris `berita` sama dengan `majegan.ts`, ada 1 baris `pengguna` berperan `superadmin`
6. [ ] **cek 2 (ini yang memvalidasi Task 11 & 12):** `npm run dev` → buka `/admin` di jendela penyamaran → kelempar ke `/admin/masuk`. Login pakai `SUPERADMIN_EMAIL` + sandi → tembus ke dashboard, nama asli dari DB tampil. Ubah 1 huruf cookie `sesi_majegan` di DevTools → refresh → kelempar lagi. Tombol keluar → kembali ke login

> Kalau cek 2 gagal, **berhenti di sini** dan perbaiki. Semua task admin sesudahnya bertumpu pada sesi ini.

### B. Deploy ke Vercel — Task 25 (27 Jul, ½ hari)

Pakai checklist **Hari 3** di atas. Dua hal yang sering bikin gagal:

- Gunakan `DATABASE_URL` pooled yang sama di Vercel; `prisma migrate deploy` sudah ada di skrip `build`, jadi migrasi jalan otomatis saat deploy
- Set `NEXT_PUBLIC_URL` ke domain produksi sebelum push, kalau tidak `sitemap.xml` & `robots.txt` menunjuk `localhost`

Seed **tidak** ikut `build` (sengaja). Setelah deploy pertama sukses, jalankan sekali dari lokal dengan `DATABASE_URL` produksi.

### C. Pengaduan masuk DB — Task 13, 14, 15 (28–29 Jul, 1 hari)

Ini modul *Wajib* pertama yang jadi utuh end-to-end, dan tidak bergantung ke CRUD admin.

- [x] **13** — server action `kirimPengaduan` di `src/app/(publik)/pengaduan/aksi.ts` (pola sama dengan `app/admin/aksi.ts`), `lib/pengaduan.ts` tetap bebas impor Prisma. Tabrakan `kodeTiket` ditangani: tangkap `P2002`, ulang maks 3×. Kolom `lokasi` ditambahkan ke model `Pengaduan` + SQL migrasi — form sudah punya isiannya tapi tabelnya belum
- [x] **14** — `pengaduan/lacak/page.tsx` pakai `db.pengaduan.findUnique` dengan `select` sempit (`kodeTiket, kategori, isi, status, tanggapan, dibuatPada`); nama & kontak pelapor tidak pernah ikut ke browser
- [x] **15** — jebakan bot (`NAMA_JEBAKAN` dipakai bersama form & action; terisi → sukses palsu, tidak disimpan) + rate limit `bolehKirim(ip)` 60 detik per IP di `lib/pengaduan.ts`, ada tesnya. `npm test`: 12 lolos
- [ ] **cek (butuh langkah A lebih dulu):** kirim laporan → dapat kode tiket → muncul di `prisma studio` → kode itu ketemu di `/pengaduan/lacak`, kode ngawur tidak ketemu, dan **View Source** halaman lacak tidak memuat nama/kontak pelapor. Kirim 2× beruntun → yang kedua ditolak

### D. Masuk Minggu 2 — Task 16 lalu 24

Jalur kritisnya: **16 (CRUD berita + Draft/Terbit)** membuka 18–22. Sesudah 16 jalan, langsung kerjakan **24** untuk halaman berita saja (`majegan.ts` → query DB + `revalidate`) supaya satu modul benar-benar tembus dari admin ke publik, sebelum melebar ke layanan/anggaran. Task 17 (upload gambar) menyusul setelah itu — sampai ada Vercel Blob, pakai URL gambar yang diisi manual.

---

## Rencana Cadangan (kalau ada minggu yang molor)

- **Boleh dikorbankan lebih dulu:** modul Anggaran & Statistik (prioritas *Penting*, bukan *Wajib*) — kalau minggu 4 mepet, turunkan jadi tabel statis input manual tanpa CRUD admin penuh.
- **Tidak boleh dikorbankan:** Minggu 6 (pelatihan + serah terima) — inti dari tujuan keberlanjutan proker.
- **Blocker paling mungkin bukan soal koding**, tapi kelengkapan & izin konten dari kalurahan. Kejar dari Minggu 1.
