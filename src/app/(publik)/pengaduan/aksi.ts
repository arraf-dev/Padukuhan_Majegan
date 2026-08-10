"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { periksaBerkas } from "@/lib/berkas";
import { db } from "@/lib/db";
import { NAMA_JEBAKAN, bolehKirim, buatKodeTiket, periksaPengaduan } from "@/lib/pengaduan";
import { unggahBerkas } from "@/lib/unggah";

// Penulisan ke DB ditaruh di sini, bukan di `lib/pengaduan.ts` — berkas itu
// harus tetap bebas impor Prisma supaya `npm test` (node --test) bisa
// menjalankannya langsung tanpa database.

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();
const atauNull = (nilai: string) => (nilai === "" ? null : nilai);

/** LPR-1 — dipasang langsung ke <form action={kirimPengaduan}>. */
export async function kirimPengaduan(data: FormData) {
  const galat = periksaPengaduan(data);
  if (galat) redirect(`/pengaduan?galat=${galat}`);

  // Bot yang mengisi kolom jebakan dibalas "berhasil" dengan kode palsu —
  // jangan simpan, dan jangan beri tahu botnya bahwa dia tertangkap.
  if (teks(data, NAMA_JEBAKAN)) redirect(`/pengaduan/terkirim?kode=${buatKodeTiket()}`);

  const lampiran = data.get("lampiranBerkas");
  if (lampiran instanceof File && lampiran.size > 0 && periksaBerkas(lampiran, "gambar")) {
    redirect("/pengaduan?galat=lampiran");
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
  if (!bolehKirim(ip)) redirect("/pengaduan?galat=jeda");

  const unggahan = await unggahBerkas(data, "lampiranBerkas", "pengaduan", "gambar");

  const anonim = data.get("anonim") !== null;

  let kode: string | null = null;
  for (let coba = 0; coba < 3 && kode === null; coba++) {
    const kodeTiket = buatKodeTiket();
    try {
      await db.pengaduan.create({
        data: {
          kodeTiket,
          kategori: teks(data, "kategori"),
          lokasi: atauNull(teks(data, "lokasi")),
          isi: teks(data, "isi"),
          lampiranUrl: unggahan.url,
          isAnonim: anonim,
          // Anonim = identitasnya tidak pernah masuk DB, bukan cuma disembunyikan
          // saat ditampilkan.
          namaPelapor: anonim ? null : atauNull(teks(data, "nama")),
          kontak: anonim ? null : atauNull(teks(data, "kontak")),
        },
      });
      kode = kodeTiket;
    } catch (e) {
      // P2002 = kode tiket kembar. Peluangnya kecil (32^4 kombinasi per bulan)
      // tapi bukan nol, dan warga tidak boleh kena galat karenanya.
      if ((e as { code?: string }).code !== "P2002") throw e;
    }
  }

  if (kode === null) throw new Error("Gagal membuat kode tiket unik setelah 3 percobaan");

  redirect(`/pengaduan/terkirim?kode=${kode}`);
}
