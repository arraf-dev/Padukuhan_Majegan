import Link from "next/link";
import { Foto } from "@/components/potongan";
import { kartu, kartuPutus, tombol } from "@/components/primitif";
import type { PotensiKategori, PotensiItem } from "@/lib/potensi";

const nomor = (nilai: number) => (nilai < 10 ? `0${nilai}` : nilai.toLocaleString("id-ID"));

const warnaKategori: Record<PotensiKategori["kode"], string> = {
  pariwisata: "bg-daun-muda text-daun",
  umkm: "bg-emas-muda text-emas-tua",
  budaya: "bg-abu-lencana text-hutan",
};

export function NavigasiPotensi({ kategori }: { kategori: PotensiKategori[] }) {
  return (
    <nav
      aria-label="Kategori Potensi Majegan"
      className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {kategori.map((item, indeks) => (
        <a
          key={item.kode}
          href={`#${item.kode}`}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-garis-tebal bg-kertas px-3.5 py-2 text-[12px] font-extrabold tracking-[.04em] text-hutan transition-colors hover:border-daun hover:bg-daun-muda"
        >
          <span className="font-mono text-[10px] text-emas-tua">0{indeks + 1}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function PotensiSection({ kategori, indeks }: { kategori: PotensiKategori; indeks: number }) {
  const dokumentasi = kategori.potensi
    .filter((item) => item.album?.foto.length)
    .flatMap((item) => item.album!.foto.slice(0, 2).map((foto) => ({ foto, album: item.album! })))
    .slice(0, 3);

  return (
    <section id={kategori.kode} className="scroll-mt-24 border-t border-garis py-10 md:py-14">
      <div className="grid items-start gap-6 lg:grid-cols-[.82fr_1.18fr] lg:gap-10">
        <div data-reveal>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-hutan font-mono text-[11px] font-bold text-emas">
              {String(indeks + 1).padStart(2, "0")}
            </span>
            <p className="font-mono text-[10px] font-bold tracking-[.16em] text-emas-tua">{kategori.label}</p>
          </div>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.08] font-semibold text-hutan">
            {kategori.judul}
          </h2>
          <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.75] text-teks md:text-[15px]">
            {kategori.pengantar}
          </p>
          <p className="mt-2 max-w-[52ch] text-[12.5px] leading-[1.7] text-redup">{kategori.deskripsi}</p>

          <Infografis data={kategori.infografis} />
        </div>

        <div data-reveal data-jeda="1" className="min-w-0">
          <Foto
            src={kategori.gambarUrl}
            keterangan={`Visual ${kategori.label.toLowerCase()} Padukuhan Majegan`}
            sizes="(min-width: 1024px) 55vw, 100vw"
            prioritas={indeks === 0}
            className="aspect-[16/10] rounded-2xl border border-garis"
          />
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-samar">
            <span className={`rounded-full px-2.5 py-1 font-bold tracking-[.06em] ${warnaKategori[kategori.kode]}`}>
              {kategori.label}
            </span>
            <span className="h-px flex-1 bg-garis" />
            <span>{kategori.potensi.length} cerita</span>
          </div>
        </div>
      </div>

      <div className="mt-7 md:mt-9">
        {kategori.potensi.length === 0 ? (
          <p className={kartuPutus}>Konten {kategori.label.toLowerCase()} sedang disiapkan.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kategori.potensi.map((item, itemIndex) => (
              <PotensiCard key={item.id} item={item} kategori={kategori.kode} prioritas={indeks === 0 && itemIndex === 0} />
            ))}
          </div>
        )}
      </div>

      {dokumentasi.length > 0 && (
        <div data-reveal className="mt-8 border-t border-dashed border-garis pt-6 md:mt-10 md:pt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.14em] text-emas-tua">DOKUMENTASI</p>
              <h3 className="mt-1 font-serif text-lg font-semibold text-hutan">Lihat dalam gambar</h3>
            </div>
            <Link href="/galeri" className={`${tombol("teks")} flex-none text-[12.5px]`}>
              Lihat galeri →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
            {dokumentasi.map(({ foto, album }) => (
              <Link key={foto.id} href={`/galeri/${album.slug}`} className="group block min-w-0">
                <Foto
                  src={foto.url}
                  keterangan={foto.alt}
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="aspect-[4/3] rounded-xl border border-garis transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Infografis({ data }: { data: PotensiKategori["infografis"] }) {
  if (data.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-garis bg-panel/60 p-4 md:mt-7">
      <p className="font-mono text-[10px] font-bold tracking-[.14em] text-emas-tua">RINGKASAN DATA</p>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
        {data.map((statistik) => (
          <div key={statistik.id} className="min-w-0">
            <div className="font-serif text-2xl font-bold leading-none text-hutan md:text-[30px]">
              {nomor(statistik.nilai)}
            </div>
            <div className="mt-1 text-[10.5px] font-semibold leading-snug text-teks md:text-xs">{statistik.label}</div>
            {statistik.satuan && <div className="mt-0.5 text-[10px] text-samar">{statistik.satuan}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PotensiCard({
  item,
  kategori,
  prioritas = false,
}: {
  item: PotensiItem;
  kategori: PotensiKategori["kode"];
  prioritas?: boolean;
}) {
  return (
    <article data-reveal className={`${kartu()} min-w-0 overflow-hidden`}>
      <Foto
        src={item.gambarUrl}
        keterangan={item.judul}
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
        prioritas={prioritas}
        className="aspect-[16/10] rounded-b-none border-x-0 border-t-0"
      />
      <div className="px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[.06em] ${warnaKategori[kategori]}`}>
            {item.subkategori || kategori.toUpperCase()}
          </span>
          {item.album && <span className="text-[10.5px] font-semibold text-samar">Ada foto</span>}
        </div>
        <h3 className="mt-2.5 font-serif text-[18px] leading-snug font-semibold text-tinta">{item.judul}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-teks">{item.ringkasan}</p>

        {kategori === "umkm" && item.produk && (
          <p className="mt-3 border-t border-dashed border-garis pt-3 text-[11.5px] text-redup">
            <strong className="text-tinta">Produk</strong> · {item.produk}
          </p>
        )}

        {(item.lokasi || item.kontak) && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-dashed border-garis pt-3 text-[11px] text-samar">
            {item.lokasi && <span>{item.lokasi}</span>}
            {item.kontak && <span>{item.kontak}</span>}
          </div>
        )}

        {item.album && (
          <Link href={`/galeri/${item.album.slug}`} className={`${tombol("teks")} mt-3 text-[12px]`}>
            Lihat dokumentasi →
          </Link>
        )}
      </div>
    </article>
  );
}
