/**
 * Isi awal database dari konten prototipe (`src/content/majegan.ts`) supaya
 * halaman publik tidak mendadak kosong saat sumber datanya pindah ke Neon.
 *
 * Aman dijalankan berulang: semuanya upsert. Begitu konten asli dari kalurahan
 * masuk lewat panel admin, jangan jalankan ini lagi di produksi — teks contoh
 * di bawah akan menimpa suntingan admin pada baris ber-slug sama.
 *
 * Jalankan: npx prisma db seed
 */
import { loadEnvFile } from "node:process";
import { hashKataSandi } from "../src/lib/auth.ts";
import { slugkan } from "../src/lib/teks.ts";
import {
  anggaran,
  berita,
  kategoriBerita,
  kelompokUsia,
  layanan,
  pengaduanTerbaru,
  profil,
  statistik,
} from "../src/content/majegan.ts";

// Aman dijalankan langsung (`node prisma/seed.ts`), bukan cuma lewat prisma CLI.
try {
  loadEnvFile(".env.local");
} catch {
  // Sudah ada di environment (mis. saat dijalankan dari `prisma db seed`).
}

const { db } = await import("../src/lib/db.ts");

async function main() {
  /* ---------- Akun ---------- */
  const email = process.env.SUPERADMIN_EMAIL;
  const sandi = process.env.SUPERADMIN_SANDI;
  if (!email || !sandi) {
    throw new Error("Set SUPERADMIN_EMAIL & SUPERADMIN_SANDI di .env.local dulu");
  }

  const dukuh = await db.pengguna.upsert({
    where: { email: email.toLowerCase() },
    // Sandi tidak ditimpa saat seed diulang — kalau sudah diganti, biarkan.
    update: { nama: profil.dukuh.nama, jabatan: profil.dukuh.jabatan, peran: "superadmin" },
    create: {
      nama: profil.dukuh.nama,
      email: email.toLowerCase(),
      sandiHash: hashKataSandi(sandi),
      jabatan: profil.dukuh.jabatan,
      peran: "superadmin",
    },
  });

  /* ---------- Berita ---------- */
  const kategori = new Map<string, string>();
  for (const nama of kategoriBerita) {
    const baris = await db.kategoriBerita.upsert({
      where: { slug: slugkan(nama) },
      update: { nama },
      create: { nama, slug: slugkan(nama) },
    });
    kategori.set(nama, baris.id);
  }

  for (const b of berita) {
    const isi = {
      judul: b.judul,
      ringkasan: b.ringkasan,
      konten: b.isi.join("\n\n"),
      lokasi: b.lokasi,
      gambarSampul: b.foto || null,
      suka: b.suka,
      tanggapan: b.tanggapan,
      // Sebagian sengaja draf supaya panel admin punya contoh kedua status,
      // dan supaya terbukti draf tidak bocor ke halaman publik.
      status: b.draft ? ("draft" as const) : ("terbit" as const),
      terbitPada: b.draft ? null : new Date(b.tanggal),
      kategoriId: kategori.get(b.kategori)!,
      penulisId: dukuh.id,
    };
    await db.berita.upsert({ where: { slug: b.slug }, update: isi, create: { ...isi, slug: b.slug } });
  }

  /* ---------- Profil & perangkat ---------- */
  const halaman = [
    { slug: "sejarah", judul: "Sejarah Padukuhan", konten: profil.sejarah.join("\n\n"), draft: false },
    {
      slug: "visi-misi",
      judul: "Visi & Misi",
      konten: [profil.visi, ...profil.misi].join("\n\n"),
      draft: profil.visiMisiDraft,
    },
  ];
  for (const h of halaman) {
    await db.halamanProfil.upsert({ where: { slug: h.slug }, update: h, create: h });
  }

  // Tanpa kolom unik yang masuk akal — ganti seluruh daftarnya sekaligus.
  await db.perangkatDesa.deleteMany();
  await db.perangkatDesa.createMany({
    data: [profil.dukuh, ...profil.perangkat].map((p, i) => ({
      nama: p.nama,
      jabatan: p.jabatan,
      urutan: i,
    })),
  });

  /* ---------- Layanan ---------- */
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
    await db.layanan.upsert({ where: { slug: l.slug }, update: isi, create: { ...isi, slug: l.slug } });
  }

  /* ---------- Anggaran ---------- */
  // Dua tahun: tahun berjalan dari `majegan.ts`, tahun sebelumnya diturunkan
  // dengan faktor tetap — supaya pemilih tahun di panel admin ada isinya dan
  // bisa diuji, bukan dropdown berisi satu pilihan.
  const barisAnggaran = (tahun: number, faktor: number) => [
    ...anggaran.sumber.map((s) => ({
      tahun,
      jenis: "pendapatan" as const,
      uraian: s.nama,
      jumlah: BigInt(Math.round((s.nominal * faktor) / 1000) * 1000),
      resmi: anggaran.resmi,
    })),
    ...anggaran.bidang.map((b) => ({
      tahun,
      jenis: "belanja" as const,
      uraian: b.nama,
      jumlah: BigInt(Math.round((b.nominal * faktor) / 1000) * 1000),
      catatan: b.catatan,
      resmi: anggaran.resmi,
    })),
  ];

  for (const [tahun, faktor] of [
    [anggaran.tahun, 1],
    [anggaran.tahun - 1, 0.88],
  ] as const) {
    await db.anggaran.deleteMany({ where: { tahun } });
    await db.anggaran.createMany({ data: barisAnggaran(tahun, faktor) });
  }

  /* ---------- Statistik ---------- */
  const tahun = anggaran.tahun;
  const barisStatistik = [
    ...statistik.map((s, i) => ({
      tahun,
      kategori: "ringkasan" as const,
      label: s.label,
      nilai: s.angka,
      urutan: i,
    })),
    ...kelompokUsia.map((u, i) => ({
      tahun,
      kategori: "usia" as const,
      label: u.rentang,
      nilai: u.persen,
      urutan: i,
    })),
  ];
  for (const s of barisStatistik) {
    await db.statistikPenduduk.upsert({
      where: { tahun_kategori_label: { tahun: s.tahun, kategori: s.kategori, label: s.label } },
      update: s,
      create: s,
    });
  }

  /* ---------- Pengaduan contoh ---------- */
  // Selang-seling anonim & berindentitas: panel admin perlu menampilkan kedua
  // bentuk, termasuk penjelasan bahwa kontak pelapor anonim memang tak disimpan.
  const pelapor = [
    { nama: "Suryanto", kontak: "0812-2700-1121", kategori: "Infrastruktur" },
    { nama: "Ngatinem", kontak: "0857-4412-8890", kategori: "Kebersihan" },
    { nama: "Yuli Astuti", kontak: "yuli.astuti@gmail.com", kategori: "Layanan Publik" },
    { nama: "Purwadi", kontak: "0813-9087-2245", kategori: "Keamanan" },
  ];

  for (const [i, p] of pengaduanTerbaru.entries()) {
    const anonim = i % 3 === 0;
    const orang = pelapor[i % pelapor.length];
    const isi = {
      kategori: anonim ? "Lainnya" : orang.kategori,
      isi: p.isi,
      status: p.status,
      tanggapan: p.tanggapan ?? null,
      isAnonim: anonim,
      namaPelapor: anonim ? null : orang.nama,
      kontak: anonim ? null : orang.kontak,
      dibuatPada: new Date(p.tanggal),
    };
    await db.pengaduan.upsert({
      where: { kodeTiket: p.kode },
      update: isi,
      create: { ...isi, kodeTiket: p.kode },
    });
  }

  console.log(
    `Selesai: ${await db.berita.count()} berita, ${await db.layanan.count()} layanan, ` +
      `${await db.pengaduan.count()} pengaduan, ${await db.pengguna.count()} pengguna.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
