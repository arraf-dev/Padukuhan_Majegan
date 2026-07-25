<!--
=====================================================================
INSTRUKSI UNTUK AI — BACA BAGIAN INI TERLEBIH DAHULU
=====================================================================
Anda adalah asisten penyusun PRD (Product Requirements Document).

INPUT yang akan Anda terima bersama template ini:
- Hasil diskusi / notulen rapat (MoM) antara pengembang dan klien.
  Bisa berupa teks bebas, transkrip, atau poin-poin catatan.

TUGAS Anda:
1. Baca seluruh hasil diskusi dengan teliti.
2. Isi SEMUA placeholder {{...}} pada template di bawah berdasarkan
   informasi dari hasil diskusi.
3. Ikuti panduan pengisian dalam komentar <!-- --> di setiap bab.
   Komentar tersebut TIDAK boleh muncul di dokumen final.

ATURAN PENTING:
- JANGAN mengarang informasi. Jika sesuatu tidak disebutkan dalam
  diskusi, tulis di Bab 12 (Pertanyaan Terbuka / TBD) — jangan
  diisi dengan asumsi seolah-olah sudah disepakati.
- Jika Anda perlu membuat asumsi teknis yang wajar, letakkan di
  Bab 5 (Asumsi & Batasan) dan tandai jelas sebagai asumsi.
- Gunakan Bahasa Indonesia yang formal namun mudah dipahami.
- Setiap kebutuhan fungsional wajib punya ID unik dengan format
  PREFIX-N (contoh: AUTH-1, TRX-2). Prefix dibuat dari singkatan
  modul (3–4 huruf kapital).
- Prioritas hanya boleh salah satu dari: **Wajib** (MVP, harus ada),
  **Penting** (MVP jika sempat / sangat diharapkan), **Fase 2**
  (di luar MVP, dikerjakan setelah rilis awal).
- Fitur yang disebut klien tapi disepakati "nanti saja" masuk ke
  Bab 11 (Fitur Usulan / Fase Lanjutan), bukan ke Bab 6.
- Versi dokumen pertama selalu v0.1 (Draft Sementara).
- OUTPUT: dokumen Markdown lengkap sesuai struktur template,
  tanpa komentar instruksi apa pun.
=====================================================================
-->

# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## {{NAMA_PRODUK}}

**STATUS: {{STATUS_DOKUMEN}}** <!-- contoh: DRAFT SEMENTARA / FINAL -->

| | |
| --- | --- |
| **Nama Produk** | {{NAMA_PRODUK_LENGKAP}} |
| **Versi Dokumen** | {{VERSI}} |
| **Disusun oleh** | {{NAMA_PENGEMBANG}} (Pengembang) |
| **Untuk** | {{NAMA_KLIEN}} (Klien) |
| **Tanggal** | {{TANGGAL_DOKUMEN}} |
| **Dokumen Terkait** | {{DOKUMEN_TERKAIT}} <!-- contoh: Notulen Rapat (MoM) – tanggal --> |

---

# 1. Ringkasan Produk (Overview)

<!-- 2 paragraf.
Paragraf 1: masalah/kondisi bisnis saat ini yang melatarbelakangi
(proses manual, alat yang dipakai sekarang, pain point).
Paragraf 2: solusi yang akan dibangun — jenis sistem, panel/modul
utama, cakupan siklus yang ditangani, dan tujuan besarnya. -->

{{RINGKASAN_PRODUK}}

# 2. Tujuan & Sasaran (Goals)

<!-- 4–6 bullet. Fokus pada outcome bisnis, bukan fitur.
Contoh pola: "Memusatkan...", "Mengurangi...", "Menyediakan data
untuk...", "Memberikan transparansi...". -->

- {{TUJUAN_1}}
- {{TUJUAN_2}}
- {{TUJUAN_3}}

# 3. Pengguna & Peran (Users & Roles)

<!-- Satu bullet per peran. Format:
**Nama Peran :** ringkasan hak dan aktivitas utama peran tersebut.
Gali dari diskusi: siapa saja yang akan memakai sistem? -->

- **{{PERAN_1}} :** {{DESKRIPSI_PERAN_1}}
- **{{PERAN_2}} :** {{DESKRIPSI_PERAN_2}}

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

<!-- Bullet ringkas per kelompok fitur yang MASUK MVP.
Ini rangkuman level tinggi; detailnya di Bab 6. -->

- {{LINGKUP_MVP_1}}
- {{LINGKUP_MVP_2}}

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

<!-- Sebutkan singkat fitur-fitur yang ditunda dan rujuk ke Bab 11.
Jika tidak ada, tulis "Belum ada fitur yang ditunda pada tahap ini." -->

