"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ambilTeks as teks, PANJANG, sahPanjang } from "@/lib/form";
import { wajibSuperadmin } from "@/lib/sesi";
import { hapusBerkasPublik, unggahBerkas } from "@/lib/unggah";

/** Naskah yang diizinkan dibuat/disunting dari panel — tolak hal lain. */
const NASKAH_SLUG = ["sejarah", "visi-misi"] as const;

/** Halaman publik yang ikut berubah tiap profil disimpan. */
function segarkan() {
  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/admin/profil");
}

/**
 * ADM-2 — simpan naskah profil (`sejarah`, `visi-misi`).
 *
 * `upsert` by slug, bukan update by id: baris yang belum pernah di-seed tetap
 * bisa dibuat dari panel tanpa langkah tambahan.
 */
export async function simpanNaskah(data: FormData) {
  await wajibSuperadmin();

  const slug = teks(data, "slug");
  const judul = teks(data, "judul");
  const konten = teks(data, "konten");
  const draft = data.get("draft") === "on";

  if (!NASKAH_SLUG.includes(slug as (typeof NASKAH_SLUG)[number])) redirect("/admin/profil?galat=slug");
  if (!judul || !konten) redirect("/admin/profil?galat=naskah");
  if (!sahPanjang(judul, PANJANG.judul) || !sahPanjang(konten, PANJANG.naskah)) {
    redirect("/admin/profil?galat=panjang");
  }

  await db.halamanProfil.upsert({
    where: { slug },
    update: { judul, konten, draft },
    create: { slug, judul, konten, draft },
  });

  segarkan();
  redirect("/admin/profil?tersimpan=naskah");
}

/** ADM-2 — tambah perangkat baru (`id` kosong) atau sunting yang sudah ada. */
export async function simpanPerangkat(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  const nama = teks(data, "nama");
  const jabatan = teks(data, "jabatan");

  if (!nama || !jabatan) redirect("/admin/profil?galat=perangkat");
  if (!sahPanjang(nama, PANJANG.nama) || !sahPanjang(jabatan, PANJANG.jabatan)) {
    redirect("/admin/profil?galat=panjang");
  }

  const unggahan = await unggahBerkas(data, "fotoBerkas", "perangkat", "gambar");
  if (unggahan.galat) redirect("/admin/profil?galat=berkas");
  const fotoUrl = unggahan.url ?? (teks(data, "fotoUrl") || null);

  // Isian angka bisa dikosongkan atau diisi huruf; jangan biarkan NaN masuk DB.
  const angka = Number.parseInt(teks(data, "urutan"), 10);
  const urutan = Number.isFinite(angka) ? Math.max(0, angka) : 0;

  const isi = { nama, jabatan, fotoUrl, urutan };
  if (id) {
    const ada = await db.perangkatDesa.findUnique({ where: { id }, select: { id: true } });
    if (!ada) redirect("/admin/profil?galat=tidak-ditemukan");
    await db.perangkatDesa.update({ where: { id }, data: isi });
  } else await db.perangkatDesa.create({ data: isi });

  segarkan();
  redirect(`/admin/profil?tersimpan=${id ? "perangkat" : "perangkat-baru"}`);
}

export async function hapusPerangkat(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  if (!id) redirect("/admin/profil");

  const baris = await db.perangkatDesa.findUnique({ where: { id }, select: { fotoUrl: true } });
  if (!baris) redirect("/admin/profil?galat=tidak-ditemukan");
  await db.perangkatDesa.delete({ where: { id } });
  const fotoBersih = baris.fotoUrl ? await hapusBerkasPublik([baris.fotoUrl]) : true;

  segarkan();
  redirect(`/admin/profil?terhapus=1${fotoBersih ? "" : "&berkas=gagal"}`);
}
