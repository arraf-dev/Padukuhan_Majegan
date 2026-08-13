# Catatan Progres Website Padukuhan Majegan

Terakhir diperbarui: 13 Agustus 2026

## Status Saat Ini

Sebagian besar fitur utama website sudah selesai. Revisi Pak Dukuh pada panel admin, alur pengaduan, layanan, profil, dan statistik sudah berada di branch `main`. Audit prioritas dekat tanggal 13 Agustus memperbaiki hydration warning, filter pengaduan mobile, favicon, serta konfigurasi build Vercel dan memverifikasi tampilan melalui browser. Deployment production untuk commit `a8af8e2` selesai, tetapi akses publik masih dialihkan ke Vercel Authentication. Pekerjaan yang tersisa memerlukan pembukaan akses production, uji perangkat fisik, persetujuan Pak Dukuh, data resmi, dan token Vercel Blob agar seluruh fitur unggah aktif.

## Revisi Pak Dukuh — Status Implementasi

### Sudah diimplementasikan

- [x] Pelacakan pengaduan publik dihapus: route, tautan footer, CTA pada formulir, CTA halaman sukses, dan sitemap sudah tidak menyertakan `/pengaduan/lacak`.
- [x] Kode tiket, status proses, tanggapan, dan mode anonim dihapus sepenuhnya dari model pengaduan.
- [x] Panel pengaduan hanya memiliki filter Semua, Belum Dibaca, dan Dibaca; laporan yang sudah dibaca ditandai hijau.
- [x] Identitas wajib diisi warga; hanya SuperAdmin yang mengambil dan melihat nama/kontak, sedangkan Admin tetap dapat membuka isi dan lampiran.
- [x] Kartu pengaduan diperbarui dengan metadata yang mudah dipindai, aksen baca, dan animasi hover yang menghormati reduced motion.
- [x] Migration `20260812230000_sederhanakan_pengaduan` sudah diterapkan; database melaporkan tidak ada migration tertunda.
- [x] Halaman sukses pengaduan memberi konfirmasi serta informasi bahwa perangkat akan menghubungi pelapor bila diperlukan.
- [x] Navigasi admin mobile diubah dari deretan tab horizontal menjadi menu yang dapat dibuka/tutup, dengan penanda halaman aktif.
- [x] Tombol **Keluar** selalu tersedia pada sidebar desktop dan menu mobile.
- [x] Menu/form ganti sandi disatukan ke `/admin/akun`; halaman `/admin/sandi` sekarang mengarahkan ke sana untuk menjaga bookmark lama.
- [x] Admin biasa dapat membuka Akun Saya dan mengganti sandi sendiri; pengelolaan pengguna tetap khusus SuperAdmin.
- [x] Halaman Profil & Struktur memiliki pintasan bagian dan perangkat tampil sebagai kartu.
- [x] Kelola Layanan memiliki pencarian, keterangan templat, dan form yang dibagi menjadi Informasi Dasar, Persyaratan, Alur, serta Dokumen Templat.
- [x] Statistik mendukung jenis kelamin, pendidikan, dan pekerjaan selain ringkasan serta kelompok usia; halaman publik menampilkan grafik/tabel responsif beserta kondisi data kosong.

### Audit prioritas dekat — 13 Agustus 2026

- [x] Hydration warning pada elemen `data-reveal` dihilangkan dengan Web Animations API tanpa mutasi class selama streaming React.
- [x] Filter Semua, Belum Dibaca, dan Dibaca dibuat menjadi grid tiga kolom agar tidak terpotong pada mobile.
- [x] Ikon situs ditambahkan; route ikon merespons HTTP 200 dan tidak lagi mengandalkan `/favicon.ico` yang hilang.
- [x] Seluruh halaman admin diuji otomatis pada 320 px dan 375 px tanpa overflow halaman, error overlay, atau halaman kosong.
- [x] Halaman publik utama diuji pada 390 px, 768 px, dan 1366 px; screenshot tersimpan lokal di `output/playwright/`.
- [x] Prisma validate, 32 test, typecheck, production build, dan `git diff --check` lulus.
- [x] URL kanonik dapat memakai `VERCEL_PROJECT_PRODUCTION_URL` ketika `NEXT_PUBLIC_URL` masih localhost; token Blob yang belum tersedia tidak lagi menggagalkan seluruh build.
- [x] Commit `a8af8e2` berhasil dideploy oleh Vercel; status integrasi GitHub melaporkan deployment selesai.

