"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { kategoriGaleri, type KategoriGaleri } from "@/content/galeri";
import { periksaBerkas, periksaIsiGambar } from "@/lib/berkas";
import { hapusBerkasPublik, unggahBerkas } from "@/lib/unggah";
import { slugkan } from "@/lib/teks";
import { wajibMasuk } from "@/lib/sesi";

const MAKS_FOTO = 50;
const MAKS_JUDUL = 120;
const MAKS_DESKRIPSI = 2000;
const MAKS_ALT = 180;
const MAKS_CAPTION = 300;

type HasilGagal = { ok: false; galat: string };
type HasilFoto = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  urutan: number;
  width: number | null;
  height: number | null;
  size: number | null;
};

type HasilFotoBerhasil = { ok: true; foto: HasilFoto };
type HasilAlbumBerhasil = { ok: true; id: string; foto: HasilFoto };

type MetadataAlbum =
  | { ok: false; galat: string }
  | {
      ok: true;
      judul: string;
      kategori: KategoriGaleri;
      tanggal: Date;
      deskripsi: string | null;
      status: "draft" | "terbit";
    };

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

const kategoriSah = (nilai: string): KategoriGaleri | null =>
  kategoriGaleri.find((kategori) => kategori === nilai) ?? null;

function tanggalSah(nilai: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nilai)) return null;
  const [tahun, bulan, hari] = nilai.split("-").map(Number);
  const tanggal = new Date(Date.UTC(tahun, bulan - 1, hari));
  if (
    tanggal.getUTCFullYear() !== tahun ||
    tanggal.getUTCMonth() !== bulan - 1 ||
    tanggal.getUTCDate() !== hari
  ) {
    return null;
  }
  return tanggal;
}

function statusSah(nilai: string): "draft" | "terbit" | null {
  return nilai === "terbit" || nilai === "draft" ? nilai : null;
}

function metadata(data: FormData): MetadataAlbum {
  const judul = teks(data, "judul");
  const kategori = kategoriSah(teks(data, "kategori"));
  const tanggal = tanggalSah(teks(data, "tanggalKegiatan"));
  const deskripsi = teks(data, "deskripsi");
  const statusMentah = teks(data, "status");
  const status = statusMentah ? statusSah(statusMentah) : "draft";

  if (!judul || judul.length > MAKS_JUDUL) return { ok: false, galat: "Judul album wajib diisi dan maksimal 120 karakter." };
  if (!kategori) return { ok: false, galat: "Kategori album tidak valid." };
  if (!tanggal) return { ok: false, galat: "Tanggal kegiatan tidak valid." };
  if (!status) return { ok: false, galat: "Status album tidak valid." };
  if (deskripsi.length > MAKS_DESKRIPSI) return { ok: false, galat: "Deskripsi maksimal 2.000 karakter." };

  return { ok: true, judul, kategori, tanggal, deskripsi: deskripsi || null, status };
}

async function fotoSah(data: FormData, nama = "foto"): Promise<File | HasilGagal> {
  const file = data.get(nama);
  if (!(file instanceof File) || file.size === 0) return { ok: false, galat: "Minimal satu foto wajib dipilih." };

  const galat = periksaBerkas(file, "gambar");
  if (galat) return { ok: false, galat };

  const isiGalat = await periksaIsiGambar(file);
  if (isiGalat) return { ok: false, galat: isiGalat };

  return file;
}

function ekstensi(tipe: string): string {
  if (tipe === "image/png") return "png";
  if (tipe === "image/webp") return "webp";
  return "jpg";
}

async function unggahFoto(albumId: string, file: File): Promise<{ url: string } | HasilGagal> {
  const data = new FormData();
  data.set("foto", file);
  const hasil = await unggahBerkas(
    data,
    "foto",
    `galeri/${albumId}`,
    "gambar",
    "public",
    `${randomUUID()}.${ekstensi(file.type)}`,
  );
  return hasil.galat || !hasil.url
    ? { ok: false, galat: hasil.galat ?? "Unggah foto gagal." }
    : { url: hasil.url };
}

const unggahGagal = (hasil: { url: string } | HasilGagal): hasil is HasilGagal => "ok" in hasil;

function altBaku(judul: string, urutan: number, nilai: string): string {
  const alt = nilai.trim().slice(0, MAKS_ALT);
  return alt || `${judul} - foto kegiatan ${urutan + 1}`;
}

function captionBersih(nilai: string): string | null {
  const caption = nilai.trim().slice(0, MAKS_CAPTION);
  return caption || null;
}

function fotoHasil(foto: {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  urutan: number;
  width: number | null;
  height: number | null;
  size: number | null;
}): HasilFoto {
  return { ...foto, caption: foto.caption ?? "" };
}

