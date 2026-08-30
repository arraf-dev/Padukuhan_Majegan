# Persetujuan & Input Data Resmi — Padukuhan Majegan

> Panduan untuk sesi bersama Pak Dukuh (dan perangkat berwenang). Tandai `[x]`
> pada tiap baris yang **sudah disetujui**, lalu isi kolom datanya. Data yang
> sudah terisi dan disetujui dapat langsung pakai; sisanya tetap `DATA_MODE=demo`.

## A. Persetujuan tampilan (butuh keputusan)

| No | Poin | Disetujui | Masukan/tambahan |
|---|---|---|---|
| 1 | Menu mobile (humberger) — perkiraan urutan: Beranda, Profil, Berita, Galeri, Potensi, Layanan, Statistik | [ ] | |
| 2 | Kartu "Struktur Perangkat" di halaman Profil (foto + jabatan) | [ ] | |
| 3 | Visual statistik penduduk (grafik batang/lingkaran) di halaman Statistik | [ ] | |
| 4 | Video hero pada Beranda: autoplay tanpa suara + poster fallback; **persetujuan crop Joglo** pada feed video | [ ] | |
| 5 | Komposisi hero (teks penuh di atas video) | [ ] | |
| 6 | Alur pengaduan tanpa pelacakan publik (sesuai revisi) | [ ] | |
| 7 | Hapus modul "Transparansi Anggaran" dari lingkup | [ ] | |

## B. Data resmi untuk diisi (isi + konfirmasi telah sesuai kenyataan)

### 1. Identitas & kontak

| Kolom | Nilai resmi |
|---|---|
| Nama padukuhan resmi | Majegan, Kalurahan Pandowoharjo, Kapanewon Sewon, Bantul |
| Tokoh/pemimpin (isi jabatan + nama) | Dukuh: \_\_\_\_\_\_\_\_\_\_ , Kaur: \_\_\_\_\_\_\_\_\_\_ |
| Nomor WhatsApp resmi (wa.me) | 0851-5651-3401 |
| Alamat balai | \_\_\_\_\_\_\_\_\_\_ |
| Koordinat peta (opsional) | \_\_\_\_\_\_\_\_\_\_ |

### 2. Sejarah & visi-misi (naskah)

- [ ] Naskah sejarah padukuhan siap (2–4 paragraf) → tempel ke `#judul-sejarah` di `/admin/profil`
- [x] **Draf visi-misi terpasang** (Var. "majeg" — 30 Ags 2026): visi bertema majem (teguh/gotong royong) + 5 misi (rukun & merti dusun; tani/UMKM; layanan Balai Dusun; lingkungan & ronda; generasi & kesehatan). Siap-muat sudah dimatikan — **tinggal pengesahan musyawarah** bila rumusannya mau diubah, cukup edit di `/admin/profil`.
- [ ] Foto bangunan/balai untuk halaman Profil (opsional)

### 3. Perangkat padukuhan — **sudah dipasang sesuai poster resmi** (nama & foto menunggu Anda; kartu menampilkan jabatan saja)

| Jabatan (sudah live di situs) | Nama (isi di sini / edit via `/admin/profil`) | Foto |
|---|---|---|
| Dukuh Majegan | | [ ] |
| LPMKal Sub Unit Majegan | | [ ] |
| Ketua PKK | | [ ] |
| Ketua Karang Taruna | | [ ] |
| Ketua Kelompok Kandang | | [ ] |
| Ketua Kelompok Tani | | [ ] |
| Ketua Organisasi Kemasyarakatan Lain | | [ ] |
| Ketua RW 32 | | [ ] |
| Ketua RW 33 | | [ ] |
| Ketua RT 1 s.d. RT 5 (masing-masing baris) | | [ ] |

**Konfirmasi tambahan:** pembagian RT di bawah RW 32 dan RW 33 (poster hanya menampilkan RT 1–5 di RW 32) — dan nama resmi tiap jabatan.

### 4. Layanan administrasi — **8 surat resmi sudah dipasang sesuai poster** (lihat halaman `/layanan`; admin dapat menyunting kapan pun)
- [ ] Konfirmasi **tautan/petunjuk form usaha** pada layanan "Surat Pengajuan Surat Keterangan Usaha" (saat ini tertulis "tautan disampaikan saat mengajukan")
- [ ] Konfirmasi biaya & durasi per layanan (saat ini `GRATIS` dan `± 1 hari kerja`)
- [ ] Templat berkas (PDF) masih belum ada di poster — menyusul bila diperlukan

### 5. Statistik penduduk
- [ ] Data terbaru per tahun (total jiwa, KK, kelompok umur, jenis kelamin, pendidikan, pekerjaan)
- [ ] Izin publikasi data dari kalurahan diperoleh (lampirkan MoM bila diminta)

### 6. Potensi
- [ ] Daftar UMKM/Pariwisata/Budaya yang benar: nama, ringkasan, foto, data infografis
- [ ] Persetujuan pemilik untuk menampilkan foto usaha

### 7. Berita
- [ ] Butir berita asli siap diunggah (minimal 2: contoh kegiatan gotong royong, kerja sama kalurahan)

## C. Langkah penutup setelah data disetujui

1. Masukkan data lewat panel admin (`/admin`).
2. Cek tampilan publik pada 320 px, 768 px, 1366 px.
3. Minta Pak Dukuh melihat dan **menandatangani daftar ini**.
4. Ubah `DATA_MODE` dari `demo` → `official` di environment Vercel (Production & Preview), redeploy, dan verifikasi penanda "data contoh" hilang.
5. Simpan dokumen ini sebagai lampiran produk KKN.

## D. Catatan hukum/privasi

- Publikasi data penduduk berupa **agregat** (tanpa nama individu) — tanpa NIK/nama per orang.
- Identitas pelapor pengaduan hanya untuk perangkat desa, tidak dipublikasikan.
- Izin tampil foto perangkat/UMKM: minta persetujuan tertulis bila foto memuat orang teridentifikasi.
