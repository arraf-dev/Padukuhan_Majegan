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
      suka: b.suka,
      tanggapan: b.tanggapan,
      status: "terbit" as const,
      terbitPada: new Date(b.tanggal),
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
  await db.anggaran.deleteMany({ where: { tahun: anggaran.tahun } });
  await db.anggaran.createMany({
    data: [
      ...anggaran.sumber.map((s) => ({
        tahun: anggaran.tahun,
        jenis: "pendapatan" as const,
        uraian: s.nama,
        jumlah: BigInt(s.nominal),
        resmi: anggaran.resmi,
      })),
      ...anggaran.bidang.map((b) => ({
        tahun: anggaran.tahun,
        jenis: "belanja" as const,
        uraian: b.nama,
        jumlah: BigInt(b.nominal),
        catatan: b.catatan,
        resmi: anggaran.resmi,
      })),
    ],
  });

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
  for (const p of pengaduanTerbaru) {
    const isi = {
      kategori: "Lainnya",
      isi: p.isi,
      status: p.status,
      tanggapan: p.tanggapan ?? null,
      isAnonim: true,
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
