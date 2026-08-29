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
| Nomor WhatsApp resmi (wa.me) | \_\_\_\_\_\_\_\_\_\_ |
| Alamat balai | \_\_\_\_\_\_\_\_\_\_ |
| Koordinat peta (opsional) | \_\_\_\_\_\_\_\_\_\_ |

### 2. Sejarah & visi-misi (naskah)

- [ ] Naskah sejarah padukuhan siap (2–4 paragraf) → tempel ke `#judul-sejarah` di `/admin/profil`
- [ ] Visi & misi siap → `#judul-visi-misi`
- [ ] Foto bangunan/balai untuk halaman Profil (opsional)

### 3. Perangkat padukuhan
Isi per baris di `/admin/profil` (foto: JPG/PNG/WEBP ≤ 4 MB):

| Nama | Jabatan | Foto |
|---|---|---|
| | Dukuh | [ ] |
| | Sekretaris | [ ] |
| | Ketua RT 01..0n | [ ] |

### 4. Layanan administrasi
Tiap layanan perlu divalidasi syarat & alurnya **bersama perangkat yang menangani**:
- [ ] Layanan terlampir di `/admin/layanan` sudah sesuai syarat riil (surat/berkas/durasi)
- [ ] Templat berkas (PDF) per layanan tersedia untuk diunggah
- [ ] Alur langkah (1–4) sudah benar

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