{{LINGKUP_DILUAR_MVP}}

# 5. Asumsi & Batasan (Assumptions & Constraints)

<!-- Bullet: pilihan teknologi (database, hosting, tier layanan),
pendekatan desain (mis. Mobile First), proses manual yang disengaja,
ketergantungan layanan pihak ketiga, dan potensi biaya tambahan.
Tandai jelas mana yang merupakan asumsi pengembang. -->

- {{ASUMSI_1}}
- {{ASUMSI_2}}

# 6. Kebutuhan Fungsional (Functional Requirements)

<!-- Kelompokkan per modul/aktor menjadi sub-bab 6.1, 6.2, dst.
Pola penamaan sub-bab: "Aktor — Nama Modul"
(contoh: "Admin — Manajemen Event", "Customer — Order").
Setiap sub-bab berisi tabel dengan format PERSIS seperti ini: -->

## 6.1 {{NAMA_MODUL_1}}

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **{{PREFIX}}-1** | {{DESKRIPSI_KEBUTUHAN}} | **Wajib** |
| **{{PREFIX}}-2** | {{DESKRIPSI_KEBUTUHAN}} | **Penting** |

<!-- Ulangi sub-bab sebanyak modul yang teridentifikasi dari diskusi.
Kebutuhan ditulis sebagai kalimat kemampuan: "Admin dapat...",
"Sistem menampilkan...", "Customer mengunggah...". -->

# 7. Alur Pengguna Utama (Key User Flows)

<!-- Buat 3–5 alur terpenting sebagai sub-bab 7.1, 7.2, dst.
Setiap alur berupa langkah bernomor dari sudut pandang pengguna,
sertakan perubahan status sistem dalam tanda kutip jika ada
(contoh: status "Menunggu Pembayaran"). Alur wajib minimal:
alur transaksi utama (happy path) dan alur pengecualian penting
(pembatalan, kegagalan, dsb.) jika dibahas dalam diskusi. -->

## 7.1 {{NAMA_ALUR_1}}

1. {{LANGKAH_1}}
2. {{LANGKAH_2}}

# 8. Model Data (High-Level)

<!-- Tabel entitas utama yang tersirat dari kebutuhan fungsional.
Field pakai snake_case. Field milik fitur Fase Lanjutan ditulis
dalam [kurung siku] dan beri catatan di bawah tabel. -->

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **{{ENTITAS_1}}** | {{FIELD_UTAMA}} | {{KETERANGAN}} |

**Catatan:** field dalam [tanda kurung siku] merupakan bagian dari fitur usulan/Fase Lanjutan (Bab 11).

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

<!-- Bullet dengan pola "**Aspek :** penjelasan". Aspek umum yang
perlu dipertimbangkan: responsivitas/mobile, keamanan & hak akses,
skalabilitas, ketahanan koneksi, privasi data, performa.
Hanya masukkan yang relevan dengan konteks proyek. -->

- **{{ASPEK_1}} :** {{PENJELASAN_1}}
- **{{ASPEK_2}} :** {{PENJELASAN_2}}

# 10. Integrasi Pihak Ketiga

<!-- Semua layanan eksternal yang disebut dalam diskusi.
Layanan untuk fase lanjutan tetap dicantumkan dengan catatan
"Fase Lanjutan". Jika tidak ada integrasi, tulis satu kalimat
bahwa sistem berdiri sendiri. -->

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **{{LAYANAN_1}}** | {{FUNGSI_1}} | {{CATATAN_1}} |

# 11. Fitur Usulan / Fase Lanjutan

<!-- Fitur yang dibahas tapi TIDAK masuk MVP. Format:
"**Nama Fitur.** Penjelasan manfaat & cara kerjanya secara ringkas,
plus keterkaitannya dengan fitur MVP jika ada."
Jika tidak ada, tulis "Belum ada usulan fase lanjutan." -->

- **{{FITUR_USULAN_1}}.** {{PENJELASAN_FITUR_1}}

# 12. Pertanyaan Terbuka / TBD

<!-- SANGAT PENTING: semua hal yang belum diputuskan dalam diskusi
masuk ke sini — nama brand, biaya, kebijakan, timeline, metode
pembayaran, dsb. Ini mencegah asumsi liar. Bullet ringkas. -->

- {{PERTANYAAN_1}}
- {{PERTANYAAN_2}}

# 13. Glosarium

<!-- Istilah khusus domain klien atau istilah teknis yang muncul
dalam dokumen. Format: "**Istilah :** definisi singkat." -->

- **{{ISTILAH_1}} :** {{DEFINISI_1}}

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan klien.*
