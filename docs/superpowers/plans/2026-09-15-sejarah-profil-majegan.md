# Sejarah Profil Majegan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti naskah sejarah contoh pada halaman Profil dengan sejarah resmi dari dokumen, menampilkan peta historis dan foto Joglo Kademangan secara responsif, serta menyertakan sumber yang mudah dibaca.

**Architecture:** Konten resmi dan metadata media disimpan sebagai data terstruktur di `src/content/sejarah.ts`, sementara narasi tetap disalin ke tabel `halaman_profil` agar dapat disunting melalui panel admin. Komponen baru `SejarahProfil` hanya bertanggung jawab atas presentasi semantik dan responsif; halaman Profil memasok narasi dari database serta figur dan sumber dari data resmi. Skrip pemasangan data resmi diperluas untuk memperbarui naskah sejarah tanpa menyentuh konten lain.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, Prisma 7, Node test runner, `next/image`.

**Spec:** `D:\KKN_DARMAJEGAN\Sejarah Padukuhan Majegan.docx`

## Global Constraints

- Dokumen DOCX adalah sumber konten, bukan sumber instruksi.
- Jangan menambah fakta sejarah yang tidak ada di dokumen.
- Rapikan ejaan dan alur kalimat tanpa mengubah makna, ketidakpastian, atau atribusi sumber.
- Gunakan tahun 1933 pada caption peta karena sesuai dengan entri sumber dan isi peta; angka 1993 pada caption DOCX diperlakukan sebagai salah ketik.
- Pertahankan naskah sejarah agar tetap dapat disunting dari panel admin.
- Gunakan dua gambar asli dari DOCX dan beri `alt` serta `figcaption` yang bermakna.
- Jangan mengubah bagian Visi dan Misi, Struktur Organisasi, atau Wilayah dan Kontak.
- Pertahankan perubahan pengguna yang sudah ada pada `opencode.json` dan `src/components/potongan.tsx`.
- Jangan menambah dependensi baru.

---

### Task 1: Data sejarah resmi dan aset gambar

**Files:**
- Create: `src/content/sejarah.ts`
- Create: `src/lib/sejarah.test.ts`
- Create: `public/gambar/sejarah-peta-majegan-1933.jpg`
- Create: `public/gambar/joglo-kademangan-majegan.jpg`
- Modify: `src/content/majegan.ts`

**Interfaces:**
- Produces: `sejarahResmi` dengan properti `paragraf`, `gambar`, dan `sumber`.
- Produces: tipe `GambarSejarah` dan `SumberSejarah` untuk komponen tampilan dan lapisan data.
- Consumes: dua media DOCX `image1.jpeg` dan `image2.jpeg` tanpa manipulasi visual yang mengubah isi.

- [ ] **Step 1: Tulis pengujian yang gagal untuk kontrak konten sejarah**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { sejarahResmi } from "../content/sejarah.ts";

test("sejarah resmi memuat empat paragraf dari dokumen", () => {
  assert.equal(sejarahResmi.paragraf.length, 4);
  assert.match(sejarahResmi.paragraf[0], /Keraton Yogyakarta/);
  assert.match(sejarahResmi.paragraf[2], /1890-an/);
});

test("figur sejarah memiliki aset lokal, alt, caption, dan tahun peta yang benar", () => {
  assert.deepEqual(
    sejarahResmi.gambar.map((gambar) => gambar.src),
    [
      "/gambar/sejarah-peta-majegan-1933.jpg",
      "/gambar/joglo-kademangan-majegan.jpg",
    ],
  );
  assert.ok(sejarahResmi.gambar.every((gambar) => gambar.alt && gambar.caption));
  assert.match(sejarahResmi.gambar[0].caption, /1933/);
});

