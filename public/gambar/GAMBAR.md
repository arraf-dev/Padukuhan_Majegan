# Daftar Gambar — cara menukar ilustrasi dengan foto asli

Berkas `.svg` di folder ini adalah **ilustrasi sementara**, bukan foto Majegan yang sebenarnya. Masing-masing diberi tanda halus bertuliskan *"ilustrasi"* di pojok kanan bawah supaya tidak disangka dokumentasi asli.

## Cara menukar — tanpa menyentuh kode sama sekali

1. Siapkan gambar penggantinya (foto asli Majegan, atau foto stok bebas lisensi)
2. Beri nama **persis sama**, hanya ekstensinya berubah: `gapura-majegan.svg` → `gapura-majegan.jpg`
3. Simpan di folder ini
4. Perbarui rujukannya di `src/content/majegan.ts` — cari `/gambar/` lalu ganti akhiran `.svg` menjadi `.jpg`

Ganti tanda `"ilustrasi"` tidak perlu dihapus manual: begitu berkas SVG-nya ditimpa foto, tandanya ikut hilang.

> Foto asli Majegan selalu lebih baik daripada foto stok. Foto stok memperlihatkan desa **orang lain** — perangkat desa bisa mengira itu dusun mereka. Kalau memakai foto stok, sebutkan dalam keterangan bahwa itu foto ilustrasi.

## Daftar slot

| Berkas | Dipakai di | Rasio | Ukuran minimum |
|---|---|---|---|
| `gapura-majegan.svg` | Hero beranda (desktop) | 16:10 | 1200 × 750 |
| `balai-dusun.svg` | Halaman Profil | 4:3 | 1000 × 750 |
| `sawah.svg` | Latar seksi statistik | 16:9 | 1600 × 900 |
| `merti-dusun.svg` | Berita kategori Kegiatan | 1:1 | 800 × 800 |
| `kerja-bakti.svg` | Berita kategori Kegiatan | 1:1 | 800 × 800 |
| `panen.svg` | Berita kategori Kegiatan | 1:1 | 800 × 800 |
| `posyandu.svg` | Berita kategori Pengumuman | 1:1 | 800 × 800 |
| `pengumuman.svg` | Berita kategori Pengumuman | 1:1 | 800 × 800 |
| `cor-jalan.svg` | Berita kategori Pembangunan | 1:1 | 800 × 800 |
| `avatar-dukuh.svg` | Sambutan Dukuh & struktur | 1:1 | 400 × 400 |
| `avatar-perangkat.svg` | Kartu perangkat di Profil | 1:1 | 400 × 400 |

Semua slot memakai `object-cover`, jadi gambar akan dipotong menyesuaikan bingkai — **taruh objek utama di tengah**.

## Kata kunci pencarian foto stok

Untuk [Unsplash](https://unsplash.com) atau [Pexels](https://pexels.com) — keduanya gratis untuk penggunaan komersial maupun non-komersial, tanpa wajib atribusi (mencantumkan nama fotografer tetap dianjurkan).

| Slot | Kata kunci |
|---|---|
| Gapura | `javanese village gate`, `gapura desa`, `indonesian village entrance` |
| Balai dusun | `joglo`, `javanese traditional house`, `village hall indonesia` |
| Sawah | `rice terrace java`, `indonesian rice field`, `sawah yogyakarta` |
| Merti dusun | `indonesian village ceremony`, `gunungan`, `javanese cultural parade` |
| Kerja bakti | `community cleaning river`, `gotong royong`, `volunteers cleanup` |
| Panen | `rice harvest indonesia`, `farmer harvesting java` |
| Posyandu | `village health post`, `community health indonesia`, `baby weighing` |
| Pengumuman | `village notice board`, `community bulletin board` |
| Cor jalan | `village road construction`, `concrete road work` |
| Avatar | Gunakan **foto asli perangkat desa**. Wajah orang asing sebagai "perangkat dusun" menyesatkan dan tidak pantas. |

## Menaruh gambar lewat panel admin

Untuk **berita**, tidak perlu menyentuh berkas sama sekali. Panel admin (`/admin/berita`) punya isian **tautan gambar** — tempel URL gambar apa pun, atau path lokal seperti `/gambar/kerja-bakti.svg`.

Bila memakai URL dari luar, host-nya harus terdaftar lebih dulu di `next.config.ts` pada `images.remotePatterns`. Yang sudah diizinkan: `images.unsplash.com`, `images.pexels.com`, `res.cloudinary.com`.

## Kalau nanti unggahan berkas sudah aktif (ADM-5 / task 17)

Setelah Vercel Blob terpasang, komposer akan menerima berkas langsung dan folder ini hanya menyisakan aset tetap (gapura, balai dusun, sawah, avatar).
