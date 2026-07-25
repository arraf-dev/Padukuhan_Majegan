import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { berita } from "@/content/majegan";
import { Atap, Ikon } from "@/components/ikon";
import { Foto, JudulSection, KartuRingkas, LencanaKategori } from "@/components/potongan";
import { tanggalPanjang } from "@/lib/tanggal";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return berita.map((b) => ({ slug: b.slug }));
}

const cari = (slug: string) => berita.find((b) => b.slug === slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const b = cari((await params).slug);
  return b ? { title: b.judul, description: b.ringkasan } : {};
}

export default async function DetailBerita({ params }: Params) {
  const b = cari((await params).slug);
  if (!b) notFound();

  const lainnya = berita.filter((x) => x.slug !== b.slug).slice(0, 3);

  return (
    <div className="px-4 pt-5 pb-10 md:px-12 md:pt-7 md:pb-12">
      <Link
        href="/berita"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-daun hover:text-hutan"
      >
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke Kabar Majegan
      </Link>

      <article className="mx-auto mt-4 max-w-3xl">
        <LencanaKategori kategori={b.kategori} />
        <h1 className="mt-3 font-serif text-2xl leading-tight font-semibold text-hutan md:text-[34px]">
          {b.judul}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed border-garis pb-4 text-[12.5px] text-samar">
          <span className="inline-flex items-center gap-2">
            <Atap ukuran={20} className="flex-none" />
            <time dateTime={b.tanggal} className="font-mono font-bold text-emas-tua">
              {tanggalPanjang(b.tanggal)}
            </time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ikon nama="pin" ukuran={12} />
            {b.lokasi}
          </span>
        </div>

        <Foto keterangan={b.foto} className="mt-5 aspect-[16/9] rounded-xl" />

        <p className="mt-5 border-l-[3px] border-emas pl-4 text-[15px] leading-[1.75] font-semibold text-tinta">
          {b.ringkasan}
        </p>

        {b.isi.map((paragraf) => (
          <p key={paragraf.slice(0, 40)} className="mt-4 text-[15px] leading-[1.85] text-teks">
            {paragraf}
          </p>
        ))}

        {/* ponytail: suka & tanggapan masih angka statis — butuh tabel + sesi
            sebelum tombolnya bisa ditekan. Ditampilkan sebagai info, bukan aksi. */}
        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-garis pt-4">
          <span className="inline-flex items-center gap-[7px] rounded-full border border-emas-garis bg-emas-muda px-3.5 py-[7px] text-xs font-extrabold text-emas-tua">
            <Ikon nama="hati" ukuran={14} />
            {b.suka} warga suka
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-redup">
            <Ikon nama="balon" ukuran={14} />
            {b.tanggapan} tanggapan
          </span>
          <span className="flex-1" />
          <span className="text-xs text-samar">Dikelola perangkat dusun &amp; karang taruna</span>
        </div>
      </article>

      <section className="mx-auto mt-10 max-w-3xl">
        <JudulSection anak="Berita Lainnya" tautan={{ href: "/berita", label: "semua berita" }} />
        <div className="grid gap-3 md:grid-cols-3">
          {lainnya.map((l) => (
            <KartuRingkas key={l.slug} b={l} />
          ))}
        </div>
      </section>
    </div>
  );
}
