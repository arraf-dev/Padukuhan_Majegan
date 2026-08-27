"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ambilTeks as teks, PANJANG, sahPanjang } from "@/lib/form";
import { wajibSuperadmin } from "@/lib/sesi";
import { TAHUN_DATA } from "@/lib/statistik";

const angka = (fd: FormData, nama: string, baku = 0) => {
  const n = Number.parseInt(teks(fd, nama), 10);
  return Number.isFinite(n) ? n : baku;
};

const TAHUN_MIN = 1970;
const TAHUN_MAKS = 2100;
const NILAI_MAKS = 100_000_000;

function segarkan() {
  revalidatePath("/");
  revalidatePath("/statistik");
  revalidatePath("/admin/statistik");
}

/**
 * ADM-7 — simpan satu baris statistik.
 *
 * `@@unique([tahun, kategori, label])` sudah ada di skema, jadi `upsert` cukup —
 * tidak perlu cek-lalu-buat yang bisa balapan.
 */
export async function simpanStatistik(data: FormData) {
  await wajibSuperadmin();

  const tahun = angka(data, "tahun", TAHUN_DATA);
  const kandidat = teks(data, "kategori");
  const kategori = ["ringkasan", "usia", "jenis_kelamin", "pekerjaan", "pendidikan"].includes(kandidat)
    ? (kandidat as "ringkasan" | "usia" | "jenis_kelamin" | "pekerjaan" | "pendidikan")
    : "ringkasan";
  const label = teks(data, "label");
  const nilai = angka(data, "nilai");
  const urutan = Math.max(0, angka(data, "urutan"));

  const kembali = `/admin/statistik?tahun=${tahun}`;
  if (!label) redirect(`${kembali}&galat=label`);
  if (!sahPanjang(label, PANJANG.label)) redirect(`${kembali}&galat=panjang`);
  if (tahun < TAHUN_MIN || tahun > TAHUN_MAKS) redirect(`${kembali}&galat=tahun`);

  // Persentase kelompok usia menentukan tinggi batang grafik; di luar 0–100
  // batangnya melampaui kotaknya atau hilang sama sekali.
  if (kategori === "usia" && (nilai < 0 || nilai > 100)) redirect(`${kembali}&galat=persen`);
  if (nilai < 0) redirect(`${kembali}&galat=negatif`);
  if (nilai > NILAI_MAKS) redirect(`${kembali}&galat=nilai`);

  await db.statistikPenduduk.upsert({
    where: { tahun_kategori_label: { tahun, kategori, label } },
    update: { nilai, urutan },
    create: { tahun, kategori, label, nilai, urutan },
  });

  segarkan();
  redirect(`${kembali}&tersimpan=1`);
}

export async function hapusStatistik(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  const tahun = angka(data, "tahun", TAHUN_DATA);
  if (!id) redirect(`/admin/statistik?tahun=${tahun}`);

  await db.statistikPenduduk.delete({ where: { id } });

  segarkan();
  redirect(`/admin/statistik?tahun=${tahun}&terhapus=1`);
}