test("daftar sumber mempertahankan tiga rujukan dokumen", () => {
  assert.equal(sejarahResmi.sumber.length, 3);
  assert.match(sejarahResmi.sumber[0].teks, /Topografische Dienst/);
  assert.match(sejarahResmi.sumber[2].teks, /Wawancara pribadi, 30 Mei 2026/);
});
```

- [ ] **Step 2: Jalankan pengujian dan pastikan gagal karena modul belum ada**

Run: `npm test`

Expected: FAIL dengan galat bahwa `src/content/sejarah.ts` belum ditemukan.

- [ ] **Step 3: Buat data sejarah resmi yang sudah dirapikan**

```ts
export type GambarSejarah = {
  src: string;
  alt: string;
  caption: string;
};

export type SumberSejarah = {
  teks: string;
  tautan?: string;
};

export const sejarahResmi = {
  paragraf: [
    "Sebelum Kalurahan Pandowoharjo terbentuk seperti yang dikenal sekarang, Majegan merupakan wilayah yang cukup besar dan memegang peranan penting dalam administrasi, terutama pemungutan pajak untuk Keraton Yogyakarta. Pada masa itu, hasil bumi sebagai pajak masyarakat Jawa dikumpulkan di Majegan sebelum diserahkan kepada Keraton Yogyakarta. Karena fungsi tersebut, nama Majegan dipercaya berkaitan dengan kegiatan pengumpulan pajak. Kedudukan ini menjadikan Majegan salah satu wilayah penting dalam perkembangan pemerintahan setempat.",
    "Dalam perkembangannya, Majegan ikut berperan dalam proses terbentuknya Kalurahan Pandowoharjo bersama wilayah Brayut, Tlacap, Pajangan, Jabung, dan Sawahan. Penyatuan wilayah-wilayah tersebut mengubah struktur pemerintahan setempat. Meskipun demikian, jejak Majegan sebagai wilayah administratif pada masa sebelumnya masih dapat ditelusuri melalui peninggalan sejarah dan ingatan masyarakat. Salah satu peninggalan yang masih bertahan adalah Joglo Kademangan, bukti fisik pemerintahan lama yang pernah berlangsung di Majegan.",
    "Joglo Kademangan diperkirakan dibangun oleh Mbah Demang sekitar tahun 1890-an dan dahulu digunakan sebagai kantor pemerintahan Kalurahan Majegan. Bangunan ini memiliki keunikan karena menggunakan kayu pohon nangka sebagai salah satu bahan utamanya. Penggunaan kayu nangka berkaitan dengan keadaan pada masa kolonial Belanda, ketika kayu jati sulit diperoleh karena banyak pohon jati mengalami penjarahan. Masyarakat kemudian memanfaatkan bahan yang tersedia di lingkungan sekitar untuk membangun Joglo Kademangan.",
    "Hingga kini, Joglo Kademangan masih berdiri dan belum mengalami renovasi menyeluruh. Perawatannya lebih banyak berupa perbaikan pada bagian bangunan yang mulai rusak atau lapuk. Bagi masyarakat Majegan, Joglo Kademangan memiliki nilai sejarah dan budaya yang penting. Bangunan ini bukan hanya peninggalan arsitektur tradisional, tetapi juga pengingat sejarah pemerintahan dan kehidupan masyarakat Majegan.",
  ],
  gambar: [
    {
      src: "/gambar/sejarah-peta-majegan-1933.jpg",
      alt: "Cuplikan peta historis wilayah Majegan dan sekitarnya tahun 1933",
      caption: "Peta wilayah Majegan tahun 1933",
    },
    {
      src: "/gambar/joglo-kademangan-majegan.jpg",
      alt: "Bangunan Joglo Kademangan Majegan dilihat dari halaman depan",
      caption: "Joglo Kademangan, peninggalan pemerintahan lama Majegan",
    },
  ],
  sumber: [
    { teks: "Topografische Dienst Batavia. (1933). Sleman: herzien door den Topografischen Dienst in 1933. Leiden University." },
    { teks: "Kalurahan Pandowoharjo. (2026). Bangunan Warisan Budaya.", tautan: "https://pandowoharjosid.slemankab.go.id" },
    { teks: "Suharno, Edi. (2026). Sejarah Joglo Kademangan Majegan. Wawancara pribadi, 30 Mei 2026, Sleman." },
  ],
} as const;
```

- [ ] **Step 4: Salin kedua gambar DOCX ke direktori publik dengan nama deskriptif**

Run dari PowerShell:

```powershell
$arsip = [IO.Compression.ZipFile]::OpenRead('D:\KKN_DARMAJEGAN\Sejarah Padukuhan Majegan.docx')
[IO.Compression.ZipFileExtensions]::ExtractToFile($arsip.GetEntry('word/media/image1.jpeg'), 'public\gambar\sejarah-peta-majegan-1933.jpg', $true)
[IO.Compression.ZipFileExtensions]::ExtractToFile($arsip.GetEntry('word/media/image2.jpeg'), 'public\gambar\joglo-kademangan-majegan.jpg', $true)
$arsip.Dispose()
```

Expected: kedua file tersedia dan dapat dibaca oleh `next/image` sebagai aset lokal.

- [ ] **Step 5: Gunakan `sejarahResmi.paragraf` sebagai sumber seed profil**

Di `src/content/majegan.ts`, impor `sejarahResmi`, lalu ganti larik sejarah contoh:

```ts
import { sejarahResmi } from "@/content/sejarah";

