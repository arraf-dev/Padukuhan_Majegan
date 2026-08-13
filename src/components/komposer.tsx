"use client";

import { useState } from "react";
import { kategoriBerita, type KategoriBerita } from "@/content/majegan";
import { Atap, CentangBulat, Ikon } from "@/components/ikon";
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
 *
 * ponytail: isian foto masih berupa tautan gambar, bukan unggahan. Pemilih
 * berkas dihapus, bukan dibiarkan sebagai hiasan — file-nya toh belum bisa
 * dikirim ke mana pun. Kembalikan dropzone-nya begitu Vercel Blob aktif (ADM-5).
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
  className="grid gap-7 px-4 py-6 md:grid-cols-1 md:px-8.5 md:pt-7.5 md:pb-9.5"
>
      <input type="hidden" name="id" value={awal?.id ?? ""} />
      <input type="hidden" name="kategori" value={kategori ?? ""} />

      <div className="rounded-2xl border border-garis bg-kertas px-5 py-6 md:px-7.5 md:py-6.5">
        {galat && (
          <p
            role="alert"
            className="mb-5 rounded-[10px] border border-bata/40 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
          >
            Judul, tulisan, dan kategori wajib terisi sebelum disimpan.
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
        <label htmlFor="gambarSampul" className={label}>
          Foto kegiatan <span className="font-medium text-samar">(opsional)</span>
        </label>
        <div className="flex items-stretch gap-3.5">
          {gambar.trim() && (
            <div className="size-[190px] flex-none overflow-hidden rounded-xl border border-garis">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL luar, belum ada Blob */}
              <img src={gambar} alt="" className="size-full object-cover" />
            </div>
          )}
<div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border-2 border-dashed border-garis-tebal bg-krem px-5 py-6">

  <label
    htmlFor="gambarSampul"
    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-hutan px-4 py-3 text-sm font-semibold text-krem hover:bg-daun transition"
  >
    <Ikon nama="foto" ukuran={18} />
    Choose File
  </label>

  <input
    id="gambarSampul"
    type="file"
    accept="image/*"
    className="hidden"
  />

  <p className="text-center text-xs text-samar">
    PNG, JPG, JPEG
  </p>

</div>
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
            Upload
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
          
        </div>
      </div>

      
    </form>
  );
}
