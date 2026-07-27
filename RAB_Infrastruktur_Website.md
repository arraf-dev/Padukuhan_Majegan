# RAB Infrastruktur — Website Padukuhan Majegan

**Disusun:** 27 Juli 2026 · **Untuk:** proker KKN & pengajuan anggaran ke Kalurahan Pandowoharjo
**Lingkup:** biaya menjalankan website secara layak dan berkelanjutan setelah KKN selesai

> ⚠️ **Semua harga adalah estimasi per Juli 2026** dan harus diverifikasi ulang ke penyedia saat pembelian. Kurs asumsi **USD 1 = Rp 16.500**. Angka dalam dokumen ini dibulatkan ke atas supaya pengajuan anggaran tidak kurang.

---

## 1. Ringkasan Eksekutif

| Skenario | Biaya tahun ke-1 | Biaya per tahun berikutnya | Butuh admin teknis? |
|---|---:|---:|---|
| **A.** Gratis total (subdomain `.vercel.app`) | **Rp 0** | **Rp 0** | Tidak |
| **B.** Subdomain kalurahan ⭐ **REKOMENDASI** | **Rp 0 – 60.000** | **Rp 0 – 60.000** | Tidak |
| **C.** Domain sendiri + hosting gratis | **Rp 60.000 – 300.000** | **Rp 60.000 – 300.000** | Tidak |
| **D.** VPS mandiri | **Rp 1.600.000 – 3.100.000** | **Rp 1.500.000 – 2.900.000** | **Ya, wajib** |
| **E.** Layanan berbayar penuh | **Rp 7.900.000** | **Rp 7.900.000** | Tidak |

**Rekomendasi: Skenario B.** Biaya nyaris nol, alamat resmi dan kredibel, tanpa perlu satu pun orang yang paham server.

**Temuan terpenting:** biaya server bukan pos terbesar. Pos terbesar yang tidak terlihat di daftar harga adalah **tenaga pemeliharaan**. Skenario D menghemat Rp 0 dibanding B, tetapi menambah kewajiban teknis bulanan yang tidak ada yang memegangnya setelah KKN selesai.

---

## 2. Dasar Perhitungan

**Profil beban yang dilayani:**

- Sasaran pembaca: ± 1.284 jiwa / 402 KK penduduk Padukuhan Majegan
- Perkiraan kunjungan realistis: 20–100 pengunjung/hari (situs informasi padukuhan, bukan portal transaksi)
- Data yang disimpan: berita, profil, layanan, anggaran, statistik, pengaduan warga — semuanya teks. Perkiraan < 100 MB dalam 5 tahun
- Beban puncak: saat ada pengumuman penting atau pembagian bantuan

**Kesimpulan teknis:** beban ini **jauh di bawah** batas gratis semua penyedia yang dibandingkan. Membeli kapasitas lebih besar tidak membuat situs lebih cepat — hanya lebih mahal.

---

## 3. Rincian Komponen Biaya

### 3.1 Domain

| Jenis | Estimasi/tahun | Syarat | Catatan |
|---|---:|---|---|
| **Subdomain kalurahan** `majegan.pandowoharjo.desa.id` | **Rp 0** | Kalurahan sudah punya `pandowoharjo.desa.id` | Hanya perlu 1 record DNS dari admin kalurahan |
| `.desa.id` (domain induk) | Rp 50.000 – 100.000 | **Hanya untuk pemerintah desa/kalurahan**, bukan padukuhan | Perlu surat permohonan Lurah, SK, KTP, surat kuasa |
| `.or.id` | Rp 55.000 – 90.000 | Akta/SK organisasi | Alternatif kalau `.desa.id` tidak bisa |
| `.web.id` | Rp 25.000 – 55.000 | KTP saja | Paling longgar syaratnya |
| `.id` | Rp 220.000 – 300.000 | KTP | Paling mahal, paling bergengsi |
| `.com` | Rp 150.000 – 250.000 | — | Tahun pertama sering diskon, tahun kedua normal |

