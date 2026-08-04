# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## DesaKu — Website Layanan & Informasi Digital Desa

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | DesaKu — Website Layanan & Informasi Digital Kalurahan Pandowoharjo |
| **Versi Dokumen** | v0.1 (Draft Sementara) |
| **Disusun oleh** | Abdul Rafi — Tim KKN UNY (Pengembang) |
| **Untuk** | Pemerintah Kalurahan Pandowoharjo (Klien) |
| **Tanggal** | 14 Juli 2026 |
| **Dokumen Terkait** | `TASKS.md` (rencana eksekusi 6 minggu), `RAB_Infrastruktur_Website.md`. |

## Riwayat Perubahan Lingkup

| Tanggal | Perubahan | Alasan |
| --- | --- | --- |
| 28 Jul 2026 | **Modul Transparansi Anggaran (APBDes) dihapus seluruhnya** — kebutuhan APB-1/2/3 (bekas Bab 6.5), ADM-6, alur 7.4, dan entitas `anggaran` pada Bab 8. | Publikasi APBDes menuntut izin resmi kalurahan yang tidak dapat dipastikan turun dalam masa KKN 6 minggu. Prioritasnya **Penting**, bukan Wajib, sehingga penghapusannya tidak mengurangi MVP. Modul Statistik Penduduk **tetap dikerjakan**. |

> Nomor ID kebutuhan (ADM-7, ADM-8, dst.) **sengaja tidak digeser** setelah ADM-6 dihapus. ID dipakai sebagai rujukan di `TASKS.md` dan komentar kode; menomori ulang akan membuat rujukan lama menunjuk kebutuhan yang salah.

---

# 1. Ringkasan Produk (Overview)

Saat ini penyebaran informasi di tingkat desa umumnya masih mengandalkan kanal konvensional seperti papan pengumuman kantor desa, undangan fisik, dan grup WhatsApp yang terfragmentasi. Warga yang ingin mengurus layanan administrasi (surat keterangan, surat pengantar, dan sejenisnya) sering kali harus datang langsung ke kantor desa hanya untuk menanyakan persyaratan, lalu kembali lagi ketika berkas sudah lengkap. Di sisi lain, data publik seperti statistik kependudukan belum tersaji dalam bentuk yang mudah diakses masyarakat, sehingga gambaran kondisi desa sulit dilihat langsung oleh warga.

Sebagai program kerja utama KKN, tim pengembang akan membangun **DesaKu**, sebuah website desa berbasis web (fullstack Next.js) yang terdiri dari dua bagian besar: (1) **situs publik** yang menampilkan profil desa, berita dan pengumuman, informasi layanan administrasi, statistik penduduk, serta kanal pengaduan warga; dan (2) **panel admin** bagi perangkat desa untuk mengelola seluruh konten dan menindaklanjuti pengaduan. Tujuan besarnya adalah memusatkan informasi resmi desa dalam satu kanal digital yang mudah diakses, meningkatkan transparansi, serta meninggalkan sistem yang berkelanjutan dan dapat dikelola mandiri oleh perangkat desa setelah masa KKN berakhir.

**Catatan pemetaan program kerja KKN (usulan pengembang, perlu konfirmasi DPL):**

| **Kategori Proker** | **Cakupan dalam Dokumen Ini** |
| --- | --- |
| **Proker Utama** | Pembangunan website inti: situs publik (profil, berita, layanan, pengaduan) + panel admin — kebutuhan berprioritas **Wajib** di Bab 6. |
| **Proker Penunjang** | Modul statistik penduduk (prioritas **Penting**) serta pelatihan dan pendampingan perangkat desa dalam mengelola website. |
| **Proker Tambahan** | Fitur usulan / Fase Lanjutan pada Bab 11 (direktori UMKM, galeri kegiatan, agenda desa, dsb.) yang dikerjakan setelah rilis awal jika waktu KKN memungkinkan. |

# 2. Tujuan & Sasaran (Goals)