async function slugBaru(judul: string): Promise<string> {
  const dasar = slugkan(judul) || "album-galeri";
  const serupa = await db.albumGaleri.findMany({
    where: { slug: { startsWith: dasar } },
    select: { slug: true },
  });
  const dipakai = new Set(serupa.map((album) => album.slug));
  if (!dipakai.has(dasar)) return dasar;
  for (let n = 2; ; n += 1) if (!dipakai.has(`${dasar}-${n}`)) return `${dasar}-${n}`;
}

function segarkan(slug?: string) {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/galeri");
  if (slug) revalidatePath(`/galeri/${slug}`);
}

/** Upload foto pertama sekaligus membuat album draft agar tidak ada album kosong. */
export async function buatAlbumDenganFoto(data: FormData): Promise<HasilAlbumBerhasil | HasilGagal> {
  await wajibMasuk();
  const isi = metadata(data);
  if (!isi.ok) return isi;

  const file = await fotoSah(data);
  if (!(file instanceof File)) return file;

  const album = await db.albumGaleri.create({
    data: {
      judul: isi.judul,
      slug: await slugBaru(isi.judul),
      deskripsi: isi.deskripsi,
      kategori: isi.kategori,
      tanggalKegiatan: isi.tanggal,
      status: "draft",
    },
    select: { id: true, slug: true, judul: true },
  });

  let url: string | null = null;
  try {
    const unggahan = await unggahFoto(album.id, file);
    if (unggahGagal(unggahan)) throw new Error(unggahan.galat);
    url = unggahan.url;

    const foto = await db.fotoGaleri.create({
      data: {
        albumId: album.id,
        url: unggahan.url,
        alt: altBaku(album.judul, 0, teks(data, "alt")),
        caption: captionBersih(teks(data, "caption")),
        urutan: 0,
        size: file.size,
      },
    });
    await db.albumGaleri.update({ where: { id: album.id }, data: { coverUrl: unggahan.url } });

    return { ok: true, id: album.id, foto: fotoHasil(foto) };
  } catch {
    if (url) await hapusBerkasPublik([url]);
    await db.albumGaleri.delete({ where: { id: album.id } }).catch(() => undefined);
    return { ok: false, galat: "Album belum dapat dibuat. Periksa konfigurasi Blob lalu coba lagi." };
  }
}

/** Upload satu foto tambahan. Dipanggil berulang dari uploader client agar request tetap kecil. */
export async function unggahFotoAlbum(data: FormData): Promise<HasilFotoBerhasil | HasilGagal> {
  await wajibMasuk();
  const albumId = teks(data, "albumId");
  if (!albumId) return { ok: false, galat: "Album tidak ditemukan." };

  const album = await db.albumGaleri.findUnique({
    where: { id: albumId },
    select: { id: true, judul: true, _count: { select: { foto: true } } },
  });
  if (!album) return { ok: false, galat: "Album tidak ditemukan." };
  if (album._count.foto >= MAKS_FOTO) return { ok: false, galat: `Satu album maksimal ${MAKS_FOTO} foto.` };

  const file = await fotoSah(data);
  if (!(file instanceof File)) return file;
  const unggahan = await unggahFoto(album.id, file);
  if (unggahGagal(unggahan)) return unggahan;

  const terakhir = await db.fotoGaleri.findFirst({
    where: { albumId: album.id },
    orderBy: { urutan: "desc" },
    select: { urutan: true },
  });
  const urutan = (terakhir?.urutan ?? -1) + 1;
  try {
    const foto = await db.fotoGaleri.create({
      data: {
        albumId: album.id,
        url: unggahan.url,
        alt: altBaku(album.judul, urutan, teks(data, "alt")),
        caption: captionBersih(teks(data, "caption")),
        urutan,
        size: file.size,
      },
    });
    return { ok: true, foto: fotoHasil(foto) };
  } catch {
    await hapusBerkasPublik([unggahan.url]);
    return { ok: false, galat: "Foto gagal disimpan. Tidak ada record foto yang dibuat." };
  }
}

type FotoMasuk = { id: string; urutan: number; alt?: string; caption?: string };