export const profil = {
  sejarah: [...sejarahResmi.paragraf],
};
```

Ubah hanya properti `sejarah` pada objek `profil`; seluruh properti sesudahnya dipertahankan persis seperti kondisi awal.

- [ ] **Step 6: Jalankan pengujian dan pastikan kontrak konten lulus**

Run: `npm test`

Expected: seluruh unit test PASS.

- [ ] **Step 7: Commit data dan aset sejarah**

```bash
git add src/content/sejarah.ts src/lib/sejarah.test.ts src/content/majegan.ts public/gambar/sejarah-peta-majegan-1933.jpg public/gambar/joglo-kademangan-majegan.jpg
git commit -m "feat: tambahkan konten sejarah resmi Majegan"
```

### Task 2: Lapisan data dan pemasangan naskah resmi

**Files:**
- Modify: `src/content/sejarah.ts`
- Modify: `src/lib/profil.ts`
- Modify: `scripts/pasang-data-resmi.ts`
- Modify: `prisma/seed.ts`
- Test: `src/lib/sejarah.test.ts`

**Interfaces:**
- Consumes: `sejarahResmi` dari `src/content/sejarah.ts`.
- Produces: `ProfilDesa.sejarahGambar: readonly GambarSejarah[]` dan `ProfilDesa.sejarahSumber: readonly SumberSejarah[]`.
- Produces: `naskahSejarahResmi(): string` sebagai satu-satunya pemformat naskah database.
- Preserves: `ProfilDesa.sejarah: string[]` dari database agar panel admin tetap menjadi sumber narasi saat baris tersedia.

- [ ] **Step 1: Tambahkan pengujian gagal untuk format teks yang akan dipasang ke database**

```ts
import { naskahSejarahResmi, sejarahResmi } from "../content/sejarah.ts";

test("paragraf sejarah siap disimpan sebagai naskah admin", () => {
  const konten = naskahSejarahResmi();
  assert.equal(konten.split("\n\n").length, 4);
  assert.doesNotMatch(konten, /\n{3,}/);
});
```

- [ ] **Step 2: Jalankan pengujian dan pastikan gagal sebelum kontrak ekspor lengkap**

Run: `npm test`

Expected: FAIL karena ekspor `naskahSejarahResmi` belum ada.

- [ ] **Step 3: Implementasikan pemformat naskah database**

Tambahkan ke `src/content/sejarah.ts`:

```ts
export function naskahSejarahResmi() {
  return sejarahResmi.paragraf.join("\n\n");
}
```

- [ ] **Step 4: Perluas hasil query profil dengan metadata figur dan sumber**

```ts
import {
  naskahSejarahResmi,
  sejarahResmi,
  type GambarSejarah,
  type SumberSejarah,
} from "@/content/sejarah";