- Memusatkan informasi resmi desa (profil, berita, pengumuman, layanan) dalam satu kanal digital yang mudah diakses warga kapan saja.
- Mengurangi kebutuhan warga datang langsung ke kantor desa hanya untuk menanyakan persyaratan layanan administrasi.
- Menyajikan data kependudukan desa kepada publik dalam bentuk agregat yang mudah dibaca.
- Menyediakan kanal aspirasi dan pengaduan warga yang terdokumentasi dan dapat dipantau statusnya.
- Meninggalkan sistem yang berkelanjutan: perangkat desa mampu mengelola konten secara mandiri setelah masa KKN berakhir.
- Menjadi fondasi digitalisasi layanan desa yang dapat dikembangkan pada fase-fase berikutnya (promosi UMKM, pengajuan surat online, dsb.).

# 3. Pengguna & Peran (Users & Roles)

- **Pengunjung / Warga :** Mengakses situs publik tanpa perlu login — melihat profil desa, membaca berita dan pengumuman, mencari informasi persyaratan layanan, melihat statistik penduduk, serta mengirim dan memantau status pengaduan.
- **Admin Desa (Perangkat Desa) :** Masuk ke panel admin untuk mengelola seluruh konten situs (berita, profil, layanan, statistik) dan menindaklanjuti pengaduan warga (mengubah status, menulis tanggapan).
- **Super Admin :** Mengelola akun Admin Desa (menambah, menonaktifkan) dan konfigurasi dasar sistem. Selama pengembangan dipegang oleh tim KKN, kemudian diserahterimakan kepada perangkat desa yang ditunjuk.

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP)

- Situs publik: beranda, profil desa (sejarah, visi-misi, struktur organisasi), kontak & lokasi kantor desa.
- Modul berita & pengumuman desa dengan kategori.
- Modul informasi layanan administrasi (jenis surat, persyaratan, alur pengurusan).
- Modul pengaduan & aspirasi warga dengan kode tiket dan pelacakan status.
- Modul statistik penduduk dalam bentuk grafik (bagian proker penunjang).
- Panel admin dengan autentikasi untuk pengelolaan seluruh konten di atas.
- Pelatihan singkat dan dokumentasi penggunaan bagi perangkat desa (kegiatan pendamping, bagian proker penunjang).

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan

Fitur pengajuan surat secara online (end-to-end), direktori UMKM & potensi desa, galeri kegiatan, agenda/kalender desa, dan peta interaktif wilayah ditunda ke fase lanjutan dan diusulkan sebagai kandidat **proker tambahan** — rincian pada Bab 11.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **(Asumsi pengembang)** Teknologi: aplikasi fullstack **Next.js** (App Router) dengan **Prisma ORM** dan basis data **PostgreSQL (Neon, free tier)**, di-deploy pada **Vercel (free tier / Hobby)**. Dipilih karena merupakan stack yang dikuasai tim dan tanpa biaya berlangganan.
- **(Asumsi pengembang)** Pendekatan desain **mobile-first**, dengan pertimbangan mayoritas warga mengakses melalui ponsel.
- **(Asumsi pengembang)** Penyimpanan media (gambar berita, lampiran pengaduan) menggunakan layanan gratis seperti Vercel Blob atau Cloudinary free tier.
- **(Asumsi pengembang)** Sampai domain resmi tersedia, website berjalan pada subdomain gratis (`*.vercel.app`). Pengajuan domain **desa.id** memerlukan proses resmi oleh pemerintah desa (lihat Bab 12).
- Proses layanan administrasi (verifikasi berkas, penerbitan surat) pada MVP **tetap berlangsung manual di kantor desa**; website hanya menyediakan informasi persyaratan dan alurnya.
- Konten awal (sejarah desa, foto perangkat, daftar layanan resmi, data statistik penduduk) disediakan oleh pemerintah desa; input awal ke sistem dibantu tim KKN.
- Tidak ada biaya operasional pada MVP. Potensi biaya di masa depan: pembelian/perpanjangan domain dan peningkatan tier layanan jika lalu lintas melampaui batas free tier.
- Pengembangan mengikuti masa pelaksanaan KKN, sehingga cakupan fitur menyesuaikan waktu yang tersedia.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Publik — Profil Desa

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **PRF-1** | Sistem menampilkan halaman beranda berisi sambutan, sorotan berita terbaru, dan akses cepat ke layanan serta pengaduan. | **Wajib** |
| **PRF-2** | Sistem menampilkan halaman profil desa: sejarah, visi & misi, serta gambaran umum wilayah. | **Wajib** |
| **PRF-3** | Sistem menampilkan struktur organisasi pemerintah desa beserta nama, jabatan, dan foto perangkat. | **Wajib** |
| **PRF-4** | Sistem menampilkan informasi kontak resmi desa (alamat, telepon, email, jam layanan) beserta peta lokasi kantor desa. | **Wajib** |