> 🔴 **Poin struktural yang wajib diperjelas di MoM:** Majegan adalah **padukuhan**, bukan desa/kalurahan. Domain `.desa.id` diterbitkan atas nama **pemerintah kalurahan**, sehingga `majegan.desa.id` kemungkinan besar **tidak bisa** didaftarkan sendiri oleh padukuhan. Jalur yang benar adalah subdomain di bawah domain Kalurahan Pandowoharjo — dan itu memang yang sudah diasumsikan di kode (`src/content/majegan.ts:15`).
>
> **Tanyakan ke kalurahan:** apakah `pandowoharjo.desa.id` sudah terdaftar? Kalau sudah, biaya domain kita **Rp 0**. Kalau belum, biayanya ditanggung kalurahan (Rp 50.000–100.000/tahun), bukan pos anggaran padukuhan.

### 3.2 Hosting Aplikasi

| Pilihan | Biaya/tahun | Cocok? |
|---|---:|---|
| **Vercel Hobby** | **Rp 0** | ✅ Sesuai beban. Batas gratis: 100 GB bandwidth/bulan — ± 100× kebutuhan kita |
| Vercel Pro | Rp 3.960.000 | ❌ Tidak ada kebutuhan yang membenarkannya |
| VPS Indonesia (2 vCPU / 2 GB) | Rp 960.000 – 2.400.000 | ⚠️ Lihat §5 |
| VPS luar negeri (Hetzner/Contabo) | Rp 780.000 – 1.320.000 | ⚠️ Lebih murah, latensi ke Indonesia lebih tinggi |
| Shared hosting cPanel | Rp 360.000 – 1.200.000 | ❌ **Tidak bisa dipakai** — Next.js butuh runtime Node.js, shared hosting umumnya hanya PHP |

> **Catatan lisensi:** Vercel Hobby diperuntukkan bagi penggunaan non-komersial. Website informasi pemerintahan padukuhan tanpa transaksi/iklan termasuk non-komersial, sehingga wajar memakai Hobby. Bila kelak ditambahkan lapak UMKM berbayar atau iklan, tinjau ulang ke Pro.

### 3.3 Basis Data

| Pilihan | Biaya/tahun | Catatan |
|---|---:|---|
| **Neon Free** | **Rp 0** | 0,5 GB — ± 5× kebutuhan 5 tahun. Tidur otomatis saat idle (jeda ±1 detik di kunjungan pertama) |
| Neon Launch | Rp 3.762.000 | Menghilangkan jeda idle. Tidak sebanding untuk trafik segini |
| Supabase Free | Rp 0 | ⚠️ Project di-*pause* setelah 7 hari tanpa aktivitas, perlu restore manual — berisiko untuk situs yang bisa sepi |
| PostgreSQL di VPS sendiri | Rp 0 tambahan | Tapi backup, update, dan pemulihan jadi tanggung jawab sendiri |

### 3.4 Penyimpanan Gambar

| Pilihan | Biaya/tahun | Catatan |
|---|---:|---|
| **Cloudinary Free** | **Rp 0** | 25 GB bandwidth/bulan — sangat cukup |
| **Vercel Blob Free** | **Rp 0** | Terintegrasi, kuota gratis memadai |

### 3.5 Email Resmi

| Pilihan | Biaya/tahun | Catatan |
|---|---:|---|
| **Zoho Mail Free** | **Rp 0** | 5 akun, domain sendiri — cukup untuk Dukuh + perangkat |
| Google Workspace | Rp 1.200.000+/akun | Tidak perlu |

### 3.6 Sertifikat SSL (HTTPS)

**Rp 0** di semua skenario — otomatis dari Vercel, atau Let's Encrypt gratis di VPS.

### 3.7 Biaya yang Sering Terlupakan

| Pos | Skenario A/B/C | Skenario D (VPS) |
|---|---:|---:|
| Backup basis data | Rp 0 (bawaan Neon) | Rp 200.000 – 600.000/tahun (snapshot) |
| Pemantauan uptime | Rp 0 (UptimeRobot free) | Rp 0 (UptimeRobot free) |
| **Tenaga pemeliharaan teknis** | **Rp 0** | **Rp 3.600.000 – 6.000.000/tahun** bila disewakan |
| Perpanjangan domain (tahunan) | Rp 0 – 300.000 | Rp 0 – 300.000 |

