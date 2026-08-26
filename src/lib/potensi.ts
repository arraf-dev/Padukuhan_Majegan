import { Prisma } from "@prisma/client";
import type { KodePotensi } from "@/content/potensi";
import { db } from "@/lib/db";

export const KODE_POTENSI = ["pariwisata", "umkm", "budaya"] as const;
export type StatusPotensi = "draft" | "terbit";

export type PotensiFoto = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  urutan: number;
};

export type PotensiAlbum = {
  id: string;
  slug: string;
  judul: string;
  foto: PotensiFoto[];
};

export type PotensiItem = {
  id: string;
  kategoriId: string;
  judul: string;
  slug: string;
  ringkasan: string;
  deskripsi: string;
  gambarUrl: string | null;
  subkategori: string | null;
  produk: string | null;
  lokasi: string | null;
  kontak: string | null;
  status: StatusPotensi;
  urutan: number;
  albumId: string | null;
  album: PotensiAlbum | null;
};

export type PotensiStatistik = {
  id: string;
  label: string;
  nilai: number;
  satuan: string | null;
  urutan: number;
};

export type PotensiKategori = {
  id: string;
  kode: KodePotensi;
  label: string;
  judul: string;
  pengantar: string;
  deskripsi: string;
  gambarUrl: string | null;
  urutan: number;
  potensi: PotensiItem[];
  infografis: PotensiStatistik[];
};

const pilihFoto = {
  id: true,
  url: true,
  alt: true,
  caption: true,
  urutan: true,
} satisfies Prisma.FotoGaleriSelect;

const pilihAlbum = {
  id: true,
  slug: true,
  judul: true,
  status: true,
  foto: { orderBy: { urutan: "asc" }, select: pilihFoto },
} satisfies Prisma.AlbumGaleriSelect;

const pilihItem = {
  id: true,
  kategoriId: true,
  judul: true,
  slug: true,
  ringkasan: true,
  deskripsi: true,
  gambarUrl: true,
  subkategori: true,
  produk: true,
  lokasi: true,
  kontak: true,
  status: true,
  urutan: true,
  album: { select: pilihAlbum },
} satisfies Prisma.PotensiSelect;

const pilihKategori = {
  id: true,
  kode: true,
  label: true,
  judul: true,
  pengantar: true,
  deskripsi: true,
  gambarUrl: true,
  urutan: true,
  potensi: {
    where: { status: "terbit" },
    orderBy: [{ urutan: "asc" }, { dibuatPada: "desc" }],
    select: pilihItem,
  },
  infografis: {
    orderBy: [{ urutan: "asc" }, { label: "asc" }],
    select: { id: true, label: true, nilai: true, satuan: true, urutan: true },
  },
} satisfies Prisma.PotensiKategoriSelect;

const pilihKategoriAdmin = {
  ...pilihKategori,
  potensi: {
    orderBy: [{ urutan: "asc" }, { dibuatPada: "desc" }],
    select: pilihItem,
  },
} satisfies Prisma.PotensiKategoriSelect;

type BarisFoto = { id: string; url: string; alt: string; caption: string | null; urutan: number };
type BarisAlbum = { id: string; slug: string; judul: string; status: string; foto: BarisFoto[] } | null;
type BarisItem = Prisma.PotensiGetPayload<{ select: typeof pilihItem }>;
type BarisKategori = Prisma.PotensiKategoriGetPayload<{ select: typeof pilihKategori }>;
type BarisKategoriAdmin = Prisma.PotensiKategoriGetPayload<{ select: typeof pilihKategoriAdmin }>;

export const kodePotensiSah = (nilai: string | undefined): KodePotensi | null =>
  KODE_POTENSI.find((kode) => kode === nilai) ?? null;

export const statusPotensiSah = (nilai: string | undefined): StatusPotensi | null =>
  nilai === "draft" || nilai === "terbit" ? nilai : null;

const keAlbum = (album: BarisAlbum): PotensiAlbum | null => {
  if (!album || album.status !== "terbit") return null;
  return {
    id: album.id,
    slug: album.slug,
    judul: album.judul,
    foto: album.foto.map((foto) => ({
      id: foto.id,
      url: foto.url,
      alt: foto.alt,
      caption: foto.caption ?? "",
      urutan: foto.urutan,
    })),
  };
};

const keItem = (item: BarisItem): PotensiItem => ({
  id: item.id,
  kategoriId: item.kategoriId,
  judul: item.judul,
  slug: item.slug,
  ringkasan: item.ringkasan,
  deskripsi: item.deskripsi,
  gambarUrl: item.gambarUrl,
  subkategori: item.subkategori,
  produk: item.produk,
  lokasi: item.lokasi,
  kontak: item.kontak,
  status: item.status,
  urutan: item.urutan,
  albumId: item.album?.id ?? null,
  album: keAlbum(item.album),
});

const keKategori = (kategori: BarisKategori | BarisKategoriAdmin): PotensiKategori => ({
  id: kategori.id,
  kode: kategori.kode,
  label: kategori.label,
  judul: kategori.judul,
  pengantar: kategori.pengantar,
  deskripsi: kategori.deskripsi,
  gambarUrl: kategori.gambarUrl,
  urutan: kategori.urutan,
  potensi: kategori.potensi.map(keItem),
  infografis: kategori.infografis,
});

export async function getPublishedPotensi(): Promise<PotensiKategori[]> {
  const kategori = await db.potensiKategori.findMany({
    orderBy: { urutan: "asc" },
    select: pilihKategori,
  });
  return kategori.map(keKategori);
}

export async function getAdminPotensi(): Promise<PotensiKategori[]> {
  const kategori = await db.potensiKategori.findMany({
    orderBy: { urutan: "asc" },
    select: pilihKategoriAdmin,
  });
  return kategori.map(keKategori);
}

export async function getPotensiById(id: string): Promise<PotensiItem | null> {
  const item = await db.potensi.findUnique({ where: { id }, select: pilihItem });
  return item ? keItem(item) : null;
}

export async function getPotensiCategories() {
  return db.potensiKategori.findMany({
    orderBy: { urutan: "asc" },
    select: { id: true, kode: true, label: true },
  });
}

export async function getPotensiAlbumOptions(potensiId?: string) {
  return db.albumGaleri.findMany({
    where: { OR: [{ potensiId: null }, ...(potensiId ? [{ potensiId }] : [])] },
    orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
    select: { id: true, judul: true, status: true, potensiId: true, _count: { select: { foto: true } } },
  });
}

export async function getPotensiCategoryById(id: string) {
  return db.potensiKategori.findUnique({
    where: { id },
    select: { id: true, kode: true, label: true, judul: true, pengantar: true, deskripsi: true, gambarUrl: true },
  });
}