## 6.2 Publik — Berita & Pengumuman

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **BRT-1** | Pengunjung dapat melihat daftar berita dan pengumuman terbaru dengan navigasi halaman (pagination). | **Wajib** |
| **BRT-2** | Pengunjung dapat membaca detail berita: judul, gambar sampul, isi, penulis, dan tanggal terbit. | **Wajib** |
| **BRT-3** | Pengunjung dapat menyaring berita berdasarkan kategori (misal: Pengumuman, Kegiatan, Pembangunan). | **Penting** |
| **BRT-4** | Pengunjung dapat mencari berita menggunakan kata kunci. | **Penting** |

## 6.3 Publik — Informasi Layanan Administrasi

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **LYN-1** | Sistem menampilkan daftar layanan administrasi desa (surat keterangan, surat pengantar, dan lainnya). | **Wajib** |
| **LYN-2** | Sistem menampilkan detail setiap layanan: persyaratan dokumen, alur pengurusan, dan estimasi waktu penyelesaian. | **Wajib** |
| **LYN-3** | Pengunjung dapat mengunduh templat/formulir dokumen persyaratan apabila tersedia. | **Penting** |

## 6.4 Publik — Pengaduan & Aspirasi Warga

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **LPR-1** | Warga dapat mengirim pengaduan/aspirasi melalui formulir berisi kategori, isi laporan, lampiran foto (opsional), serta identitas dan kontak pelapor. | **Wajib** |
| **LPR-2** | Sistem menghasilkan kode tiket unik untuk setiap pengaduan yang masuk dan menampilkannya kepada pelapor. | **Penting** |
| **LPR-3** | Warga dapat melacak status pengaduan ("Terkirim", "Diproses", "Selesai") beserta tanggapan admin menggunakan kode tiket. | **Penting** |
| **LPR-4** | Sistem menyediakan opsi pengiriman pengaduan secara anonim (kebijakannya perlu disepakati — lihat Bab 12). | **Penting** |

## 6.5 Publik — Statistik Penduduk

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **STA-1** | Sistem menampilkan statistik kependudukan agregat (jumlah penduduk, jenis kelamin, kelompok usia, pekerjaan, pendidikan) dalam bentuk grafik. | **Penting** |
| **STA-2** | Data statistik yang ditampilkan bersifat agregat, tanpa data pribadi individual warga. | **Penting** |

## 6.6 Admin — Autentikasi & Manajemen Akun

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **AUTH-1** | Admin dapat masuk ke panel admin menggunakan email dan kata sandi. | **Wajib** |
| **AUTH-2** | Sistem membatasi akses panel admin hanya untuk akun terautentikasi sesuai perannya (role-based access). | **Wajib** |
| **AUTH-3** | Super Admin dapat menambah dan menonaktifkan akun Admin Desa. | **Penting** |
| **AUTH-4** | Admin dapat mengganti kata sandi akunnya sendiri. | **Penting** |

## 6.7 Admin — Manajemen Konten & Pengaduan

| **ID** | **Kebutuhan Fungsional** | **Prioritas** |
| --- | --- | --- |
| **ADM-1** | Admin dapat membuat, mengubah, menghapus, dan menerbitkan berita dengan status "Draft" dan "Terbit". | **Wajib** |
| **ADM-2** | Admin dapat mengelola konten profil desa dan data struktur organisasi. | **Wajib** |
| **ADM-3** | Admin dapat mengelola daftar layanan administrasi beserta persyaratan dan alurnya. | **Wajib** |
| **ADM-4** | Admin dapat melihat daftar pengaduan masuk, mengubah statusnya, dan menulis tanggapan. | **Wajib** |
| **ADM-5** | Admin dapat mengunggah gambar untuk kebutuhan konten (sampul berita, foto perangkat, dsb.). | **Wajib** |
| **ADM-7** | Admin dapat mengelola data statistik penduduk agregat. | **Penting** |
| **ADM-8** | Sistem menampilkan dashboard ringkas: jumlah berita terbit, pengaduan baru, dan pengaduan yang belum ditanggapi. | **Penting** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Warga Mengirim dan Memantau Pengaduan

