import Image from "next/image";
import Link from "next/link";
import type { Berita, KategoriBerita, StatusPengaduan } from "@/content/majegan";
import { Atap, Ikon } from "@/components/ikon";
import { tanggalKapital, tanggalPanjang } from "@/lib/tanggal";

/** Judul section dengan garis atap joglo + hairline, opsional tautan kanan. */
export function JudulSection({
  anak,
  tautan,
  sisipan,
}: {
  anak: React.ReactNode;
  tautan?: { href: string; label: string };
  sisipan?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 md:gap-3.5">
      <Atap className="hidden flex-none md:block" />
      <h2 className="font-serif text-xl font-semibold text-hutan md:text-2xl">{anak}</h2>
      {sisipan}
      <span className="h-px flex-1 bg-garis" />
      {tautan && (
        <Link
          href={tautan.href}
          className="flex-none text-[13.5px] font-semibold text-daun hover:text-hutan"
        >
          {tautan.label} →
        </Link>
      )}
    </div>
  );
}

/**
 * Slot gambar: merender gambar bila `src` ada, placeholder bergaris bila tidak.
 *
 * `keterangan` selalu wajib — jadi teks `alt` saat gambarnya tampil, dan tulisan
 * di dalam pil placeholder saat belum ada gambar. Satu prop, dua peran, supaya
 * tidak ada gambar yang lolos tanpa alt.
 */
export function Foto({
  src,
  keterangan,
  className = "",
  sizes = "100vw",
  prioritas = false,
}: {
  src?: string | null;
  keterangan: string;
  className?: string;
  sizes?: string;
  prioritas?: boolean;
}) {
  if (!src) {
    return (
      <div className={`foto flex items-center justify-center ${className}`}>
        {keterangan && <span className="foto-cap">{keterangan}</span>}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-foto ${className}`}>
      <Image
        src={src}
        alt={keterangan}
        fill
        sizes={sizes}
        priority={prioritas}
        className="object-cover"
      />
    </div>
  );
}

const warnaStatus: Record<StatusPengaduan, string> = {
  TERKIRIM: "border-[1.5px] border-garis-tebal text-teks",
  DIPROSES: "bg-emas text-hutan",
  SELESAI: "bg-daun text-krem",
};

/** Lencana status pengaduan — dipakai dashboard, daftar admin, & detailnya. */
export function LencanaStatus({
  status,
  className = "",
}: {
  status: StatusPengaduan;
  className?: string;
}) {
  return (
    <span
      className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-extrabold ${warnaStatus[status]} ${className}`}
    >
      {status}
    </span>
  );
}

function warnaLencana(kategori: KategoriBerita) {
  switch (kategori) {
    case "Kegiatan":
      return "bg-emas-muda text-emas-tua";
    case "Pembangunan":
      return "bg-daun-muda text-daun";
    case "Pengumuman":
      return "bg-[#E0DBC6] text-hutan";
  }
}

function warnaOverlay(kategori: KategoriBerita) {
  switch (kategori) {
    case "Kegiatan":
      return "bg-hutan/90 text-emas";
    case "Pembangunan":
      return "bg-daun/90 text-krem";
    case "Pengumuman":
      return "bg-emas/95 text-hutan";
  }
}

export function LencanaKategori({
  kategori,
  className = "",
}: {
  kategori: KategoriBerita;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[.06em] ${warnaLencana(kategori)} ${className}`}
    >
      {kategori.toUpperCase()}
    </span>
  );
}

/** Kartu berita gaya album dusun — foto 1:1, meta, dan baris reaksi. */
export function KartuAlbum({ b }: { b: Berita }) {
  return (
    <Link
      href={`/berita/${b.slug}`}
      data-reveal
      className="block overflow-hidden rounded-2xl border border-garis bg-kertas transition hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(33,50,40,.13)]"
    >
      <div className="relative px-2.5 pt-2.5">
        <Foto
          src={b.foto}
          keterangan={b.fotoKeterangan}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-square rounded-[11px]"
        />
        <span
          className={`absolute top-[22px] left-[22px] rounded-full px-3 py-1.5 text-[10.5px] font-extrabold tracking-[.08em] ${warnaOverlay(b.kategori)}`}
        >
          {b.kategori.toUpperCase()}
        </span>
      </div>
      <div className="px-4.5 pt-3.5 pb-4">
        <div className="flex items-center gap-2.5">
          <Atap ukuran={22} className="flex-none" />
          <span className="font-mono text-[11px] font-bold tracking-[.06em] text-emas-tua">
            {tanggalKapital(b.tanggal)}
          </span>
          <span className="flex-1" />
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-samar">
            <Ikon nama="pin" ukuran={12} />
            {b.lokasi}
          </span>
        </div>
        <h3 className="mt-2.5 mb-1.5 font-serif text-lg leading-snug font-semibold text-tinta">
          {b.judul}
        </h3>
        <p className="text-[13px] leading-relaxed text-teks">{b.ringkasan}</p>
        <div className="mt-3.5 flex items-center gap-3 border-t border-dashed border-garis pt-3">
          <span className="inline-flex items-center gap-[7px] rounded-full border border-emas-garis bg-emas-muda px-3.5 py-[7px] text-xs font-extrabold text-emas-tua">
            <Ikon nama="hati" ukuran={14} />
            {b.suka} warga suka
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-redup">
            <Ikon nama="balon" ukuran={14} />
            {b.tanggapan} tanggapan
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Kartu ringkas untuk Beranda: kolom di desktop, baris di mobile. */
export function KartuRingkas({ b }: { b: Berita }) {
  return (
    <Link
      href={`/berita/${b.slug}`}
      data-reveal
      className="flex gap-3 overflow-hidden rounded-xl border border-garis bg-kertas p-3 transition hover:border-daun md:block md:p-0 md:hover:-translate-y-[3px] md:hover:shadow-[0_8px_20px_rgba(33,50,40,.12)]"
    >
      <Foto
        src={b.foto}
        keterangan={b.fotoKeterangan}
        sizes="(min-width: 768px) 33vw, 72px"
        className="size-[72px] flex-none rounded-[9px] [&>span]:hidden md:h-[130px] md:w-full md:rounded-none md:[&>span]:inline-flex"
      />
      <div className="md:px-4.5 md:pt-4 md:pb-4.5">
        <LencanaKategori kategori={b.kategori} className="text-[10px] md:text-[11px]" />
        <h3 className="my-1.5 font-serif text-[13.5px] leading-snug font-semibold text-tinta md:mt-2.5 md:mb-1.5 md:text-[16.5px]">
          {b.judul}
        </h3>
        <div className="text-[11px] text-samar md:text-xs">{tanggalPanjang(b.tanggal)}</div>
      </div>
    </Link>
  );
}
