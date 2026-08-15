"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { wajibSuperadmin } from "@/lib/sesi";
import { perBaris, slugkan, uraikanAlur } from "@/lib/teks";
import { unggahBerkas } from "@/lib/unggah";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

function segarkan(slug: string) {
  revalidatePath("/layanan");
  revalidatePath(`/layanan/${slug}`);
  revalidatePath("/admin/layanan");
}

/** Slug unik dari nama layanan: "slug", lalu "slug-2", "slug-3", … */
async function slugBaru(nama: string) {
  const dasar = slugkan(nama) || "layanan";
  const serupa = await db.layanan.findMany({
    where: { slug: { startsWith: dasar } },
    select: { slug: true },
  });

  const dipakai = new Set(serupa.map((s) => s.slug));
  if (!dipakai.has(dasar)) return dasar;

  for (let n = 2; ; n++) if (!dipakai.has(`${dasar}-${n}`)) return `${dasar}-${n}`;
}

/** ADM-3 — simpan layanan baru (`id` kosong) atau suntingan layanan yang ada. */
export async function simpanLayanan(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  const nama = teks(data, "nama");
  const deskripsi = teks(data, "deskripsi");
  const persyaratan = perBaris(teks(data, "persyaratan"));
  const alur = uraikanAlur(teks(data, "alur"));

  const angka = Number.parseInt(teks(data, "urutan"), 10);
  const urutan = Number.isFinite(angka) ? angka : 0;

  const kembaliKe = id ? `/admin/layanan/${id}` : "/admin/layanan/baru";
  if (!nama || !deskripsi || persyaratan.length === 0) redirect(`${kembaliKe}?galat=lengkapi`);

  const unggahan = await unggahBerkas(data, "templatBerkas", "layanan", "dokumen");
  if (unggahan.galat) redirect(`${kembaliKe}?galat=berkas`);

  const isi = {
    namaLayanan: nama,
    deskripsi,
    persyaratan,
    alur,
    estimasiWaktu: teks(data, "estimasiWaktu") || "± 1 hari kerja",
    biaya: teks(data, "biaya") || "GRATIS",
    fileTemplat: unggahan.url ?? (teks(data, "fileTemplat") || null),
    urutan,
  };

  let slug: string;
  if (id) {
    // Slug lama dipertahankan meski nama disunting — alasannya sama dengan
    // berita: tautan layanan sudah tersebar di grup WhatsApp warga.
    const baris = await db.layanan.update({ where: { id }, data: isi, select: { slug: true } });
    slug = baris.slug;
  } else {
    const baris = await db.layanan.create({
      data: { ...isi, slug: await slugBaru(nama) },
      select: { slug: true },
    });
    slug = baris.slug;
  }

  segarkan(slug);
  redirect(`/admin/layanan?tersimpan=${id ? "sunting" : "baru"}`);
}

export async function hapusLayanan(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  if (!id) redirect("/admin/layanan");

  const baris = await db.layanan.delete({ where: { id }, select: { slug: true } });

  segarkan(baris.slug);
  redirect("/admin/layanan?terhapus=1");
}
