import { Prisma } from "@prisma/client";
import {
  kategoriGaleri,
  type AlbumGaleri,
  type KategoriGaleri,
  type FotoGaleri,
} from "@/content/galeri";
import { db } from "@/lib/db";

export type AlbumGaleriRingkas = Omit<AlbumGaleri, "foto"> & { jumlahFoto: number };

export type FilterGaleri = {
  kategori?: KategoriGaleri;
  tahun?: number;
  halaman?: number;
  perHalaman?: number;
};

const pilihFoto = {
  id: true,
  url: true,
  alt: true,
  caption: true,
  urutan: true,
  width: true,
  height: true,
  size: true,
} satisfies Prisma.FotoGaleriSelect;

const pilihRingkas = {
  id: true,
  judul: true,
  slug: true,
  deskripsi: true,
  kategori: true,
  coverUrl: true,
  tanggalKegiatan: true,
  status: true,
  dibuatPada: true,
  diperbaruiPada: true,
  _count: { select: { foto: true } },
} satisfies Prisma.AlbumGaleriSelect;

const pilihDetail = {
  id: true,
  judul: true,
  slug: true,
  deskripsi: true,
  kategori: true,
  coverUrl: true,
  tanggalKegiatan: true,
  status: true,
  dibuatPada: true,
  diperbaruiPada: true,
  foto: { orderBy: { urutan: "asc" }, select: pilihFoto },
} satisfies Prisma.AlbumGaleriSelect;

type BarisRingkas = Prisma.AlbumGaleriGetPayload<{ select: typeof pilihRingkas }>;
type BarisDetail = Prisma.AlbumGaleriGetPayload<{ select: typeof pilihDetail }>;

const kategoriSah = (nilai: string | undefined): KategoriGaleri | undefined =>
  kategoriGaleri.find((kategori) => kategori === nilai);

const tahunWhere = (tahun: number): Prisma.DateTimeFilter => ({
  gte: new Date(Date.UTC(tahun, 0, 1)),
  lt: new Date(Date.UTC(tahun + 1, 0, 1)),
});

const keRingkas = (album: BarisRingkas): AlbumGaleriRingkas => ({
  id: album.id,
  judul: album.judul,
  slug: album.slug,
  deskripsi: album.deskripsi ?? "",
  kategori: album.kategori as KategoriGaleri,
  coverUrl: album.coverUrl,
  tanggalKegiatan: album.tanggalKegiatan.toISOString(),
  status: album.status,
  dibuatPada: album.dibuatPada.toISOString(),
  diperbaruiPada: album.diperbaruiPada.toISOString(),
  jumlahFoto: album._count.foto,
});

const keFoto = (foto: BarisDetail["foto"][number]): FotoGaleri => ({
  id: foto.id,
  url: foto.url,
  alt: foto.alt,
  caption: foto.caption ?? "",
  urutan: foto.urutan,
  width: foto.width,
  height: foto.height,
  size: foto.size,
});

const keDetail = (album: BarisDetail): AlbumGaleri => ({
  id: album.id,
  judul: album.judul,
  slug: album.slug,
  deskripsi: album.deskripsi ?? "",
  kategori: album.kategori as KategoriGaleri,
  coverUrl: album.coverUrl,
  tanggalKegiatan: album.tanggalKegiatan.toISOString(),
  status: album.status,
  dibuatPada: album.dibuatPada.toISOString(),
  diperbaruiPada: album.diperbaruiPada.toISOString(),
  foto: album.foto.map(keFoto),
});

const wherePublik = (filter: FilterGaleri): Prisma.AlbumGaleriWhereInput => ({
  status: "terbit",
  ...(kategoriSah(filter.kategori) ? { kategori: kategoriSah(filter.kategori) } : {}),
  ...(filter.tahun ? { tanggalKegiatan: tahunWhere(filter.tahun) } : {}),
});

export async function getPublishedAlbums(filter: FilterGaleri = {}) {
  const perHalaman = Math.min(Math.max(filter.perHalaman ?? 9, 1), 50);
  const halamanDiminta = Math.max(filter.halaman ?? 1, 1);
  const where = wherePublik(filter);
  const [total, baris] = await Promise.all([
    db.albumGaleri.count({ where }),
    db.albumGaleri.findMany({
      where,
      orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
      skip: (halamanDiminta - 1) * perHalaman,
      take: perHalaman,
      select: pilihRingkas,
    }),
  ]);

  const jumlahHalaman = Math.max(1, Math.ceil(total / perHalaman));
  const halaman = Math.min(halamanDiminta, jumlahHalaman);

  // Query diulang hanya bila nomor halaman di luar rentang, supaya URL seperti
  // `?hal=999` menampilkan halaman terakhir, sama dengan pola Berita existing.
  if (halaman !== halamanDiminta && total > 0) {
    const terakhir = await db.albumGaleri.findMany({
      where,
      orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
      skip: (jumlahHalaman - 1) * perHalaman,
      take: perHalaman,
      select: pilihRingkas,
    });
    return { albums: terakhir.map(keRingkas), total, halaman, jumlahHalaman };
  }

  return { albums: baris.map(keRingkas), total, halaman, jumlahHalaman };
}

export async function getLatestAlbums(batas = 4): Promise<AlbumGaleriRingkas[]> {
  const baris = await db.albumGaleri.findMany({
    where: { status: "terbit" },
    orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
    take: Math.min(Math.max(batas, 1), 6),
    select: pilihRingkas,
  });
  return baris.map(keRingkas);
}

export async function getAllPublishedAlbums(): Promise<AlbumGaleriRingkas[]> {
  const baris = await db.albumGaleri.findMany({
    where: { status: "terbit" },
    orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
    select: pilihRingkas,
  });
  return baris.map(keRingkas);
}

export async function getAlbumBySlug(slug: string): Promise<AlbumGaleri | null> {
  const baris = await db.albumGaleri.findUnique({ where: { slug }, select: pilihDetail });
  return baris?.status === "terbit" ? keDetail(baris) : null;
}

export async function getAdminAlbums(): Promise<AlbumGaleriRingkas[]> {
  const baris = await db.albumGaleri.findMany({
    orderBy: [{ tanggalKegiatan: "desc" }, { dibuatPada: "desc" }],
    select: pilihRingkas,
  });
  return baris.map(keRingkas);
}

export async function getAlbumById(id: string): Promise<AlbumGaleri | null> {
  const baris = await db.albumGaleri.findUnique({ where: { id }, select: pilihDetail });
  return baris ? keDetail(baris) : null;
}

export async function getGalleryYears(): Promise<number[]> {
  const baris = await db.albumGaleri.findMany({
    where: { status: "terbit" },
    orderBy: { tanggalKegiatan: "desc" },
    select: { tanggalKegiatan: true },
  });
  return [...new Set(baris.map((album) => album.tanggalKegiatan.getUTCFullYear()))];
}
