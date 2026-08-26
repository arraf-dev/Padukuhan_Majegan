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
import { albumGaleriDemo } from "../src/content/galeri.ts";
import { kategoriPotensiDemo } from "../src/content/potensi.ts";
import {
  berita,
  kategoriBerita,
  kelompokUsia,
  layanan,
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

  /* ---------- Galeri kegiatan ---------- */
  for (const g of albumGaleriDemo) {
    const isi = {
      judul: g.judul,
      deskripsi: g.deskripsi,
      kategori: g.kategori,
      coverUrl: g.coverUrl,
      tanggalKegiatan: new Date(g.tanggalKegiatan),
      status: g.status,
    } as const;
    const album = await db.albumGaleri.upsert({
      where: { slug: g.slug },
      update: isi,
      create: { ...isi, slug: g.slug },
      select: { id: true },
    });

    await db.fotoGaleri.deleteMany({ where: { albumId: album.id, id: { notIn: g.foto.map((f) => f.id) } } });
    for (const f of g.foto) {
      await db.fotoGaleri.upsert({
        where: { id: f.id },
        update: {
          albumId: album.id,
          url: f.url,
          alt: f.alt,
          caption: f.caption || null,
          urutan: f.urutan,
          width: f.width,
          height: f.height,
          size: f.size,
        },
        create: {
          id: f.id,
          albumId: album.id,
          url: f.url,
          alt: f.alt,
          caption: f.caption || null,
          urutan: f.urutan,
          width: f.width,
          height: f.height,
          size: f.size,
        },
      });
    }
  }

  /* ---------- Potensi Majegan ---------- */
  // Data ini sengaja berlabel contoh dan akan ditimpa ketika konten resmi
  // dimasukkan melalui panel admin. Jangan jalankan seed ulang di production.
  for (const p of kategoriPotensiDemo) {
    const kategori = await db.potensiKategori.upsert({
      where: { kode: p.kode },
      update: {
        label: p.label,
        judul: p.judul,
        pengantar: p.pengantar,
        deskripsi: p.deskripsi,
        gambarUrl: p.gambarUrl,
        urutan: p.urutan,
      },
      create: {
        kode: p.kode,
        label: p.label,
        judul: p.judul,
        pengantar: p.pengantar,
        deskripsi: p.deskripsi,
        gambarUrl: p.gambarUrl,
        urutan: p.urutan,
      },
      select: { id: true },
    });

    await db.potensiInfografis.deleteMany({ where: { kategoriId: kategori.id } });
    await db.potensiInfografis.createMany({
      data: p.infografis.map((s) => ({
        kategoriId: kategori.id,
        label: s.label,
        nilai: s.nilai,
        satuan: s.satuan,
        urutan: s.urutan,
      })),
    });

    for (const [urutan, item] of p.items.entries()) {
      const potensi = await db.potensi.upsert({
        where: { slug: slugkan(item.judul) },
        update: {
          kategoriId: kategori.id,
          judul: item.judul,
          ringkasan: item.ringkasan,
          deskripsi: item.deskripsi,
          gambarUrl: item.gambarUrl,
          subkategori: item.subkategori ?? null,
          produk: item.produk ?? null,
          lokasi: item.lokasi ?? null,
          kontak: item.kontak ?? null,
          status: "terbit",
          urutan,
        },
        create: {
          kategoriId: kategori.id,
          judul: item.judul,
          slug: slugkan(item.judul),
          ringkasan: item.ringkasan,
          deskripsi: item.deskripsi,
          gambarUrl: item.gambarUrl,
          subkategori: item.subkategori ?? null,
          produk: item.produk ?? null,
          lokasi: item.lokasi ?? null,
          kontak: item.kontak ?? null,
          status: "terbit",
          urutan,
        },
        select: { id: true },
      });

      await db.albumGaleri.updateMany({ where: { potensiId: potensi.id }, data: { potensiId: null } });
      if (item.albumSlug) {
        await db.albumGaleri.updateMany({
          where: { slug: item.albumSlug },
          data: { potensiId: potensi.id },
        });
      }
    }
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

  /* ---------- Statistik ---------- */
  // Tahun data ditulis tetap, bukan `new Date().getFullYear()`: kunci upsert
  // `[tahun, kategori, label]` harus stabil, kalau tidak pergantian tahun
  // diam-diam membuat satu set baris kembar.
  const tahun = 2026;
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
  // Seluruh data masih demo, jadi daftar diganti utuh agar seed tetap idempoten
  // meskipun pengaduan tidak memiliki kunci bisnis/nomor tiket lagi.
  await db.pengaduan.deleteMany();
  await db.pengaduan.createMany({
    data: [
      {
        namaPelapor: "Suryanto",
        kontak: "0812-2700-1121",
        kategori: "Infrastruktur",
        lokasi: "RT 03",
        isi: "Lampu jalan RT 03 mati sejak tiga hari lalu.",
        dibuatPada: new Date("2026-08-11T19:20:00+07:00"),
      },
      {
        namaPelapor: "Ngatinem",
        kontak: "0857-4412-8890",
        kategori: "Kebersihan",
        lokasi: "Jembatan sisi timur",
        isi: "Sampah menumpuk di tepi kali dekat jembatan dan mulai menimbulkan bau.",
        dibuatPada: new Date("2026-08-10T08:30:00+07:00"),
      },
      {
        namaPelapor: "Yuli Astuti",
        kontak: "yuli.astuti@gmail.com",
        kategori: "Layanan Publik",
        lokasi: "RT 05",
        isi: "Mohon jadwal posyandu diumumkan lebih awal agar warga dapat menyesuaikan waktu.",
        dibacaPada: new Date("2026-08-10T10:15:00+07:00"),
        dibuatPada: new Date("2026-08-09T15:10:00+07:00"),
      },
      {
        namaPelapor: "Purwadi",
        kontak: "0813-9087-2245",
        kategori: "Keamanan",
        lokasi: "RT 02",
        isi: "Pohon di tepi jalan miring dan rantingnya menjulur ke kabel listrik.",
        dibacaPada: new Date("2026-08-08T09:00:00+07:00"),
        dibuatPada: new Date("2026-08-07T20:40:00+07:00"),
      },
    ],
  });

  console.log(
    `Selesai: ${await db.berita.count()} berita, ${await db.albumGaleri.count()} album galeri, ` +
      `${await db.layanan.count()} layanan, ` +
      `${await db.pengaduan.count()} pengaduan, ${await db.pengguna.count()} pengguna.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
