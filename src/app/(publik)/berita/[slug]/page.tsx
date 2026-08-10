import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Atap, Ikon } from "@/components/ikon";
import { Foto, JudulSection, KartuRingkas, LencanaKategori } from "@/components/potongan";
import { tombol } from "@/components/primitif";
import { beritaSlug, beritaTerbit } from "@/lib/berita";
import { tanggalPanjang } from "@/lib/tanggal";

type Params = { params: Promise<{ slug: string }> };

// ponytail: `generateStaticParams` dibuang, bukan diganti query — daftar slug-nya
// berubah tiap admin menayangkan berita. Kembali ke prerender di Minggu 5 saat
// ISR dipasang dan DB sudah pasti hidup ketika build jalan.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const b = await beritaSlug((await params).slug);
  return b ? { title: b.judul, description: b.ringkasan } : {};
}

export default async function DetailBerita({ params }: Params) {
  const b = await beritaSlug((await params).slug);
  if (!b) notFound();

  const lainnya = (await beritaTerbit(4)).filter((x) => x.slug !== b.slug).slice(0, 3);

  return (
    <div className="wadah px-4 pt-5 pb-10 md:px-12 md:pt-8 md:pb-12 lg:px-16 lg:pt-10 lg:pb-16">
      <Link href="/berita" className={`${tombol("teks")} text-[13px] lg:text-sm`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke Kabar Majegan
      </Link>

      {/**
       * Di bawah xl: susunannya persis seperti sebelumnya — artikel 768px di
       * tengah, "Berita Lainnya" menumpuk di bawah. Mulai 1280px keduanya
       * masuk satu grid sehingga gutter kosong di kanan terpakai jadi rail.
       */}
      <div className="xl:grid xl:grid-cols-[minmax(0,760px)_300px] xl:items-start xl:justify-center xl:gap-12">
      <article className="mx-auto mt-4 max-w-3xl xl:mx-0 xl:max-w-none">
        <LencanaKategori kategori={b.kategori} />
        <h1 className="judul-halaman mt-3">{b.judul}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed border-garis pb-4 text-[12.5px] text-samar lg:mt-4 lg:pb-5 lg:text-[13.5px]">
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

        <Foto
          src={b.foto}
          keterangan={b.fotoKeterangan}
          prioritas
          sizes="(min-width: 768px) 760px, 100vw"
          className="mt-5 aspect-[16/9] rounded-xl lg:mt-7 lg:aspect-[21/9] lg:rounded-2xl"
        />

        <p className="mt-5 border-l-[3px] border-emas pl-4 text-[15px] leading-[1.75] font-semibold text-tinta lg:mt-7 lg:pl-5 lg:text-[18px]">
          {b.ringkasan}
        </p>

        {b.isi.map((paragraf) => (
          <p
            key={paragraf.slice(0, 40)}
            className="mt-4 text-[15px] leading-[1.85] text-teks lg:mt-5 lg:text-[17px] lg:leading-[1.9]"
          >
            {paragraf}
          </p>
        ))}
      </article>

      {/* Jadi rail kanan yang menempel mulai xl; di bawah itu tetap blok biasa
          di bawah artikel. KartuRingkas sudah bertumpuk vertikal sejak md:,
          jadi bentuknya langsung cocok untuk kolom sempit. */}
      <section className="mx-auto mt-10 max-w-3xl xl:sticky xl:top-24 xl:mx-0 xl:mt-4 xl:max-w-none">
        <JudulSection anak="Berita Lainnya" tautan={{ href: "/berita", label: "semua berita" }} />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1 xl:gap-4">
          {lainnya.map((l) => (
            <KartuRingkas key={l.slug} b={l} />
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
