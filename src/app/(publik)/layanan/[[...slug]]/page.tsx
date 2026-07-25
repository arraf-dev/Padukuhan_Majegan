import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desa, layanan } from "@/content/majegan";
import { CentangKotak, Ikon } from "@/components/ikon";

type Params = { params: Promise<{ slug?: string[] }> };

/** Tanpa slug = layanan pertama, sama seperti tampilan awal pada mockup. */
const cari = (slug?: string[]) =>
  slug?.length ? layanan.find((l) => l.slug === slug[0]) : layanan[0];

export async function generateStaticParams() {
  return [{ slug: [] }, ...layanan.map((l) => ({ slug: [l.slug] }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = cari((await params).slug);
  return l ? { title: l.nama, description: l.deskripsi } : {};
}

/** `**tebal**` → <strong>. ponytail: satu pola, tidak perlu parser markdown. */
function Tebal({ teks }: { teks: string }) {
  return (
    <>
      {teks.split(/\*\*(.+?)\*\*/g).map((bagian, i) =>
        i % 2 ? <strong key={i}>{bagian}</strong> : bagian,
      )}
    </>
  );
}

export default async function Layanan({ params }: Params) {
  const aktif = cari((await params).slug);
  if (!aktif) notFound();

  return (
    <div className="grid items-start gap-8 px-4 py-8 md:grid-cols-[300px_1fr] md:px-12 md:pt-8.5 md:pb-11.5">
      {/* ---------- Daftar layanan ---------- */}
      <div>
        <div className="mb-3 flex items-center gap-2.5 rounded-[10px] border border-garis bg-kertas px-3.5 py-2.5 text-[13px] text-samar">
          <Ikon nama="cari" ukuran={14} />
          Cari layanan…
        </div>
        <nav className="flex flex-col gap-2.5">
          {layanan.map((l) => {
            const ini = l.slug === aktif.slug;
            return (
              <Link
                key={l.slug}
                href={`/layanan/${l.slug}`}
                aria-current={ini ? "page" : undefined}
                className={`rounded-[11px] px-4 py-3.5 ${
                  ini
                    ? "bg-hutan text-krem shadow-[0_4px_12px_rgba(13,56,37,.22)]"
                    : "border border-garis bg-kertas hover:border-daun"
                }`}
              >
                <div className={`text-sm ${ini ? "font-bold" : "font-semibold text-tinta"}`}>
                  {l.namaSingkat}
                </div>
                <div className={`mt-1 text-[11.5px] ${ini ? "text-emas" : "text-samar"}`}>
                  {l.syarat.length} syarat · {l.durasi}
                </div>
              </Link>
            );
          })}
        </nav>
        <p className="mt-3.5 rounded-[11px] border border-emas-garis bg-emas-muda px-4 py-3.5 text-[12.5px] leading-relaxed text-emas-teks">
          Ragu dengan berkas?{" "}
          <a href={desa.whatsappUrl} className="font-bold text-emas-tua">
            Tanya via WhatsApp
          </a>{" "}
          dulu agar tidak bolak-balik.
        </p>
      </div>

      {/* ---------- Detail ---------- */}
      <article
        key={aktif.slug}
        data-reveal
        className="rounded-2xl border border-garis bg-kertas px-5 py-6 md:px-8.5 md:py-7.5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold text-hutan md:text-[27px]">
            {aktif.nama}
          </h1>
          <span className="rounded-full bg-daun-muda px-3 py-[5px] text-xs font-bold text-daun">
            {aktif.durasi}
          </span>
          <span className="rounded-full bg-emas-muda px-3 py-[5px] text-xs font-bold text-emas-tua">
            {aktif.biaya}
          </span>
        </div>
        <p className="mt-3 mb-6 max-w-[64ch] text-[14.5px] leading-[1.7] text-teks">
          {aktif.deskripsi}
        </p>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-3 font-serif text-[17px] font-semibold text-hutan">Persyaratan</h2>
            <ul className="flex flex-col gap-2.5">
              {aktif.syarat.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 rounded-[10px] border border-garis bg-krem px-3.5 py-3"
                >
                  <CentangKotak className="mt-px flex-none" />
                  <span className="text-[13.5px] leading-snug text-tinta">
                    <Tebal teks={s} />
                  </span>
                </li>
              ))}
            </ul>

            {aktif.berkas && (
              <div className="mt-3.5 flex items-center gap-3 rounded-[10px] border-[1.5px] border-dashed border-garis-tebal px-4 py-3.5">
                <Ikon nama="berkas" ukuran={26} className="flex-none text-emas-tua" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold text-tinta">
                    {aktif.berkas.nama}
                  </div>
                  <div className="text-[11.5px] text-samar">{aktif.berkas.ukuran}</div>
                </div>
                {/* ponytail: berkas asli menyusul dari perangkat dusun. */}
                <span className="flex-none rounded-lg border-[1.5px] border-daun px-4 py-2 text-[13px] font-bold text-hutan/50">
                  Unduh
                </span>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-serif text-[17px] font-semibold text-hutan">Alur Pengurusan</h2>
            <ol className="flex flex-col">
              {aktif.alur.map((a, i) => {
                const akhir = i === aktif.alur.length - 1;
                return (
                  <li key={a.judul} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex size-[30px] flex-none items-center justify-center rounded-full text-[13.5px] font-extrabold ${
                          akhir ? "bg-hutan text-emas" : "bg-emas text-hutan"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {!akhir && <span className="w-0.5 flex-1 bg-garis" />}
                    </div>
                    <div className={akhir ? "" : "pb-4.5"}>
                      <div className="pt-1 text-sm font-bold text-tinta">{a.judul}</div>
                      <div className="mt-0.5 text-[12.5px] text-redup">{a.detail}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </article>
    </div>
  );
}
