"use client";

import { useRef, useState } from "react";
import { perBaris, rangkaiAlur, uraikanAlur, type LangkahAlur } from "@/lib/teks";

type BarisSyarat = { id: number; nilai: string };
type BarisAlur = LangkahAlur & { id: number };

const isian = "min-h-11 w-full rounded-[10px] border border-garis bg-kertas px-3.5 py-2 text-[13.5px] text-tinta placeholder:text-samar focus:border-daun focus:outline-none";
const tombolAksi = "flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-garis bg-kertas px-3 text-xs font-bold text-redup transition-colors hover:border-daun hover:text-hutan disabled:cursor-not-allowed disabled:opacity-40";

function pindahkan<T>(baris: T[], dari: number, arah: -1 | 1): T[] {
  const ke = dari + arah;
  if (ke < 0 || ke >= baris.length) return baris;

  const hasil = [...baris];
  [hasil[dari], hasil[ke]] = [hasil[ke], hasil[dari]];
  return hasil;
}

function TombolUrutan({
  label,
  urutan,
  terakhir,
  saatPindah,
  saatHapus,
}: {
  label: string;
  urutan: number;
  terakhir: boolean;
  saatPindah: (arah: -1 | 1) => void;
  saatHapus: () => void;
}) {
  return (
    <div className="flex flex-none items-center gap-1.5">
      <button type="button" className={tombolAksi} aria-label={`Naikkan ${label} ${urutan}`} title="Naikkan" disabled={urutan === 1} onClick={() => saatPindah(-1)}>
        <span aria-hidden="true">↑</span>
      </button>
      <button type="button" className={tombolAksi} aria-label={`Turunkan ${label} ${urutan}`} title="Turunkan" disabled={terakhir} onClick={() => saatPindah(1)}>
        <span aria-hidden="true">↓</span>
      </button>
      <button type="button" className={`${tombolAksi} hover:border-bata hover:text-bata`} aria-label={`Hapus ${label} ${urutan}`} onClick={saatHapus}>
        Hapus
      </button>
    </div>
  );
}

export function EditorPersyaratan({ nilaiAwal }: { nilaiAwal: string }) {
  const [baris, setBaris] = useState<BarisSyarat[]>(() => {
    const nilai = perBaris(nilaiAwal);
    return (nilai.length ? nilai : [""]).map((item, id) => ({ id, nilai: item }));
  });
  const idBerikutnya = useRef(baris.length);

  const tambah = () => setBaris((sekarang) => [...sekarang, { id: idBerikutnya.current++, nilai: "" }]);
  const ubah = (id: number, nilai: string) => setBaris((sekarang) => sekarang.map((item) => (item.id === id ? { ...item, nilai } : item)));
  const hapus = (id: number) =>
    setBaris((sekarang) => {
      const sisa = sekarang.filter((item) => item.id !== id);
      return sisa.length ? sisa : [{ id: idBerikutnya.current++, nilai: "" }];
    });

  return (
    <div className="flex flex-col gap-2.5">
      <input type="hidden" name="persyaratan" value={baris.map((item) => item.nilai.trim()).filter(Boolean).join("\n")} />
      {baris.map((item, index) => (
        <div key={item.id} className="flex flex-wrap items-center gap-2.5 rounded-xl border border-garis bg-krem p-2.5">
          <span className="flex size-8 flex-none items-center justify-center rounded-full bg-panel text-xs font-extrabold text-hutan" aria-hidden="true">
            {index + 1}
          </span>
          <label className="sr-only" htmlFor={`syarat-${item.id}`}>Syarat {index + 1}</label>
          <input id={`syarat-${item.id}`} value={item.nilai} onChange={(event) => ubah(item.id, event.target.value)} placeholder="Contoh: Fotokopi KTP" className={`${isian} min-w-48 flex-1`} />
          <TombolUrutan label="syarat" urutan={index + 1} terakhir={index === baris.length - 1} saatPindah={(arah) => setBaris((sekarang) => pindahkan(sekarang, index, arah))} saatHapus={() => hapus(item.id)} />
        </div>
      ))}
      <button type="button" onClick={tambah} className="min-h-11 self-start rounded-lg border border-daun px-3.5 text-[13px] font-bold text-hutan transition-colors hover:bg-emas-lembut">
        + Tambah syarat
      </button>
    </div>
  );
}

export function EditorAlur({ nilaiAwal }: { nilaiAwal: string }) {
  const [baris, setBaris] = useState<BarisAlur[]>(() => {
    const nilai = uraikanAlur(nilaiAwal);
    return (nilai.length ? nilai : [{ judul: "", detail: "" }]).map((item, id) => ({ ...item, id }));
  });
  const idBerikutnya = useRef(baris.length);

  const tambah = () => setBaris((sekarang) => [...sekarang, { id: idBerikutnya.current++, judul: "", detail: "" }]);
  const ubah = (id: number, kolom: keyof LangkahAlur, nilai: string) =>
    setBaris((sekarang) => sekarang.map((item) => (item.id === id ? { ...item, [kolom]: nilai } : item)));
  const hapus = (id: number) =>
    setBaris((sekarang) => {
      const sisa = sekarang.filter((item) => item.id !== id);
      return sisa.length ? sisa : [{ id: idBerikutnya.current++, judul: "", detail: "" }];
    });

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="alur" value={rangkaiAlur(baris.filter((item) => item.judul.trim() || item.detail.trim()))} />
      {baris.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-garis bg-krem p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
            <span className="flex items-center gap-2 text-[12px] font-bold tracking-[.06em] text-hutan">
              <span className="flex size-7 items-center justify-center rounded-full bg-emas text-[11px] font-extrabold">{index + 1}</span>
              LANGKAH {index + 1}
            </span>
            <TombolUrutan label="langkah" urutan={index + 1} terakhir={index === baris.length - 1} saatPindah={(arah) => setBaris((sekarang) => pindahkan(sekarang, index, arah))} saatHapus={() => hapus(item.id)} />
          </div>
          <div className="grid gap-2.5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11.5px] font-bold tracking-[.05em] text-redup" htmlFor={`judul-langkah-${item.id}`}>JUDUL LANGKAH {index + 1}</label>
              <input id={`judul-langkah-${item.id}`} value={item.judul} onChange={(event) => ubah(item.id, "judul", event.target.value)} placeholder="Contoh: Siapkan berkas" className={isian} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11.5px] font-bold tracking-[.05em] text-redup" htmlFor={`detail-langkah-${item.id}`}>DETAIL LANGKAH {index + 1} (OPSIONAL)</label>
              <input id={`detail-langkah-${item.id}`} value={item.detail} onChange={(event) => ubah(item.id, "detail", event.target.value)} placeholder="Contoh: Bawa dokumen asli" className={isian} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={tambah} className="min-h-11 self-start rounded-lg border border-daun px-3.5 text-[13px] font-bold text-hutan transition-colors hover:bg-emas-lembut">
        + Tambah langkah
      </button>
    </div>
  );
}