### Perlu disetujui melalui pengecekan tampilan

- [-] Uji pengalaman admin pada ponsel nyata (minimal lebar 320 px dan 375 px).
- [-] Konfirmasi desain menu mobile, kartu Struktur Perangkat, serta visual statistik bersama Pak Dukuh.
- [-] Isi data statistik resmi untuk kategori jenis kelamin, pendidikan, dan pekerjaan agar grafik publik terisi.
- [-] Nonaktifkan Vercel Authentication untuk environment Production. Saat ini seluruh URL publik mendapat redirect `302` menuju login Vercel.
- [-] Jalankan ulang smoke test setelah akses production dibuka; pengujian unggah penuh tetap menunggu token Vercel Blob.

## Yang Sudah Selesai

### Sistem utama

- Next.js, React, TypeScript, Tailwind CSS, Prisma, dan PostgreSQL sudah terpasang.
- Database dan seed data sudah tersedia.
- Login, sesi cookie, logout, dan proteksi `/admin` sudah tersedia.
- Pembagian hak akses Admin dan SuperAdmin sudah diterapkan.
- Form pengaduan menyimpan identitas wajib dan isi laporan ke database serta memiliki anti-spam sederhana. Tidak ada tiket atau pelacakan status publik.
- Production memvalidasi `DATABASE_URL`, `RAHASIA_SESI`, dan ketersediaan URL HTTPS kanonik tanpa membocorkan nilainya. Pada Vercel, URL sistem menjadi fallback aman ketika `NEXT_PUBLIC_URL` belum siap.
- Mode `DATA_MODE=demo|official` tersedia; mode demo menampilkan penanda bahwa informasi publik masih berupa data contoh.
- Endpoint `GET /api/health` memeriksa koneksi aplikasi dan database tanpa menampilkan secret.
- Lampiran pengaduan baru disimpan sebagai Blob privat dan hanya dapat dibuka melalui panel admin yang sudah masuk.

### Halaman publik

- Beranda membaca data aktual dari database.
- Daftar dan detail berita membaca data dari database.
- Profil dan struktur perangkat membaca data dari database.
- Informasi layanan membaca data dari database.
- Statistik membaca data dari database.
- Pengaduan dapat dikirim warga dan ditindaklanjuti oleh perangkat melalui panel admin; pelacakan status publik tidak tersedia.

### Panel admin

- CRUD berita dan status Draft/Terbit.
- Kelola profil, sejarah, visi-misi, dan struktur perangkat.
- Kelola layanan dan persyaratannya.
- Kelola pengaduan berdasarkan status baca, dengan identitas khusus SuperAdmin dan lampiran yang dapat dibuka kedua peran.
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
- Konfigurasi MCP dan artefak Playwright lokal sudah diabaikan Git agar tidak ikut ter-push.

## Hasil Verifikasi Terakhir

- `git diff --check`: lulus.
- Prisma schema valid dan database tidak memiliki migration tertunda.
- Form unggah berita, profil, layanan, dan pengaduan sudah diperiksa melalui browser.
- Proteksi halaman admin dan tautan Aksi cepat sudah diperiksa melalui browser.
- Seluruh halaman admin lulus audit browser pada 320 px dan 375 px; halaman publik utama lulus pada 390 px, 768 px, dan 1366 px.
- Hydration warning tidak muncul lagi setelah perbaikan mekanisme reveal.
- `npm test`: **32 dari 32 test lulus** (termasuk fallback URL Vercel dan validasi environment).
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
7. Buka akses publik pada environment Production Vercel, jalankan smoke test, lalu lakukan uji pengguna, pelatihan admin, dan serah terima.

## Catatan Penting

