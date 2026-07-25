import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { alurPengaduan, kategoriPengaduan } from "@/content/majegan";
import { Identitas } from "@/components/identitas";
import { Ikon } from "@/components/ikon";
import { buatKodeTiket, periksaPengaduan } from "@/lib/pengaduan";

export const metadata: Metadata = {
  title: "Kirim Pengaduan",
  description: "Sampaikan keluhan atau usulan Anda. Identitas pelapor tidak ditampilkan ke publik.",
};

async function kirim(formData: FormData) {
  "use server";

  const galat = periksaPengaduan(formData);
  if (galat) redirect(`/pengaduan?galat=${galat}`);

  // ponytail: laporan belum disimpan — tabel `pengaduan` (Bab 8 PRD) menyusul
  // bersama Prisma. Kode tiket sudah dibuat supaya alur & format tiketnya pasti.
  redirect(`/pengaduan/terkirim?kode=${buatKodeTiket()}`);
}

const pesanGalat: Record<string, string> = {
  isi: "Isi laporan wajib diisi.",
  kategori: "Pilih salah satu kategori terlebih dahulu.",
  identitas: "Nama dan kontak wajib diisi, kecuali laporan dikirim anonim.",
};

export default async function Pengaduan({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  const { galat } = await searchParams;
  const pesan = galat ? pesanGalat[galat] : undefined;

  const kotak =
    "w-full rounded-[9px] border-[1.5px] border-garis-tebal bg-kertas px-3.5 py-3 text-sm text-tinta placeholder:text-samar focus:border-daun";
  const label = "mb-1.5 block text-[13px] font-bold text-tinta";
  const wajib = <span className="text-bata">*</span>;

  return (
    <div className="grid items-start gap-8 px-4 py-6 md:grid-cols-[1fr_340px] md:px-12 md:pt-8.5 md:pb-11.5">
      <form
        action={kirim}
        className="rounded-2xl border border-garis bg-kertas px-5 py-6 md:px-8.5 md:py-7.5"
      >
        <h1 className="mb-1.5 font-serif text-2xl font-semibold text-hutan md:text-[27px]">
          Kirim Pengaduan / Aspirasi
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-teks">
          Sampaikan keluhan atau usulan Anda. Identitas pelapor{" "}
          <strong>tidak pernah ditampilkan ke publik</strong>.
        </p>

        {pesan && (
          <p
            role="alert"
            className="mb-5 rounded-[10px] border border-bata/40 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
          >
            {pesan}
          </p>
        )}

        <fieldset className="mb-4.5">
          <legend className={label}>Kategori {wajib}</legend>
          <div className="flex flex-wrap gap-2">
            {kategoriPengaduan.map((k) => (
              <label
                key={k}
                className="cursor-pointer rounded-full border border-garis-tebal px-3.5 py-1.5 text-xs font-semibold text-teks transition select-none hover:border-daun hover:text-hutan has-checked:border-hutan has-checked:bg-hutan has-checked:font-bold has-checked:text-krem"
              >
                {/* `required` pada satu radio membuat seluruh grup wajib dipilih. */}
                <input type="radio" name="kategori" value={k} required className="sr-only" />
                {k}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-4">
          <label htmlFor="lokasi" className={label}>
            Lokasi <span className="font-medium text-samar">(opsional)</span>
          </label>
          <input id="lokasi" name="lokasi" className={kotak} placeholder="RT/RW atau titik lokasi" />
        </div>

        <label htmlFor="isi" className={label}>
          Isi laporan {wajib}
        </label>
        <textarea
          id="isi"
          name="isi"
          required
          rows={4}
          className={kotak}
          placeholder="Ceritakan apa yang terjadi, di mana, dan sejak kapan…"
        />

        <label htmlFor="foto" className={`${label} mt-4`}>
          Lampiran foto{" "}
          <span className="font-medium text-samar">(opsional, maks. 3 · ≤ 2 MB)</span>
        </label>
        {/* ponytail: unggahan belum diproses — butuh Vercel Blob (ADM-5, Minggu 2). */}
        <label
          htmlFor="foto"
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-garis-tebal bg-krem px-4 py-5 text-center text-[13px] text-samar hover:border-daun"
        >
          <Ikon nama="foto" ukuran={26} />
          <span>
            Seret foto ke sini atau <strong className="text-daun">pilih dari galeri</strong>
          </span>
        </label>
        <input id="foto" name="foto" type="file" accept="image/*" multiple className="sr-only" />

        <Identitas kotak={kotak} label={label} />

        <div className="mt-5.5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="min-h-11 rounded-[10px] bg-emas px-7 py-3.5 text-[15px] font-extrabold text-hutan transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(138,109,43,.35)]"
          >
            Kirim Pengaduan
          </button>
          <button
            type="reset"
            className="px-4.5 py-3.5 text-sm font-semibold text-redup hover:text-hutan"
          >
            Batal
          </button>
          <span className="flex-1" />
          <span className="text-xs text-samar">
            Laporan tersimpan aman — hanya perangkat dusun yang dapat membacanya.
          </span>
        </div>
      </form>

      <aside className="flex flex-col gap-3.5">
        <div className="rounded-[13px] border border-garis bg-kertas px-5.5 py-5">
          <h2 className="mb-3 font-serif text-base font-semibold text-hutan">Bagaimana alurnya?</h2>
          <ol className="flex flex-col text-[13px] text-teks">
            {alurPengaduan.map((a, i) => {
              const akhir = i === alurPengaduan.length - 1;
              return (
                <li key={a} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex size-6 flex-none items-center justify-center rounded-full text-xs font-extrabold ${
                        akhir ? "bg-hutan text-emas" : "bg-emas text-hutan"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {!akhir && <span className="w-0.5 flex-1 bg-garis" />}
                  </div>
                  <span className={akhir ? "pt-0.5" : "pt-0.5 pb-3.5"}>{a}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <Link
          href="/pengaduan/lacak"
          className="flex items-center gap-2.5 rounded-[13px] border border-garis bg-kertas px-5 py-4 text-[13.5px] font-semibold text-hutan hover:border-daun"
        >
          <Ikon nama="cari" ukuran={16} className="flex-none text-daun" />
          Sudah pernah lapor? Lacak dengan kode tiket
        </Link>

        <div className="rounded-[13px] border border-emas-garis bg-emas-muda px-5 py-4.5">
          <div className="mb-2 flex items-center gap-2.5">
            <Ikon nama="gembok" ukuran={16} className="text-emas-tua" />
            <strong className="text-[13.5px] text-emas-teks">Privasi pelapor</strong>
          </div>
          <p className="text-[12.5px] leading-relaxed text-emas-teks">
            Identitas &amp; kontak hanya dilihat perangkat dusun untuk keperluan tindak lanjut —
            tidak pernah tampil ke publik.
          </p>
        </div>
      </aside>
    </div>
  );
}
