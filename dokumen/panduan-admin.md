# Panduan Admin — Website Padukuhan Majegan

> Untuk perangkat desa yang ditunjuk menjadi admin. Situs: `<situs-padukuhan>` · Panel admin: `<situs-padukuhan>/admin`

## 1. Masuk & rol

1. Buka `<situs>/admin` — otomatis diarahkan ke halaman **Masuk**.
2. Isi email dan kata sandi yang diterima dari Pak Dukuh → **Masuk**.
3. Setelah 5 kali salah kata sandi, akun/IP Anda ditahan **15 menit**. Tunggu, jangan mencoba-coba terus.
4. **SuperAdmin** dapat: semua modul, melihat identitas pelapor, kelola akun & peran.
   **Admin** dapat: semua modul **kecuali** identitas pelapor dan kelola akun.
5. Logout: klik menu **Keluar** (di pojok kanan atas panel).

## 2. Berita (pengumuman kegiatan)

- Buka **Berita → Tulis Berita**.
- Isi judul, lokasi (opsional), tulisan, pilih kategori (Pengumuman/Kegiatan/Pembangunan), unggah foto (opsional, JPG/PNG/WEBP ≤ 4 MB).
- **Tayangkan Sekarang** = langsung tampil ke publik. **Simpan Draf** = tersimpan, belum tampil.
- Edit dan hapus dari **Berita → Kelola Berita**. Menghapus bersifat permanen.
- Catatan: tautan berita yang dibagikan ke warga akan berubah bila berita dihapus.

## 3. Galeri & Potensi

- **Galeri → Tambah Album**: beri judul & deskripsi, pilih kategori, unggah beberapa foto sekaligus.
- **Potensi**: pilih kategori (Pariwisata/UMKM/Budaya), tambah entri beserta foto dan angka infografis.
- Format foto: JPG/PNG/WEBP, maks 4 MB.

## 4. Layanan

- **Layanan → Tambah**: nama layanan, persyaratan, dan langkah alur (pisah baris: langkah | penjelasan).
- Templat berkas (PDF) dapat diunggah agar warga bisa mengunduhnya.
- Validasi ulang syarat dengan perangkat yang berwenang bila ada perubahan.

## 5. Statistik penduduk

- Buka **Statistik**: pilih **tahun**, lalu isi total jiwa/KK dan distribusi per kelompok (umur, jenis kelamin, pendidikan, pekerjaan).
- Nilai harus berupa angka wajar; kesalahan rentang ditolak otomatis.
- Data yang tampil merupakan **agregat** — tanpa nama/NIK.

## 6. Pengaduan warga

- Buka **Pengaduan Warga**: filter **Semua / Belum Dibaca / Dibaca**.
- Klik laporan → baca isi, lokasi, lampiran, lalu klik **Tandai Sudah Dibaca**.
- **Privasi**: nama & nomor pelapor hanya terlihat oleh SuperAdmin. Jangan pernah menyebarkan.
- Lampiran hanya bisa dibuka dari dalam panel admin.

## 7. Profil & Struktur

- Buka **Profil**: sunting naskah sejarah / visi-misi dan daftar perangkat (foto + jabatan).
- Jangan menghapus perangkat yang masih menjabat.

## 8. Akun & sandi (khusus SuperAdmin)

- **Akun**: tambah admin baru (nama, email, jabatan, peran, sandi awal) — bagikan sandi lewat kontak pribadi, bukan grup.
- Setel ulang peran/status aktif bila ada mutasi.
- **Aturan keselamatan**: selalu ada minimal satu SuperAdmin aktif. SuperAdmin terakhir tidak bisa diturunkan/dinonaktifkan.
- Ganti kata sandi sendiri lewat **Akun → Akun Saya / Ubah sandi**.

## 9. Keamanan sederhana

- Gunakan sandi panjang (8+ karakter) dan unik — jangan dipakai untuk aplikasi lain.
- Login pada perangkat yang Anda pegang; jangan simpan sandi di tempat terbuka.
- Bila ada data yang keliru tampil atau ikon teknis muncul, catat URL & tampilkan ke pengembang KKN.

## 10. Mode data

- Selama badge "data contoh" tampil, situs masih berjalan pada `DATA_MODE=demo`.
- Setelah data resmi masuk & diverifikasi, pengembang akan mengubah ke `official` — badge hilang otomatis.

---

### Istilah

- **Draf**: belum tampil ke publik. **Terbit**: sudah tampil.
- **Form Server Action**: data disimpan langsung melalui server — tidak perlu tombol simpan terpisah.
- **Revalidate**: perubahan di admin otomatis menarik ulang halaman publik (maks 60 detik).