- Tanpa `BLOB_READ_WRITE_TOKEN`, pemilih berkas tetap terlihat tetapi unggahan ke Vercel Blob belum bisa digunakan. Situs dan formulir tanpa berkas tetap berjalan; percobaan unggah ditolak dengan pesan yang aman.
- Deployment Vercel sudah berhasil dibangun, tetapi Vercel Authentication masih melindungi domain production. Smoke test aplikasi tidak dapat dinyatakan lulus sampai proteksi production dinonaktifkan atau bypass resmi tersedia.
- Lampiran pengaduan yang pernah diunggah sebagai Blob publik sebelum perubahan ini perlu diunggah ulang bila masih diperlukan; endpoint panel tidak meneruskan URL publik lama.
- Tanpa `DATABASE_URL`, `RAHASIA_SESI`, atau URL HTTPS kanonik, build production sengaja dihentikan dengan pesan konfigurasi yang jelas. Token Blob divalidasi saat operasi unggah agar kekurangan token tidak mematikan seluruh situs.
- Gunakan `DATA_MODE="demo"` selama data resmi belum lengkap; ubah menjadi `official` hanya setelah konten diverifikasi.
- `TASKS.md` di working tree belum sepenuhnya mencerminkan kondisi kode aktual; jadikan audit kode dan catatan ini sebagai acuan sementara.
- Implementasi pengamanan production dan Vercel Blob sebelumnya sudah di-commit dan di-push ke branch `main` pada commit `715c790`.

---

# Target Production: Docker + Coolify

Bagian ini menjadi acuan utama untuk melacak perpindahan deployment dari Vercel ke container Docker yang dikelola melalui Coolify. Arsitektur aplikasi tetap monolitik; migrasi infrastruktur dilakukan bertahap agar risiko terhadap production dapat dikendalikan.

## Legenda Status

- `[ ]` belum dikerjakan
- `[-]` sedang dikerjakan atau baru tervalidasi sebagian
- `[x]` selesai dan sudah diverifikasi

## Ringkasan Kesiapan

**Skor awal production readiness: 5/10.**

Yang sudah baik:

- Build production berhasil.
- Next.js sudah menggunakan output `standalone` untuk container.
- Database dan penyimpanan berkas berada di layanan eksternal.
- Neon menggunakan koneksi PostgreSQL pooled.
- Prisma migration, auth guard, atribut cookie aman, health check, test, typecheck, dan pengabaian file environment sudah tersedia.
- Pemeriksaan repository tidak menemukan pola secret yang terlacak Git.

Kesenjangan utama:

- Belum ada `Dockerfile`, `.dockerignore`, dan workflow GitHub Actions.
- `prisma migrate deploy` masih dijalankan di dalam proses build.
- Beberapa secret runtime masih diwajibkan saat build.
- Blob publik dan privat belum menggunakan token/store terpisah.
- Belum ada prosedur backup/restore yang teruji, monitoring, strategi rollout, dan rollback.
- Audit dependency terakhir melaporkan 8 kerentanan tinggi dan 1 moderat.

## 1. Arsitektur Saat Ini

```text
Browser
  ↓ HTTPS
Next.js 16 App Router
  ├── Server Components
  ├── Server Actions
  ├── Admin authentication
  ├── Public/admin routes
  └── Health endpoint
       ↓
Prisma 7 + PostgreSQL adapter
       ↓
Neon PostgreSQL

File upload
  ↓
Vercel Blob
```

- Frontend dan backend berada dalam satu aplikasi Next.js.
- Saat ini tidak ada worker, Redis, message queue, WebSocket, atau cron job.

## 2. Technology Stack

| Area | Teknologi/keputusan saat ini |
| --- | --- |
| Frontend | React 19, Next.js 16 App Router, Tailwind CSS 4 |
| Backend | Next.js Server Actions dan Route Handlers |
| Database | PostgreSQL di Neon |
| ORM | Prisma 7 dengan `@prisma/adapter-pg` |
| Authentication | Implementasi internal HMAC, scrypt, dan cookie |
| Object storage | Vercel Blob |
| Runtime | Node.js minimal 22; Node.js 24 direkomendasikan untuk container |
| Package manager | npm dengan lockfile |
| Build saat ini | `prisma generate && prisma migrate deploy && next build` |
| Start | `next start` |
| Test | Node test runner; hasil terakhir 31 test lulus |
| Container output | Next.js `standalone` |

