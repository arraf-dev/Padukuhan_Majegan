# Potensi Gambar Utuh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menampilkan keseluruhan gambar sumber pada visual utama tiap kategori di halaman `/potensi`, tanpa memotong infografis atau foto yang diunggah admin dan tanpa mengubah perilaku foto pada fitur lain.

**Architecture:** `Foto` tetap menjadi satu komponen gambar bersama, tetapi mendapat opsi rasio-tampil yang aman dan bersifat opt-in. Nilai bawaan tetap mempertahankan `object-cover` agar berita, galeri, dan kartu lain tidak berubah. Hanya visual utama pada `PotensiSection` yang memilih `object-contain`, menggunakan latar netral dan bingkai responsif supaya gambar asli terlihat penuh pada desktop maupun mobile.

**Tech Stack:** Next.js App Router, React, TypeScript, `next/image`, Tailwind CSS, Playwright.

**Spec:**

- Gambar utama untuk kategori Pariwisata, UMKM, dan Budaya pada `/potensi` harus terlihat utuh; tidak ada bagian tepi gambar sumber yang dipotong.
- Area gambar tetap rapi pada lebar 320 px, tablet, dan desktop. Ruang sisa dari perbedaan rasio gambar memakai latar `bg-foto`, bukan pembesaran atau pemotongan gambar.
- Foto pada galeri, berita, dokumentasi, dan kartu potensi tetap memakai perilaku saat ini (`object-cover`).
- URL gambar, skema basis data, unggahan admin, teks alternatif, lazy-loading, dan optimasi ukuran `next/image` tidak diubah.

## Global Constraints

- Jangan mengganti gambar sumber atau mengubah data Potensi di basis data.
- Jangan mengubah komponen selain yang diperlukan untuk mode tampilan gambar dan halaman Potensi.
- `src/components/potongan.tsx` memiliki perubahan lokal pengguna yang belum dikomit; sebelum mengedit, telaah diff terkini dan pertahankan seluruh perubahan yang tidak terkait.
- Jangan mengubah rasio atau mode tampilan `Foto` pada pemanggil lain secara massal.

## Review Focus

- Pastikan `object-contain` hanya aktif pada visual kategori utama Potensi.
- Pastikan mode bawaan `Foto` masih `object-cover`.
- Pastikan tidak ada overflow horizontal pada viewport 320 px.
- Pastikan gambar tetap memiliki `alt`, `sizes`, dan strategi pemuatan yang sama.

---

### Task 1: Tambahkan kontrak mode tampilan gambar yang tidak mengganggu pemanggil lama

**Files:**

- Modify: `src/components/potongan.tsx`
- Create: `e2e/06-potensi.spec.ts`

- [ ] **Step 1: Tulis pengujian E2E yang gagal untuk kebutuhan gambar utuh.**

  Tambahkan pengujian Playwright untuk `/potensi` yang memilih visual kategori pertama melalui penanda khusus, lalu memeriksa bahwa elemen `img` terlihat, memakai `object-fit: contain`, dan section tidak lebih lebar daripada viewport 320 px.

  Contoh inti pengujiannya:

  ```ts
  await page.goto("/potensi");
  const visual = page.locator('[data-potensi-visual="pariwisata"] img');
  await expect(visual).toBeVisible();
  await expect(visual).toHaveCSS("object-fit", "contain");

  await page.setViewportSize({ width: 320, height: 568 });
  const meluber = await page.locator("#pariwisata").evaluate((elemen) => elemen.scrollWidth > elemen.clientWidth);
  expect(meluber).toBe(false);
  ```

- [ ] **Step 2: Jalankan hanya pengujian baru untuk memastikan ia gagal sebelum perubahan.**

  Run: `npm run test:e2e -- --project=desktop e2e/06-potensi.spec.ts`

  Expected: gagal karena visual saat ini memiliki `object-fit: cover` dan belum ada penanda visual Potensi.

