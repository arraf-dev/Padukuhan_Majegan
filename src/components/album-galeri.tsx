import Link from "next/link";
import type { AlbumGaleriRingkas } from "@/lib/galeri";
import { Foto } from "@/components/potongan";
import { kartu } from "@/components/primitif";
import { tanggalKapital } from "@/lib/tanggal";

const warnaKategori = (kategori: AlbumGaleriRingkas["kategori"]) => {
  switch (kategori) {
    case "Budaya":
    case "Keagamaan":
      return "bg-emas-muda text-emas-tua";
    case "Pemerintahan":
    case "Sosial":
      return "bg-daun-muda text-daun";
    case "Olahraga":
      return "bg-abu-lencana text-hutan";
    default:
      return "bg-hutan/90 text-emas";
  }
};

export function LencanaKategoriGaleri({
  kategori,
  className = "",
}: {
  kategori: AlbumGaleriRingkas["kategori"];
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[.06em] ${warnaKategori(kategori)} ${className}`}
    >
      {kategori.toUpperCase()}
    </span>
  );
}

export function AlbumGaleriCard({ album, prioritas = false }: { album: AlbumGaleriRingkas; prioritas?: boolean }) {
  return (
    <Link
      href={`/galeri/${album.slug}`}
      data-reveal
      className={`${kartu(true)} group block overflow-hidden`}
    >
      <div className="relative px-2.5 pt-2.5">
        <Foto
          src={album.coverUrl}
          keterangan={`Sampul album ${album.judul}`}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          prioritas={prioritas}
          className="aspect-[4/3] rounded-[11px] transition-transform duration-500 ease-out group-hover:scale-[1.015]"
        />
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-2">
          <LencanaKategoriGaleri kategori={album.kategori} />
          <span className="rounded-full bg-hutan/88 px-2.5 py-1 text-[10px] font-bold text-krem backdrop-blur-sm">
            {album.jumlahFoto} foto
          </span>
        </div>
      </div>
      <div className="px-4.5 pt-3.5 pb-4.5">
        <div className="font-mono text-[10.5px] font-bold tracking-[.06em] text-emas-tua">
          {tanggalKapital(album.tanggalKegiatan)}
        </div>
        <h2 className="mt-2 font-serif text-[18px] leading-snug font-semibold text-tinta">
          {album.judul}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-teks">
          {album.deskripsi}
        </p>
      </div>
    </Link>
  );
}