## 3. Temuan Kritis yang Harus Diselesaikan

### A. Migration masih berjalan saat build

Dampak:

- Build membutuhkan akses ke database production.
- Build memiliki side effect terhadap database.
- Build paralel berpotensi menjalankan migration secara bersamaan.
- Hasil build tidak sepenuhnya reproducible dan dapat gagal karena database/network.

Perbaikan yang direncanakan:

- Pisahkan `next build` dari `prisma migrate deploy`.
- Tambahkan perintah khusus `migrate:deploy`.
- Jalankan migration sebagai release/deployment gate, bukan sebagai bagian image build.
- Terapkan migration backward-compatible dengan pola expand-contract.

### B. Blob publik dan privat masih memakai satu token/store

Mode akses Vercel Blob ditentukan pada tingkat store. Karena website membutuhkan aset publik dan lampiran pengaduan privat, gunakan dua store/token:

- `BLOB_READ_WRITE_TOKEN` untuk aset publik.
- `BLOB_PRIVATE_READ_WRITE_TOKEN` untuk lampiran privat.
- Operasi `put()` dan `get()` harus menerima token yang sesuai secara eksplisit.

## 4. Arsitektur Production Target

```text
Developer
  ↓ push / pull request
GitHub
  ↓
GitHub Actions
  ├── npm ci
  ├── test
  ├── typecheck
  ├── lint/check
  └── Docker build
       ↓ jika seluruh pemeriksaan lulus
Coolify deployment webhook / manual promotion
       ↓
Docker multi-stage image
       ↓
Database migration gate
       ↓
Readiness check
       ↓
Coolify rolling deployment
       ↓
Traefik: HTTPS port 443
       ↓
Next.js container: internal port 3000
       ├── Neon PostgreSQL melalui koneksi privat/terenkripsi
       └── Vercel Blob melalui HTTPS
```

Keputusan transisi:

- Pertahankan Neon pada rilis awal Coolify.
- Pertahankan Vercel Blob pada fase pertama.
- Jangan memigrasikan database dan object storage bersamaan dengan cutover Docker.
- Migrasi database ke PostgreSQL yang dikelola Coolify hanya setelah latihan backup/restore dan rekonsiliasi data berhasil.

## 5. Rancangan Docker

- Base image: `node:24-bookworm-slim`.
- Stage dependency menjalankan `npm ci`.
- Stage builder menjalankan `prisma generate` dan `next build`, tanpa migration database.
- Stage runner hanya menyalin output `standalone`, `.next/static`, dan `public`.
- Container berjalan sebagai user non-root.
- Runtime menggunakan `NODE_ENV=production`, `HOSTNAME=0.0.0.0`, dan `PORT=3000`.
- Hanya port internal `3000` yang diekspos; akses publik melalui proxy Coolify/Traefik.
- `.dockerignore` harus mengabaikan `.env*`, `.git`, `.next`, `node_modules`, test output, dan file lokal yang tidak diperlukan.
- Health check menggunakan Node.js `fetch`, sehingga tidak perlu memasang `curl`.
- Entrypoint melakukan validasi environment runtime sebelum aplikasi dimulai.
- Output `standalone` Next.js tetap dipertahankan.

## 6. Model Deployment Coolify

- Gunakan model **Application + Dockerfile**.
- Jalankan satu aplikasi Next.js tanpa supporting service pada fase pertama.
- Database Neon dan Vercel Blob tetap eksternal.
- Gunakan rolling update Coolify, bukan Docker Compose untuk aplikasi utama.
- Tidak perlu menambahkan Nginx karena routing dan TLS ditangani Traefik/Coolify.

## 7. Environment Variables

