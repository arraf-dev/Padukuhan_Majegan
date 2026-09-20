import { loadEnvFile } from "node:process";
import { BERITA_POSYANDU_LANSIA } from "../src/content/berita-posyandu-lansia.ts";

const SLUG_BERITA_DEMO = [
  "merti-dusun-majegan-2026",
  "kerja-bakti-bersih-kali",
  "jadwal-posyandu-agustus",
  "pengecoran-jalan-tahap-ii",
  "panen-raya-kwt-majegan",
  "jadwal-ronda-agustus-2026",
  "perbaikan-saluran-irigasi-blok-timur",
  "pendataan-blt-dd-tahap-tiga",
  "pelatihan-olahan-pangan-umkm",
  "penambahan-lampu-jalan-rt-05",
  "persiapan-lomba-agustusan-2026",
  "rencana-pembangunan-pos-kamling-baru",
] as const;

if (process.env.KONFIRMASI_HAPUS_BERITA_DEMO !== "hapus-berita-demo") {
  throw new Error("Set KONFIRMASI_HAPUS_BERITA_DEMO=hapus-berita-demo untuk menjalankan pembersihan.");
}

try {
  loadEnvFile(".env.local");
} catch {
  // Konfigurasi dapat berasal dari environment deployment.
}

const { db } = await import("../src/lib/db.ts");

async function main() {
  const hasil = await db.$transaction(async (tx) => {
    const kategori = await tx.kategoriBerita.upsert({
      where: { slug: "kegiatan" },
      update: { nama: "Kegiatan" },
      create: { nama: "Kegiatan", slug: "kegiatan" },
    });
    const penulis = await tx.pengguna.findFirst({
      where: { peran: "superadmin", aktif: true },
      select: { id: true },
    });
    const dihapus = await tx.berita.deleteMany({ where: { slug: { in: [...SLUG_BERITA_DEMO] } } });
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
    const foto = await tx.fotoBerita.createMany({
      data: BERITA_POSYANDU_LANSIA.fotoDokumentasi.map((item, urutan) => ({
        ...item,
        beritaId: posyandu.id,
        urutan,
      })),
      skipDuplicates: true,
    });

    return { jumlahDihapus: dihapus.count, jumlahFotoBaru: foto.count };
  });

  console.log(
    `Selesai: ${hasil.jumlahDihapus} berita demo dihapus; ${BERITA_POSYANDU_LANSIA.slug} dipastikan ada; ${hasil.jumlahFotoBaru} foto baru ditambahkan.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
