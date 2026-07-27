# Panduan VPS — Website Padukuhan Majegan

**Keputusan:** VPS disewa dan dibayar oleh mahasiswa KKN untuk **3 bulan pertama**, selanjutnya menjadi tanggungan Padukuhan Majegan / Kalurahan Pandowoharjo.

**Dokumen ini adalah runbook, bukan tutorial.** Ditujukan untuk dua pembaca:
1. Mahasiswa KKN yang memasang sistem (bagian 1–7)
2. **Pemegang akses berikutnya**, yang mungkin belum pernah menyentuh server (bagian 8–10)

> ⏳ **Tenggat yang tidak bisa ditawar:** bagian 9 (serah terima) harus selesai **sebelum bulan ke-3 berakhir**, bukan di minggu terakhir. Bagian 10 harus sudah dibaca dan diuji oleh pemegang berikutnya, bukan sekadar dikirimkan.

---

## 1. Spesifikasi & Penyedia

### Spesifikasi minimum

| Komponen | Ukuran | Alasan |
|---|---|---|
| vCPU | 2 | Cukup untuk Node.js + PostgreSQL pada beban puluhan pengunjung/hari |
| RAM | **2 GB + 2 GB swap** | Lihat peringatan di bawah |
| Penyimpanan | 40–50 GB SSD | Sistem + basis data + berkas gambar, longgar untuk 5 tahun |
| Sistem operasi | **Ubuntu 24.04 LTS** | Dukungan keamanan sampai 2029 |
| Lokasi | **Jakarta / Indonesia** | Latensi rendah + memenuhi kemungkinan syarat data dalam negeri |

> 🔴 **`next build` dapat gagal di RAM 2 GB.** Proses build Next.js memakan memori jauh lebih besar daripada saat melayani permintaan. Tanpa swap, build akan dihentikan paksa oleh kernel (OOM killer) dengan pesan yang membingungkan — biasanya hanya `Killed`. **Swap 2 GB wajib dibuat** (langkah 4.2). Alternatifnya sewa RAM 4 GB, tetapi swap jauh lebih murah dan sudah memadai.

### Estimasi harga penyedia Indonesia

| Penyedia | Estimasi/bulan | Catatan |
|---|---:|---|
| IDCloudHost | Rp 100.000 – 180.000 | Data center Jakarta |
| Biznet Gio | Rp 120.000 – 200.000 | Jaringan Biznet |
| Niagahoster VPS | Rp 130.000 – 220.000 | Dukungan bahasa Indonesia |
| DomaiNesia | Rp 100.000 – 175.000 | — |

**Beban mahasiswa (3 bulan): ± Rp 300.000 – 600.000.**
**Beban padukuhan mulai bulan ke-4: ± Rp 1.200.000 – 2.400.000/tahun.**

> Harga estimasi Juli 2026, **wajib diverifikasi saat pembelian**. Pilih penyedia yang menerima **transfer bank / virtual account**, bukan hanya kartu kredit — ini menentukan apakah padukuhan bisa membayar sendiri nanti (lihat bagian 2).

---

## 2. Prasyarat — selesaikan SEBELUM menyewa VPS

Lima hal ini menentukan apakah situs masih hidup di bulan ke-6. Menyewa VPS sebelum kelima-limanya terjawab berarti membeli tenggat, bukan membeli server.

- [ ] **2.1 Nama orang, bukan jabatan.** Siapa yang akan memegang akses SSH setelah KKN? Tulis namanya di sini: `________________`. Orang tersebut sudah menyatakan bersedia.
- [ ] **2.2 Mata anggaran tertulis.** Biaya VPS sudah masuk usulan APBDes tahun berikutnya. **Ini yang paling sering terlewat** — APBDes dikunci tahunan, sehingga tagihan bulan ke-4 tidak punya pos anggaran bila belum diusulkan sekarang.
- [ ] **2.3 Metode pembayaran atas nama desa.** Rekening/virtual account kalurahan, bukan kartu pribadi mahasiswa. Bila tetap memakai kartu mahasiswa, serah terima belum benar-benar terjadi.
- [ ] **2.4 Pengingat perpanjangan.** Dua kontak (Dukuh + 1 perangkat) menerima notifikasi jatuh tempo dari penyedia.
- [ ] **2.5 Alasan teknis terdokumentasi.** Konfirmasi tertulis dari kalurahan mengenai syarat penempatan data di dalam negeri — ini pembenaran resmi atas biaya VPS dalam laporan.

