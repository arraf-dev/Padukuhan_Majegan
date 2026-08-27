import type { Metadata } from "next";
import { desa } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { Foto, JudulSection } from "@/components/potongan";
import { kartu } from "@/components/primitif";
import { profilDesa } from "@/lib/profil";

export const metadata: Metadata = { title: "Profil" };

const bagian = [
  { id: "sejarah", label: "Sejarah" },
  { id: "visi-misi", label: "Visi & Misi" },
  { id: "struktur", label: "Struktur Organisasi" },
  { id: "wilayah", label: "Wilayah & Kontak" },
];

export default async function Profil() {
  const profil = await profilDesa();

  return (
    <div className="wadah gap-10 px-4 py-8 md:grid md:grid-cols-[210px_1fr] md:px-12 md:pt-10 md:pb-12 lg:grid-cols-[240px_1fr] lg:gap-14 lg:px-16 lg:pt-12 lg:pb-16">
      {/* ponytail: daftar isi tanpa scroll-spy — anchor biasa sudah cukup.
          top-24 mulai md: header desktop sekarang sticky, top-5 akan terselip. */}
      <nav className="sticky top-5 mb-6 self-start max-md:hidden md:top-24">
        <div className="mb-2.5 text-[11px] font-bold tracking-[.12em] text-samar">
          DI HALAMAN INI
        </div>
        <div className="flex flex-col border-l-2 border-garis">
          {bagian.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="-ml-0.5 border-l-2 border-transparent px-3.5 py-2 text-[13.5px] text-redup transition-colors duration-200 ease-out hover:border-emas hover:font-bold hover:text-hutan"
            >
              {b.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="flex min-w-0 flex-col gap-10 lg:gap-14">
        <section id="sejarah" data-reveal className="scroll-mt-6 md:scroll-mt-20">
          <JudulSection anak="Sejarah Padukuhan" />
          <div className="grid items-start gap-6 md:grid-cols-[1.5fr_1fr] lg:gap-9">
            <div className="text-[15px] leading-[1.8] text-teks lg:text-[16.5px] lg:leading-[1.85]">
              {profil.sejarah.map((p, i) => (
                <p key={i} className={i === 0 ? "mb-3.5" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <Foto
              src="/gambar/balai-dusun.svg"
              keterangan="Balai Dusun Majegan"
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-[190px] rounded-xl border border-garis lg:h-[280px] lg:rounded-2xl"
            />
          </div>
        </section>

        <section id="visi-misi" data-reveal className="scroll-mt-6 md:scroll-mt-20">
          <JudulSection
            anak="Visi & Misi"
            sisipan={
              profil.visiMisiDraft ? (
                <span className="flex-none rounded-full border border-emas-garis bg-emas-muda px-2.5 py-1 text-[11px] font-extrabold tracking-[.08em] text-emas-tua">
                  DRAFT
                </span>
              ) : undefined
            }
          />
          <div className="grid gap-4.5 md:grid-cols-2 lg:gap-6">
            <div className="rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-panel px-6 py-6 text-redup lg:rounded-2xl lg:px-8 lg:py-8">
              <div className="mb-2.5 text-[11px] font-bold tracking-[.14em] text-emas-tua">VISI</div>
              <p className="font-serif text-[17px] leading-[1.65] font-medium text-pretty italic lg:text-[19px] lg:leading-[1.7]">
                {profil.visi}
              </p>
            </div>
            <div className="rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-panel px-6 py-6 text-redup lg:rounded-2xl lg:px-8 lg:py-8">
              <div className="mb-3 text-[11px] font-bold tracking-[.14em] text-emas-tua">MISI</div>
              <ol className="flex flex-col gap-2.5 text-sm leading-relaxed italic lg:gap-3 lg:text-[15px]">
                {profil.misi.map((m, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="flex size-[22px] flex-none items-center justify-center rounded-full bg-foto text-xs font-extrabold text-pucat">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="struktur" data-reveal className="scroll-mt-6 md:scroll-mt-20">
          <JudulSection anak="Struktur Organisasi" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3.5 rounded-xl bg-hutan px-6 py-4 text-krem shadow-[0_4px_14px_rgba(13,56,37,.25)] lg:gap-4 lg:rounded-2xl lg:px-8 lg:py-5">
              <Foto
                src={profil.dukuh.foto}
                keterangan={profil.dukuh.jabatan}
                sizes="46px"
                className="size-[46px] flex-none rounded-full border-2 border-emas lg:size-[58px]"
              />
              <div>
                <div className="font-serif text-base font-semibold lg:text-[19px]">{profil.dukuh.nama}</div>
                <div className="text-xs font-semibold text-emas">{profil.dukuh.jabatan}</div>
              </div>
            </div>
            <div className="h-[22px] w-0.5 bg-garis-tebal" />
            <div className="h-0.5 w-3/4 bg-garis-tebal" />
            <div className="grid w-full grid-cols-2 gap-4 pt-5 md:grid-cols-4 lg:gap-5 lg:pt-7">
              {profil.perangkat.map((p) => (
                <div
                  key={p.id}
                  className={`${kartu()} p-3.5 text-center hover:border-daun lg:p-5`}
                >
                  <Foto
                    src={p.foto}
                    keterangan={p.jabatan}
                    sizes="40px"
                    className="mx-auto mb-2 size-10 rounded-full border-[1.5px] border-emas lg:mb-3 lg:size-14"
                  />
                  <div className="text-[13.5px] font-bold text-tinta lg:text-[15px]">{p.nama}</div>
                  <div className="text-[11.5px] font-semibold text-emas-tua lg:text-[12.5px]">{p.jabatan}</div>
                </div>
              ))}
            </div>
            <p className="mt-3.5 text-center text-[12.5px] text-samar">{profil.catatanStruktur}</p>
          </div>
        </section>

        <section id="wilayah" data-reveal className="scroll-mt-6 md:scroll-mt-20">
          <JudulSection anak="Wilayah & Kontak" />
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] lg:gap-8">
            <div className="flex flex-col gap-2">
              <div className="relative h-[230px] overflow-hidden rounded-xl border border-garis bg-foto lg:h-[380px] lg:rounded-2xl">
                <iframe
                  src="/peta-majegan.html"
                  title="Peta wilayah Padukuhan Majegan"
                  className="block size-full border-0"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2.5 border-b border-garis bg-kertas/95 px-3 py-[7px]">
                  <span className="font-serif text-xs font-semibold text-hutan">
                    Peta wilayah {desa.nama}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[.03em] text-samar max-md:hidden">
                    PANDOWOHARJO, SLEMAN · SUMBER OPENSTREETMAP
                  </span>
                </div>
              </div>
              <p className="text-[12.5px] leading-snug text-teks">{profil.catatanPeta}</p>
            </div>

            <address className={`${kartu()} px-6 py-6 text-[13.5px] leading-[1.75] text-teks not-italic lg:px-7 lg:py-7 lg:text-[14.5px]`}>
              <div className="mb-2 font-serif text-base font-semibold text-hutan lg:text-[17px]">
                Kantor Padukuhan
              </div>
              {desa.alamat.map((baris) => (
                <div key={baris}>{baris}</div>
              ))}
              {/* Hijau, bukan ragam `primer` emas: ini kontak langsung, bukan CTA utama halaman. */}
              <a
                href={desa.whatsappUrl}
                className="mt-3.5 inline-flex items-center gap-2 rounded-[10px] bg-daun px-4.5 py-2.5 text-[13.5px] font-bold text-krem transition-colors duration-200 ease-out hover:bg-hutan"
              >
                <Ikon nama="obrolan" ukuran={15} />
                Hubungi via WhatsApp
              </a>
            </address>
          </div>
        </section>
      </div>
    </div>
  );
}