> **Pos "tenaga pemeliharaan" adalah biaya paling nyata sekaligus paling sering dihilangkan dari RAB.** Di Skenario A/B/C nilainya benar-benar nol karena tidak ada server yang perlu diurus. Di Skenario D, kalau tidak ada perangkat desa yang mampu, pekerjaan ini harus dibayar ke pihak ketiga — dan nilainya melampaui seluruh biaya server.

---

## 4. Perbandingan Skenario

### Skenario A — Gratis Total

| Komponen | Biaya/tahun |
|---|---:|
| Domain (`padukuhan-majegan.vercel.app`) | Rp 0 |
| Hosting Vercel Hobby | Rp 0 |
| Basis data Neon Free | Rp 0 |
| Penyimpanan gambar | Rp 0 |
| **TOTAL** | **Rp 0** |

**Kelemahan:** alamat `.vercel.app` terbaca sebagai situs percobaan, bukan situs resmi pemerintahan. Kurang kredibel untuk pengumuman resmi dan tidak pantas dicantumkan di papan pengumuman atau surat dinas.

### Skenario B — Subdomain Kalurahan ⭐ REKOMENDASI

| Komponen | Biaya/tahun |
|---|---:|
| Subdomain `majegan.pandowoharjo.desa.id` | Rp 0 |
| *(bila domain induk kalurahan belum ada — ditanggung kalurahan)* | *Rp 0 – 60.000* |
| Hosting Vercel Hobby | Rp 0 |
| Basis data Neon Free | Rp 0 |
| Penyimpanan gambar + email Zoho | Rp 0 |
| **TOTAL** | **Rp 0 – 60.000** |

**Keunggulan:** alamat resmi berakhiran `.desa.id` — kredibel, dipercaya warga, sah dicantumkan di dokumen dinas. Biaya praktis nol. Tanpa kewajiban teknis apa pun.

### Skenario C — Domain Sendiri + Hosting Gratis

| Komponen | Biaya/tahun |
|---|---:|
| Domain `.web.id` / `.or.id` / `.id` | Rp 55.000 – 300.000 |
| Hosting Vercel Hobby | Rp 0 |
| Basis data Neon Free | Rp 0 |
| **TOTAL** | **Rp 55.000 – 300.000** |

**Kapan dipakai:** bila kalurahan menolak/menunda pemberian subdomain, sehingga padukuhan perlu alamat sendiri.

### Skenario D — VPS Mandiri