---

## 3. Arsitektur yang Dipasang

```
Internet
   │
   ▼
 nginx  (port 80/443, HTTPS via Let's Encrypt)
   │  reverse proxy
   ▼
 Node.js — Next.js standalone  (port 3000, dikelola systemd)
   │
   ▼
 PostgreSQL 16  (localhost saja, tidak terbuka ke internet)
   │
   ▼
 pg_dump harian → /var/backups + salinan luar server
```

**Perubahan kode yang diperlukan: satu baris** di `next.config.ts` (`output: "standalone"`) — sudah diterapkan dan build-nya sudah diuji berhasil. Skema basis data, Prisma, dan seluruh kode aplikasi **tidak berubah sama sekali** — `src/lib/db.ts` memang sengaja memakai driver PostgreSQL biasa, bukan pustaka khusus Neon.

Hasil build yang sudah terverifikasi:

| | Ukuran |
|---|---:|
| `.next/standalone` (yang dijalankan systemd) | **23 MB** |
| `node_modules` lengkap | 644 MB |

Layanan yang berjalan hanya bergantung pada 23 MB tersebut. `node_modules` tetap diperlukan **saat build** di server, tetapi begitu build selesai, aplikasi yang berjalan tidak lagi bergantung padanya — sehingga nyala ulang layanan tidak bisa gagal gara-gara `node_modules` rusak, dan kelak build dapat dipindah ke luar server tanpa mengubah konfigurasi systemd.

> **Keuntungan tak terduga dari pilihan sebelumnya:** karena memakai Prisma driver adapter (`@prisma/adapter-pg`), tidak ada berkas biner mesin kueri Prisma yang harus ikut disalin ke server. Ini menghilangkan sumber galat deployment yang paling umum pada Prisma di VPS.

---

## 4. Pemasangan Server

Semua perintah dijalankan sebagai `root` kecuali disebut lain. Ganti `<IP-VPS>` dan `<domain>` sesuai milik Anda.

### 4.1 Akses awal & pengguna non-root

```bash
ssh root@<IP-VPS>

adduser majegan
usermod -aG sudo majegan

# Salin kunci SSH agar bisa masuk tanpa sandi
rsync --archive --chown=majegan:majegan ~/.ssh /home/majegan/
```

Matikan login sandi dan login root — dua sumber pembobolan terbesar:

```bash
nano /etc/ssh/sshd_config
#   PermitRootLogin no
#   PasswordAuthentication no
systemctl restart ssh
```

> ⚠️ **Jangan tutup terminal ini** sampai Anda berhasil membuka sesi SSH baru sebagai `majegan`. Bila konfigurasi salah, sesi yang masih terbuka adalah satu-satunya jalan memperbaiki.

### 4.2 Swap — wajib, sebelum apa pun dibangun

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

free -h   # pastikan baris Swap menunjukkan 2 Gi
```

### 4.3 Firewall & pembaruan keamanan otomatis

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

apt update && apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

`unattended-upgrades` memasang tambalan keamanan tanpa campur tangan manusia. **Ini komponen terpenting untuk server yang akan ditinggalkan.**

### 4.4 Node.js 22 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version    # harus v22.x
```

> Pengembangan lokal memakai Node 24, produksi memakai 22 LTS. Kode ini tidak memakai fitur khusus Node 24 saat berjalan. Yang perlu diperhatikan hanya `prisma/seed.ts` yang dijalankan langsung sebagai TypeScript — didukung sejak Node 22.6.

### 4.5 PostgreSQL

