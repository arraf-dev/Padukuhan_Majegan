# Catatan Progres Website Padukuhan Majegan

Terakhir diperbarui: 27 Agustus 2026

## Status Saat Ini

Website hampir siap pakai. Fitur inti (berita, profil, layanan, statistik, galeri, potensi, pengaduan, panel admin) sudah berjalan dan ter-deploy di Vercel. Halaman Potensi telah dirapikan, label admin `Sunting` diganti `Edit`, dashboard admin diperbaiki dari overflow mobile, dan penyimpanan berkas sudah bermigrasi dari Vercel Blob ke **Cloudflare R2** dan terverifikasi end-to-end secara lokal (upload publik, lampiran privat, hapus, akses objek).

Kesiapan production diperkirakan **~70%**: platform teknis hampir selesai, yang menahan utamanya adalah env R2 di Vercel (belum diisi), QA e2e di production, konten resmi (masih `DATA_MODE=demo`), serah terima, dan rotasi token.

| Area | Kesiapan | Status | Langkah Berikutnya |
|---|---|---|---|
| Fitur & kode | 100% | ISR/SSG halaman publik, validasi form terpusat, rate-limit login, lint bersih, test 48/48 | — |
| Deployment | 50% | Situs live di Vercel, env R2 belum diisi | Isi 7 env R2 + `NEXT_PUBLIC_URL`, redeploy |
| QA e2e production | 40% | Upload/CRUD baru diuji lokal | Uji unggah + login & CRUD di production |
| Konten resmi | 25% | Masih `DATA_MODE=demo` | Persetujuan Pak Dukuh, isi data resmi |
| Keamanan | 55% | Header keamanan, rate-limit login, magic-bytes PDF, batas panjang form | `npm audit`, rotasi token R2 |
| Serah terima | 10% | Belum mulai | Panduan admin, pelatihan, transfer akun |

Status per 27 Agustus 2026 (sesi "Fitur & kode" 95% → 100%):

- **Commit `803a82e`** (migrasi R2 + potensi + `/api/live`) sudah di-push.
- **ISR/static generation**: `revalidate = 60` di `layout.tsx` publik + `generateStaticParams` untuk `/berita/[slug]` (10 slug) dan `/galeri/[slug]` (5 slug); `/sitemap.xml` `revalidate = 3600`. Halaman ber-`searchParams` (`/berita`, `/galeri`, `/layanan`, `/pengaduan`) tetap on-demand — keputusan desain. Admin tidak perlu perubahan: `revalidatePath` sudah menutup semua path publik.
- **Hardening form**: `lib/form.ts` (batas panjang server terpusat), `lib/limiter.ts` (rate-limit login 10 gagal/15 menit per IP & email + hash dummy anti timing oracle), magic-bytes dokumen PDF (`periksaIsiDokumen`), validasi kontak pengaduan (8–25 digit), whitelist slug naskah profil, rentang thun/nilai statistik, hapus foto R2 perangkat, guard id basi di berita/layanan/potensi/perangkat.
- **ESLint** terpasang (`eslint-config-next` flat config) + script `lint`; 6 temuan awal (3 error, 3 warning) dibereskan — pola set-state-in-effect diganti sesuaai aturan React 19.
- Quality gate lengkap hijau: **test 48/48, typecheck, lint (exit 0), build production** — build lokal perlu `NEXT_PUBLIC_URL` HTTPS di env (nilai `.env.local` masih `localhost`).

## Keputusan Utama

- **Hosting:** tetap di **Vercel (Hobby gratis)**, tanpa VPS. Biaya keluar hanya domain.
- **Database:** PostgreSQL di **Neon** (connection pooled).
- **Penyimpanan berkas:** **Cloudflare R2** — bucket publik `majegan-publik`, bucket privat `majegan-private`. Kuota gratis 10 GB, tanpa biaya transfer.
- **Video:** tidak disimpan di object storage; ke depan pakai **embed YouTube**.
- **Token R2:** dipakai sementara meski pernah dikirim via chat; **rotasi token dijadwalkan sebelum serah terima**.
- **Docker + Coolify dibatalkan** (tidak relevan lagi untuk kebutuhan ini).
- Data publik masih mode **demo** sampai data resmi terverifikasi.

