/**
 * Pasang data resmi (struktur & layanan) sesuai poster Padukuhan ke database.
 *
 * Bedanya dengan `npx prisma db seed`: skrip ini hanya menyentuh tabel
 * `layanan` dan `perangkat_desa` — berita, galeri, statistik, potensi, dan
 * pengguna yang sudah disunting admin TIDAK ikut ditimpa. Aman dijalankan
 * berulang (upsert by slug / jabatan).
 *
 * Jalankan: node scripts/pasang-data-resmi.ts
 * (DATABASE_URL diambil dari environment, fallback ke .env.local)
 */
import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // Sudah tersedia di environment.
}

const { db } = await import("../src/lib/db.ts");
const { layanan, profil } = await import("../src/content/majegan.ts");

// Nama-nama demo lama yang mencetak perangkat; akan digantikan tanda "-"
// (nama resmi menyusul dari Pak Dukuh). Nama lain dianggap suntingan admin.
const NAMA_DEMO = new Set([
  "Sarjiman, S.Pd.",
  "Sumarno",
  "Dwi Hartana",
  "Sri Lestari",
  "Agus Riyanto",
  "Bejo Suwarno",
  "Tukiman",
  "Slamet Widodo",
  "Suparjo",
  "Marsudi",
  "Wagiman",
  "Heru Prasetyo",
  "Darmadi",
]);

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL belum tersedia — set di .env.local atau environment.");
  }

  /* ---------- Layanan resmi (8 surat) ---------- */
  for (const [i, l] of layanan.entries()) {
    const isi = {
      namaLayanan: l.nama,
      deskripsi: l.deskripsi,
      persyaratan: l.syarat,
      alur: l.alur,
      estimasiWaktu: l.durasi,
      biaya: l.biaya,
      fileTemplat: l.berkas?.nama ?? null,
      urutan: i,
    };
    await db.layanan.upsert({
      where: { slug: l.slug },
      update: isi,
      create: { ...isi, slug: l.slug },
    });
  }
  const dibuang = await db.layanan.deleteMany({
    where: { slug: { notIn: layanan.map((l) => l.slug) } },
  });
  console.log(`layanan resmi tersimpan: ${layanan.length} baris; demo dihapus: ${dibuang.count}`);

  /* ---------- Perangkat / struktur resmi ---------- */
  const daftar = [profil.dukuh, ...profil.perangkat];
  let dibuat = 0;
  let diperbarui = 0;
  for (const [i, p] of daftar.entries()) {
    const ada = await db.perangkatDesa.findFirst({ where: { jabatan: p.jabatan } });
    if (ada) {
      // Pertahankan nama bila admin sudah mengisinya dengan nama asli.
      const nama = NAMA_DEMO.has(ada.nama) || ada.nama === "-" ? p.nama : ada.nama;
      await db.perangkatDesa.update({
        where: { id: ada.id },
        data: { nama, urutan: i },
      });
      diperbarui += 1;
    } else {
      await db.perangkatDesa.create({ data: { nama: p.nama, jabatan: p.jabatan, urutan: i } });
      dibuat += 1;
    }
  }
  const sisa = await db.perangkatDesa.findMany({
    where: { jabatan: { notIn: daftar.map((p) => p.jabatan) } },
    select: { jabatan: true },
  });
  const dihapus = (
    await db.perangkatDesa.deleteMany({
      where: { jabatan: { notIn: daftar.map((p) => p.jabatan) } },
    })
  ).count;

  console.log(
    `perangkat: ${dibuat} dibuat, ${diperbarui} diperbarui, ${dihapus} sisa demo dihapus (${sisa
      .map((s) => s.jabatan)
      .join(", ")})`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
