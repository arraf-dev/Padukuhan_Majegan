"use client";

import { useState } from "react";
import { kategoriBerita, type KategoriBerita } from "@/content/majegan";
import { Atap, CentangBulat, Ikon } from "@/components/ikon";
import { IsianBerkas } from "@/components/isian-berkas";
import { tanggalKapital } from "@/lib/tanggal";

const BATAS_CAPTION = 2200;

const langkah = ["Foto", "Tulis", "Tayang"];

export type BeritaAwal = {
  id: string;
  judul: string;
  konten: string;
  kategori: string;
  lokasi: string;
  gambarSampul: string;
  tanggal: string;
};

/**
 * Komposer berita 3 langkah (ADM-1). Pratinjau di kanan memakai state yang sama
 * dengan form, jadi yang dilihat penulis benar-benar bentuk kartunya di halaman
 * Berita. Dipakai untuk tulis baru maupun sunting — bedanya cuma `awal`.
 */
export function Komposer({
  aksi,
  awal,
  galat,
}: {
  aksi: (data: FormData) => Promise<void>;
  awal?: BeritaAwal;
  galat?: string;
}) {
  const [gambar, setGambar] = useState(awal?.gambarSampul ?? "");
  const [judul, setJudul] = useState(awal?.judul ?? "");
  const [caption, setCaption] = useState(awal?.konten ?? "");
  const [lokasi, setLokasi] = useState(awal?.lokasi ?? "");
  const [kategori, setKategori] = useState<KategoriBerita | null>(
    kategoriBerita.find((k) => k === awal?.kategori) ?? null,
  );

  const selesai = [Boolean(gambar.trim()), Boolean(judul.trim() && caption.trim()), Boolean(kategori)];
  // Foto masih opsional selama unggahan belum aktif — jangan halangi berita
  // terbit karena perangkat dusun tidak punya URL gambar.
  const siap = selesai[1] && selesai[2];
  const tanggal = awal?.tanggal ?? new Date().toISOString();

  const kotak =
    "w-full rounded-[9px] border-[1.5px] bg-kertas px-3.5 py-3 text-sm text-tinta placeholder:text-samar";
  const label = "mb-1.5 block text-[13px] font-bold text-tinta";
  const wajib = <span className="text-bata">*</span>;

  return (
    <form
      action={aksi}
      // max-w di lg: rail pratayang dipatok 460px, tanpa batas kolom penyunting
      // melar sampai 1400px+ di monitor lebar dan barisnya jadi sulit dibaca.
      className="grid items-start gap-7 px-4 py-6 md:grid-cols-[1fr_460px] md:px-8.5 md:pt-7.5 md:pb-9.5 lg:mx-auto lg:w-full lg:max-w-[1400px] lg:gap-10 lg:px-12 lg:pt-9 lg:pb-12"
    >
      <input type="hidden" name="id" value={awal?.id ?? ""} />
      <input type="hidden" name="kategori" value={kategori ?? ""} />

      <div className="rounded-2xl border border-garis bg-kertas px-5 py-6 md:px-7.5 md:py-6.5 lg:px-9 lg:py-8">
        {galat && (
          <p
            role="alert"
            className="mb-5 rounded-[10px] border border-bata/40 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
          >
            {galat === "berkas"
              ? "Foto harus berformat JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB."
              : galat === "panjang"
                ? "Judul maksimal 200 karakter dan tulisan maksimal 2.200 karakter."
                : "Judul, tulisan, dan kategori wajib terisi sebelum disimpan."}
          </p>
        )}

        {/* langkah */}
        <ol className="mb-6 flex flex-wrap items-center gap-2.5">
          {langkah.map((l, i) => (
            <li key={l} className="flex items-center gap-2.5">
              {i > 0 && <span className="h-[1.5px] w-6.5 bg-garis-tebal" />}
              <span
                className={`flex items-center gap-2 text-[12.5px] font-extrabold ${
                  selesai[i] ? "text-hutan" : "text-samar"
                }`}
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-xs ${
                    selesai[i]
                      ? "bg-emas text-hutan"
                      : "border-[1.5px] border-garis-tebal text-samar"
                  }`}
                >
                  {i + 1}
                </span>
                {l}
              </span>
            </li>
          ))}
        </ol>

        {/* 1 · foto */}
        <span className={label}>
          Foto kegiatan <span className="font-medium text-samar">(opsional)</span>
        </span>
        {awal?.gambarSampul && <input type="hidden" name="gambarSampul" value={awal.gambarSampul} />}
        <div className="grid gap-3.5 sm:grid-cols-[190px_1fr]">
          <div className="foto flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-garis">
            {gambar.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element -- pratinjau unggahan lokal/Blob
              <img src={gambar} alt="" className="size-full object-cover" />
            ) : (
              <span className="foto-cap text-[10px]">Foto belum ada</span>
            )}
          </div>
          <IsianBerkas
            name="gambarSampulBerkas"
            awal={awal?.gambarSampul}
            onPilih={setGambar}
          />
        </div>

        {/* 2 · tulis */}
        <label htmlFor="judul" className={`${label} mt-5`}>
          Judul berita {wajib}
        </label>
        <input
          id="judul"
          name="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul singkat kegiatan…"
          className={`${kotak} ${judul ? "border-daun" : "border-garis-tebal"}`}
        />

        <label htmlFor="lokasi" className={`${label} mt-4`}>
          Lokasi <span className="font-medium text-samar">(opsional)</span>
        </label>
        <input
          id="lokasi"
          name="lokasi"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          placeholder="Balai Padukuhan, RT 03, …"
          className={`${kotak} border-garis-tebal`}
        />

        <div className="mt-4 mb-1.5 flex items-baseline justify-between">
          <label htmlFor="konten" className="text-[13px] font-bold text-tinta">
            Tulisan / caption {wajib}
          </label>
          <span className="text-[11px] text-samar">
            {caption.length.toLocaleString("id-ID")} / {BATAS_CAPTION.toLocaleString("id-ID")}
          </span>
        </div>
        <textarea
          id="konten"
          name="konten"
          rows={4}
          maxLength={BATAS_CAPTION}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ceritakan kegiatannya seperti menulis caption… Pisahkan paragraf dengan satu baris kosong."
          className={`${kotak} border-garis-tebal leading-relaxed`}
        />

        <fieldset className="mt-4">
          <legend className={label}>Kategori {wajib}</legend>
          <div className="flex flex-wrap gap-2">
            {kategoriBerita.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kategori === k}
                onClick={() => setKategori(k)}
                className={`rounded-full px-3.5 py-2 text-[12.5px] ${
                  kategori === k
                    ? "bg-hutan font-bold text-krem"
                    : "border border-garis-tebal font-semibold text-teks hover:border-daun hover:text-hutan"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 3 · tayang — dua tombol submit, satu action */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-garis pt-5">
          <button
            type="submit"
            name="status"
            value="terbit"
            disabled={!siap}
            className="min-h-11 rounded-[10px] bg-emas px-7 py-3.5 text-[15px] font-extrabold text-hutan transition enabled:hover:shadow-[0_6px_16px_rgba(138,109,43,.35)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Tayangkan Sekarang
          </button>
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={!siap}
            className="min-h-11 rounded-[10px] border-[1.5px] border-daun px-5 py-3 text-sm font-bold text-hutan hover:bg-[#EFE9D6] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Simpan Draf
          </button>
          <span className="flex-1" />
          <span className="text-xs text-samar">
            Draf tidak tampil di halaman publik sampai ditayangkan.
          </span>
        </div>
      </div>

      {/* ---------- Pratinjau ---------- */}
      {/* Menempel di lg: penyunting jauh lebih panjang dari pratayang, tanpa ini
          pratayang tergulir hilang justru saat isinya sedang diketik. */}
      <div className="flex flex-col gap-3.5 lg:sticky lg:top-6 lg:gap-4">
        <div className="rounded-2xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="mb-3 font-serif text-[15px] font-semibold text-hutan">
            Pratinjau di website
          </h2>
          <article className="overflow-hidden rounded-2xl border border-garis bg-kertas">
            <div className="relative px-2 pt-2">
              <div className="foto flex aspect-square items-center justify-center overflow-hidden rounded-[9px]">
                {gambar.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element -- pratinjau unggahan lokal/Blob
                  <img src={gambar} alt="" className="size-full object-cover" />
                ) : (
                  <span className="foto-cap text-[10px]">Foto belum ada</span>
                )}
              </div>
              {kategori && (
                <span className="absolute top-4 left-4 rounded-full bg-hutan/90 px-2.5 py-1 text-[9.5px] font-extrabold tracking-[.08em] text-emas">
                  {kategori.toUpperCase()}
                </span>
              )}
            </div>
            <div className="px-3 pt-2.5 pb-3.5">
              <div className="flex items-center gap-1.5">
                <Atap ukuran={17} className="flex-none" />
                <span className="font-mono text-[9.5px] font-bold tracking-[.06em] text-emas-tua">
                  {tanggalKapital(tanggal)}
                </span>
                {lokasi.trim() && (
                  <>
                    <span className="flex-1" />
                    <span className="inline-flex items-center gap-1 text-[9.5px] text-samar">
                      <Ikon nama="pin" ukuran={10} />
                      {lokasi}
                    </span>
                  </>
                )}
              </div>
              <h3 className="mt-1.5 mb-1 font-serif text-[13.5px] leading-snug font-semibold text-tinta">
                {judul || "Judul berita akan tampil di sini"}
              </h3>
              <p className="line-clamp-3 text-[11px] leading-snug text-teks">
                {caption || "Tulisan Anda akan muncul di bawah judul…"}
              </p>
            </div>
          </article>
        </div>

        <div className="rounded-2xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="mb-2.5 font-serif text-[15px] font-semibold text-hutan">Siap tayang?</h2>
          <ul className="flex flex-col gap-2 text-[13px] text-teks">
            {["Foto (opsional)", "Judul & tulisan terisi", "Kategori dipilih"].map((t, i) => (
              <li key={t} className={`flex items-center gap-2.5 ${selesai[i] ? "" : "text-pucat"}`}>
                {selesai[i] ? (
                  <CentangBulat className="flex-none" />
                ) : (
                  <span className="size-[15px] flex-none rounded-full border-[1.5px] border-garis-tebal" />
                )}
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-[10px] border border-emas-garis bg-emas-muda px-3.5 py-2.5 text-[11.5px] leading-relaxed text-emas-teks">
            Setelah &ldquo;Tayangkan&rdquo;, berita langsung muncul di Beranda &amp; halaman Berita —
            tanpa perlu persetujuan tambahan.
          </p>
        </div>
      </div>
    </form>
  );
}
