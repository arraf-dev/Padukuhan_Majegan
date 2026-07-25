"use client";

import { useState } from "react";

/**
 * Sakelar anonim + isian identitas.
 *
 * Klien yang memegang state supaya `required` bisa ikut mati saat anonim —
 * tanpa itu browser tidak menahan pengiriman, laporan bolak-balik ke server,
 * dan tulisan warga yang sudah panjang ikut terhapus. Validasi di server tetap
 * jalan sebagai pengaman.
 */
export function Identitas({ kotak, label }: { kotak: string; label: string }) {
  const [anonim, setAnonim] = useState(false);

  return (
    <>
      <label className="my-4 flex items-center justify-between gap-4 rounded-[10px] border border-garis bg-krem px-4 py-3.5">
        <span>
          <span className="block text-[13.5px] font-bold text-tinta">Kirim sebagai anonim</span>
          <span className="block text-xs text-samar">
            Nama &amp; kontak disembunyikan dari tanggapan
          </span>
        </span>
        <input
          type="checkbox"
          name="anonim"
          checked={anonim}
          onChange={(e) => setAnonim(e.target.checked)}
          className="peer sr-only"
        />
        <span className="relative inline-block h-6 w-11 flex-none rounded-full bg-garis-tebal transition peer-checked:bg-daun peer-checked:[&>span]:translate-x-5 peer-focus-visible:outline-3 peer-focus-visible:outline-emas">
          <span className="absolute top-[3px] left-[3px] size-[18px] rounded-full bg-kertas shadow transition" />
        </span>
      </label>

      {!anonim && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nama" className={label}>
              Nama lengkap <span className="text-bata">*</span>
            </label>
            <input id="nama" name="nama" required className={kotak} placeholder="Nama sesuai KTP" />
          </div>
          <div>
            <label htmlFor="kontak" className={label}>
              Kontak (HP/WA) <span className="text-bata">*</span>
            </label>
            <input
              id="kontak"
              name="kontak"
              required
              inputMode="tel"
              className={kotak}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>
        </div>
      )}
    </>
  );
}
