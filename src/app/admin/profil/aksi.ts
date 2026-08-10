"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { wajibSuperadmin } from "@/lib/sesi";
import { unggahBerkas } from "@/lib/unggah";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

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

  if (!slug || !judul || !konten) redirect("/admin/profil?galat=naskah");

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

  const unggahan = await unggahBerkas(data, "fotoBerkas", "perangkat", "gambar");
  if (unggahan.galat) redirect("/admin/profil?galat=berkas");
  const fotoUrl = unggahan.url ?? (teks(data, "fotoUrl") || null);

  // Isian angka bisa dikosongkan atau diisi huruf; jangan biarkan NaN masuk DB.
  const angka = Number.parseInt(teks(data, "urutan"), 10);
  const urutan = Number.isFinite(angka) ? angka : 0;

  const isi = { nama, jabatan, fotoUrl, urutan };
  if (id) await db.perangkatDesa.update({ where: { id }, data: isi });
  else await db.perangkatDesa.create({ data: isi });

  segarkan();
  redirect(`/admin/profil?tersimpan=${id ? "perangkat" : "perangkat-baru"}`);
}

export async function hapusPerangkat(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  if (!id) redirect("/admin/profil");

  await db.perangkatDesa.delete({ where: { id } });

  segarkan();
  redirect("/admin/profil?terhapus=1");
}
