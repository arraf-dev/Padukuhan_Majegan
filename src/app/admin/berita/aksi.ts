"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kategoriBerita } from "@/content/majegan";
import { db } from "@/lib/db";
import { ringkasDari, slugkan } from "@/lib/teks";
import { wajibMasuk } from "@/lib/sesi";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

/** Halaman publik yang ikut berubah tiap berita disimpan atau dihapus. */
function segarkan(slug: string) {
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath(`/berita/${slug}`);
  revalidatePath("/admin/berita");
}

/** Slug unik dari judul: "judul", lalu "judul-2", "judul-3", … */
async function slugBaru(judul: string) {
  const dasar = slugkan(judul) || "berita";
  const serupa = await db.berita.findMany({
    where: { slug: { startsWith: dasar } },
    select: { slug: true },
  });

  const dipakai = new Set(serupa.map((s) => s.slug));
  if (!dipakai.has(dasar)) return dasar;

  for (let n = 2; ; n++) if (!dipakai.has(`${dasar}-${n}`)) return `${dasar}-${n}`;
}

/**
 * ADM-1 — simpan berita baru atau suntingan berita yang sudah ada.
 * Dipasang ke `<form action={simpanBerita}>` di komposer; `id` & `status` ikut
 * lewat FormData, jadi satu action melayani Tayangkan maupun Simpan Draf.
 */
export async function simpanBerita(data: FormData) {
  const { id: penulisId } = await wajibMasuk();

  const id = teks(data, "id");
  const judul = teks(data, "judul");
  const konten = teks(data, "konten");
  const namaKategori = kategoriBerita.find((k) => k === teks(data, "kategori"));
  // `as const` supaya tipenya tetap literal enum Prisma, bukan melebar ke string.
  const status = teks(data, "status") === "terbit" ? ("terbit" as const) : ("draft" as const);

  const kembaliKe = id ? `/admin/berita/${id}` : "/admin/berita/baru";
  if (!judul || !konten || !namaKategori) redirect(`${kembaliKe}?galat=lengkapi`);

  const kategori = await db.kategoriBerita.upsert({
    where: { slug: slugkan(namaKategori) },
    update: {},
    create: { nama: namaKategori, slug: slugkan(namaKategori) },
  });

  const isi = {
    judul,
    konten,
    ringkasan: ringkasDari(konten),
    lokasi: teks(data, "lokasi") || null,
    gambarSampul: teks(data, "gambarSampul") || null,
    status,
    kategoriId: kategori.id,
  };

  let slug: string;
  if (id) {
    // Slug lama dipertahankan meski judul disunting — tautan yang sudah
    // tersebar di WhatsApp warga tidak boleh mati karena perbaikan typo.
    const lama = await db.berita.findUnique({ where: { id }, select: { terbitPada: true } });
    const baris = await db.berita.update({
      where: { id },
      data: {
        ...isi,
        terbitPada: status === "terbit" ? (lama?.terbitPada ?? new Date()) : null,
      },
      select: { slug: true },
    });
    slug = baris.slug;
  } else {
    const baris = await db.berita.create({
      data: {
        ...isi,
        slug: await slugBaru(judul),
        terbitPada: status === "terbit" ? new Date() : null,
        penulisId,
      },
      select: { slug: true },
    });
    slug = baris.slug;
  }

  segarkan(slug);
  redirect(`/admin/berita?tersimpan=${status}`);
}

export async function hapusBerita(data: FormData) {
  await wajibMasuk();

  const id = teks(data, "id");
  if (!id) redirect("/admin/berita");

  const baris = await db.berita.delete({ where: { id }, select: { slug: true } });

  segarkan(baris.slug);
  redirect("/admin/berita?terhapus=1");
}