1. Warga membuka halaman "Pengaduan" pada situs publik.
2. Warga mengisi formulir: kategori, isi laporan, lampiran foto (opsional), serta identitas — atau memilih opsi anonim.
3. Sistem menyimpan pengaduan dengan status "Terkirim" dan menampilkan kode tiket unik kepada warga.
4. Admin Desa melihat pengaduan baru di panel admin, lalu mengubah status menjadi "Diproses".
5. Setelah ditindaklanjuti, Admin menulis tanggapan dan mengubah status menjadi "Selesai".
6. Warga membuka halaman "Lacak Pengaduan", memasukkan kode tiket, dan melihat status terkini beserta tanggapan.

## 7.2 Warga Mencari Informasi Layanan Administrasi

1. Warga membuka halaman "Layanan" pada situs publik.
2. Warga memilih jenis layanan yang dibutuhkan (misal: surat keterangan domisili).
3. Sistem menampilkan persyaratan dokumen, alur pengurusan, dan estimasi waktu penyelesaian.
4. Warga mengunduh templat formulir apabila tersedia.
5. Warga datang ke kantor desa dengan berkas lengkap; proses penerbitan surat berlangsung manual (sesuai batasan MVP).

## 7.3 Admin Menerbitkan Berita

1. Admin masuk ke panel admin melalui halaman login.
2. Admin membuat berita baru: judul, gambar sampul, kategori, dan isi — tersimpan dengan status "Draft".
3. Admin meninjau pratinjau tampilan berita.
4. Admin menekan tombol terbitkan; status berubah menjadi "Terbit" dan berita tampil di situs publik.

# 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **pengguna** | id, nama, email, password_hash, role, is_active | Akun panel admin; role: super_admin / admin. |
| **halaman_profil** | id, slug, judul, konten, updated_at | Konten statis profil desa (sejarah, visi-misi, dsb.). |
| **perangkat_desa** | id, nama, jabatan, foto_url, urutan | Data struktur organisasi. |
| **berita** | id, judul, slug, konten, gambar_sampul, kategori_id, penulis_id, status, published_at | Status: draft / terbit. |
| **kategori_berita** | id, nama, slug | Kategori untuk penyaringan berita. |
| **layanan** | id, nama_layanan, deskripsi, persyaratan, alur, estimasi_waktu, file_templat | Informasi layanan administrasi. |
| **pengaduan** | id, kode_tiket, nama_pelapor, kontak, is_anonim, kategori, isi, lampiran_url, status, tanggapan, created_at | Status: terkirim / diproses / selesai. |
| **statistik_penduduk** | id, tahun, kategori, label, nilai | Data agregat; kategori: jenis_kelamin / usia / pekerjaan / pendidikan. |
| **[umkm]** | [id, nama_usaha, pemilik, kategori, deskripsi, kontak, foto_url] | Direktori UMKM — Fase Lanjutan. |
| **[galeri]** | [id, judul, foto_url, kegiatan, tanggal] | Galeri kegiatan — Fase Lanjutan. |

**Catatan:** field dalam [tanda kurung siku] merupakan bagian dari fitur usulan/Fase Lanjutan (Bab 11).

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsivitas :** Tampilan mengikuti pendekatan mobile-first dan berfungsi baik pada ponsel, tablet, maupun desktop.
- **Keamanan & Hak Akses :** Kata sandi disimpan dalam bentuk hash, panel admin dilindungi autentikasi dengan pembatasan berbasis peran, seluruh input divalidasi untuk mencegah serangan umum (injeksi, XSS).
- **Privasi Data :** Identitas dan kontak pelapor pengaduan tidak pernah ditampilkan ke publik; statistik penduduk hanya disajikan secara agregat.
- **Performa :** Halaman publik memanfaatkan static generation / ISR Next.js agar tetap cepat diakses pada koneksi internet pedesaan yang terbatas.
- **SEO & Keterjangkauan :** Halaman publik dilengkapi metadata dan sitemap agar mudah ditemukan melalui mesin pencari.
- **Keberlanjutan :** Sistem disertai dokumentasi penggunaan dan pelatihan agar perangkat desa dapat mengelola website secara mandiri pasca-KKN.
- **Biaya Operasional :** Seluruh layanan pada MVP menggunakan free tier tanpa biaya berlangganan.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Vercel** | Hosting dan deployment aplikasi Next.js. | Free tier (Hobby) — asumsi pengembang. |
| **Neon** | Basis data PostgreSQL serverless. | Free tier — asumsi pengembang. |
| **Vercel Blob / Cloudinary** | Penyimpanan gambar dan lampiran. | Dipilih salah satu; free tier — asumsi pengembang. |
| **Google Maps (embed)** | Peta lokasi kantor desa pada halaman kontak. | Embed gratis, tanpa API berbayar. |
| **WhatsApp (tautan wa.me)** | Kanal kontak cepat warga ke kantor desa. | Opsional; hanya berupa tautan, bukan integrasi API. |

