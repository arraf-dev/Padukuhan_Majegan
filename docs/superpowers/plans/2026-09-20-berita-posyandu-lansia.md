# Berita Posyandu Lansia dan Pembersihan Konten Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menayangkan satu berita nyata Posyandu Lansia Padukuhan Majegan memakai dua foto yang diberikan pengguna, sambil menghapus artikel berita demo dari kode sumber dan basis data secara aman.

**Architecture:** Berita tetap dibaca dari Prisma melalui `src/lib/berita.ts`. Model baru `FotoBerita` menyimpan banyak foto dokumentasi dengan teks alternatif dan caption per foto; halaman detail merendernya sebagai dokumentasi lengkap. Script data yang dijalankan satu kali hanya menghapus slug demo yang diketahui, lalu membuat artikel Posyandu Lansia secara idempoten; script seed berhenti menulis fixture berita demo agar data tersebut tidak kembali.

**Tech Stack:** Next.js App Router, React, TypeScript, Prisma 7 + PostgreSQL, `next/image`, Tailwind CSS, Playwright.

**Spec:** User request dated 20 September 2026: kedua gambar lampiran dimasukkan ke fitur Berita sebagai dokumentasi Posyandu Lansia, seluruh data dummy Berita dihapus, dan keterangannya membahas Posyandu untuk lansia. Rencana ini melengkapi [rencana gambar Potensi](2026-09-20-potensi-gambar-utuh.md); Task 1 pada rencana tersebut harus lebih dahulu menyediakan prop `Foto.mode`.

## Global Constraints

- Gunakan dua foto persis dari lampiran pengguna; jangan membuat atau mengganti foto dengan visual AI.
- Artikel harus dikategorikan sebagai `Kegiatan`, berjudul **Posyandu Lansia Padukuhan Majegan**, dan ditayangkan saat script dijalankan.
- Tulisan artikel tidak boleh mengarang jadwal, diagnosis, obat, nama petugas, atau lokasi pemeriksaan yang tidak diberikan pengguna.
- Hanya hapus 12 slug fixture yang tercantum di `SLUG_BERITA_DEMO`; jangan memakai `db.berita.deleteMany({})` dan jangan menghapus berita yang dibuat warga/admin.
- `prisma/seed.ts` tidak boleh lagi mengimpor atau menulis array artikel demo.
- `src/components/potongan.tsx` mempunyai perubahan lokal pengguna yang belum dikomit; telaah diff terkini dan pertahankan setiap perubahan di luar mode gambar.
- Penghapusan data produksi hanya boleh dilakukan setelah migrasi database berhasil dan perintah guard eksplisit dijalankan.

## Review Focus

- Kedua foto Posyandu tampil utuh di detail artikel, dengan teks alternatif dan caption yang berbeda serta relevan.
- Kartu berita tetap memakai satu cover dan rasio visual lama; galeri dokumentasi hanya muncul bila artikel mempunyai foto tambahan.
- Penghapus hanya mengenai 12 slug demo yang diketahui; berita lain dan kategori yang dipakai tetap ada.
- Menjalankan script pembersihan kedua kali tidak menghapus atau menimpa suntingan artikel Posyandu yang sudah ada.
- Halaman Beranda, daftar Berita, detail Berita, sitemap, dan E2E pembuatan berita tetap bekerja saat tidak ada fixture demo.

---

### Task 1: Tambahkan penyimpanan dan pembacaan foto dokumentasi artikel

**Files:**

- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260920000000_add_berita_foto/migration.sql`
- Modify: `src/content/majegan.ts`
- Modify: `src/lib/berita.ts`
- Modify: `src/app/(publik)/berita/[slug]/page.tsx`
- Create: `e2e/07-berita-posyandu-lansia.spec.ts`

**Interfaces:**

- Produces `FotoBerita` Prisma model: `{ id: string; beritaId: string; url: string; alt: string; caption: string | null; urutan: number }`.
- Produces `FotoDokumentasiBerita` TypeScript type: `{ url: string; alt: string; caption: string }`.
- Extends `Berita` with `fotoDokumentasi: FotoDokumentasiBerita[]`.

- [ ] **Step 1: Tulis pengujian E2E yang gagal untuk berita Posyandu.**

  Tambahkan `e2e/07-berita-posyandu-lansia.spec.ts` dengan pengujian yang membuka `/berita/posyandu-lansia-padukuhan-majegan` dan mengharapkan judul, kategori, dua gambar dokumentasi, serta dua caption berikut:

  ```ts
  const judul = "Posyandu Lansia Padukuhan Majegan";
  const altPemeriksaan =
    "Kader Posyandu Lansia mendampingi pemeriksaan kesehatan warga lanjut usia di Padukuhan Majegan.";
  const altPendampingan =
    "Pendampingan pemeriksaan kesehatan dasar bagi warga lanjut usia dalam Posyandu Lansia Padukuhan Majegan.";

  await page.goto("/berita/posyandu-lansia-padukuhan-majegan");
  await expect(page.getByRole("heading", { name: judul })).toBeVisible();
  await expect(page.getByText("KEGIATAN", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: altPemeriksaan })).toBeVisible();
  await expect(page.getByRole("img", { name: altPendampingan })).toBeVisible();
  await expect(page.getByText("Pemeriksaan kesehatan dasar untuk warga lanjut usia.")).toBeVisible();
  await expect(page.getByText("Pendampingan kader selama kegiatan Posyandu Lansia.")).toBeVisible();
  ```

- [ ] **Step 2: Jalankan pengujian baru untuk memastikan ia gagal.**

  Run: `npm run test:e2e -- --project=desktop e2e/07-berita-posyandu-lansia.spec.ts`

  Expected: gagal karena artikel, relasi `FotoBerita`, dan galeri dokumentasi belum tersedia.

- [ ] **Step 3: Tambahkan relasi `FotoBerita` pada skema dan buat migrasi.**

  Di `prisma/schema.prisma`, tambahkan relasi pada `Berita` dan model berikut:

  ```prisma
  model Berita {
    // kolom yang ada tetap dipertahankan
    fotoDokumentasi FotoBerita[]
  }

  model FotoBerita {
    id        String   @id @default(cuid())
    beritaId  String   @map("berita_id")
    url       String
    alt       String
    caption   String?
    urutan    Int      @default(0)
    dibuatPada DateTime @default(now()) @map("created_at")
    berita    Berita   @relation(fields: [beritaId], references: [id], onDelete: Cascade)

    @@unique([beritaId, urutan])
    @@index([beritaId, urutan])
    @@map("berita_foto")
  }
  ```

  Buat `prisma/migrations/20260920000000_add_berita_foto/migration.sql` dengan SQL berikut:

  ```sql
  CREATE TABLE "berita_foto" (
      "id" TEXT NOT NULL,
      "berita_id" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "alt" TEXT NOT NULL,
      "caption" TEXT,
      "urutan" INTEGER NOT NULL DEFAULT 0,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "berita_foto_pkey" PRIMARY KEY ("id")
  );

  CREATE UNIQUE INDEX "berita_foto_berita_id_urutan_key" ON "berita_foto"("berita_id", "urutan");
  CREATE INDEX "berita_foto_berita_id_urutan_idx" ON "berita_foto"("berita_id", "urutan");
  ALTER TABLE "berita_foto"
    ADD CONSTRAINT "berita_foto_berita_id_fkey"
    FOREIGN KEY ("berita_id") REFERENCES "berita"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ```

  Jalankan `npx prisma migrate dev` untuk menerapkan migration yang sudah ada ke basis data pengembangan, lalu `npx prisma generate` untuk memperbarui klien Prisma.

- [ ] **Step 4: Map foto dokumentasi dari Prisma ke tipe tampilan.**

  Di `src/content/majegan.ts`, deklarasikan dan ekspor:

  ```ts
  export type FotoDokumentasiBerita = { url: string; alt: string; caption: string };
  ```

  Tambahkan `fotoDokumentasi: FotoDokumentasiBerita[]` sebagai properti wajib pada `Berita`. Di `src/lib/berita.ts`, tambahkan relasi berikut pada `pilih`:

  ```ts
  fotoDokumentasi: {
    select: { url: true, alt: true, caption: true },
    orderBy: { urutan: "asc" },
  },
  ```

  Lalu pada `keBerita`, map menjadi:

  ```ts
  fotoDokumentasi: b.fotoDokumentasi.map((foto) => ({
    url: foto.url,
    alt: foto.alt,
    caption: foto.caption ?? "",
  })),
  ```

- [ ] **Step 5: Render galeri dokumentasi yang hanya muncul bila ada foto.**

  Di `src/app/(publik)/berita/[slug]/page.tsx`, setelah paragraf isi artikel, tampilkan `<section aria-labelledby="dokumentasi-berita">` hanya saat `b.fotoDokumentasi.length > 0`. Susun foto dengan `grid gap-3 sm:grid-cols-2`; tiap foto dibungkus `<figure>` dan memakai:

  ```tsx
  <Foto
    src={foto.url}
    keterangan={foto.alt}
    mode="contain"
    sizes="(min-width: 640px) 380px, 100vw"
    className="aspect-[3/4] rounded-xl border border-garis bg-foto"
  />
  {foto.caption && <figcaption className="mt-2 text-sm leading-relaxed text-redup">{foto.caption}</figcaption>}
  ```

  `mode="contain"` bergantung pada Task 1 di rencana Potensi; bila task itu belum diterapkan, selesaikan terlebih dahulu. Jangan ubah mode cover pada kartu Berita maupun gambar sampul artikel.

- [ ] **Step 6: Jalankan kembali pengujian.**

  Run: `npm run test:e2e -- --project=desktop e2e/07-berita-posyandu-lansia.spec.ts`

  Expected: masih gagal hanya karena artikel dan dua sumber gambar belum dimasukkan; kode halaman sudah mampu merender foto dokumentasi saat datanya tersedia.

- [ ] **Step 7: Commit perubahan skema dan tampilan.**

  Run: `git add prisma/schema.prisma prisma/migrations src/content/majegan.ts src/lib/berita.ts "src/app/(publik)/berita/[slug]/page.tsx" e2e/07-berita-posyandu-lansia.spec.ts`

  Run: `git commit -m "feat: dukung foto dokumentasi berita"`

### Task 2: Simpan kedua foto dan definisikan konten Posyandu Lansia yang faktual

**Files:**

- Create: `public/gambar/berita/posyandu-lansia-pemeriksaan.png`
- Create: `public/gambar/berita/posyandu-lansia-pendampingan.png`
- Create: `src/content/berita-posyandu-lansia.ts`
- Create: `src/content/berita-posyandu-lansia.test.ts`

**Interfaces:**

- Produces `SLUG_BERITA_POSYANDU_LANSIA = "posyandu-lansia-padukuhan-majegan"`.
- Produces `BERITA_POSYANDU_LANSIA` containing title, category, location, ringkasan, konten, cover, and two `FotoDokumentasiBerita` rows.

- [ ] **Step 1: Tulis pengujian unit yang gagal untuk naskah dan foto Posyandu.**

  Di `src/content/berita-posyandu-lansia.test.ts`, pastikan metadata tidak kosong, kategori benar, dua foto dipakai, dan tidak ada klaim jadwal/medis yang tidak didukung:

  ```ts
  import assert from "node:assert/strict";
  import test from "node:test";
  import { BERITA_POSYANDU_LANSIA, SLUG_BERITA_POSYANDU_LANSIA } from "./berita-posyandu-lansia.ts";

  test("konten Posyandu Lansia memakai dua foto dan keterangan yang relevan", () => {
    assert.equal(SLUG_BERITA_POSYANDU_LANSIA, "posyandu-lansia-padukuhan-majegan");
    assert.equal(BERITA_POSYANDU_LANSIA.kategori, "Kegiatan");
    assert.equal(BERITA_POSYANDU_LANSIA.fotoDokumentasi.length, 2);
    assert.match(BERITA_POSYANDU_LANSIA.ringkasan, /lanjut usia/i);
    assert.doesNotMatch(BERITA_POSYANDU_LANSIA.konten, /pukul|tanggal|obat|diagnosis/i);
  });
  ```

- [ ] **Step 2: Jalankan pengujian unit untuk memastikan ia gagal.**

  Run: `node --test src/content/berita-posyandu-lansia.test.ts`

  Expected: gagal karena modul konten belum ada.

- [ ] **Step 3: Salin kedua lampiran pengguna dengan nama aset yang stabil.**

  Gunakan file sumber berikut tanpa mengubah isi visualnya:

  ```powershell
  Copy-Item -LiteralPath 'C:\Users\ACERNI~1\AppData\Local\Temp\codex-clipboard-9462b3fd-f1f7-4964-bcf0-e2f2aec27c00.png' -Destination 'public\gambar\berita\posyandu-lansia-pemeriksaan.png'
  Copy-Item -LiteralPath 'C:\Users\ACERNI~1\AppData\Local\Temp\codex-clipboard-b24f65ea-eb35-4e88-ae07-90c9a8521237.png' -Destination 'public\gambar\berita\posyandu-lansia-pendampingan.png'
  ```

  Jika file temporary sudah tidak tersedia saat eksekusi, hentikan task dan minta pengguna melampirkan ulang kedua foto; jangan menggantinya dengan gambar lain.

- [ ] **Step 4: Tambahkan sumber konten berita nyata.**

  Buat `src/content/berita-posyandu-lansia.ts` dengan nilai persis berikut:

  ```ts
  import type { FotoDokumentasiBerita, KategoriBerita } from "./majegan.ts";

  export const SLUG_BERITA_POSYANDU_LANSIA = "posyandu-lansia-padukuhan-majegan";

  export const BERITA_POSYANDU_LANSIA = {
    judul: "Posyandu Lansia Padukuhan Majegan",
    slug: SLUG_BERITA_POSYANDU_LANSIA,
    kategori: "Kegiatan" satisfies KategoriBerita,
    lokasi: "Padukuhan Majegan",
    ringkasan:
      "Kader Posyandu Lansia Padukuhan Majegan mendampingi pemeriksaan kesehatan dasar bagi warga lanjut usia agar kondisi kesehatan mereka dapat dipantau secara berkala.",
    konten:
      "Posyandu Lansia Padukuhan Majegan menjadi ruang pendampingan kesehatan bagi warga lanjut usia. Kader mendampingi peserta selama pemeriksaan kesehatan dasar dan mencatat hasilnya untuk pemantauan berkala.\n\nMelalui kegiatan ini, warga lansia mendapat perhatian kesehatan lebih dekat di lingkungan tempat tinggalnya. Keluarga diharapkan tetap mendampingi lansia dan menghubungi kader apabila membutuhkan informasi kegiatan berikutnya.",
    gambarSampul: "/gambar/berita/posyandu-lansia-pemeriksaan.png",
    fotoDokumentasi: [
      {
        url: "/gambar/berita/posyandu-lansia-pemeriksaan.png",
        alt: "Kader Posyandu Lansia mendampingi pemeriksaan kesehatan warga lanjut usia di Padukuhan Majegan.",
        caption: "Pemeriksaan kesehatan dasar untuk warga lanjut usia.",
      },
      {
        url: "/gambar/berita/posyandu-lansia-pendampingan.png",
        alt: "Pendampingan pemeriksaan kesehatan dasar bagi warga lanjut usia dalam Posyandu Lansia Padukuhan Majegan.",
        caption: "Pendampingan kader selama kegiatan Posyandu Lansia.",
      },
    ] satisfies FotoDokumentasiBerita[],
  } as const;
  ```

- [ ] **Step 5: Jalankan pengujian konten hingga lulus.**

  Run: `node --test src/content/berita-posyandu-lansia.test.ts`

  Expected: PASS; artikel berisi dua foto, kategori `Kegiatan`, dan narasi khusus Posyandu Lansia tanpa detail yang tidak dikonfirmasi.

- [ ] **Step 6: Commit aset dan konten.**

  Run: `git add public/gambar/berita src/content/berita-posyandu-lansia.ts src/content/berita-posyandu-lansia.test.ts`

  Run: `git commit -m "feat: tambah konten posyandu lansia"`

### Task 3: Hentikan seed demo dan lakukan penghapusan data secara terbatasi

**Files:**

- Modify: `prisma/seed.ts`
- Modify: `src/content/majegan.ts`
- Create: `scripts/bersihkan-berita-demo.ts`
- Modify: `package.json`
- Modify: `e2e/07-berita-posyandu-lansia.spec.ts`

**Interfaces:**

- Produces `SLUG_BERITA_DEMO: readonly string[]` berisi persis 12 slug fixture lama.
- Produces command `npm run data:berita-posyandu`, yang hanya berjalan saat `KONFIRMASI_HAPUS_BERITA_DEMO=hapus-berita-demo`.

- [ ] **Step 1: Tulis assertion E2E yang gagal untuk pembersihan data demo.**

  Dalam `e2e/07-berita-posyandu-lansia.spec.ts`, setelah login dengan `paksaMasuk`, buka `/admin/berita` dan pastikan contoh judul yang dulunya dipublikasikan tidak ada:

  ```ts
  for (const judulDemo of [
    "Merti Dusun Majegan 2026",
    "Kerja Bakti Bersih Kali",
    "Jadwal Posyandu Agustus",
    "Pengecoran Jalan Tahap II",
    "Panen Raya Kelompok Wanita Tani",
    "Jadwal Ronda Malam Bulan Agustus",
    "Perbaikan Saluran Irigasi Blok Timur Rampung",
    "Pendataan Ulang Penerima BLT-DD Tahap III",
    "Pelatihan Olahan Pangan untuk Pelaku UMKM",
    "Penambahan Lampu Jalan di RT 05 dan RT 06",
    "Persiapan Lomba Agustusan Padukuhan",
    "Rencana Pembangunan Pos Kamling RT 07",
  ]) {
    await expect(page.getByText(judulDemo, { exact: true })).toHaveCount(0);
  }
  ```

- [ ] **Step 2: Jalankan pengujian untuk memastikan fixture lama masih terdeteksi.**

  Run: `npm run test:e2e -- --project=desktop e2e/07-berita-posyandu-lansia.spec.ts`

  Expected: gagal pada deployment/database yang masih mempunyai artikel demo.

- [ ] **Step 3: Hapus sumber fixture berita, tetapi pertahankan tipe yang dipakai aplikasi.**

  Di `src/content/majegan.ts`, hapus export `berita` beserta semua 12 objek artikel demo. Pertahankan `kategoriBerita`, `KategoriBerita`, dan tipe `Berita` yang diperlukan `src/lib/berita.ts`; tambahkan properti wajib `fotoDokumentasi: FotoDokumentasiBerita[]` pada tipe tersebut. Di `prisma/seed.ts`, hapus import `berita` dan seluruh loop `for (const b of berita)` agar `npx prisma db seed` tidak pernah membuat ulang konten demo.

- [ ] **Step 4: Buat script pembersihan dengan allowlist dan guard.**

  Buat `scripts/bersihkan-berita-demo.ts`. Script harus memuat `.env.local`, menolak jalan tanpa guard, menghapus hanya slug allowlist, lalu membuat artikel Posyandu bila belum ada. Inti implementasi:

  ```ts
  import { loadEnvFile } from "node:process";
  import { BERITA_POSYANDU_LANSIA } from "../src/content/berita-posyandu-lansia.ts";

  const SLUG_BERITA_DEMO = [
    "merti-dusun-majegan-2026", "kerja-bakti-bersih-kali", "jadwal-posyandu-agustus",
    "pengecoran-jalan-tahap-ii", "panen-raya-kwt-majegan", "jadwal-ronda-agustus-2026",
    "perbaikan-saluran-irigasi-blok-timur", "pendataan-blt-dd-tahap-tiga",
    "pelatihan-olahan-pangan-umkm", "penambahan-lampu-jalan-rt-05",
    "persiapan-lomba-agustusan-2026", "rencana-pembangunan-pos-kamling-baru",
  ] as const;

  if (process.env.KONFIRMASI_HAPUS_BERITA_DEMO !== "hapus-berita-demo") {
    throw new Error("Set KONFIRMASI_HAPUS_BERITA_DEMO=hapus-berita-demo untuk menjalankan pembersihan.");
  }

  try { loadEnvFile(".env.local"); } catch {}
  const { db } = await import("../src/lib/db.ts");
  await db.$transaction(async (tx) => {
    const kategori = await tx.kategoriBerita.upsert({
      where: { slug: "kegiatan" }, update: { nama: "Kegiatan" }, create: { nama: "Kegiatan", slug: "kegiatan" },
    });
    const penulis = await tx.pengguna.findFirst({ where: { peran: "superadmin", aktif: true }, select: { id: true } });
    await tx.berita.deleteMany({ where: { slug: { in: [...SLUG_BERITA_DEMO] } } });
    const posyandu = await tx.berita.upsert({
      where: { slug: BERITA_POSYANDU_LANSIA.slug },
      update: {},
      create: {
        judul: BERITA_POSYANDU_LANSIA.judul,
        slug: BERITA_POSYANDU_LANSIA.slug,
        ringkasan: BERITA_POSYANDU_LANSIA.ringkasan,
        konten: BERITA_POSYANDU_LANSIA.konten,
        lokasi: BERITA_POSYANDU_LANSIA.lokasi,
        gambarSampul: BERITA_POSYANDU_LANSIA.gambarSampul,
        status: "terbit",
        terbitPada: new Date(),
        kategoriId: kategori.id,
        penulisId: penulis?.id ?? null,
      },
      select: { id: true },
    });
    await tx.fotoBerita.createMany({
      data: BERITA_POSYANDU_LANSIA.fotoDokumentasi.map((foto, urutan) => ({ ...foto, beritaId: posyandu.id, urutan })),
      skipDuplicates: true,
    });
  });
  ```

  Bungkus eksekusi dengan `try/catch/finally` dan `await db.$disconnect()` agar koneksi selalu tertutup. Karena `update: {}` dan unique key `[beritaId, urutan]`, menjalankan script lagi hanya menghapus slug demo yang sama dan tidak menimpa artikel Posyandu yang sudah diedit melalui admin.

- [ ] **Step 5: Daftarkan perintah data yang aman.**

  Di `package.json`, tambahkan script berikut:

  ```json
  "data:berita-posyandu": "node scripts/bersihkan-berita-demo.ts"
  ```

  Jalankan di lingkungan target hanya setelah migration berhasil:

  ```powershell
  $env:KONFIRMASI_HAPUS_BERITA_DEMO = 'hapus-berita-demo'
  npm run data:berita-posyandu
  Remove-Item Env:KONFIRMASI_HAPUS_BERITA_DEMO
  ```

  Expected output: jumlah artikel demo yang dihapus dan slug Posyandu yang dipastikan ada. Jangan mencetak `DATABASE_URL`, token R2, atau kredensial pengguna.

- [ ] **Step 6: Jalankan E2E hingga lulus dan periksa seed.**

  Run: `npm run test:e2e -- --project=desktop e2e/07-berita-posyandu-lansia.spec.ts`

  Run: `rg -n "merti-dusun-majegan-2026|jadwal-posyandu-agustus|for \(const b of berita\)" prisma/seed.ts src/content/majegan.ts`

  Expected: E2E lulus; pencarian tidak menghasilkan array atau loop fixture lama.

- [ ] **Step 7: Commit pembersihan dan script data.**

  Run: `git add prisma/seed.ts src/content/majegan.ts scripts/bersihkan-berita-demo.ts package.json e2e/07-berita-posyandu-lansia.spec.ts`

  Run: `git commit -m "feat: ganti berita demo dengan posyandu lansia"`

### Task 4: Verifikasi migrasi, responsif, dan regresi aplikasi

**Files:**

- Verify: `prisma/schema.prisma`
- Verify: `prisma/migrations/20260920000000_add_berita_foto/migration.sql`
- Verify: `src/lib/berita.ts`
- Verify: `src/app/(publik)/berita/[slug]/page.tsx`
- Verify: `scripts/bersihkan-berita-demo.ts`

- [ ] **Step 1: Jalankan pemeriksaan unit dan statis.**

  Run: `npm test`

  Run: `node --test src/content/berita-posyandu-lansia.test.ts`

  Run: `npm run lint`

  Run: `npm run typecheck`

  Expected: seluruh pemeriksaan lulus; hasil Prisma mengenali relasi `fotoDokumentasi` dan tipe `Berita` lengkap.

- [ ] **Step 2: Jalankan build dengan URL produksi eksplisit.**

  Run: `$env:NEXT_PUBLIC_URL='https://www.majegan-pandowoharjo.id'; npm run build`

  Expected: build berhasil dan generate static params/detail berita mengambil berita dari database tanpa array demo.

- [ ] **Step 3: Periksa manual pada browser.**

  Buka `/berita`, `/berita/posyandu-lansia-padukuhan-majegan`, dan `/sitemap.xml` pada lebar 320 px serta 1440 px. Pastikan kartu hanya memakai cover, detail menampilkan dua foto utuh tanpa overflow horizontal, caption dapat dibaca, judul demo tidak muncul di daftar/admin, dan URL Posyandu tampil di sitemap.

- [ ] **Step 4: Tinjau diff dan target destruktif sebelum push.**

  Run: `git diff --check`

  Run: `git diff -- prisma/schema.prisma prisma/migrations prisma/seed.ts src/content/majegan.ts src/lib/berita.ts "src/app/(publik)/berita/[slug]/page.tsx" scripts/bersihkan-berita-demo.ts package.json`

  Expected: pembersihan dibatasi oleh allowlist 12 slug, tidak ada `deleteMany({})` pada tabel berita, dan kedua aset yang diberikan pengguna ada di `public/gambar/berita/`.

- [ ] **Step 5: Commit verifikasi yang diperlukan.**

  Run: `git add e2e/07-berita-posyandu-lansia.spec.ts`

  Run: `git commit -m "test: verifikasi berita posyandu dan pembersihan demo"`
