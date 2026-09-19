# Editor Daftar Persyaratan dan Alur Layanan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti dua textarea Persyaratan dan Alur Pengurusan pada panel admin dengan daftar baris yang mudah diisi, ditambah, dihapus, dan diurutkan tanpa mengubah data layanan yang sudah tersimpan.

**Architecture:** `BorangLayanan` tetap berupa Server Component dan tetap mengirimkan dua nilai FormData bernama `persyaratan` dan `alur`. Komponen klien baru mengelola baris daftar, lalu menyerialisasikannya kembali ke format baris-baru yang saat ini sudah dipahami `simpanLayanan`; alur tetap memakai `judul | detail` hanya pada nilai tersembunyi, bukan pada antarmuka admin. Tidak diperlukan migrasi Prisma atau perubahan halaman publik.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node test runner, Playwright.

**Spec:** Permintaan pengguna 2026-09-19 dan tangkapan layar panel admin layanan; rancangan ringkas berada di bagian berikut.

## Ringkasan desain

- **Persyaratan:** setiap syarat tampil sebagai satu input teks berpenanda nomor, tombol naik/turun, dan tombol Hapus; tombol “Tambah syarat” menambahkan satu baris kosong di akhir.
- **Alur pengurusan:** setiap langkah tampil sebagai kartu bernomor dengan dua input: “Judul langkah” dan “Detail (opsional)”; tombol naik/turun dan Hapus bekerja per langkah; tombol “Tambah langkah” menambahkan kartu kosong.
- **Kompatibilitas:** teks `**tebal**` pada persyaratan tetap tersimpan apa adanya dan tetap diproses oleh halaman publik. Baris kosong tidak ikut terkirim. Urutan daftar adalah urutan yang diterima halaman publik.
- **Aksesibilitas dan mobile:** semua kontrol punya label yang bisa dibaca pembaca layar; area tombol cukup besar untuk sentuhan; kartu langkah ditumpuk satu kolom pada layar sempit.

## Global Constraints

- Jangan mengubah skema Prisma, migrasi, nama field database, atau kontrak FormData `persyaratan` dan `alur`.
- Gunakan utilitas yang sudah ada: `perBaris`, `uraikanAlur`, dan `rangkaiAlur` dari `src/lib/teks.ts`.
- Jangan menambah dependensi atau drag-and-drop; gunakan tombol Naik dan Turun agar editor tetap ringan dan dapat diakses.
- Pertahankan dukungan penulisan `**tebal**` pada persyaratan dan pemisah `|` untuk data lama melalui serialisasi tersembunyi.
- Sebelum menulis kode Next.js, baca panduan yang relevan di `node_modules/next/dist/docs/` sesuai `AGENTS.md`.

## Review Focus

- Layanan lama yang berisi beberapa syarat dan detail alur harus muncul kembali sebagai baris terpisah tanpa perubahan kata atau urutan.
- Menghapus semua syarat visual harus tetap mengirim nilai kosong sehingga validasi server yang ada menolak penyimpanan.
- Baris syarat atau langkah kosong tidak boleh disimpan sebagai item kosong di database.
- Detail alur yang memuat karakter `|` harus tetap utuh setelah disimpan dan dibuka lagi.
- Pengurutan melalui tombol Naik/Turun harus sama dengan urutan yang tampil pada halaman publik.

---

## File structure

- Create: `src/components/editor-daftar-layanan.tsx` — komponen klien untuk daftar syarat dan langkah, serialisasi nilai tersembunyi, serta aksi tambah/hapus/pindah.
- Modify: `src/app/admin/layanan/borang.tsx` — mengganti dua textarea dengan editor daftar dan memperbarui keterangan bantuan.
- Modify: `src/lib/teks.test.ts` — menutup perilaku parsing daftar yang menjadi kontrak editor.
- Create: `e2e/05-layanan-admin.spec.ts` — verifikasi alur admin membuat layanan melalui editor daftar, tampilan publik, dan pembersihan data uji.

### Task 1: Kunci kontrak serialisasi daftar

**Files:**
- Modify: `src/lib/teks.test.ts`

**Interfaces:**
- Consumes: `perBaris(teks: string): string[]`, `uraikanAlur(teks: string): LangkahAlur[]`, dan `rangkaiAlur(alur: LangkahAlur[]): string` dari `src/lib/teks.ts`.
- Produces: bukti bahwa format tersembunyi editor tetap kompatibel dengan server action yang ada.

- [ ] **Step 1: Tambahkan pengujian gagal untuk daftar persyaratan**

```ts
import { perBaris } from "./teks.ts";

test("persyaratan: baris kosong dan spasi tidak ikut disimpan", () => {
  assert.deepEqual(
    perBaris("  Fotokopi **KTP**  \n\n Fotokopi KK \r\n  "),
    ["Fotokopi **KTP**", "Fotokopi KK"],
  );
});
```

- [ ] **Step 2: Jalankan pengujian untuk memastikan kondisi awal tercakup**

Run: `node --test src/lib/teks.test.ts`

Expected: PASS setelah impor `perBaris` ditambahkan; fungsi sudah memiliki perilaku yang dibutuhkan, sehingga tes ini mendokumentasikan kontraknya.