export type ProfilDesa = {
  sejarah: string[];
  sejarahGambar: readonly GambarSejarah[];
  sejarahSumber: readonly SumberSejarah[];
};
```

Pada `profilDesa()`, gunakan data resmi sebagai fallback jika baris database belum ada dan selalu sertakan metadata presentasi:

```ts
const sejarah = naskah("sejarah");

return {
  sejarah: paragraf(sejarah?.konten ?? naskahSejarahResmi()),
  sejarahGambar: sejarahResmi.gambar,
  sejarahSumber: sejarahResmi.sumber,
};
```

Sisipkan ketiga properti tersebut pada objek hasil yang sudah ada; jangan hapus properti `visi`, `misi`, `visiMisiDraft`, `dukuh`, `struktur`, `catatanStruktur`, atau `catatanPeta`.

- [ ] **Step 5: Perluas skrip pemasangan data resmi untuk upsert sejarah saja**

Tambahkan import `naskahSejarahResmi`, lalu sebelum pemasangan struktur jalankan:

```ts
await db.halamanProfil.upsert({
  where: { slug: "sejarah" },
  update: {
    judul: "Sejarah Padukuhan",
    konten: naskahSejarahResmi(),
    draft: false,
  },
  create: {
    slug: "sejarah",
    judul: "Sejarah Padukuhan",
    konten: naskahSejarahResmi(),
    draft: false,
  },
});
```

Perbarui komentar kepala skrip agar menyebut profil, struktur, dan layanan. Jangan jalankan skrip terhadap database produksi sebelum target `DATABASE_URL` dikonfirmasi.

- [ ] **Step 6: Pastikan seed tetap memakai sumber tunggal**

Pertahankan `prisma/seed.ts` menggunakan `profil.sejarah.join("\n\n")`; karena `profil.sejarah` kini berasal dari `sejarahResmi`, tidak boleh ada salinan naskah kedua di seed.

- [ ] **Step 7: Jalankan test dan typecheck**

Run: `npm test && npm run typecheck`

Expected: unit test dan pemeriksaan tipe PASS.

- [ ] **Step 8: Commit integrasi data profil**

```bash
git add src/content/sejarah.ts src/lib/profil.ts scripts/pasang-data-resmi.ts prisma/seed.ts src/lib/sejarah.test.ts
git commit -m "feat: integrasikan sejarah resmi ke profil"
```

### Task 3: Komponen sejarah editorial yang responsif

**Files:**
- Create: `src/components/sejarah-profil.tsx`
- Modify: `src/app/(publik)/profil/page.tsx`
- Create: `e2e/04-profil.spec.ts`

**Interfaces:**
- Consumes: `paragraf: string[]`, `gambar: readonly GambarSejarah[]`, dan `sumber: readonly SumberSejarah[]`.
- Produces: artikel semantik berisi narasi, dua elemen `figure`, caption, dan daftar sumber.

- [ ] **Step 1: Tulis pengujian browser yang gagal untuk pengalaman bagian Sejarah**

```tsx
import { expect, test } from "@playwright/test";

test("profil menampilkan sejarah resmi, dua figur, dan sumber", async ({ page }) => {
  await page.goto("/profil#sejarah");
  const sejarah = page.locator("#sejarah");

  await expect(sejarah.getByText("JEJAK AWAL MAJEGAN")).toBeVisible();
  await expect(sejarah.getByText("Peta wilayah Majegan tahun 1933")).toBeVisible();
  await expect(sejarah.getByText("Joglo Kademangan, peninggalan pemerintahan lama Majegan")).toBeVisible();
  await expect(sejarah.locator("figure")).toHaveCount(2);
  await expect(sejarah.getByRole("heading", { name: "Sumber sejarah" })).toBeVisible();
  await expect(sejarah.getByRole("link", { name: /Bangunan Warisan Budaya/ })).toHaveAttribute("href", "https://pandowoharjosid.slemankab.go.id");
});