# 11. Fitur Usulan / Fase Lanjutan

Fitur-fitur berikut diusulkan sebagai kandidat **proker tambahan** dan dikerjakan setelah rilis awal jika waktu KKN memungkinkan, atau diserahkan sebagai rekomendasi pengembangan lanjutan.

- **Pengajuan Surat Online.** Warga dapat mengajukan permohonan surat langsung dari website, mengunggah berkas persyaratan, dan memantau status pengajuan hingga surat siap diambil. Memperluas modul Informasi Layanan (LYN) dari sekadar informatif menjadi transaksional, dan berpotensi mengurangi antrean di kantor desa secara signifikan.
- **Direktori UMKM & Potensi Desa.** Katalog usaha dan produk warga (nama usaha, deskripsi, foto, kontak) sebagai media promosi ekonomi lokal. Terhubung dengan situs publik sebagai halaman tersendiri.
- **Galeri Kegiatan Desa.** Dokumentasi foto kegiatan desa yang dikelola admin, melengkapi modul Berita (BRT) dengan sisi visual.
- **Agenda / Kalender Kegiatan.** Jadwal kegiatan desa (posyandu, kerja bakti, musyawarah) yang dapat dilihat warga, membantu penyebaran undangan kegiatan.
- **Peta Interaktif Wilayah.** Peta dusun/padukuhan dan fasilitas umum desa untuk melengkapi halaman profil.

# 12. Pertanyaan Terbuka / TBD

- Konfirmasi desa/kalurahan lokasi KKN beserta nama resmi yang digunakan pada website (dokumen ini sementara memakai asumsi Kalurahan Pandowoharjo).
- Pembagian resmi modul ke proker utama/penunjang/tambahan — perlu disesuaikan dengan ketentuan LPPM UNY dan disetujui DPL (pemetaan pada Bab 1 baru usulan pengembang).
- Nama/brand resmi website dan logo yang akan digunakan.
- Domain: apakah pemerintah desa akan mengajukan domain **desa.id** (memerlukan surat permohonan resmi), atau cukup subdomain gratis untuk tahap awal?
- Ketersediaan dan izin publikasi data statistik kependudukan dari pemerintah desa.
- Kebijakan pengaduan: apakah opsi anonim diizinkan, dan perangkat desa mana yang bertanggung jawab menanggapi?
- Siapa perangkat desa yang ditunjuk sebagai pengelola (admin dan super admin) setelah serah terima pasca-KKN?
- Kesiapan konten awal: naskah sejarah desa, foto perangkat, daftar lengkap layanan beserta persyaratan resminya.
- Timeline pelaksanaan KKN dan target tanggal rilis awal website.
- Kebutuhan alamat email resmi desa untuk akun layanan (Vercel, Neon, dsb.) agar kepemilikan tidak melekat pada akun pribadi mahasiswa.

# 13. Glosarium

- **KKN :** Kuliah Kerja Nyata — program pengabdian masyarakat mahasiswa.
- **Proker :** Program kerja KKN; terbagi menjadi utama, penunjang, dan tambahan.
- **DPL :** Dosen Pembimbing Lapangan KKN.
- **PRD :** Product Requirements Document — dokumen kebutuhan produk seperti dokumen ini.
- **MVP :** Minimum Viable Product — cakupan fitur minimum yang layak dirilis pada tahap awal.
- **Kalurahan :** Sebutan resmi untuk desa di Daerah Istimewa Yogyakarta.
- **Panel Admin :** Antarmuka khusus terproteksi login untuk mengelola konten website.
- **Free Tier :** Paket layanan cloud gratis dengan batasan pemakaian tertentu.
- **ISR :** Incremental Static Regeneration — teknik Next.js untuk menyajikan halaman statis yang diperbarui berkala.

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut dengan klien.*
