import Image from "next/image";
import type { GambarSejarah, SumberSejarah } from "@/content/sejarah";

type SejarahProfilProps = {
  paragraf: string[];
  gambar: readonly GambarSejarah[];
  sumber: readonly SumberSejarah[];
};

/** Narasi sejarah panjang dengan figur dan sumber yang tetap nyaman dipindai. */
export function SejarahProfil({ paragraf, gambar, sumber }: SejarahProfilProps) {
  const [peta, joglo] = gambar;

  return (
    <article className="space-y-7 lg:space-y-10">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)] lg:gap-9">
        <div className="lg:pt-2">
          <p className="mb-3 text-[11px] font-extrabold tracking-[.14em] text-emas-tua">
            JEJAK AWAL MAJEGAN
          </p>
          {paragraf[0] ? (
            <p className="font-serif text-[17px] leading-[1.85] text-tinta lg:text-[19px]">
              {paragraf[0]}
            </p>
          ) : null}
        </div>

        {peta ? (
          <figure className="overflow-hidden rounded-xl border border-garis bg-kertas shadow-[0_8px_28px_rgba(33,50,40,.08)] lg:rounded-2xl">
            <Image
              src={peta.src}
              alt={peta.alt}
              width={940}
              height={666}
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-garis px-4 py-3 text-[12px] leading-relaxed text-redup">
              {peta.caption}
            </figcaption>
          </figure>
        ) : null}
      </div>

      {paragraf[1] ? (
        <p className="max-w-4xl text-[15px] leading-[1.85] text-teks lg:text-[16.5px]">
          {paragraf[1]}
        </p>
      ) : null}

      {joglo ? (
        <figure className="overflow-hidden rounded-xl border border-garis bg-kertas shadow-[0_8px_28px_rgba(33,50,40,.08)] lg:rounded-2xl">
          <Image
            src={joglo.src}
            alt={joglo.alt}
            width={850}
            height={416}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-garis px-4 py-3 text-[12px] leading-relaxed text-redup">
            {joglo.caption}
          </figcaption>
        </figure>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
        {paragraf.slice(2).map((isi) => (
          <p key={isi} className="text-[15px] leading-[1.85] text-teks lg:text-[16.5px]">
            {isi}
          </p>
        ))}
      </div>

      <aside aria-labelledby="sumber-sejarah" className="border-t border-garis pt-5">
        <h3 id="sumber-sejarah" className="mb-3 font-serif text-base font-semibold text-hutan">
          Sumber sejarah
        </h3>
        <ol className="list-decimal space-y-2 pl-5 text-[12.5px] leading-relaxed text-redup marker:font-semibold marker:text-emas-tua">
          {sumber.map((item) => (
            <li key={item.teks}>
              {item.tautan ? (
                <a
                  href={item.tautan}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-garis-tebal underline-offset-2 transition-colors duration-200 hover:text-hutan"
                >
                  {item.teks}
                </a>
              ) : (
                item.teks
              )}
            </li>
          ))}
        </ol>
      </aside>
    </article>
  );
}
