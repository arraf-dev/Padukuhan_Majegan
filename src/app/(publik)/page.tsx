import Link from "next/link";
import {
  aksesCepat,
  berita,
  desa,
  kelompokUsia,
  pengumuman,
  statistik,
} from "@/content/majegan";
import { Hitung } from "@/components/gerak";
import { Ikon } from "@/components/ikon";
import { Foto, JudulSection, KartuRingkas } from "@/components/potongan";
import { tanggalPendek } from "@/lib/tanggal";

const terbaru = berita.slice(0, 3);

export default function Beranda() {
  return (
    <>
      {/* ---------- Sambutan & akses cepat (mobile) ---------- */}
      <div className="flex flex-col gap-3.5 px-4 pt-4 md:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-garis bg-kertas p-4">
          <Foto keterangan="" className="size-13 flex-none rounded-full border-2 border-emas" />
          <div>
            <div className="font-serif text-[15px] font-semibold text-hutan">
              Sambutan Dukuh Majegan
            </div>
            <p className="my-1 text-xs leading-relaxed text-redup">
              &ldquo;Sugeng rawuh — mari rawat Majegan bersama-sama.&rdquo;
            </p>
            <Link href="/profil" className="text-[12.5px] font-semibold text-daun">
              Baca profil padukuhan →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {aksesCepat.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex min-h-11 flex-col gap-2 rounded-xl border p-3.5 ${
                i === 1
                  ? "border-hutan bg-hutan text-krem"
                  : "border-garis bg-kertas text-tinta hover:border-daun"
              }`}
            >
              <Ikon nama={a.ikon} ukuran={22} className="text-daun" />
              <span className="text-[13.5px] font-bold">{a.label}</span>
              <span className={`-mt-1.5 text-[11px] ${i === 1 ? "text-krem/65" : "text-samar"}`}>
                {a.ringkas}
              </span>
            </Link>
          ))}
        </div>

        {/* Pengumuman berjalan — berhenti bila pengguna minta gerak dikurangi. */}
        <div className="flex items-center gap-2.5 overflow-hidden rounded-[10px] border border-emas-garis bg-emas-muda px-3.5 py-2.5">
          <span className="flex-none text-[10px] font-bold tracking-[.08em] text-emas-tua">
            PENGUMUMAN
          </span>
          <div className="h-6 flex-1 overflow-hidden">
            <div className="ticker flex flex-col">
              {[...pengumuman, pengumuman[0]].map((p, i) => (
                <span
                  key={i}
                  className="flex h-6 items-center whitespace-nowrap text-[12.5px] text-emas-teks"
                >
                  {p.teks}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Hero (desktop) ---------- */}
      <div className="hidden items-stretch gap-10 px-12 pt-11 pb-9 md:grid md:grid-cols-[1.35fr_.9fr]">
        <div>
          <div className="text-xs font-bold tracking-[.14em] text-emas-tua uppercase">
            Website Resmi Pemerintah Padukuhan
          </div>
          <h1 className="mt-3 mb-3.5 font-serif text-[40px] leading-[1.18] font-semibold text-balance text-hutan">
            Selamat Datang di
            <br />
            {desa.nama}
          </h1>
          <p className="mb-[22px] max-w-[52ch] text-base leading-[1.7] text-teks">
            Kanal informasi dan layanan resmi warga Majegan — urus surat pengantar, sampaikan
            aduan, dan ikuti kabar terbaru padukuhan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/layanan"
              className="rounded-[9px] bg-emas px-6 py-3.5 text-[15px] font-bold text-hutan transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(138,109,43,.35)]"
            >
              Lihat Layanan
            </Link>
            <Link
              href="/profil"
              className="rounded-[9px] border-[1.5px] border-daun px-6 py-3.5 text-[15px] font-semibold text-hutan transition hover:bg-[#EFE9D6]"
            >
              Profil Padukuhan
            </Link>
          </div>

          <dl className="mt-[30px] flex border-t border-garis pt-5">
            {statistik.map((s, i) => (
              <div
                key={s.label}
                className={`px-7 ${i === 0 ? "pl-0" : "border-l border-garis"} ${
                  i === statistik.length - 1 ? "pr-0" : ""
                }`}
              >
                <dd className="font-serif text-[27px] font-bold text-hutan">
                  <Hitung ke={s.angka} />
                </dd>
                <dt className="mt-0.5 text-[12.5px] text-redup">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-3.5">
          <Foto keterangan="Foto gapura / kegiatan warga" className="min-h-[150px] flex-1 rounded-xl border border-garis" />
          <div className="rounded-xl border border-garis bg-kertas px-5 py-4.5">
            <div className="mb-3 font-serif text-[15px] font-semibold text-hutan">Akses Cepat</div>
            <div className="grid grid-cols-2 gap-2.5">
              {aksesCepat.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-2.5 rounded-[9px] border border-garis p-3 text-tinta transition hover:border-daun hover:bg-krem hover:text-hutan"
                >
                  <Ikon nama={a.ikon} ukuran={20} className="flex-none text-daun" />
                  <span className="text-[13px] font-semibold">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Berita & pengumuman ---------- */}
      <section className="px-4 pt-6 pb-10 md:px-12 md:pt-2 md:pb-10">
        <div className="md:hidden">
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-semibold text-hutan">Berita Terbaru</h2>
            <Link href="/berita" className="text-[12.5px] font-semibold text-daun">
              Lihat semua →
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <JudulSection anak="Berita & Pengumuman" tautan={{ href: "/berita", label: "Lihat semua" }} />
        </div>

        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4.5">
          {terbaru.map((b) => (
            <KartuRingkas key={b.slug} b={b} />
          ))}
        </div>

        <div className="mt-2.5 grid gap-2.5 md:mt-4.5 md:grid-cols-2 md:gap-4.5">
          <div
            data-reveal
            className="rounded-xl border border-garis bg-kertas p-3.5 transition md:px-5.5 md:py-5 md:hover:-translate-y-[3px]"
          >
            <div className="mb-2 font-serif text-[13px] font-semibold text-hutan md:mb-2.5 md:text-[15px]">
              Statistik Penduduk
            </div>
            <BatangUsia />
            <div className="mt-2 flex justify-between text-[10.5px] text-samar max-md:hidden">
              {kelompokUsia.map((k) => (
                <span key={k.rentang}>{k.rentang}</span>
              ))}
            </div>
            <div className="mt-2 font-serif text-lg font-bold text-hutan md:hidden">
              <Hitung ke={statistik[0].angka} />
            </div>
            <div className="text-[10.5px] text-samar md:hidden">jiwa · data 2026</div>
            <Link
              href="/statistik"
              className="mt-2.5 inline-block text-[12.5px] font-semibold text-daun max-md:hidden"
            >
              Lihat statistik →
            </Link>
          </div>

          <div
            data-reveal
            className="rounded-xl border border-garis bg-kertas px-5.5 py-5 transition hover:-translate-y-[3px] max-md:hidden"
          >
            <div className="mb-2.5 font-serif text-[15px] font-semibold text-hutan">
              Pengumuman Terbaru
            </div>
            <ul className="flex flex-col gap-2.5 text-[13px] leading-snug">
              {pengumuman.slice(0, 3).map((p) => (
                <li key={p.tanggal} className="flex gap-2.5">
                  <span className="flex-none pt-0.5 font-mono text-[11px] font-semibold text-emas-tua">
                    {tanggalPendek(p.tanggal)}
                  </span>
                  <span>{p.teks}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

/** Batang kelompok usia — dipakai di teaser Beranda. */
function BatangUsia() {
  return (
    <div className="flex h-10 items-end gap-[5px] md:h-[52px] md:gap-[7px]">
      {kelompokUsia.map((k) => (
        <div
          key={k.rentang}
          style={{ height: `${k.persen}%` }}
          title={`${k.rentang} tahun`}
          className={`flex-1 rounded-t md:rounded-t-[4px] ${
            k.persen === 100 ? "bg-emas" : "bg-garis-tebal"
          }`}
        />
      ))}
    </div>
  );
}