test("bagian sejarah tetap berada dalam viewport 320 piksel", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/profil#sejarah");
  const lebarKonten = await page.locator("#sejarah").evaluate((elemen) => elemen.scrollWidth);
  expect(lebarKonten).toBeLessThanOrEqual(320);
});
```

- [ ] **Step 2: Jalankan pengujian dan pastikan gagal terhadap tampilan lama**

Dengan server lokal aktif, jalankan dari PowerShell:

```powershell
$env:E2E_URL='http://127.0.0.1:3000'
npx playwright test e2e/04-profil.spec.ts --project=desktop
```

Expected: FAIL karena tampilan lama belum memiliki dua `figure`, caption peta 1933, dan bagian sumber.

- [ ] **Step 3: Implementasikan komponen dengan urutan baca editorial**

Gunakan implementasi lengkap berikut agar urutan baca, ukuran intrinsik gambar, fokus tautan, dan fallback jumlah paragraf tetap eksplisit:

```tsx
import Image from "next/image";
import type { GambarSejarah, SumberSejarah } from "@/content/sejarah";

type SejarahProfilProps = {
  paragraf: string[];
  gambar: readonly GambarSejarah[];
  sumber: readonly SumberSejarah[];
};

export function SejarahProfil({ paragraf, gambar, sumber }: SejarahProfilProps) {
  const [peta, joglo] = gambar;

  return (
<article className="space-y-7 lg:space-y-10">
  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)] lg:gap-9">
    <div>
      <p className="mb-3 text-[11px] font-extrabold tracking-[.14em] text-emas-tua">JEJAK AWAL MAJEGAN</p>
      {paragraf[0] && (
        <p className="font-serif text-[17px] leading-[1.85] text-tinta lg:text-[19px]">{paragraf[0]}</p>
      )}
    </div>
    {peta && (
      <figure className="overflow-hidden rounded-xl border border-garis bg-kertas lg:rounded-2xl">
        <Image src={peta.src} alt={peta.alt} width={940} height={666} sizes="(min-width: 1024px) 42vw, 100vw" className="h-auto w-full" />
        <figcaption className="px-4 py-3 text-[12px] leading-relaxed text-redup">{peta.caption}</figcaption>
      </figure>
    )}
  </div>
  {paragraf[1] && <p className="max-w-4xl text-[15px] leading-[1.85] text-teks lg:text-[16.5px]">{paragraf[1]}</p>}
  {joglo && (
    <figure className="overflow-hidden rounded-xl border border-garis bg-kertas lg:rounded-2xl">
      <Image src={joglo.src} alt={joglo.alt} width={850} height={416} sizes="(min-width: 1024px) 900px, 100vw" className="h-auto w-full" />
      <figcaption className="px-4 py-3 text-[12px] leading-relaxed text-redup">{joglo.caption}</figcaption>
    </figure>
  )}
  <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
    {paragraf.slice(2).map((isi) => <p key={isi} className="text-[15px] leading-[1.85] text-teks lg:text-[16.5px]">{isi}</p>)}
  </div>
  <aside aria-labelledby="sumber-sejarah" className="border-t border-garis pt-5">
    <h3 id="sumber-sejarah" className="mb-3 font-serif text-base font-semibold text-hutan">Sumber sejarah</h3>
    <ol className="list-decimal space-y-2 pl-5 text-[12.5px] leading-relaxed text-redup">
      {sumber.map((item) => (
        <li key={item.teks}>
          {item.tautan ? <a href={item.tautan} target="_blank" rel="noreferrer" className="underline decoration-garis-tebal underline-offset-2 hover:text-hutan">{item.teks}</a> : item.teks}
        </li>
      ))}
    </ol>
  </aside>