| Variable | Wajib | Rahasia | Waktu penggunaan | Keterangan |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Ya | Ya | Runtime dan migration | URL PostgreSQL pooled |
| `RAHASIA_SESI` | Ya | Ya | Runtime | Kunci penandatanganan sesi |
| `NEXT_PUBLIC_URL` | Ya | Tidak | Build dan runtime | URL HTTPS canonical production |
| `DATA_MODE` | Ya | Tidak | Runtime | `demo` atau `official` |
| `BLOB_READ_WRITE_TOKEN` | Ya | Ya | Runtime | Store aset publik |
| `BLOB_PRIVATE_READ_WRITE_TOKEN` | Ya | Ya | Runtime | Store lampiran privat |
| `SUPERADMIN_EMAIL` | Seed saja | Tidak | Operasi satu kali | Jangan diwajibkan oleh app runtime |
| `SUPERADMIN_SANDI` | Seed saja | Ya | Operasi satu kali | Jangan diwajibkan oleh app runtime |
| `PORT` | Tidak | Tidak | Runtime | Default `3000` |
| `HOSTNAME` | Tidak | Tidak | Runtime | Default `0.0.0.0` |
| `SMOKE_URL` | CI saja | Tidak | Lokal/CI | Target smoke test deployment |

Ketentuan:

- Secret hanya dimasukkan sebagai environment runtime Coolify.
- Secret tidak boleh menjadi Docker build argument atau tersimpan di image layer.
- Validasi build-time harus dipisahkan dari validasi runtime agar build image tidak membutuhkan secret production.

## 8. Database dan Migration

Strategi awal:

- Gunakan Neon pooled connection pada rilis Coolify pertama.
- Jangan menjalankan seed secara otomatis saat container start/deploy.
- Jalankan `prisma migrate deploy` sebagai langkah release terpisah.
- Buat backup sebelum migration production.
- Gunakan migration expand-contract agar versi lama dan baru dapat berjalan selama rolling update.

Jika PostgreSQL kelak dipindahkan ke Coolify:

- Gunakan persistent volume.
- Jangan membuka port PostgreSQL `5432` ke internet.
- Siapkan backup sebelum migrasi.
- Uji restore di staging.
- Rekonsiliasi jumlah row dan data penting.
- Tentukan maintenance window.
- Simpan Neon dan URL lama sampai verifikasi selesai agar rollback masih mungkin.

## 9. Object Storage

- Pertahankan Vercel Blob pada fase pertama.
- Jangan menyimpan upload pengguna ke filesystem container yang bersifat ephemeral.
- Pastikan token Blob dapat digunakan di luar runtime Vercel.
- Pisahkan store/token publik dan privat.
- Saat record aplikasi dihapus, hapus Blob terkait bila memang tidak lagi dibutuhkan.
- Tambahkan cleanup untuk orphan Blob ketika upload berhasil tetapi penyimpanan database gagal.
- Validasi magic bytes/signature berkas, tidak hanya MIME dari browser.
- Siapkan abstraction/adapter storage jika nanti berpindah ke R2 atau S3.
- Jangan memigrasikan object storage bersamaan dengan cutover Docker.

## 10. Temuan Security dan Reliability

### Kritis

- Migration database berlangsung saat build.
- Akses Blob publik dan privat belum dipisahkan per store/token.

### Tinggi

- Audit dependency terakhir menemukan 8 high dan 1 moderate.
- Login admin belum memiliki rate limiting yang kuat.
- Belum ada CI gate sebelum deployment.
- Backup dan restore belum diuji end-to-end.
- Build masih membutuhkan sebagian secret runtime.

### Menengah

- Rate limit pengaduan masih in-memory dan tidak konsisten antar-replica.
- Kepercayaan terhadap `x-forwarded-for` perlu dibatasi sesuai proxy Coolify.
- Header CSP, HSTS, Referrer-Policy, dan Permissions-Policy belum lengkap.
- Sesi pengguna yang dinonaktifkan dapat tetap valid sampai maksimal sekitar 8 jam.
- Validasi upload masih terlalu bergantung pada MIME yang dikirim klien.
- Risiko orphan Blob belum ditangani.
- Private Vercel Blob masih perlu dipantau karena status/dukungan platform dapat berubah.
- Google Fonts saat build menciptakan ketergantungan network; pertimbangkan self-host font.

