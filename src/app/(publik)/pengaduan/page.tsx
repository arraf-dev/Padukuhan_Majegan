import type { Metadata } from "next";
import { alurPengaduan, kategoriPengaduan } from "@/content/majegan";
import { Identitas } from "@/components/identitas";
import { Ikon } from "@/components/ikon";
import { IsianBerkas } from "@/components/isian-berkas";
import { isianTebal, kartu, labelBorang, tombol } from "@/components/primitif";
import { NAMA_JEBAKAN } from "@/lib/pengaduan";
import { kirimPengaduan } from "./aksi";

export const metadata: Metadata = {
  title: "Kirim Pengaduan",
  description: "Sampaikan keluhan atau usulan Anda. Identitas pelapor tidak ditampilkan ke publik.",
};

const pesanGalat: Record<string, string> = {
  isi: "Isi laporan wajib diisi.",
  kategori: "Pilih salah satu kategori terlebih dahulu.",
  identitas: "Nama lengkap dan nomor HP/WhatsApp wajib diisi.",
  lampiran: "Lampiran harus berformat JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB.",
  penyimpanan: "Penyimpanan lampiran belum tersedia. Silakan kirim laporan tanpa lampiran terlebih dahulu.",
  gagal: "Laporan gagal tersimpan. Silakan coba lagi dalam beberapa saat.",
  jeda: "Laporan sebelumnya baru saja terkirim. Tunggu sebentar sebelum mengirim laporan berikutnya.",
};

export default async function Pengaduan({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  const { galat } = await searchParams;
  const pesan = galat ? pesanGalat[galat] : undefined;

  const wajib = <span className="text-bata">*</span>;

  return (
    <div className="wadah grid items-start gap-8 px-4 py-6 md:grid-cols-[1fr_340px] md:px-12 md:pt-10 md:pb-12 lg:grid-cols-[1fr_360px] lg:gap-10 lg:px-16 lg:pt-12 lg:pb-16">
      <form
        action={kirimPengaduan}
        data-reveal
        className={`${kartu()} px-5 py-6 md:px-8 md:py-7 lg:px-10 lg:py-9`}
      >
        {/* Jebakan bot — tak terlihat & tak bisa di-tab, jadi hanya robot yang mengisinya. */}
        <input
          type="text"
          name={NAMA_JEBAKAN}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />
        <h1 className="judul-halaman mb-1.5">Kirim Pengaduan / Aspirasi</h1>
        <p className="mb-6 text-sm leading-relaxed text-teks lg:mb-8 lg:text-[15px]">
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
          <legend className={labelBorang}>Kategori {wajib}</legend>
          <div className="flex flex-wrap gap-2">
            {kategoriPengaduan.map((k) => (
              <label
                key={k}
                className="cursor-pointer rounded-full border border-garis-tebal px-3.5 py-1.5 text-xs font-semibold text-teks transition-colors duration-200 ease-out select-none hover:border-daun hover:bg-emas-lembut hover:text-hutan has-checked:border-hutan has-checked:bg-hutan has-checked:font-bold has-checked:text-krem"
              >
                {/* `required` pada satu radio membuat seluruh grup wajib dipilih. */}
                <input type="radio" name="kategori" value={k} required className="sr-only" />
                {k}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-4">
          <label htmlFor="lokasi" className={labelBorang}>
            Lokasi <span className="font-medium text-samar">(opsional)</span>
          </label>
          <input id="lokasi" name="lokasi" className={isianTebal} placeholder="RT/RW atau titik lokasi" />
        </div>

        <label htmlFor="isi" className={labelBorang}>
          Isi laporan {wajib}
        </label>
        <textarea
          id="isi"
          name="isi"
          required
          rows={4}
          className={isianTebal}
          placeholder="Ceritakan apa yang terjadi, di mana, dan sejak kapan…"
        />

        <span className={`${labelBorang} mt-4.5`}>
          Lampiran foto <span className="font-medium text-samar">(opsional)</span>
        </span>
        <IsianBerkas name="lampiranBerkas" />

        <Identitas kotak={isianTebal} label={labelBorang} />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className={tombol("primer", "besar")}>
            Kirim Pengaduan
          </button>
          <button
            type="reset"
            className="px-4.5 py-3.5 text-sm font-semibold text-redup transition-colors duration-200 ease-out hover:text-hutan"
          >
            Batal
          </button>
          <span className="flex-1" />
          <span className="text-xs text-samar">
            Laporan tersimpan aman — hanya perangkat dusun yang dapat membacanya.
          </span>
        </div>
      </form>

      {/* Aside menempel: borang pengaduan panjang, alur & catatan privasi tetap
          terlihat sementara warga mengisi. */}
      <aside
        data-reveal
        data-jeda="1"
        className="flex flex-col gap-3.5 md:sticky md:top-24 lg:gap-4"
      >
        <div className={`${kartu()} px-6 py-5 lg:px-7 lg:py-6`}>
          <h2 className="mb-3 font-serif text-base font-semibold text-hutan lg:text-[17px]">
            Bagaimana alurnya?
          </h2>
          <ol className="flex flex-col text-[13px] text-teks lg:text-[13.5px]">
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

        <div className="rounded-xl border border-emas-garis bg-emas-muda px-5 py-4.5">
          <div className="mb-2 flex items-center gap-2.5">
            <Ikon nama="gembok" ukuran={16} className="text-emas-tua" />
            <strong className="text-[13.5px] text-emas-teks">Privasi pelapor</strong>
          </div>
          <p className="text-[12.5px] leading-relaxed text-emas-teks">
            Identitas tidak pernah tampil ke publik. Hanya SuperAdmin yang dapat melihat nama dan
            kontak; Admin tetap dapat membaca isi laporan dan lampirannya.
          </p>
        </div>
      </aside>
    </div>
  );
}