function bacaFoto(data: FormData): FotoMasuk[] | HasilGagal {
  let nilai: unknown;
  try {
    nilai = JSON.parse(teks(data, "fotoJson"));
  } catch {
    return { ok: false, galat: "Urutan foto tidak valid." };
  }
  if (!Array.isArray(nilai) || nilai.length === 0 || nilai.length > MAKS_FOTO) {
    return { ok: false, galat: `Album harus memiliki 1-${MAKS_FOTO} foto.` };
  }

  const hasil: FotoMasuk[] = [];
  const ids = new Set<string>();
  for (const item of nilai) {
    if (!item || typeof item !== "object") return { ok: false, galat: "Data foto tidak valid." };
    const foto = item as Partial<FotoMasuk>;
    if (typeof foto.id !== "string" || !foto.id || ids.has(foto.id)) return { ok: false, galat: "Daftar foto tidak valid." };
    if (typeof foto.urutan !== "number" || !Number.isInteger(foto.urutan) || foto.urutan < 0 || foto.urutan >= nilai.length) {
      return { ok: false, galat: "Urutan foto tidak valid." };
    }
    ids.add(foto.id);
    hasil.push({
      id: foto.id,
      urutan: foto.urutan,
      alt: typeof foto.alt === "string" ? foto.alt : "",
      caption: typeof foto.caption === "string" ? foto.caption : "",
    });
  }
  const urutan = new Set(hasil.map((foto) => foto.urutan));
  return urutan.size === hasil.length ? hasil : { ok: false, galat: "Urutan foto tidak valid." };
}

/** Menyimpan metadata, caption, cover, reorder, penghapusan foto, dan status album. */
export async function simpanAlbum(data: FormData): Promise<HasilGagal | never> {
  await wajibMasuk();
  const id = teks(data, "id");
  if (!id) return { ok: false, galat: "Album tidak ditemukan." };
  const isi = metadata(data);
  if (!isi.ok) return isi;
  const fotoMasuk = bacaFoto(data);
  if (!Array.isArray(fotoMasuk)) return fotoMasuk;

  const album = await db.albumGaleri.findUnique({
    where: { id },
    include: { foto: { select: { id: true, url: true } } },
  });
  if (!album) return { ok: false, galat: "Album tidak ditemukan." };

  const fotoIds = new Set(fotoMasuk.map((foto) => foto.id));
  const fotoLama = album.foto;
  if (fotoMasuk.some((foto) => !fotoLama.some((lama) => lama.id === foto.id))) {
    return { ok: false, galat: "Album memiliki foto yang tidak valid." };
  }
  const fotoTersisa = fotoLama.filter((foto) => fotoIds.has(foto.id));
  const coverId = teks(data, "coverId");
  const cover = fotoTersisa.find((foto) => foto.id === coverId) ?? fotoTersisa[0];
  if (!cover) return { ok: false, galat: "Minimal satu foto wajib dipertahankan." };

  const slug = album.slug;
  try {
    await db.$transaction(async (tx) => {
      await tx.fotoGaleri.deleteMany({
        where: { albumId: id, id: { notIn: [...fotoIds] } },
      });
      for (const foto of fotoMasuk) {
        await tx.fotoGaleri.update({
          where: { id: foto.id },
          data: {
            urutan: foto.urutan,
            alt: altBaku(isi.judul, foto.urutan, foto.alt ?? ""),
            caption: captionBersih(foto.caption ?? ""),
          },
        });
      }
      await tx.albumGaleri.update({
        where: { id },
        data: {
          judul: isi.judul,
          deskripsi: isi.deskripsi,
          kategori: isi.kategori,
          tanggalKegiatan: isi.tanggal,
          status: isi.status,
          coverUrl: cover.url,
        },
      });
    });
  } catch {
    return { ok: false, galat: "Perubahan album gagal disimpan. Coba lagi." };
  }

  const terhapus = fotoLama.filter((foto) => !fotoIds.has(foto.id)).map((foto) => foto.url);
  const blobBersih = await hapusBerkasPublik(terhapus);
  segarkan(slug);
  redirect(`/admin/galeri?tersimpan=${isi.status}${blobBersih ? "" : "&berkas=gagal"}`);
}

export async function ubahStatusAlbum(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  const status = statusSah(teks(data, "status"));
  if (!id || !status) redirect("/admin/galeri?galat=status");

  const album = await db.albumGaleri.findUnique({
    where: { id },
    select: { slug: true, _count: { select: { foto: true } } },
  });
  if (!album) redirect("/admin/galeri?galat=tidak-ditemukan");
  if (status === "terbit" && album._count.foto === 0) redirect("/admin/galeri?galat=foto");

  await db.albumGaleri.update({ where: { id }, data: { status } });
  segarkan(album.slug);
  redirect(`/admin/galeri?tersimpan=${status}`);
}

export async function hapusAlbum(data: FormData) {
  await wajibMasuk();
  const id = teks(data, "id");
  if (!id) redirect("/admin/galeri");

  const album = await db.albumGaleri.findUnique({
    where: { id },
    select: { slug: true, foto: { select: { url: true } } },
  });
  if (!album) redirect("/admin/galeri?galat=tidak-ditemukan");

  await db.albumGaleri.delete({ where: { id } });
  const blobBersih = await hapusBerkasPublik(album.foto.map((foto) => foto.url));
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/galeri");
  redirect(`/admin/galeri?terhapus=1${blobBersih ? "" : "&berkas=gagal"}`);
}