- [ ] **Step 3: Tambahkan pengujian bolak-balik detail yang memuat pemisah**

```ts
test("alur bolak-balik mempertahankan detail yang memuat pemisah", () => {
  const teks = "Bayar | tunai | atau transfer";
  assert.equal(rangkaiAlur(uraikanAlur(teks)), teks);
});
```

- [ ] **Step 4: Jalankan seluruh pengujian utilitas**

Run: `node --test src/lib/teks.test.ts`

Expected: PASS untuk seluruh tes, termasuk dua kasus daftar baru.

- [ ] **Step 5: Commit kontrak utilitas**

```bash
git add src/lib/teks.test.ts
git commit -m "test: kunci format editor daftar layanan"
```

### Task 2: Bangun editor daftar yang dapat diakses

**Files:**
- Create: `src/components/editor-daftar-layanan.tsx`

**Interfaces:**
- Consumes: `perBaris`, `uraikanAlur`, `rangkaiAlur`, dan tipe `LangkahAlur` dari `@/lib/teks`.
- Produces: `EditorPersyaratan({ nilaiAwal: string }): JSX.Element` dan `EditorAlur({ nilaiAwal: string }): JSX.Element`. Masing-masing merender satu `<input type="hidden">` bernama `persyaratan` atau `alur` untuk dikonsumsi `simpanLayanan` tanpa perubahan.

- [ ] **Step 1: Buat kerangka komponen klien dan tipe baris stabil**

```tsx
"use client";

import { useRef, useState } from "react";
import { perBaris, rangkaiAlur, uraikanAlur, type LangkahAlur } from "@/lib/teks";

type BarisSyarat = { id: number; nilai: string };
type BarisAlur = LangkahAlur & { id: number };
```

Gunakan penghitung berbasis `useRef` untuk `id` internal; jangan gunakan indeks array sebagai React key karena tombol pindah akan menukar posisi baris.

- [ ] **Step 2: Implementasikan `EditorPersyaratan`**

```tsx
<input type="hidden" name="persyaratan" value={baris.map((b) => b.nilai.trim()).filter(Boolean).join("\n")} />
```

Render satu input berlabel `Syarat ${nomor}` untuk setiap baris, tombol `Naikkan syarat`, `Turunkan syarat`, dan `Hapus syarat`, serta tombol `Tambah syarat`. Tombol Naik/Turun dinonaktifkan pada batas daftar. Saat baris terakhir dihapus, sisakan satu input kosong agar admin masih memiliki tempat untuk menulis dan server action tetap menjadi sumber validasi minimal satu syarat.

- [ ] **Step 3: Implementasikan `EditorAlur`**

```tsx
<input
  type="hidden"
  name="alur"
  value={rangkaiAlur(baris.filter((b) => b.judul.trim() || b.detail.trim()))}
/>
```

Setiap langkah mempunyai input berlabel `Judul langkah ${nomor}` dan `Detail langkah ${nomor} (opsional)`. Gunakan kumpulan aksi pindah/hapus yang sama seperti persyaratan, tetapi tulis nomor langkah secara visual agar struktur alur mudah dipindai.

- [ ] **Step 4: Terapkan gaya yang konsisten dengan panel admin**

Gunakan token kelas yang sudah dipakai `BorangLayanan`: `rounded-xl`, `border-garis`, `bg-krem`, `text-tinta`, serta target sentuh `min-h-11`. Pada layar `md` dan lebih besar, letakkan tombol aksi di sisi kanan baris; pada layar kecil, biarkan tombol membungkus ke bawah tanpa overflow horizontal.

- [ ] **Step 5: Jalankan pemeriksaan tipe dan lint**

Run: `npm run typecheck; npm run lint`

Expected: PASS; komponen klien tidak mengimpor kode server atau dependensi baru.

- [ ] **Step 6: Commit editor daftar**

```bash
git add src/components/editor-daftar-layanan.tsx
git commit -m "feat: tambahkan editor daftar layanan"
```

### Task 3: Hubungkan editor ke borang layanan

**Files:**
- Modify: `src/app/admin/layanan/borang.tsx`

**Interfaces:**
- Consumes: `EditorPersyaratan` dan `EditorAlur` dari `@/components/editor-daftar-layanan`.
- Produces: form baru dan edit layanan yang mengirim FormData persis sama seperti sebelum perubahan.

- [ ] **Step 1: Ganti textarea Persyaratan**

```tsx
<EditorPersyaratan nilaiAwal={awal?.persyaratan ?? ""} />
<p className="mt-1.5 text-[11.5px] text-samar">
  Tulis teks penekanan dengan <code>**tebal**</code> bila diperlukan.
</p>
```

Hapus label “SATU BARIS SATU SYARAT” karena editor sudah memperlihatkan satu syarat per baris. Pertahankan `legend` dan gaya fieldset saat ini.

- [ ] **Step 2: Ganti textarea Alur Pengurusan**