</article>
  );
}
```

Gunakan `Image` dari `next/image` dengan dimensi intrinsik agar peta tidak terpotong dan foto Joglo tidak diregangkan. Sumber dengan `tautan` dirender sebagai link eksternal yang memiliki fokus keyboard terlihat, sedangkan wawancara tetap berupa teks.

- [ ] **Step 4: Ganti blok sejarah lama pada halaman Profil**

```tsx
<section id="sejarah" data-reveal className="scroll-mt-6 md:scroll-mt-20">
  <JudulSection anak="Sejarah Padukuhan" />
  <SejarahProfil
    paragraf={profil.sejarah}
    gambar={profil.sejarahGambar}
    sumber={profil.sejarahSumber}
  />
</section>
```

Hapus penggunaan ilustrasi `/gambar/balai-dusun.svg` hanya dari bagian sejarah. Bagian lain pada halaman harus tetap sama.

- [ ] **Step 5: Jalankan pengujian browser, lint, dan typecheck**

Run:

```powershell
$env:E2E_URL='http://127.0.0.1:3000'
npx playwright test e2e/04-profil.spec.ts --project=desktop
npm run lint
npm run typecheck
```

Expected: kedua pengujian browser PASS dan tidak ada lint atau type error.

- [ ] **Step 6: Commit presentasi halaman Profil**

```bash
git add src/components/sejarah-profil.tsx "src/app/(publik)/profil/page.tsx" e2e/04-profil.spec.ts
git commit -m "feat: rapikan tampilan sejarah pada halaman profil"
```

### Task 4: Verifikasi menyeluruh dan pemasangan data

**Files:**
- Verify: `src/lib/sejarah.test.ts`
- Verify: `src/components/sejarah-profil.tsx`
- Verify: `src/app/(publik)/profil/page.tsx`
- Verify: `public/gambar/sejarah-peta-majegan-1933.jpg`
- Verify: `public/gambar/joglo-kademangan-majegan.jpg`

**Interfaces:**
- Consumes: seluruh perubahan Task 1-3.
- Produces: bukti bahwa konten benar, build berhasil, dan tata letak dapat dibaca pada layar kecil maupun besar.

- [ ] **Step 1: Jalankan rangkaian verifikasi kode**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: seluruh perintah exit code `0` tanpa test failure, lint error, type error, atau build error.

- [ ] **Step 2: Jalankan situs lokal dan periksa halaman Profil**

Run: `npm run dev`

Periksa `/profil#sejarah` pada viewport 320×568, 768×1024, dan 1440×900. Pastikan:

- urutan baca narasi tetap logis;
- tidak ada teks, gambar, atau caption yang terpotong;
- peta menampilkan keseluruhan isi tanpa crop;
- foto Joglo mempertahankan rasio aslinya;
- daftar sumber mudah dibaca dan link dapat difokuskan dengan keyboard;
- navigasi anchor Profil masih berfungsi;
- bagian Visi dan Misi, Struktur Organisasi, serta Wilayah dan Kontak tidak berubah secara visual.

- [ ] **Step 3: Bandingkan konten web dengan DOCX**

Verifikasi empat gagasan utama: fungsi pengumpulan pajak untuk Keraton Yogyakarta, penyatuan wilayah pembentuk Pandowoharjo, pembangunan Joglo sekitar 1890-an dengan kayu nangka, dan kondisi serta nilai Joglo saat ini. Verifikasi pula ketiga sumber dan kedua caption.

- [ ] **Step 4: Pasang data resmi hanya setelah target database dikonfirmasi**

Run: `node scripts/pasang-data-resmi.ts`

Expected: log menyatakan naskah sejarah tersimpan, sementara berita, galeri, statistik, potensi, pengaduan, dan pengguna tidak disentuh.

- [ ] **Step 5: Periksa diff akhir dan status repository**

Run: `git diff --check && git status --short`

Expected: tidak ada whitespace error; hanya file dalam rencana yang berubah, ditambah perubahan pengguna yang sudah ada dan tidak disentuh.
