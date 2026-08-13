import Link from "next/link";
import { aksesCepat, desa } from "@/content/majegan";
import { Hitung } from "@/components/gerak";
import { Ikon } from "@/components/ikon";
import { Foto } from "@/components/potongan";
import { kartu, tombol } from "@/components/primitif";
import type { Ringkasan } from "@/lib/statistik";

/** Ringkasan Majegan setelah hero sinematik; mempertahankan data dan akses cepat lama. */
export function TentangMajegan({ ringkasan }: { ringkasan: Ringkasan[] }) {
  return (
    <section
      id="tentang-majegan"
      aria-labelledby="judul-tentang-majegan"
      className="wadah scroll-mt-20 grid items-start gap-8 px-4 pt-14 pb-10 md:grid-cols-[1.35fr_.9fr] md:items-stretch md:gap-10 md:px-12 md:pt-18 md:pb-14 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:px-16 lg:pt-24 lg:pb-20"
    >
      <div>
        <p
          data-reveal
          className="text-[11.5px] font-bold tracking-[.14em] text-emas-tua uppercase md:text-xs lg:text-[13px]"
        >
          Tentang Majegan
        </p>

        <h2
          id="judul-tentang-majegan"
          data-reveal
          data-jeda="1"
          className="mt-2.5 mb-3 font-serif text-[clamp(1.75rem,6vw,2.75rem)] leading-[1.18] font-semibold text-balance text-hutan md:mt-3 md:mb-3.5 md:text-[clamp(2.75rem,3.6vw,3.5rem)] lg:mb-5"
        >
          Ruang hidup yang tumbuh bersama.
        </h2>

        <p
          data-reveal
          data-jeda="2"
          className="mb-5 max-w-[52ch] text-base leading-[1.7] text-pretty text-teks md:mb-[22px] md:text-[17px] lg:mb-7 lg:text-[19px] lg:leading-[1.75]"
        >
          {desa.nama} tumbuh dari kehidupan agraris, semangat gotong royong, dan hubungan erat
          antarwarga. Website ini menjadi ruang bersama untuk mengenal Majegan, mengakses layanan,
          menyampaikan pengaduan, dan mengikuti kabar terbaru padukuhan.
        </p>

        <div data-reveal data-jeda="3" className="flex flex-wrap gap-3">
          <Link href="/layanan" className={tombol("primer", "besar")}>
            Lihat Layanan
          </Link>
          <Link href="/profil" className={tombol("sekunder", "besar")}>
            Profil Padukuhan
          </Link>
        </div>

        <dl
          data-reveal
          data-jeda="4"
          className="mt-6 flex flex-wrap border-t border-garis pt-4 md:mt-[30px] md:flex-nowrap md:pt-5 lg:mt-9 lg:pt-7"
        >
          {ringkasan.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-1 md:px-7 md:py-0 lg:px-9 ${i === 0 ? "pl-0 lg:pl-0" : "border-l border-garis"} ${
                i === ringkasan.length - 1 ? "md:pr-0" : ""
              }`}
            >
              <dd className="font-serif text-[22px] font-bold text-hutan md:text-[27px] lg:text-[32px]">
                <Hitung ke={s.angka} />
              </dd>
              <dt className="mt-0.5 text-[12.5px] text-redup lg:mt-1 lg:text-[13.5px]">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3 md:gap-3.5 lg:gap-5">
        {/* min-h naik di lg: pada kolom selebar ~560px, 150px membuat gapura
            tampak seperti strip, bukan foto. */}
        <Foto
          src="/gambar/gapura-majegan.svg"
          keterangan="Gapura masuk Padukuhan Majegan"
          prioritas
          sizes="(min-width: 1024px) 42vw, (min-width: 768px) 33vw, 100vw"
          className="aspect-[16/10] rounded-xl border border-garis md:aspect-auto md:min-h-[150px] md:flex-1 lg:min-h-[340px] lg:rounded-2xl"
        />

        <div
          data-reveal
          data-jeda="5"
          className={`${kartu()} px-4 py-4 md:px-5 md:py-4.5 lg:px-6 lg:py-5.5`}
        >
          <h2 className="mb-3 font-serif text-[15px] font-semibold text-hutan lg:mb-4 lg:text-[17px]">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
            {aksesCepat.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex min-h-11 items-center gap-2.5 rounded-[10px] border border-garis p-3 text-tinta transition-colors duration-200 ease-out hover:border-daun hover:bg-krem hover:text-hutan lg:gap-3 lg:p-4"
              >
                <Ikon nama={a.ikon} ukuran={20} className="flex-none text-daun" />
                <span className="text-[13px] font-semibold lg:text-sm">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
