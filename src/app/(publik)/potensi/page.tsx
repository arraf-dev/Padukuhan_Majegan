import type { Metadata } from "next";
import { Foto } from "@/components/potongan";
import { kartuPutus } from "@/components/primitif";
import { NavigasiPotensi, PotensiSection } from "@/components/potensi";
import { getPublishedPotensi } from "@/lib/potensi";

export const metadata: Metadata = {
  title: { absolute: "Potensi Majegan | Padukuhan Majegan" },
  description: "Kenali potensi pariwisata, UMKM, dan budaya Padukuhan Majegan, Kalurahan Pandowoharjo.",
  alternates: { canonical: "/potensi" },
};

export const dynamic = "force-dynamic";

const GAMBAR_HERO_BAKU = "/gambar/gapura-majegan.svg";

export default async function Potensi() {
  const kategori = await getPublishedPotensi();
  const gambarHero = kategori.find((item) => item.gambarUrl)?.gambarUrl ?? GAMBAR_HERO_BAKU;
  const jumlahCerita = kategori.reduce((jumlah, item) => jumlah + item.potensi.length, 0);
  const jumlahDokumentasi = kategori.reduce(
    (jumlah, item) => jumlah + item.potensi.filter((potensi) => potensi.album?.foto.length).length,
    0,
  );

  return (
    <div>
      <section className="border-b border-garis bg-panel/45">
        <div className="wadah grid items-center gap-7 px-4 py-9 md:grid-cols-[1fr_.78fr] md:px-12 md:py-14 lg:gap-12 lg:px-16">
          <div data-reveal>
            <p className="font-mono text-[11px] font-bold tracking-[.18em] text-emas-tua">POTENSI PADUKUHAN</p>
            <h1 className="mt-2 max-w-[13ch] font-serif text-[clamp(2.5rem,7vw,4.7rem)] leading-[.98] font-semibold tracking-[-.035em] text-hutan">
              Potensi Majegan
            </h1>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-[1.75] text-teks md:text-[15px]">
              Kenali berbagai potensi yang tumbuh dari lingkungan dan masyarakat Padukuhan Majegan.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-garis pt-4">
              <Ringkasan nilai={kategori.length} label="kategori" />
              <Ringkasan nilai={jumlahCerita} label="cerita" />
              <Ringkasan nilai={jumlahDokumentasi} label="dokumentasi" />
            </div>
          </div>

          <div data-reveal data-jeda="1" className="min-w-0">
            <Foto
              src={gambarHero}
              keterangan="Potensi dan kehidupan warga Padukuhan Majegan"
              sizes="(min-width: 768px) 48vw, 100vw"
              prioritas
              className="aspect-[16/10] rounded-2xl border border-garis"
            />
            <p className="mt-2 text-right text-[11px] text-samar">Pariwisata, UMKM, dan budaya warga.</p>
          </div>
        </div>
      </section>

      <div className="wadah px-4 pb-12 md:px-12 md:pb-16 lg:px-16 lg:pb-20">
        <section className="sticky top-0 z-30 -mx-4 border-b border-garis bg-krem/95 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:mt-7 md:rounded-xl md:border md:p-3 lg:mt-9">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-4">
            <p className="flex-none font-mono text-[10px] font-bold tracking-[.14em] text-emas-tua">PILIH KATEGORI</p>
            {kategori.length > 0 ? (
              <NavigasiPotensi kategori={kategori} />
            ) : (
              <p className="text-[12.5px] text-samar">Konten potensi sedang disiapkan.</p>
            )}
          </div>
        </section>

        {kategori.length === 0 ? (
          <p className={`${kartuPutus} mt-10`}>Belum ada konten Potensi Majegan yang diterbitkan.</p>
        ) : (
          kategori.map((item, indeks) => <PotensiSection key={item.id} kategori={item} indeks={indeks} />)
        )}
      </div>
    </div>
  );
}

function Ringkasan({ nilai, label }: { nilai: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <strong className="font-serif text-2xl leading-none text-hutan">{nilai}</strong>
      <span className="text-[11px] font-semibold text-redup">{label}</span>
    </div>
  );
}