### Rendah

- Log belum terstruktur.
- Belum ada request ID dan deployment/version ID pada log.
- Test masih menampilkan warning module Node.
- Dokumentasi dan task tracking perlu selalu disinkronkan dengan kondisi kode.

## 11. Backup dan Restore

### Database

- Backup harian ke object storage kompatibel S3.
- Retensi harian minimal 30 hari.
- Backup mingguan disimpan selama 12 minggu.
- Buat backup tambahan sebelum setiap migration production.
- Lakukan latihan restore minimal setiap kuartal.

### Object storage

- Backup database saja tidak mencadangkan isi Blob; database hanya menyimpan URL/path.
- Siapkan sinkronisasi atau backup terpisah untuk object storage sesuai kebutuhan retensi.

### Coolify

- Cadangkan konfigurasi Coolify, `APP_KEY`, dan SSH key yang diperlukan.
- Backup Coolify tidak menggantikan backup database dan data aplikasi.

## 12. Monitoring dan Alerting

- External uptime monitor memeriksa endpoint liveness `/api/live`.
- Readiness `/api/health` memeriksa aplikasi dan koneksi database.
- Pantau status container dan jumlah restart.
- Pantau CPU, memory, dan disk host; beri alert ketika disk melewati 80%.
- Pantau availability dan pertumbuhan ukuran PostgreSQL.
- Pantau HTTP 5xx dan kegagalan login admin.
- Pantau status deployment serta hasil backup.
- Kirim notifikasi melalui email, Telegram, Discord, atau webhook yang dikelola tim.

## 13. Rencana Perubahan File

### File yang akan dibuat

- [ ] `Dockerfile`
- [ ] `.dockerignore`
- [ ] `.github/workflows/ci.yml`
- [ ] `scripts/docker-entrypoint.sh`
- [ ] `src/app/api/live/route.ts`
- [ ] Runbook deployment, backup, restore, dan rollback di folder `deployment/`

### File yang akan dimodifikasi

- [ ] `package.json`: pisahkan build dan migration serta tambahkan lint/check yang konsisten.
- [ ] Konfigurasi environment: pisahkan validasi build-time dan runtime.
- [ ] Root layout/import: hindari evaluasi secret runtime saat build halaman.
- [ ] Modul upload: gunakan token publik dan privat yang berbeda.
- [ ] Route lampiran privat: gunakan token private secara eksplisit.
- [ ] `next.config.*`: pastikan standalone, security headers, dan strategi font sesuai container.
- [ ] `.env.example`: dokumentasikan seluruh variable tanpa nilai rahasia.
- [ ] `.gitignore`: abaikan konfigurasi MCP lokal seperti `.mcp.json`.
- [ ] `README.md` dan `note.md`: sinkronkan setup, deploy, dan tracking.

### Komponen yang dipertahankan

- Arsitektur monolitik Next.js.
- Prisma dan PostgreSQL.
- Output Next.js standalone.
- Server Actions dan route handler.
- Sistem authentication yang ada, dengan hardening bertahap.
- Vercel Blob selama masa transisi.
- Seluruh route publik/admin dan test yang sudah ada.

Tidak ada komponen aplikasi yang perlu dihapus pada fase awal.

## 14. Roadmap Implementasi

### Fase 1 — Persiapan repository dan pemisahan lifecycle

- [ ] Pisahkan `build`, `migrate:deploy`, dan `start` di `package.json`.
- [ ] Pisahkan validasi environment build-time dari runtime.
- [ ] Tambahkan token Blob private dan gunakan token berdasarkan jenis file.
- [ ] Perbarui `.env.example`, `.gitignore`, README, dan catatan deployment.
- Risiko: upload atau migration salah konfigurasi.
- Validasi: test, typecheck, dan build image/app harus lulus tanpa melakukan mutasi database production.
- Rollback: revert perubahan script dan environment ke commit production terakhir.

### Fase 2 — Dockerization

