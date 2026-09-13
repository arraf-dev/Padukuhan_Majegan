/**
 * Audit read-only untuk menemukan konten seed/demo yang masih tersisa.
 *
 * Jalankan dengan:
 *   node scripts/audit-data.ts
 *
 * Skrip ini tidak mengubah database dan sengaja tidak mencetak kredensial,
 * identitas pelapor, atau isi pengaduan.
 */
import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // Environment production biasanya sudah disediakan oleh platform.
}

const { db } = await import("../src/lib/db.ts");

const PENANDA_DEMO = /contoh|demo|placeholder|lokasi contoh|kontak contoh|produk contoh/i;

function tandai(teks: string | null | undefined) {
  return Boolean(teks && PENANDA_DEMO.test(teks));
}

async function main() {
  const [berita, galeri, potensi, profil, perangkat, statistik, layanan, pengaduan] = await Promise.all([
    db.berita.findMany({ select: { judul: true, slug: true, status: true, ringkasan: true, konten: true } }),
    db.albumGaleri.findMany({ select: { judul: true, slug: true, status: true, deskripsi: true } }),
    db.potensi.findMany({ select: { judul: true, slug: true, status: true, ringkasan: true, deskripsi: true, lokasi: true, produk: true, kontak: true, kategori: { select: { kode: true } } } }),
    db.halamanProfil.findMany({ select: { slug: true, draft: true, konten: true } }),
    db.perangkatDesa.findMany({ select: { nama: true, jabatan: true } }),
    db.statistikPenduduk.findMany({ select: { tahun: true, kategori: true, label: true, nilai: true }, orderBy: [{ tahun: "desc" }, { urutan: "asc" }] }),
    db.layanan.findMany({ select: { namaLayanan: true, slug: true, deskripsi: true } }),
    db.pengaduan.count(),
  ]);

  const hasil = {
    ringkasan: {
      berita: berita.length,
      galeri: galeri.length,
      potensi: potensi.length,
      profil: profil.length,
      perangkat: perangkat.length,
      statistik: statistik.length,
      layanan: layanan.length,
      pengaduan: pengaduan,
    },
    perluDiperiksa: {
      berita: berita.filter((b) => [b.judul, b.ringkasan, b.konten].some(tandai)).map(({ judul, slug, status }) => ({ judul, slug, status })),
      galeri: galeri.filter((g) => [g.judul, g.deskripsi].some(tandai)).map(({ judul, slug, status }) => ({ judul, slug, status })),
      potensi: potensi.filter((p) => [p.judul, p.ringkasan, p.deskripsi, p.lokasi, p.produk, p.kontak].some(tandai)).map(({ judul, slug, status, kategori }) => ({ judul, slug, status, kategori: kategori.kode })),
      profil: profil.filter((p) => tandai(p.konten) || p.draft || !p.konten.trim()).map(({ slug, draft, konten }) => ({ slug, draft, kosong: !konten.trim(), adaPenandaDemo: tandai(konten) })),
      perangkat: perangkat.filter((p) => p.nama === "-" || tandai(p.nama)).map(({ nama, jabatan }) => ({ nama, jabatan })),
    },
    statistikPerTahun: [...new Set(statistik.map((s) => s.tahun))].map((tahun) => ({
      tahun,
      jumlahBaris: statistik.filter((s) => s.tahun === tahun).length,
      kategori: [...new Set(statistik.filter((s) => s.tahun === tahun).map((s) => s.kategori))],
    })),
  };

  console.log(JSON.stringify(hasil, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
