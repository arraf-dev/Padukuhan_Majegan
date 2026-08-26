"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { kodePotensiSah, statusPotensiSah } from "@/lib/potensi";
import { hapusBerkasPublik, unggahBerkas } from "@/lib/unggah";
import { slugkan } from "@/lib/teks";
import { wajibMasuk } from "@/lib/sesi";

const teks = (data: FormData, nama: string) => String(data.get(nama) ?? "").trim();

function angka(data: FormData, nama: string, baku = 0) {
  const nilai = Number.parseInt(teks(data, nama), 10);
  return Number.isFinite(nilai) ? nilai : baku;
}

function segarkan(id?: string) {
  revalidatePath("/");
  revalidatePath("/potensi");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/potensi");
  if (id) revalidatePath(`/admin/potensi/${id}`);
}

async function slugBaru(judul: string) {
  const dasar = slugkan(judul) || "potensi";
  const serupa = await db.potensi.findMany({
    where: { slug: { startsWith: dasar } },
    select: { slug: true },
  });
  const dipakai = new Set(serupa.map((item) => item.slug));
  if (!dipakai.has(dasar)) return dasar;
  for (let n = 2; ; n += 1) if (!dipakai.has(`${dasar}-${n}`)) return `${dasar}-${n}`;
}

function validasiTeks(data: FormData) {
  const judul = teks(data, "judul");
  const ringkasan = teks(data, "ringkasan");
  const deskripsi = teks(data, "deskripsi");
  const status = statusPotensiSah(teks(data, "status"));

  if (!judul || judul.length > 120) return { galat: "Judul wajib diisi dan maksimal 120 karakter." } as const;
  if (!ringkasan || ringkasan.length > 320) return { galat: "Ringkasan wajib diisi dan maksimal 320 karakter." } as const;
  if (!deskripsi || deskripsi.length > 3000) return { galat: "Deskripsi wajib diisi dan maksimal 3.000 karakter." } as const;
  if (!status) return { galat: "Status Potensi tidak valid." } as const;

  return {
    judul,
    ringkasan,
    deskripsi,
    subkategori: teks(data, "subkategori") || null,
    produk: teks(data, "produk") || null,
    lokasi: teks(data, "lokasi") || null,
    kontak: teks(data, "kontak") || null,
    status,
    urutan: Math.max(0, angka(data, "urutan")),
  } as const;
}

export async function simpanPotensi(data: FormData) {
  await wajibMasuk();

  const id = teks(data, "id");
  const kategoriId = teks(data, "kategoriId");
  const isi = validasiTeks(data);
  const kembali = id ? `/admin/potensi/${id}` : "/admin/potensi/baru";

  if (!kategoriId) redirect(`${kembali}?galat=kategori`);
  if ("galat" in isi) redirect(`${kembali}?galat=isi`);

  const kategori = await db.potensiKategori.findUnique({ where: { id: kategoriId }, select: { kode: true } });
  if (!kategori || !kodePotensiSah(kategori.kode)) redirect(`${kembali}?galat=kategori`);

  const albumId = teks(data, "albumId") || null;
  if (albumId) {
    const album = await db.albumGaleri.findUnique({ where: { id: albumId }, select: { potensiId: true } });
    if (!album || (album.potensiId && album.potensiId !== id)) redirect(`${kembali}?galat=album`);
  }

  const unggahan = await unggahBerkas(data, "gambarBerkas", "potensi", "gambar");
  if (unggahan.galat) redirect(`${kembali}?galat=berkas`);
  const gambarUrl = unggahan.url ?? (teks(data, "gambarUrl") || null);

  let potensiId = id;
  let slug = "";

  if (id) {
    const lama = await db.potensi.findUnique({ where: { id }, select: { slug: true, gambarUrl: true } });
    if (!lama) redirect("/admin/potensi?galat=tidak-ditemukan");
    slug = lama.slug;
    await db.potensi.update({
      where: { id },
      data: { ...isi, kategoriId, gambarUrl: gambarUrl ?? lama.gambarUrl },
    });
  } else {
    const baru = await db.potensi.create({
      data: { ...isi, kategoriId, gambarUrl, slug: await slugBaru(isi.judul) },
      select: { id: true, slug: true },
    });
    potensiId = baru.id;
    slug = baru.slug;
  }

  await db.$transaction(async (tx) => {
    await tx.albumGaleri.updateMany({ where: { potensiId }, data: { potensiId: null } });
    if (albumId) await tx.albumGaleri.update({ where: { id: albumId }, data: { potensiId } });
  });

  segarkan(potensiId);
  redirect(`/admin/potensi?tersimpan=${isi.status}`);
}

export async function ubahStatusPotensi(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  const status = statusPotensiSah(teks(data, "status"));
  if (!id || !status) redirect("/admin/potensi?galat=status");

  const item = await db.potensi.findUnique({ where: { id }, select: { slug: true } });
  if (!item) redirect("/admin/potensi?galat=tidak-ditemukan");
  await db.potensi.update({ where: { id }, data: { status } });
  segarkan(id);
  redirect(`/admin/potensi?tersimpan=${status}`);
}

export async function hapusPotensi(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  if (!id) redirect("/admin/potensi");

  const item = await db.potensi.findUnique({ where: { id }, select: { gambarUrl: true } });
  if (!item) redirect("/admin/potensi?galat=tidak-ditemukan");
  await db.potensi.delete({ where: { id } });
  const blobBersih = item.gambarUrl ? await hapusBerkasPublik([item.gambarUrl]) : true;
  segarkan();
  redirect(`/admin/potensi?terhapus=1${blobBersih ? "" : "&berkas=gagal"}`);
}

export async function simpanKategoriPotensi(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  const judul = teks(data, "judul");
  const pengantar = teks(data, "pengantar");
  const deskripsi = teks(data, "deskripsi");
  if (!id || !judul || !pengantar || !deskripsi) redirect("/admin/potensi?galat=kategori-isi");

  const unggahan = await unggahBerkas(data, "gambarKategoriBerkas", "potensi/kategori", "gambar");
  if (unggahan.galat) redirect("/admin/potensi?galat=berkas");

  const lama = await db.potensiKategori.findUnique({ where: { id }, select: { gambarUrl: true } });
  if (!lama) redirect("/admin/potensi?galat=tidak-ditemukan");
  await db.potensiKategori.update({
    where: { id },
    data: {
      judul,
      pengantar,
      deskripsi,
      gambarUrl: unggahan.url ?? (teks(data, "gambarUrl") || lama.gambarUrl),
    },
  });
  segarkan();
  redirect("/admin/potensi?tersimpan=kategori");
}

export async function simpanInfografis(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  const kategoriId = teks(data, "kategoriId");
  const label = teks(data, "label");
  const nilai = angka(data, "nilai", -1);
  if (!kategoriId || !label || nilai < 0) redirect("/admin/potensi?galat=infografis");

  const isi = { label, nilai, satuan: teks(data, "satuan") || null, urutan: Math.max(0, angka(data, "urutan")) };
  if (id) {
    await db.potensiInfografis.update({ where: { id }, data: isi });
  } else {
    await db.potensiInfografis.upsert({
      where: { kategoriId_label: { kategoriId, label } },
      update: isi,
      create: { ...isi, kategoriId },
    });
  }
  segarkan();
  redirect("/admin/potensi?tersimpan=infografis");
}

export async function hapusInfografis(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  if (!id) redirect("/admin/potensi");
  await db.potensiInfografis.delete({ where: { id } });
  segarkan();
  redirect("/admin/potensi?terhapus=infografis");
}