- [ ] Buat multi-stage `Dockerfile` berbasis Node.js 24.
- [ ] Buat `.dockerignore`.
- [ ] Buat entrypoint untuk validasi runtime.
- [ ] Jalankan aplikasi sebagai non-root dan salin hanya output standalone.
- Risiko: static asset, Prisma engine, atau file runtime tidak ikut tersalin.
- Validasi: `docker build`, pemeriksaan user container, ukuran image, route statis, dan Prisma runtime.
- Rollback: Vercel tetap menjadi deployment production aktif.

### Fase 3 — Validasi container lokal

- [ ] Jalankan container dengan environment test/staging.
- [ ] Uji port, network database, object storage, dan filesystem read-only/ephemeral.
- [ ] Uji route publik, login admin, CRUD, upload, `/api/live`, dan `/api/health`.
- Risiko: environment host dan Docker berbeda.
- Validasi: seluruh alur utama dan smoke test lulus dari luar container.
- Rollback: hentikan dan hapus container lokal; tidak menyentuh production.

### Fase 4 — Persiapan database

- [ ] Buat backup Neon sebelum migration.
- [ ] Pastikan migration menggunakan pola expand-contract.
- [ ] Uji migration dan restore di staging.
- [ ] Rekonsiliasi row count dan data penting.
- Risiko: migration tidak kompatibel atau merusak data.
- Validasi: restore, migrate, test aplikasi, dan rekonsiliasi berhasil.
- Rollback: restore backup atau gunakan kembali schema/URL Neon sebelumnya sesuai runbook.

### Fase 5 — Setup aplikasi Coolify

- [ ] Hubungkan repository GitHub ke Coolify.
- [ ] Pilih deployment dari `Dockerfile`.
- [ ] Konfigurasi port internal `3000` dan seluruh runtime environment.
- [ ] Deploy ke domain staging terlebih dahulu.
- Risiko: environment, network, atau health check salah.
- Validasi: build log bersih, container sehat, health check dan smoke test lulus.
- Rollback: hentikan deployment staging tanpa mengubah production Vercel.

### Fase 6 — Domain dan HTTPS

- [ ] Arahkan DNS ke host Coolify.
- [ ] Konfigurasi domain dan sertifikat TLS melalui Coolify/Traefik.
- [ ] Pastikan tidak ada host port mapping publik selain 80/443 pada proxy.
- Risiko: downtime DNS atau penerbitan sertifikat gagal.
- Validasi: HTTPS valid, redirect HTTP ke HTTPS, canonical URL benar.
- Rollback: kembalikan DNS ke deployment Vercel sampai TTL selesai.

### Fase 7 — Health check dan rolling deployment

- [ ] Tambahkan liveness `/api/live` yang tidak bergantung pada database.
- [ ] Gunakan `/api/health` sebagai readiness yang memeriksa database.
- [ ] Konfigurasi health check dan rolling update Coolify.
- [ ] Simulasikan database tidak tersedia untuk memastikan readiness gagal dengan benar.
- Risiko: false unhealthy menyebabkan deployment terus di-restart.
- Validasi: liveness tetap hidup, readiness mengikuti status dependency, traffic hanya menuju instance ready.
- Rollback: nonaktifkan sementara health check yang salah dan kembalikan image sebelumnya.

### Fase 8 — Backup dan restore

- [ ] Otomatiskan backup database harian dan backup pre-migration.
- [ ] Simpan backup di lokasi offsite.
- [ ] Dokumentasikan dan uji restore.
- [ ] Tetapkan strategi backup/sinkronisasi Blob.
- Risiko: backup tampak sukses tetapi tidak dapat dipulihkan.
- Validasi: restore ke staging dan verifikasi aplikasi/data.
- Rollback: pertahankan backup lama sampai backup baru teruji.

### Fase 9 — Monitoring dan notifikasi

- [ ] Tambahkan uptime monitoring eksternal.
- [ ] Pantau resource host, deployment, HTTP error, database, disk, dan backup.
- [ ] Konfigurasi kanal notifikasi.
- [ ] Kirim alert uji untuk memastikan penerima dan eskalasi bekerja.
- Risiko: alert noise atau kegagalan yang tidak terdeteksi.
- Validasi: simulasi outage/deploy gagal/disk threshold dan pastikan notifikasi diterima.
- Rollback: sesuaikan threshold dan routing tanpa menonaktifkan observability inti.