## Yang Sudah Selesai

### Frontend
- Halaman potensi, galeri, berita, profil, layanan, statistik, pengaduan, dan landing page (video hero) — rapi dan responsif.
- Audit otomatis semua halaman publik (320/390/768/1366 px) dan admin (320/375/1366 px): seluruhnya 200, tanpa overflow, tanpa console error; satu perbaikan overflow dashboard `/admin` di 320 px.
- Landing page: video hero autoplay/muted/loop + poster fallback + dukung `prefers-reduced-motion`.

### Backend
- Migrasi penuh Vercel Blob → Cloudflare R2:
  - Modul S3-compatible `src/lib/r2.ts` + `unggah.ts` (publik = URL penuh, privat = object key).
  - Route lampiran pengaduan privat via R2, wajib sesi admin, guard prefix `pengaduan/`.
  - Validasi signature gambar di semua upload; cleanup orphan saat insert gagal.
- Security headers (nosniff, DENY frame, Referrer-Policy, Permissions-Policy, HSTS) dan endpoint `/api/live`.
- Script `build` dipisah dari `migrate:deploy`.
- Kredensial R2 tersimpan di `.env.local` (tidak masuk repo); test 39/39 lulus, typecheck lulus.

## Yang Akan Dikerjakan

### 1. Konfigurasi & Deployment
- Isi environment R2 di Vercel (Production) — nilai sama dengan `.env.local`:
  ```env
  R2_ACCOUNT_ID=""
  R2_ACCESS_KEY_ID=""
  R2_SECRET_ACCESS_KEY=""
  R2_BUCKET_PUBLIK="majegan-publik"
  R2_BUCKET_PRIVAT="majegan-private"
  R2_PUBLIC_URL="https://pub-...r2.dev"
  NEXT_PUBLIC_URL="https://domain-resmi-anda"
  ```
- Deploy ulang ke Vercel.
- (Rencana lanjutan) Custom domain untuk bucket publik pengganti `r2.dev` + perbarui `R2_PUBLIC_URL` dan `next.config.ts`.

### 2. Pengujian & QA
- Uji unggah end-to-end lewat UI: sampul berita, foto perangkat, foto galeri/potensi, lampiran pengaduan, templat layanan.
- Uji login + seluruh CRUD di production dengan akun Admin dan SuperAdmin.
- Uji pada ponsel fisik 320/375 px bersama calon admin.

### 3. Persetujuan & Konten Resmi
- Persetujuan Pak Dukuh: menu mobile, kartu Struktur Perangkat, visual statistik, video hero, crop Joglo.
- Isi data resmi: sejarah, kontak/WhatsApp, foto perangkat, layanan, statistik, berita.
- Ubah `DATA_MODE` dari `demo` ke `official` setelah data terverifikasi.

### 4. Keamanan & Operasional
- Tangani `npm audit` (temuan high/moderate) secara terkontrol.
- Rotasi token R2 sebelum serah terima.
- Tentukan domain & akun resmi pemilik Vercel/Neon/Cloudflare.

### 5. Serah Terima
- Pelatihan admin.
- Dokumentasi penggunaan.
- Serah terima akses ke perangkat desa yang ditunjuk.

### Catatan kerja

- R2 saat ini memakai URL dev `r2.dev` (rate limit); untuk production stabil, rencanakan **custom domain** untuk bucket publik dan perbarui `R2_PUBLIC_URL` + `next.config.ts`.
- Build production berhenti dengan pesan jelas bila `DATABASE_URL`, `RAHASIA_SESI`, atau `NEXT_PUBLIC_URL` HTTPS belum tersedia — ini disengaja.
- `DATA_MODE="demo"` selama data resmi belum lengkap.
- Secret tidak pernah ditulis di file repository.
