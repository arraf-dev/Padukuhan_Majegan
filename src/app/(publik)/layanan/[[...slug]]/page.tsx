import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desa } from "@/content/majegan";
import { CentangKotak, Ikon } from "@/components/ikon";
import { kartu, kartuPutus, tombol } from "@/components/primitif";
import { semuaLayanan } from "@/lib/layanan";

type Params = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ q?: string }>;
};

/** Tanpa slug = layanan pertama, sama seperti tampilan awal pada mockup. */
const cari = (daftar: Awaited<ReturnType<typeof semuaLayanan>>, slug?: string[]) =>
  slug?.length ? daftar.find((l) => l.slug === slug[0]) : daftar[0];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = cari(await semuaLayanan(), (await params).slug);
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

export default async function Layanan({ params, searchParams }: Params) {
  const layanan = await semuaLayanan();
  const aktif = cari(layanan, (await params).slug);
  if (!aktif) notFound();

  // ponytail: memakai searchParams membuat rute ini dirender on-demand, bukan
  // SSG lagi. Ditukar dengan pencarian yang jalan tanpa JavaScript — penting di
  // HP kentang & sinyal tipis. Pindahkan ke komponen klien kalau nanti butuh SSG.
  const q = ((await searchParams).q ?? "").trim().toLowerCase();
  const daftar = q
    ? layanan.filter((l) => `${l.nama} ${l.deskripsi} ${l.syarat.join(" ")}`.toLowerCase().includes(q))
    : layanan;

  return (
    <div className="wadah grid items-start gap-8 px-4 py-8 md:grid-cols-[300px_1fr] md:px-12 md:pt-10 md:pb-12 lg:grid-cols-[320px_1fr] lg:gap-10 lg:px-16 lg:pt-12 lg:pb-16">
      {/**
       * Rail daftar menempel di desktop — detail layanan jauh lebih panjang,
       * tanpa sticky pengguna harus gulir balik ke atas untuk ganti layanan.
       *
       * max-h + overflow menjaga kasus layar pendek: 8 layanan ± 700px, di
       * laptop setinggi 768px rail yang dipatok akan memotong item terbawah
       * tanpa cara menjangkaunya. Overflow hanya aktif kalau memang tidak muat.
       */}
      <div className="min-w-0 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-1">
        {/* form GET biasa: hasil pencarian ikut ke URL, bisa dibagikan & di-back */}
        <form className="mb-3 flex items-center gap-2.5 rounded-[10px] border border-garis bg-kertas px-3.5 py-1 transition-colors duration-200 ease-out focus-within:border-daun">
          <Ikon nama="cari" ukuran={14} className="flex-none text-samar" />
          <label htmlFor="q" className="sr-only">
            Cari layanan
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Cari layanan…"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[13px] text-tinta placeholder:text-samar focus:outline-none"
          />
        </form>

        {q && (
          <p className="mb-3 text-[12.5px] text-samar">
            {daftar.length} layanan cocok dengan &ldquo;{q}&rdquo; ·{" "}
            <Link
              href="/layanan"
              className="font-semibold text-daun underline transition-colors duration-200 ease-out hover:text-hutan"
            >
              tampilkan semua
            </Link>
          </p>
        )}

        <nav className="flex flex-col gap-2.5">
          {daftar.map((l) => {
            const ini = l.slug === aktif.slug;
            return (
              <Link
                key={l.slug}
                href={`/layanan/${l.slug}`}
                aria-current={ini ? "page" : undefined}
                className={
                  ini
                    ? "rounded-xl bg-hutan px-4 py-3.5 text-krem shadow-[0_4px_12px_rgba(13,56,37,.22)]"
                    : `${kartu(true)} px-4 py-3.5`
                }
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

        {/* Tanpa cabang ini, pencarian nihil hanya menampilkan kolom kosong tanpa keterangan. */}
        {daftar.length === 0 && (
          <p className={kartuPutus}>
            Tidak ada layanan yang cocok dengan &ldquo;{q}&rdquo;.
            <br />
            <Link href="/layanan" className={`${tombol("teks")} mt-2 text-[13px]`}>
              Tampilkan semua layanan
            </Link>
          </p>
        )}

        <a
          href="/gambar/syarat-surat-menyurat.jpg"
          target="_blank"
          className="mt-3.5 flex items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-kertas px-4 py-3.5 text-[12.5px] font-semibold text-teks transition-colors duration-200 ease-out hover:border-daun hover:text-hutan"
        >
          <Ikon nama="berkas" ukuran={16} className="flex-none text-emas-tua" />
          Poster syarat permohonan surat (JPG)
        </a>

        <p className="mt-3.5 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3.5 text-[12.5px] leading-relaxed text-emas-teks">
          Ragu dengan berkas?{" "}
          <a
            href={desa.whatsappUrl}
            className="font-bold text-emas-tua transition-colors duration-200 ease-out hover:text-hutan"
          >
            Tanya via WhatsApp
          </a>{" "}
          dulu agar tidak bolak-balik.
        </p>
      </div>

      {/* ---------- Detail ---------- */}
      <article
        key={aktif.slug}
        data-reveal
        // min-w-0: item grid bawaannya `min-width:auto`, sehingga kolom melebar
        // mengikuti isi terpanjang dan menyeret seluruh halaman meluber di HP.
        className={`${kartu()} min-w-0 px-5 py-6 md:px-8 md:py-7 lg:px-10 lg:py-9`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="judul-halaman">{aktif.nama}</h1>
          <span className="rounded-full bg-daun-muda px-3 py-[5px] text-xs font-bold text-daun">
            {aktif.durasi}
          </span>
          <span className="rounded-full bg-emas-muda px-3 py-[5px] text-xs font-bold text-emas-tua">
            {aktif.biaya}
          </span>
        </div>
        <p className="mt-3 mb-6 max-w-[64ch] text-[14.5px] leading-[1.7] text-teks lg:mb-8 lg:text-base lg:leading-[1.8]">
          {aktif.deskripsi}
        </p>

        <div className="grid items-start gap-6 md:grid-cols-2 lg:gap-8">
          <section className="min-w-0">
            <h2 className="mb-3 font-serif text-[17px] font-semibold text-hutan lg:mb-4 lg:text-[19px]">Persyaratan</h2>
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
                  <div className="text-[11.5px] text-samar">templat isian, bisa diisi di rumah</div>
                </div>
                {aktif.berkas.url ? (
                  <a
                    href={aktif.berkas.url}
                    download
                    className="flex-none rounded-lg border-[1.5px] border-daun px-4 py-2 text-[13px] font-bold text-hutan transition-colors hover:bg-emas-lembut"
                  >
                    Unduh
                  </a>
                ) : (
                  <span className="flex-none rounded-lg border-[1.5px] border-daun px-4 py-2 text-[13px] font-bold text-hutan/50">
                    Belum tersedia
                  </span>
                )}
              </div>
            )}
          </section>

          <section className="min-w-0">
            <h2 className="mb-3 font-serif text-[17px] font-semibold text-hutan lg:mb-4 lg:text-[19px]">Alur Pengurusan</h2>
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