| Komponen | Biaya awal | Biaya/tahun |
|---|---:|---:|
| Domain | — | Rp 55.000 – 300.000 |
| VPS 2 vCPU / 2 GB / 40 GB SSD | Rp 0 – 200.000 (setup) | Rp 960.000 – 2.400.000 |
| Backup otomatis / snapshot | — | Rp 200.000 – 600.000 |
| Sertifikat SSL (Let's Encrypt) | — | Rp 0 |
| Konfigurasi awal (Node, nginx, PostgreSQL, firewall) | Rp 500.000 – 1.500.000 *(bila disewakan)* | — |
| **Subtotal infrastruktur** | **Rp 500.000 – 1.700.000** | **Rp 1.215.000 – 3.300.000** |
| Tenaga pemeliharaan *(bila tak ada SDM internal)* | — | Rp 3.600.000 – 6.000.000 |
| **TOTAL REALISTIS** | **Rp 500.000 – 1.700.000** | **Rp 4.815.000 – 9.300.000** |

### Skenario E — Layanan Berbayar Penuh

| Komponen | Biaya/tahun |
|---|---:|
| Domain `.desa.id` | Rp 60.000 |
| Vercel Pro | Rp 3.960.000 |
| Neon Launch | Rp 3.762.000 |
| Penyimpanan berbayar | Rp 120.000 |
| **TOTAL** | **Rp 7.902.000** |

**Tidak direkomendasikan.** Membeli kapasitas puluhan kali lipat dari kebutuhan.

### Total Biaya Kepemilikan 5 Tahun

| Skenario | Tahun 1 | 5 Tahun | Kewajiban teknis |
|---|---:|---:|---|
| A. Gratis total | Rp 0 | **Rp 0** | Tidak ada |
| **B. Subdomain kalurahan** ⭐ | Rp 60.000 | **Rp 300.000** | Tidak ada |
| C. Domain sendiri | Rp 300.000 | **Rp 1.500.000** | Tidak ada |
| D. VPS (tanpa upah tenaga) | Rp 1.700.000 | **Rp 14.900.000** | Rutin bulanan |
| D. VPS (dengan upah tenaga) | Rp 5.300.000 | **Rp 38.900.000** | Rutin bulanan |
| E. Berbayar penuh | Rp 7.902.000 | **Rp 39.510.000** | Tidak ada |

**Selisih B vs D:** sekitar **Rp 14,6 juta** dalam 5 tahun, untuk kualitas layanan yang sama persis bagi warga.

---

## 5. Mengapa VPS Tidak Direkomendasikan di Sini

Bukan karena VPS buruk, melainkan karena tidak cocok dengan kondisi lapangan:

1. **Tidak ada yang memegang setelah KKN.** VPS menuntut orang yang bisa SSH, memperbarui sistem operasi, memperpanjang sertifikat, memulihkan layanan yang mati. Tidak ada perangkat Padukuhan Majegan yang saat ini berperan demikian, dan melatihkannya dalam sisa waktu KKN tidak realistis.
2. **Kegagalan bersifat senyap dan berlarut.** Bila Vercel bermasalah, ada tim yang menanganinya. Bila VPS mati Sabtu malam, situs padam sampai ada yang menyadari dan bisa memperbaiki — bisa berhari-hari.
3. **Keamanan menjadi tanggung jawab sendiri.** Server yang tidak diperbarui adalah sasaran empuk. Situs pemerintahan yang diretas menimbulkan kerugian nama baik yang jauh melebihi penghematan biaya.
4. **Biayanya justru lebih mahal**, bukan lebih murah — lihat tabel 5 tahun di atas.

### Kapan VPS Justru Menjadi Pilihan Benar

- **Ada kewajiban data harus berada di wilayah Indonesia.** Neon yang dipakai sekarang berlokasi di **Singapura**. Data pengaduan warga memuat nama dan kontak. Bila kalurahan atau regulasi menghendaki penempatan data di dalam negeri, ini alasan sah untuk pindah ke VPS/penyedia Indonesia. **Perlu ditanyakan saat MoM.**
- **Kalurahan sudah memiliki VPS beserta pengelolanya** untuk aplikasi lain — menumpang di sana berarti biaya tambahan nol dan SDM sudah tersedia.
- **Trafik tumbuh jauh melampaui perkiraan**, misalnya bila situs berkembang menjadi portal tingkat kalurahan.

> **Kabar baiknya: keputusan ini murah dibatalkan.** Aplikasi memakai PostgreSQL standar lewat Prisma, dan `src/lib/db.ts` sengaja tidak memakai pustaka khusus Neon. Pindah ke VPS berarti mengganti satu variabel `DATABASE_URL` dan menyiapkan server — kode dan skema basis data tidak berubah sama sekali. **Tidak perlu memutuskan sekarang untuk selamanya.**

---

## 6. Sumber Dana

| Sumber | Kelayakan | Catatan |
|---|---|---|
| **APBDes / Dana Desa** | Paling sesuai | Masuk bidang Penyelenggaraan Pemerintahan Desa — sub-bidang sistem informasi & administrasi. Diajukan lewat kalurahan |
| **Swadaya masyarakat** | Layak | Nominal Skenario B sangat kecil, terjangkau iuran RT |
| **Sisa dana / hibah KKN** | Layak untuk tahun ke-1 | ⚠️ **Tidak boleh** menjadi andalan tahun ke-2 dan seterusnya |
| **CSR perusahaan** | Mungkin | Untuk nominal sekecil ini, biaya pengurusannya tidak sepadan |

**Untuk Skenario B, nominalnya (Rp 0–60.000/tahun) berada di bawah ambang yang lazim memerlukan pengajuan formal** — realistis ditanggung operasional kalurahan tanpa proses anggaran berbelit.

---

## 7. Risiko Keberlanjutan

| Risiko | Dampak | Penanganan |
|---|---|---|
| **Domain lupa diperpanjang** | 🔴 Situs mati total, alamat bisa diambil pihak lain | Aktifkan *auto-renew*; daftarkan **2** kontak pengingat (Dukuh + 1 perangkat); catat tanggal jatuh tempo di dokumen serah terima |
| **Akun masih atas nama mahasiswa KKN** | 🔴 Kehilangan akses permanen bila mahasiswa tidak dapat dihubungi | Pindahkan kepemilikan Vercel & Neon ke email resmi desa **sebelum KKN berakhir** — sudah menjadi task Minggu 6 |
| Ketentuan layanan gratis berubah | 🟡 Perlu migrasi | Basis data PostgreSQL standar, mudah dipindah. Pantau berkala |
| Tidak ada yang memperbarui konten | 🟡 Situs basi, warga berhenti membuka | Pelatihan admin (Minggu 6) + tunjuk penanggung jawab konten secara resmi |
| Kartu kredit kedaluwarsa (bila berbayar) | 🟡 Layanan terhenti | Pakai skenario gratis — risiko ini hilang seluruhnya |

> **Risiko nomor satu bukan biaya, melainkan kepemilikan akun dan perpanjangan domain.** Keduanya bernilai kecil atau nol rupiah, tetapi masing-masing dapat mematikan situs sepenuhnya.

---

## 8. Rekomendasi & Langkah Eksekusi

**Ambil Skenario B.** Bila kalurahan belum dapat memberi subdomain dalam waktu dekat, jalan sementara adalah Skenario A (gratis, `.vercel.app`) sambil menunggu — situs tetap dapat digunakan dan dilatihkan, alamatnya tinggal dipindah kemudian tanpa mengubah kode.

**Langkah, berurutan:**

1. [ ] **Tanyakan ke Kalurahan Pandowoharjo (masukkan ke agenda MoM):**
   - Apakah domain `pandowoharjo.desa.id` sudah terdaftar dan aktif?
   - Bersediakah memberikan subdomain `majegan.pandowoharjo.desa.id`?
   - Siapa pengelola DNS-nya?
   - Adakah ketentuan penempatan data di dalam negeri yang harus dipatuhi?
2. [ ] Deploy ke Vercel memakai subdomain `.vercel.app` lebih dulu — **Rp 0**, tidak perlu menunggu jawaban apa pun *(lihat bagian B pada `TASKS.md`)*
3. [ ] Setelah subdomain disetujui: tambahkan di Vercel → Settings → Domains, lalu minta admin kalurahan menambahkan 1 record DNS `CNAME`
4. [ ] Perbarui `NEXT_PUBLIC_URL` ke alamat resmi, lalu **redeploy** (nilainya dibekukan saat build)
5. [ ] Pindahkan kepemilikan akun Vercel & Neon ke email resmi desa
6. [ ] Catat di dokumen serah terima: tanggal jatuh tempo domain, pemegang akun, dan langkah perpanjangan

---

## 9. Ringkasan untuk Dicantumkan di Laporan KKN

> Website Padukuhan Majegan dirancang agar dapat berjalan berkelanjutan **tanpa biaya berlangganan**. Infrastruktur memanfaatkan layanan gratis (Vercel dan Neon PostgreSQL) yang kapasitasnya jauh melampaui kebutuhan padukuhan, dengan alamat resmi berupa subdomain di bawah domain `.desa.id` milik Kalurahan Pandowoharjo.
>
> **Total biaya operasional yang diperlukan: Rp 0 hingga Rp 60.000 per tahun.**
>
> Alternatif penggunaan VPS mandiri telah dikaji dan tidak direkomendasikan, karena berbiaya sekitar **Rp 14,6 juta lebih mahal dalam lima tahun** sekaligus menuntut pemeliharaan teknis rutin yang belum tersedia sumber dayanya di tingkat padukuhan. Arsitektur aplikasi tetap disusun agar netral terhadap penyedia, sehingga perpindahan ke VPS dapat dilakukan sewaktu-waktu tanpa perubahan kode.
