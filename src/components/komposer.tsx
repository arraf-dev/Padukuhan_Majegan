"use client";

import { useState } from "react";
import { kategoriBerita, type KategoriBerita } from "@/content/majegan";
import { Atap, CentangBulat, Ikon } from "@/components/ikon";
import { tanggalKapital } from "@/lib/tanggal";

const BATAS_CAPTION = 2200;

const langkah = ["Foto", "Tulis", "Tayang"];

/**
 * Komposer berita 3 langkah. Pratinjau di kanan memakai state yang sama dengan
 * form, jadi yang dilihat penulis benar-benar bentuk kartunya di halaman Berita.
 *
 * ponytail: belum menyimpan apa pun — "Tayangkan" & "Simpan Draf" menunggu
 * ADM-1 + Prisma. Foto dipratinjau lewat object URL, belum diunggah (ADM-5).
 */
export function Komposer() {
  const [foto, setFoto] = useState<{ url: string; nama: string } | null>(null);
  const [judul, setJudul] = useState("");
  const [caption, setCaption] = useState("");
  const [kategori, setKategori] = useState<KategoriBerita | null>(null);

  const selesai = [Boolean(foto), Boolean(judul.trim() && caption.trim()), Boolean(kategori)];
  const siap = selesai.every(Boolean);
  const hariIni = new Date().toISOString();

  const kotak =
    "w-full rounded-[9px] border-[1.5px] bg-kertas px-3.5 py-3 text-sm text-tinta placeholder:text-samar";
  const label = "mb-1.5 block text-[13px] font-bold text-tinta";
  const wajib = <span className="text-bata">*</span>;

  const pilihFoto = (berkas: File | undefined) => {
    if (!berkas) return;
    if (foto) URL.revokeObjectURL(foto.url);
    setFoto({ url: URL.createObjectURL(berkas), nama: berkas.name });
  };

  const hapusFoto = () => {
    if (foto) URL.revokeObjectURL(foto.url);
    setFoto(null);
  };

  return (
    <div className="grid items-start gap-7 px-4 py-6 md:grid-cols-[1fr_460px] md:px-8.5 md:pt-7.5 md:pb-9.5">
      <div className="rounded-2xl border border-garis bg-kertas px-5 py-6 md:px-7.5 md:py-6.5">
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
        <span className={label}>Foto kegiatan {wajib}</span>
        <div className="flex items-stretch gap-3.5">
          {foto && (
            <div className="relative size-[190px] flex-none overflow-hidden rounded-xl border border-garis">
              {/* eslint-disable-next-line @next/next/no-img-element -- object URL lokal, belum diunggah */}
              <img src={foto.url} alt={foto.nama} className="size-full object-cover" />
              <button
                type="button"
                onClick={hapusFoto}
                aria-label="Hapus foto"
                className="absolute top-2 right-2 flex size-[22px] items-center justify-center rounded-full bg-hutan/75 text-xs text-krem"
              >
                ✕
              </button>
            </div>
          )}
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-krem px-4 py-8 text-center text-[13px] text-samar hover:border-daun">
            <Ikon nama="foto" ukuran={30} />
            <span>
              Seret foto ke sini atau{" "}
              <strong className="text-daun">pilih dari komputer/HP</strong>
            </span>
            <span className="text-[11px]">JPG/PNG · otomatis dipotong 1:1 · maks 5 MB</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => pilihFoto(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* 2 · tulis */}
        <label htmlFor="judul" className={`${label} mt-5`}>
          Judul berita {wajib}
        </label>
        <input
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul singkat kegiatan…"
          className={`${kotak} ${judul ? "border-daun" : "border-garis-tebal"}`}
        />

        <div className="mt-4 mb-1.5 flex items-baseline justify-between">
          <label htmlFor="caption" className="text-[13px] font-bold text-tinta">
            Tulisan / caption {wajib}
          </label>
          <span className="text-[11px] text-samar">
            {caption.length.toLocaleString("id-ID")} / {BATAS_CAPTION.toLocaleString("id-ID")}
          </span>
        </div>
        <textarea
          id="caption"
          rows={4}
          maxLength={BATAS_CAPTION}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Ceritakan kegiatannya seperti menulis caption…"
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

        {/* 3 · tayang */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-garis pt-5">
          <button
            type="button"
            disabled={!siap}
            className="min-h-11 rounded-[10px] bg-emas px-7 py-3.5 text-[15px] font-extrabold text-hutan transition enabled:hover:shadow-[0_6px_16px_rgba(138,109,43,.35)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Tayangkan Sekarang
          </button>
          <button
            type="button"
            className="min-h-11 rounded-[10px] border-[1.5px] border-daun px-5 py-3 text-sm font-bold text-hutan hover:bg-[#EFE9D6]"
          >
            Simpan Draf
          </button>
          <span className="flex-1" />
          <span className="text-xs text-samar">Penyimpanan draf menyusul bersama ADM-1.</span>
        </div>
      </div>

      {/* ---------- Pratinjau ---------- */}
      <div className="flex flex-col gap-3.5">
        <div className="rounded-2xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="mb-3 font-serif text-[15px] font-semibold text-hutan">
            Pratinjau di website
          </h2>
          <article className="overflow-hidden rounded-2xl border border-garis bg-kertas">
            <div className="relative px-2 pt-2">
              <div className="foto flex aspect-square items-center justify-center overflow-hidden rounded-[9px]">
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- object URL lokal
                  <img src={foto.url} alt="" className="size-full object-cover" />
                ) : (
                  <span className="foto-cap text-[10px]">Foto belum dipilih</span>
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
                  {tanggalKapital(hariIni)}
                </span>
              </div>
              <h3 className="mt-1.5 mb-1 font-serif text-[13.5px] leading-snug font-semibold text-tinta">
                {judul || "Judul berita akan tampil di sini"}
              </h3>
              <p className="line-clamp-3 text-[11px] leading-snug text-teks">
                {caption || "Tulisan Anda akan muncul di bawah judul…"}
              </p>
              <div className="mt-2 flex items-center gap-2 border-t border-dashed border-garis pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emas-garis bg-emas-muda px-2.5 py-1 text-[10px] font-extrabold text-emas-tua">
                  <Ikon nama="hati" ukuran={11} />0 warga suka
                </span>
                <span className="text-[10px] font-semibold text-redup">0 tanggapan</span>
              </div>
            </div>
          </article>
        </div>

        <div className="rounded-2xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="mb-2.5 font-serif text-[15px] font-semibold text-hutan">Siap tayang?</h2>
          <ul className="flex flex-col gap-2 text-[13px] text-teks">
            {["Foto sudah dipilih", "Judul & caption terisi", "Kategori dipilih"].map((t, i) => (
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
    </div>
  );
}
