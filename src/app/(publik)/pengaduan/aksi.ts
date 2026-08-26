"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { periksaBerkas } from "@/lib/berkas";
import { db } from "@/lib/db";
import { NAMA_JEBAKAN, bolehKirim, periksaPengaduan } from "@/lib/pengaduan";
import { hapusBerkasPrivat, unggahBerkas } from "@/lib/unggah";

// Penulisan ke DB ditaruh di sini, bukan di `lib/pengaduan.ts` — berkas itu
// harus tetap bebas impor Prisma supaya `npm test` (node --test) bisa
// menjalankannya langsung tanpa database.

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();
const atauNull = (nilai: string) => (nilai === "" ? null : nilai);

/** LPR-1 — dipasang langsung ke <form action={kirimPengaduan}>. */
export async function kirimPengaduan(data: FormData) {
  const galat = periksaPengaduan(data);
  if (galat) redirect(`/pengaduan?galat=${galat}`);

  // Bot yang mengisi kolom jebakan dibalas "berhasil" — jangan simpan, dan
  // jangan beri tahu botnya bahwa dia tertangkap.
  if (teks(data, NAMA_JEBAKAN)) redirect("/pengaduan/terkirim");

  const lampiran = data.get("lampiranBerkas");
  if (lampiran instanceof File && lampiran.size > 0 && periksaBerkas(lampiran, "gambar")) {
    redirect("/pengaduan?galat=lampiran");
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
  if (!bolehKirim(ip)) redirect("/pengaduan?galat=jeda");

  // Lampiran dapat memuat foto rumah, lokasi, atau warga. Simpan privat dan
  // sajikan hanya lewat route panel admin yang memeriksa sesi.
  const unggahan = await unggahBerkas(data, "lampiranBerkas", "pengaduan", "gambar", "private");
  if (unggahan.galat) redirect("/pengaduan?galat=penyimpanan");

  try {
    await db.pengaduan.create({
      data: {
        kategori: teks(data, "kategori"),
        lokasi: atauNull(teks(data, "lokasi")),
        isi: teks(data, "isi"),
        lampiranUrl: unggahan.url,
        namaPelapor: teks(data, "nama"),
        kontak: teks(data, "kontak"),
      },
    });
  } catch {
    // Objek sudah terlanjur terunggah ke R2; bersihkan agar tidak jadi orphan.
    if (unggahan.url) await hapusBerkasPrivat(unggahan.url);
    redirect("/pengaduan?galat=gagal");
  }

  redirect("/pengaduan/terkirim");
}
