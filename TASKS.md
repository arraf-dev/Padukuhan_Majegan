# TASKS — Proker Utama Website DesaKu

**Durasi:** 6 minggu · **Tim:** 1 orang (solo dev)
**Mulai:** 23 Juli 2026

> Cara pakai: centang `- [ ]` jadi `- [x]` tiap task selesai. Kalau ada minggu yang molor, cek bagian **Rencana Cadangan** di paling bawah sebelum menggeser jadwal minggu berikutnya.

---

## Minggu 1 (23–29 Jul) — Fondasi & Koordinasi Awal

**Teknis**
- [ ] Setup Next.js (App Router) + TypeScript + Tailwind, inisialisasi repo Git
- [ ] Setup Prisma + Neon Postgres, migrasi skema inti Bab 8 (`pengguna`, `halaman_profil`, `perangkat_desa`, `berita`, `kategori_berita`, `layanan`, `pengaduan`)
- [ ] Autentikasi admin dasar (AUTH-1, AUTH-2) — login + proteksi route `/admin`
- [ ] Struktur folder: route group publik vs admin, layout dasar mobile-first (wireframe 1a–1e)
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

## Rencana Cadangan (kalau ada minggu yang molor)

- **Boleh dikorbankan lebih dulu:** modul Anggaran & Statistik (prioritas *Penting*, bukan *Wajib*) — kalau minggu 4 mepet, turunkan jadi tabel statis input manual tanpa CRUD admin penuh.
- **Tidak boleh dikorbankan:** Minggu 6 (pelatihan + serah terima) — inti dari tujuan keberlanjutan proker.
- **Blocker paling mungkin bukan soal koding**, tapi kelengkapan & izin konten dari kalurahan. Kejar dari Minggu 1.