```bash
apt install -y postgresql postgresql-contrib

sudo -u postgres psql <<'SQL'
CREATE USER majegan WITH PASSWORD 'GANTI_SANDI_ACAK_PANJANG';
CREATE DATABASE majegan OWNER majegan;
SQL
```

Bangkitkan sandi acak, jangan mengarang sendiri:

```bash
openssl rand -base64 24
```

PostgreSQL bawaan Ubuntu hanya mendengarkan `localhost` — **jangan diubah**. Basis data tidak boleh terjangkau dari internet.

### 4.6 Ambil kode & siapkan environment

```bash
su - majegan
git clone https://github.com/arraf-dev/Padukuhan_Majegan.git ~/app
cd ~/app
npm ci
```

Buat `~/app/.env.production`:

```ini
DATABASE_URL="postgresql://majegan:SANDI_DARI_4.5@localhost:5432/majegan"
RAHASIA_SESI="hasil dari: openssl rand -base64 32"
NEXT_PUBLIC_URL="https://<domain>"
SUPERADMIN_EMAIL="dukuh@pandowoharjo.desa.id"
SUPERADMIN_SANDI="sandi awal, wajib diganti setelah login pertama"
```

```bash
chmod 600 ~/app/.env.production
```

> `RAHASIA_SESI` produksi **harus berbeda** dari yang dipakai di laptop. Rahasia yang sama berarti cookie sesi dari komputer pengembang berlaku sah di situs produksi.

### 4.7 Build & isi basis data

```bash
cd ~/app
set -a && source .env.production && set +a

npx prisma migrate deploy
npx prisma db seed          # hanya sekali, saat pertama kali
npm run build
```

### 4.8 systemd — agar hidup kembali sendiri

Ini yang membuat situs pulih otomatis setelah server dinyalakan ulang atau aplikasi berhenti mendadak. **Tanpa ini, setiap gangguan kecil berujung situs mati sampai ada manusia yang menyadarinya.**

`/etc/systemd/system/majegan.service`:

```ini
[Unit]
Description=Website Padukuhan Majegan
After=network.target postgresql.service

[Service]
Type=simple
User=majegan
WorkingDirectory=/home/majegan/app
EnvironmentFile=/home/majegan/app/.env.production
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now majegan
systemctl status majegan     # harus active (running)
```

### 4.9 nginx & HTTPS

```bash
apt install -y nginx certbot python3-certbot-nginx
```

`/etc/nginx/sites-available/majegan`:

```nginx
server {
    listen 80;
    server_name <domain>;

    client_max_body_size 10M;   # unggahan foto berita

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/majegan /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

certbot --nginx -d <domain>
systemctl list-timers | grep certbot    # pastikan timer perpanjangan aktif
```

> `X-Forwarded-Proto` **wajib ada.** Tanpa header itu aplikasi mengira koneksinya HTTP biasa, sehingga cookie sesi ber-flag `secure` (`src/lib/sesi.ts:23`) tidak pernah terkirim — gejalanya: login seolah berhasil tetapi selalu kembali ke halaman masuk.

---

## 5. Skrip Deploy

Simpan sebagai `~/app/deploy.sh`, lalu `chmod +x deploy.sh`:

```bash
#!/usr/bin/env bash
# Pasang versi terbaru. Jalankan dari ~/app sebagai pengguna majegan.
set -euo pipefail

cd ~/app
git pull origin main
npm ci
set -a && source .env.production && set +a
npx prisma migrate deploy
npm run build
sudo systemctl restart majegan

sleep 5
curl -fsS -o /dev/null http://127.0.0.1:3000/ && echo "OK — situs merespons" || {
  echo "GAGAL — kembalikan ke versi sebelumnya: git reset --hard HEAD~1 && ./deploy.sh"
  exit 1
}
```

Sejak sekarang, memperbarui situs cukup: `ssh majegan@<IP-VPS>` lalu `cd app && ./deploy.sh`.

---

## 6. Backup — dan pengujian pemulihannya

**Backup yang belum pernah diuji pulih bukan backup.** Ini penyebab kehilangan data yang paling umum: berkas cadangan ada, terjadwal rapi, tetapi ternyata kosong atau rusak — dan baru ketahuan saat dibutuhkan.