- [ ] **Step 3: Perluas props `Foto` dengan mode tampilan yang eksplisit.**

  Di `src/components/potongan.tsx`, tambahkan prop bertipe union, misalnya:

  ```ts
  mode?: "cover" | "contain";
  ```

  Beri nilai default `"cover"`. Pilih kelas `object-cover` untuk `cover` dan `object-contain` untuk `contain`; jangan mengubah `fill`, `sizes`, `priority`, `loading`, atau fallback ketika `src` kosong. Pertahankan perubahan lokal yang sudah ada di file tersebut.

- [ ] **Step 4: Jalankan kembali pengujian baru.**

  Expected: masih gagal pada selektor Potensi sampai pemanggil kategori memakai mode baru. Ini membuktikan mode bawaan tidak diam-diam mengubah halaman Potensi.

### Task 2: Terapkan mode gambar utuh hanya pada visual utama kategori Potensi

**Files:**

- Modify: `src/components/potensi.tsx`
- Modify: `e2e/06-potensi.spec.ts`

- [ ] **Step 1: Tulis ekspektasi untuk seluruh kategori yang memiliki gambar.**

  Perluas pengujian agar memeriksa setiap `section` kategori yang memiliki gambar utama. Gunakan atribut data yang stabil berbasis `kategori.kode`, bukan teks judul yang dapat diedit dari panel admin.

- [ ] **Step 2: Tandai pembungkus visual utama dan setel mode gambar.**

  Pada pembungkus `<div>` visual utama di `PotensiSection`, tambahkan:

  ```tsx
  data-potensi-visual={kategori.kode}
  ```

  Pada `<Foto>` tepat di bawahnya, tetapkan `mode="contain"`. Pertahankan rasio bingkai yang konsisten untuk layout dua kolom (`aspect-[16/10]`), tambah `bg-foto` bila perlu agar area kosong mempunyai warna yang selaras, dan jangan menambahkan padding yang mengurangi area tampilan gambar.

  Hasil yang diharapkan: gambar 4:3, vertikal, maupun infografis lebar ditempatkan seluruhnya di dalam bingkai; ruang kosong yang mungkin muncul di sisi atau atas-bawah merupakan konsekuensi rasio yang disengaja, bukan crop.

- [ ] **Step 3: Pastikan gambar kartu Potensi tetap memakai bawaan.**

  Jangan tambahkan prop `mode` pada `<Foto>` di `PotensiCard`, dokumentasi, atau komponen lain. Tinjau diff pemanggil `Foto` untuk memastikan hanya visual kategori utama yang menerima `mode="contain"`; semua pemanggil lain akan tetap mendapat default `object-cover`.

- [ ] **Step 4: Jalankan pengujian Potensi hingga lulus.**

  Run: `npm run test:e2e -- --project=desktop e2e/06-potensi.spec.ts`

  Expected: seluruh visual utama menggunakan `contain`, foto kartu tetap `cover`, dan tidak ada overflow pada 320 px.

### Task 3: Verifikasi responsif, aksesibilitas, dan regresi

**Files:**

- Verify: `src/components/potongan.tsx`
- Verify: `src/components/potensi.tsx`
- Verify: `e2e/06-potensi.spec.ts`

- [ ] **Step 1: Periksa manual pada browser.**

  Buka `/potensi` pada 320 px, 768 px, dan 1440 px. Konfirmasi infografis tape/UMKM atau gambar kategori serupa tampak penuh, tidak terseret keluar bingkai, label kategori masih sejajar, dan ukuran kolom teks-gambar tetap seimbang.

- [ ] **Step 2: Jalankan pemeriksaan kode.**

  Run: `npm test`

  Run: `npm run lint`

  Run: `npm run typecheck`

  Expected: semua lulus tanpa perubahan pada data Potensi maupun pemanggil `Foto` di fitur lain.

- [ ] **Step 3: Tinjau diff akhir sebelum commit.**

  Run: `git diff --check` dan `git diff -- src/components/potongan.tsx src/components/potensi.tsx e2e/06-potensi.spec.ts`

  Expected: diff hanya memuat prop mode gambar, pemakaian opt-in di visual utama Potensi, dan pengujian terkait; perubahan lokal pengguna di luar lingkup tetap utuh.