```tsx
<EditorAlur nilaiAwal={awal?.alur ?? ""} />
<p className="mt-1.5 text-[11.5px] text-samar">
  Detail langkah bersifat opsional dan tampil sebagai keterangan pada halaman publik.
</p>
```

Hapus instruksi pemisah `|`; pemisah tersebut hanya menjadi format serialisasi internal.

- [ ] **Step 3: Verifikasi data lama dalam mode edit**

Jalankan aplikasi lokal, buka salah satu URL `/admin/layanan/{id}` yang memiliki beberapa syarat dan langkah, lalu pastikan setiap item muncul pada baris/kartu sendiri dengan urutan yang sama. Ubah satu nilai, simpan, muat ulang halaman edit, lalu pastikan nilai serta urutannya tidak berubah.

- [ ] **Step 4: Jalankan pemeriksaan proyek**

Run: `npm test; npm run typecheck; npm run lint`

Expected: PASS.

- [ ] **Step 5: Commit integrasi form**

```bash
git add src/app/admin/layanan/borang.tsx
git commit -m "feat: gunakan daftar pada borang layanan"
```

### Task 4: Uji alur admin hingga tampilan publik

**Files:**
- Create: `e2e/05-layanan-admin.spec.ts`

**Interfaces:**
- Consumes: `paksaMasuk`, `perlu`, dan `tandai` dari `e2e/helpers.ts`; label aksesibel dan tombol dari Task 2.
- Produces: bukti browser bahwa daftar input tersimpan sebagai layanan dan tampil pada halaman publik, tanpa meninggalkan data E2E.

- [ ] **Step 1: Tulis skenario Playwright untuk membuat layanan melalui editor daftar**

```ts
test("superadmin mengisi daftar syarat dan alur layanan", async ({ page }) => {
  await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
  const nama = tandai("Uji E2E Layanan");

  await page.goto("/admin/layanan/baru");
  await page.fill("#nama", nama);
  await page.fill("#deskripsi", "Layanan khusus untuk menguji editor daftar.");
  await page.getByLabel("Syarat 1").fill("Fotokopi **KTP**");
  await page.getByRole("button", { name: "Tambah syarat" }).click();
  await page.getByLabel("Syarat 2").fill("Fotokopi Kartu Keluarga");
  await page.getByLabel("Judul langkah 1").fill("Siapkan berkas");
  await page.getByLabel("Detail langkah 1 (opsional)").fill("Bawa dokumen asli.");
  await page.getByRole("button", { name: "Simpan Layanan" }).click();
});
```

- [ ] **Step 2: Tambahkan asersi halaman publik dan urutan**

```ts
await expect(page.getByRole("status")).toContainText("Layanan baru tersimpan");
await page.goto("/layanan");
await page.getByRole("link", { name, exact: false }).click();
await expect(page.getByRole("heading", { name: "Persyaratan" })).toBeVisible();
await expect(page.getByText("Fotokopi KTP", { exact: false })).toBeVisible();
await expect(page.getByText("Fotokopi Kartu Keluarga", { exact: true })).toBeVisible();
await expect(page.getByText("Siapkan berkas", { exact: true })).toBeVisible();
await expect(page.getByText("Bawa dokumen asli.", { exact: true })).toBeVisible();

const syarat = page
  .locator("section")
  .filter({ has: page.getByRole("heading", { name: "Persyaratan" }) })
  .getByRole("listitem");
await expect(syarat.nth(0)).toContainText("Fotokopi KTP");
await expect(syarat.nth(1)).toContainText("Fotokopi Kartu Keluarga");
```

Tambahkan asersi locator urutan untuk memastikan syarat pertama berada sebelum syarat kedua, lalu navigasikan ke `/admin/layanan`, pilih Hapus pada baris dengan nama uji, konfirmasi `Ya, hapus`, dan cek status `Layanan dihapus.`

- [ ] **Step 3: Jalankan E2E khusus layanan**

Run: `$env:E2E_URL='http://127.0.0.1:3000'; npx playwright test e2e/05-layanan-admin.spec.ts --project=desktop`

Expected: PASS dan data layanan uji telah dihapus pada akhir skenario.

- [ ] **Step 4: Jalankan verifikasi akhir**

Run: `npm test; npm run typecheck; npm run lint; $env:NEXT_PUBLIC_URL='https://www.majegan-pandowoharjo.id'; npm run build`

Expected: seluruh perintah PASS. Jalankan pula seluruh E2E desktop pada lingkungan yang memiliki kredensial uji.

- [ ] **Step 5: Commit pengujian E2E**

```bash
git add e2e/05-layanan-admin.spec.ts
git commit -m "test: verifikasi editor daftar layanan"
```

## Self-review

- **Cakupan:** setiap kebutuhan UI pada gambar tercakup: daftar persyaratan, daftar langkah, penambahan/penghapusan, urutan, serta penghilangan aturan manual `|`.
- **Kompatibilitas:** data lama dan server action tetap memakai kontrak yang sama; tidak ada migrasi atau perubahan halaman publik.
- **Pengujian:** unit test menjaga serialisasi; E2E menjaga interaksi admin, output publik, dan pembersihan data uji.
- **Placeholder:** tidak ada langkah implementasi yang belum ditentukan.