### 6.1 Cadangan harian otomatis

`/home/majegan/backup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

TUJUAN=/home/majegan/backups
mkdir -p "$TUJUAN"
BERKAS="$TUJUAN/majegan-$(date +%F).sql.gz"

set -a && source /home/majegan/app/.env.production && set +a
pg_dump "$DATABASE_URL" | gzip > "$BERKAS"

# Tolak berkas mencurigakan kecil — pg_dump bisa "berhasil" tapi kosong
UKURAN=$(stat -c%s "$BERKAS")
if [ "$UKURAN" -lt 10000 ]; then
  echo "PERINGATAN: cadangan hanya $UKURAN byte — periksa segera!" >&2
  exit 1
fi

find "$TUJUAN" -name 'majegan-*.sql.gz' -mtime +30 -delete
echo "Cadangan selesai: $BERKAS ($UKURAN byte)"
```

```bash
chmod +x /home/majegan/backup.sh
crontab -e
# tambahkan:
0 2 * * * /home/majegan/backup.sh >> /home/majegan/backup.log 2>&1
```

### 6.2 Salinan ke luar server — jangan dilewati

Cadangan yang hanya berada di VPS yang sama akan ikut lenyap bila VPS-nya bermasalah. Pilih salah satu:

- **Paling sederhana:** unduh berkas cadangan ke komputer kalurahan sebulan sekali, catat dalam agenda
- **Otomatis:** `rclone` ke Google Drive resmi desa
- **Snapshot penyedia:** aktifkan bila tersedia (± Rp 20.000–50.000/bulan) — melindungi seluruh server, bukan hanya basis data

### 6.3 Uji pemulihan — lakukan sekali di bulan pertama, dengan disaksikan

```bash
sudo -u postgres createdb ujicoba
gunzip -c ~/backups/majegan-<tanggal>.sql.gz | sudo -u postgres psql ujicoba
sudo -u postgres psql ujicoba -c "SELECT count(*) FROM berita;"
sudo -u postgres dropdb ujicoba
```

Bila jumlah baris yang muncul masuk akal, cadangan terbukti sahih. **Lakukan ini bersama pemegang akses berikutnya**, agar mereka pernah mengerjakannya sendiri, bukan sekadar membaca.

---

## 7. Pemantauan

- [ ] **UptimeRobot** (gratis) — pantau `https://<domain>` tiap 5 menit. **Kirim notifikasi ke minimal 2 orang, salah satunya bukan mahasiswa KKN.**
- [ ] Notifikasi jatuh tempo VPS dan domain aktif ke kedua kontak tersebut
- [ ] Periksa ruang disk sebulan sekali: `df -h` — bila mencapai 80%, hapus cadangan lama

---

## 8. Kalender Pemeliharaan

Serahkan tabel ini kepada pemegang akses berikutnya.

| Kapan | Yang dikerjakan | Perintah |
|---|---|---|
| Setiap hari | *(otomatis)* cadangan basis data | — |
| Setiap hari | *(otomatis)* tambalan keamanan | — |
| Bulanan | Periksa situs hidup & ruang disk | `df -h` |
| Bulanan | Pastikan cadangan kemarin ada dan wajar ukurannya | `ls -lh ~/backups \| tail -3` |
| 3 bulan sekali | Uji pemulihan cadangan (bagian 6.3) | — |
| 3 bulan sekali | Nyalakan ulang server terjadwal | `sudo reboot` |
| Tahunan | Perpanjang domain | — |
| Bulanan/tahunan | **Bayar tagihan VPS** | — |

---

## 9. Serah Terima — selesaikan sebelum bulan ke-3 berakhir