### Fase 10 — Security hardening

- [ ] Selesaikan audit dependency secara terkontrol.
- [ ] Tambahkan distributed/persistent rate limit untuk login dan pengaduan.
- [ ] Batasi trusted proxy dan parsing alamat IP.
- [ ] Tambahkan security headers.
- [ ] Validasi magic bytes file dan cleanup orphan Blob.
- [ ] Buat mekanisme pencabutan sesi ketika akun dinonaktifkan.
- Risiko: kontrol baru memblokir pengguna sah atau merusak upload.
- Validasi: unit/integration test untuk auth, header, rate limit, dan upload.
- Rollback: revert tiap kontrol secara independen berdasarkan fitur yang bermasalah.

### Fase 11 — CI/CD GitHub

- [ ] Buat GitHub Actions untuk `npm ci`, lint/check, test, typecheck, dan Docker build.
- [ ] Cegah deployment jika salah satu quality gate gagal.
- [ ] Trigger Coolify hanya dari branch yang disetujui setelah CI lulus.
- [ ] Pertahankan opsi manual deployment/promotion untuk keadaan darurat.
- Risiko: pipeline salah dapat memblokir semua deployment atau melewatkan kegagalan.
- Validasi: buat PR percobaan yang sengaja gagal dan pastikan deployment tidak berjalan.
- Rollback: gunakan manual deployment image/commit terakhir yang sudah diverifikasi.

### Fase 12 — Verifikasi production dan cutover

- [ ] Ambil backup final dan catat commit/image yang akan dirilis.
- [ ] Jalankan smoke test staging dan minta sign-off.
- [ ] Ubah DNS atau promosikan deployment Coolify.
- [ ] Uji beranda, berita, profil, layanan, statistik, login admin, CRUD, pengaduan, upload publik, dan lampiran privat.
- [ ] Amati error, resource, database, dan log selama periode stabilisasi.
- Risiko: regresi aplikasi atau dependency eksternal setelah cutover.
- Validasi: seluruh alur kritis lulus melalui domain production dan tidak ada lonjakan error.
- Rollback: arahkan DNS kembali ke Vercel atau deploy image/commit sebelumnya, lalu gunakan database yang tetap backward-compatible.

## 15. Checklist Production Final

- [ ] Docker image berhasil dibangun.
- [ ] Container berjalan sebagai user non-root.
- [ ] Production build tidak memutasi database production.
- [ ] Aplikasi terhubung ke database.
- [ ] Migration production berhasil.
- [ ] Store/token Blob publik dan privat sudah dipisahkan.
- [ ] Database menggunakan storage yang persisten.
- [ ] Seluruh environment variable sudah dikonfigurasi.
- [ ] Liveness check berfungsi.
- [ ] Readiness check berfungsi.
- [ ] Domain mengarah ke Coolify.
- [ ] HTTPS valid dan HTTP dialihkan ke HTTPS.
- [ ] Hanya port 80/443 yang terbuka untuk traffic web publik.
- [ ] PostgreSQL tidak terekspos ke internet.
- [ ] Backup otomatis berhasil.
- [ ] Restore backup sudah diuji.
- [ ] Monitoring dan alerting aktif.
- [ ] Log aplikasi dapat diakses dan digunakan untuk diagnosis.
- [ ] CI quality gate aktif.
- [ ] Rolling deployment berhasil diuji.
- [ ] Rollback deployment dan database sudah diuji.

## Referensi Operasional

- [Coolify rolling updates](https://coolify.io/docs/knowledge-base/rolling-updates)
- [Coolify health checks](https://coolify.io/docs/knowledge-base/health-checks)
- [Coolify environment variables](https://coolify.io/docs/knowledge-base/environment-variables)
- [Coolify database backups](https://coolify.io/docs/databases/backups)
- [Coolify backup and restore](https://coolify.io/docs/knowledge-base/how-to/backup-restore-coolify)
- [Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)
