"use client";

import { useState } from "react";
import { Ikon } from "@/components/ikon";

export function IsianBerkas({
  name,
  jenis = "gambar",
  awal,
  onPilih,
}: {
  name: string;
  jenis?: "gambar" | "dokumen";
  awal?: string;
  onPilih?: (url: string) => void;
}) {
  const [nama, setNama] = useState("");
  const accept = jenis === "gambar" ? "image/jpeg,image/png,image/webp" : "application/pdf,image/jpeg,image/png,image/webp";

  return (
    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-krem px-4 py-5 text-center text-[13px] text-samar transition-colors hover:border-daun">
      <Ikon nama={jenis === "gambar" ? "foto" : "berkas"} ukuran={28} className="text-emas-tua" />
      <span>
        <strong className="text-daun">Pilih {jenis === "gambar" ? "foto" : "berkas"}</strong> dari komputer/HP
      </span>
      <span className="text-[11px]">
        {nama || (awal ? "Pilih baru untuk mengganti berkas saat ini" : jenis === "gambar" ? "JPG/PNG/WEBP · maks 4 MB" : "PDF/JPG/PNG/WEBP · maks 4 MB")}
      </span>
      <input
        type="file"
        name={name}
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const berkas = e.target.files?.[0];
          setNama(berkas?.name ?? "");
          if (berkas && onPilih) onPilih(URL.createObjectURL(berkas));
        }}
      />
    </label>
  );
}