- [ ] **9.1** Akun VPS dipindah ke email resmi desa, atau dibuat ulang atas nama desa sejak awal
- [ ] **9.2** Metode pembayaran diganti ke rekening desa — **kartu mahasiswa dilepas**
- [ ] **9.3** Kunci SSH pemegang berikutnya sudah dipasang dan **sudah pernah dipakai masuk sendiri**
- [ ] **9.4** Kunci SSH mahasiswa KKN dihapus dari server *(setelah 9.3 terbukti berhasil)*
- [ ] **9.5** Seluruh kredensial diserahkan tertulis: akses VPS, sandi basis data, `RAHASIA_SESI`, akun domain, akun UptimeRobot
- [ ] **9.6** Pemegang berikutnya **telah mempraktikkan sendiri**: masuk SSH, membaca log, menyalakan ulang layanan, memulihkan cadangan
- [ ] **9.7** Dokumen ini dicetak dan diserahkan dalam bentuk fisik — tidak semua orang bisa membuka GitHub saat situs sedang bermasalah
- [ ] **9.8** Nomor kontak darurat: siapa yang dihubungi bila pemegang akses tidak bisa mengatasi? `________________`

> **Butir 9.6 adalah inti serah terima.** Menyerahkan kata sandi bukan serah terima. Serah terima terjadi ketika orang tersebut sudah pernah memperbaiki sesuatu dengan tangannya sendiri.

---

## 10. Bila Terjadi Masalah

Bagian ini ditujukan bagi pemegang akses, termasuk yang belum berpengalaman. Kerjakan berurutan dan berhenti begitu situs pulih.

### Situs tidak bisa dibuka sama sekali

```bash
ssh majegan@<IP-VPS>
sudo systemctl status majegan      # aplikasi jalan?
sudo systemctl restart majegan     # nyalakan ulang aplikasi
sudo systemctl status nginx
sudo systemctl restart nginx
```

Bila SSH pun tidak bisa masuk: buka panel penyedia VPS, periksa apakah server menyala, gunakan fitur *console* dari panel tersebut. **Bila server dimatikan karena tagihan belum dibayar, tidak ada perintah yang bisa memperbaikinya — lunasi tagihannya.**

### Situs terbuka tetapi menampilkan pesan galat

```bash
sudo journalctl -u majegan -n 50 --no-pager     # 50 baris log terakhir
sudo systemctl status postgresql                 # basis data jalan?
```

Kata `Authentication failed` pada log berarti masalah sambungan basis data — periksa `DATABASE_URL` di `~/app/.env.production`.

### Peringatan "koneksi tidak aman" / sertifikat kedaluwarsa

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Login panel admin selalu kembali ke halaman masuk

Hampir selalu berarti header `X-Forwarded-Proto` hilang dari konfigurasi nginx (bagian 4.9), sehingga cookie sesi ditolak.

### Disk penuh

```bash
df -h
du -sh ~/backups
find ~/backups -name '*.sql.gz' -mtime +14 -delete
```

### Situs lambat atau sering mati sendiri

```bash
free -h        # swap habis?
top            # proses apa yang memakan sumber daya?
sudo reboot
```

### Data hilang atau terhapus

**Jangan panik dan jangan menulis apa pun ke basis data.** Pulihkan dari cadangan (bagian 6.3), gunakan berkas tertanggal sebelum kejadian.

---

## 11. Jalan Keluar Bila VPS Tidak Lagi Terbiayai

Skenario ini nyata dan tidak memalukan — tuliskan sekarang selagi masih ada yang paham, jangan menunggu saat genting.

Aplikasi ini netral terhadap penyedia. Bila suatu saat VPS tidak dapat dilanjutkan, situs **tidak harus mati**:

1. Ambil cadangan terakhir: `~/backups/majegan-<tanggal>.sql.gz`
2. Buat basis data gratis di [neon.tech](https://neon.tech), pulihkan cadangan ke sana
3. Deploy ke Vercel (gratis) — lihat bagian **B** pada `TASKS.md`
4. Arahkan domain ke Vercel
5. Biaya berjalan kembali menjadi **Rp 0/tahun**

Seluruh proses memakan waktu sekitar satu jam dan **tidak memerlukan perubahan kode satu baris pun**. Kemampuan pindah ini bukan kebetulan — sejak awal `src/lib/db.ts` sengaja memakai PostgreSQL standar tanpa pustaka khusus penyedia mana pun.
