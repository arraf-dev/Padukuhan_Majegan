# TASKS — Proker Utama Website DesaKu

**Durasi:** 6 minggu · **Tim:** 1 orang (solo dev)
**Mulai:** 23 Juli 2026

> Cara pakai: centang `- [ ]` jadi `- [x]` tiap task selesai. Kalau ada minggu yang molor, cek bagian **Rencana Cadangan** di paling bawah sebelum menggeser jadwal minggu berikutnya.

---

## Prioritas Dekat — Audit 13 Agustus 2026

- [x] Hilangkan hydration warning pada animasi reveal.
- [x] Rapikan filter pengaduan agar ketiga kategori terlihat pada mobile.
- [x] Tambahkan favicon/ikon aplikasi.
- [x] Audit seluruh halaman admin pada viewport 320 px dan 375 px.
- [x] Audit halaman publik utama pada viewport 390 px, 768 px, dan 1366 px.
- [x] Jalankan Prisma validate, 32 test, typecheck, production build, dan diff check.
- [ ] Uji pada ponsel fisik 320/375 px bersama calon admin.
- [ ] Minta persetujuan Pak Dukuh untuk menu mobile, kartu Struktur Perangkat, dan visual statistik.
- [ ] Masukkan serta verifikasi data resmi, lalu ubah `DATA_MODE` menjadi `official`.
- [x] Siapkan fallback URL kanonik Vercel dan mode aman saat token Blob belum tersedia.
- [ ] Lengkapi environment Blob agar seluruh fitur unggah aktif.
- [ ] Jalankan smoke test pada deployment HTTPS terbaru.

---

## Minggu 1 (23–29 Jul) — Fondasi & Koordinasi Awal

**Teknis**
- [ ] Setup Next.js (App Router) + TypeScript + Tailwind, inisialisasi repo Git
- [ ] Setup Prisma + Neon Postgres, migrasi skema inti Bab 8 (`pengguna`, `halaman_profil`, `perangkat_desa`, `berita`, `kategori_berita`, `layanan`, `pengaduan`)
- [ ] Autentikasi admin dasar (AUTH-1, AUTH-2) — login + proteksi route `/admin`
- [ ] Struktur folder: route group publik vs admin, layout dasar mobile-first (wireframe 1a–1e)
- [ ] Deploy awal ke Vercel (Hobby)

**Non-teknis / koordinasi ke kalurahan**
- [ ] MoM resmi dengan pemerintah desa — jawab TBD Bab 12 (nama resmi, pembatasan identitas pelapor, admin/super admin, target rilis)
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
- [x] Publik: pengaduan selesai setelah dikirim; pelacakan publik dihapus sesuai revisi Pak Dukuh
- [x] Admin: filter Semua/Dibaca/Belum Dibaca dan pembatasan identitas berdasarkan peran
- [ ] Tautan WhatsApp (wa.me) di titik kontak

**Non-teknis**
- [ ] Validasi ulang syarat & alur tiap layanan bersama perangkat desa berwenang

**Target minggu ini:** Flow kirim pengaduan dan pengelolaan baca di admin, serta pencarian info layanan berjalan penuh.

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

Status: ✅ selesai · 🟡 UI jalan, data masih dummy dari `src/content/majegan.ts` · ⬜ belum ada.
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
| 8  | Panel admin: login, dashboard, form berita | FE | `app/admin/**` | 🟡 | 11, 12 |
| 9  | `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, metadata | FE | `app/*` | ✅ | — |
| 10 | Prisma + Neon Postgres: skema Bab 8 + migrasi + seed dari `majegan.ts` | BE | `prisma/schema.prisma` | ⬜ | — |
| 11 | Auth admin: hash password, sesi cookie, `signIn`/`signOut` (AUTH-1) | BE | `lib/auth.ts` | ⬜ | 10 |
| 12 | Proteksi route `/admin` + redirect ke `/admin/masuk` (AUTH-2) | BE | `middleware.ts` | ⬜ | 11 |
| 13 | Server action simpan pengaduan beridentitas → DB, pakai `periksaPengaduan` | BE | `lib/pengaduan.ts` | ✅ | 10 |
| 14 | Hapus pelacakan publik dan kode tiket sesuai revisi Pak Dukuh | BE | `app/(publik)/pengaduan` | ✅ | 13 |
| 15 | Rate limit + honeypot form pengaduan (anti-spam) | BE | `lib/pengaduan.ts` | ⬜ | 13 |
| 16 | Admin CRUD berita + status Draft/Terbit (ADM-1) | BE | `app/admin/berita/**` | ⬜ | 10, 12 |
| 17 | Upload gambar via Vercel Blob (ADM-5) | BE | `lib/unggah.ts` | ⬜ | 12 |
| 18 | Admin kelola profil & struktur organisasi (ADM-2) | BE | `app/admin/profil` | ⬜ | 16, 17 |
| 19 | Admin kelola layanan (ADM-3) | BE | `app/admin/layanan` | ⬜ | 16 |
| 20 | Admin filter baca, detail, lampiran, dan pembatasan identitas pelapor | BE | `app/admin/pengaduan` | ✅ | 13, 16 |
| 21 | Admin kelola anggaran (ADM-6) & statistik (ADM-7) | BE | `app/admin/anggaran`, `/statistik` | ⬜ | 16 |
| 22 | Dashboard admin: hitungan nyata dari DB (ADM-8) | BE | `app/admin/page.tsx` | ⬜ | 16, 20 |
| 23 | Super admin kelola akun (AUTH-3) + ganti password (AUTH-4) | BE | `app/admin/pengguna` | ⬜ | 11 |
| 24 | Ganti sumber data halaman publik: `majegan.ts` → query DB, pasang `revalidate` | FE+BE | `app/(publik)/**` | ⬜ | 16–21 |
| 25 | Deploy Vercel + env (`DATABASE_URL`, secret sesi, token Blob) | Infra | — | ⬜ | 10, 11 |

Jalur kritis: **10 → 11 → 12 → 16** membuka hampir semua sisa task admin. Task 13–15 bisa jalan paralel setelah 10.

---

## Rencana Cadangan (kalau ada minggu yang molor)

- **Boleh dikorbankan lebih dulu:** modul Anggaran & Statistik (prioritas *Penting*, bukan *Wajib*) — kalau minggu 4 mepet, turunkan jadi tabel statis input manual tanpa CRUD admin penuh.
- **Tidak boleh dikorbankan:** Minggu 6 (pelatihan + serah terima) — inti dari tujuan keberlanjutan proker.
- **Blocker paling mungkin bukan soal koding**, tapi kelengkapan & izin konten dari kalurahan. Kejar dari Minggu 1.
