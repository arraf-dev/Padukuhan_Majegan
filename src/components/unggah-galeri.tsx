"use client";

import { useEffect, useRef, useState } from "react";
import type { AlbumGaleri, FotoGaleri } from "@/content/galeri";
import { buatAlbumDenganFoto, simpanAlbum, unggahFotoAlbum } from "@/app/admin/galeri/aksi";
import { isian, kartu, label, tombol } from "@/components/primitif";
import { LencanaKategoriGaleri } from "@/components/album-galeri";
import { kategoriGaleri } from "@/content/galeri";
import { tanggalPanjang } from "@/lib/tanggal";

const BATAS_FOTO = 50;
const BATAS_BERKAS = 4 * 1024 * 1024;
const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp"];

type FotoDraft = FotoGaleri & {
  pratinjau: string;
  baru: boolean;
  berkas?: File;
};

const idBaru = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `foto-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const keDraft = (foto: FotoGaleri): FotoDraft => ({
  ...foto,
  pratinjau: foto.url,
  baru: false,
});

export function UnggahGaleri({ awal }: { awal?: AlbumGaleri }) {
  const [judul, setJudul] = useState(awal?.judul ?? "");
  const [kategori, setKategori] = useState<AlbumGaleri["kategori"]>(awal?.kategori ?? "Kegiatan Warga");
  const [tanggal, setTanggal] = useState(awal?.tanggalKegiatan.slice(0, 10) ?? "");
  const [deskripsi, setDeskripsi] = useState(awal?.deskripsi ?? "");
  const [status, setStatus] = useState<AlbumGaleri["status"]>(awal?.status ?? "draft");
  const [foto, setFoto] = useState<FotoDraft[]>(awal?.foto.map(keDraft) ?? []);
  const [albumId, setAlbumId] = useState(awal?.id ?? "");
  const [coverId, setCoverId] = useState(awal?.foto.find((item) => item.url === awal.coverUrl)?.id ?? awal?.foto[0]?.id ?? "");
  const [dragId, setDragId] = useState<string | null>(null);
  const [galat, setGalat] = useState("");
  const [pesan, setPesan] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const urlsSementara = useRef(new Set<string>());

  useEffect(() => {
    // Salin isi ref ke variabel lokal: cleanup jalang ditautkan ke koleksi yang
    // sama, bukan ke `current` yang bisa berubah saat komponen dilepas.
    const urls = urlsSementara.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  const ubahUrutan = (dari: number, ke: number) => {
    if (ke < 0 || ke >= foto.length) return;
    setFoto((sekarang) => {
      const salinan = [...sekarang];
      const [pindah] = salinan.splice(dari, 1);
      salinan.splice(ke, 0, pindah);
      return salinan.map((item, urutan) => ({ ...item, urutan }));
    });
  };

  const hapusFoto = (id: string) => {
    const target = foto.find((item) => item.id === id);
    if (target?.baru) {
      URL.revokeObjectURL(target.pratinjau);
      urlsSementara.current.delete(target.pratinjau);
    }

    setFoto((sekarang) => {
      const berikutnya = sekarang.filter((item) => item.id !== id).map((item, urutan) => ({ ...item, urutan }));
      if (id === coverId) setCoverId(berikutnya[0]?.id ?? "");
      return berikutnya;
    });
  };

  const tambahFoto = (berkas: FileList | null) => {
    if (!berkas) return;

    const tersedia = BATAS_FOTO - foto.length;
    const berikutnya: FotoDraft[] = [];
    const galatBerkas: string[] = [];

    for (const file of Array.from(berkas).slice(0, tersedia)) {
      if (!TIPE_FOTO.includes(file.type) || file.size > BATAS_BERKAS) {
        galatBerkas.push(`${file.name}: JPG, PNG, atau WEBP maksimal 4 MB.`);
        continue;
      }

      const pratinjau = URL.createObjectURL(file);
      urlsSementara.current.add(pratinjau);
      berikutnya.push({
        id: idBaru(),
        url: "",
        alt: `${judul || "Kegiatan Padukuhan Majegan"} - foto ${foto.length + berikutnya.length + 1}`,
        caption: "",
        urutan: foto.length + berikutnya.length,
        width: null,
        height: null,
        size: file.size,
        pratinjau,
        baru: true,
        berkas: file,
      });
    }

    if (berikutnya.length) {
      setFoto((sekarang) => [...sekarang, ...berikutnya]);
      if (!coverId) setCoverId(berikutnya[0].id);
    }
    setGalat(galatBerkas.join(" "));
  };

  const ubahFoto = (id: string, field: "alt" | "caption", nilai: string) => {
    setFoto((sekarang) => sekarang.map((item) => (item.id === id ? { ...item, [field]: nilai } : item)));
  };

  const lepaskan = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const dari = foto.findIndex((item) => item.id === dragId);
    const ke = foto.findIndex((item) => item.id === targetId);
    if (dari >= 0 && ke >= 0) ubahUrutan(dari, ke);
    setDragId(null);
  };

  const kirimForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGalat("");
    setPesan("");
    if (!siap) {
      setGalat("Judul, kategori, tanggal, dan minimal satu foto wajib diisi.");
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const statusKirim: AlbumGaleri["status"] = submitter?.value === "terbit" ? "terbit" : "draft";
    setMengirim(true);
    let fotoKerja = [...foto];
    let albumIdKerja = albumId;
    let coverIdKerja = coverId;

    const terapkanFotoBerhasil = (idLokal: string, hasil: Extract<Awaited<ReturnType<typeof unggahFotoAlbum>>, { ok: true }>["foto"]) => {
      const lokal = fotoKerja.find((item) => item.id === idLokal);
      if (lokal?.baru) {
        URL.revokeObjectURL(lokal.pratinjau);
        urlsSementara.current.delete(lokal.pratinjau);
      }
      fotoKerja = fotoKerja.map((item) =>
        item.id === idLokal
          ? { ...item, ...hasil, caption: hasil.caption, pratinjau: hasil.url, baru: false, berkas: undefined }
          : item,
      );
      if (coverIdKerja === idLokal) coverIdKerja = hasil.id;
    };

    try {
      if (!albumId) {
        const pertama = fotoKerja[0];
        if (!pertama?.baru || !pertama.berkas) {
          setGalat("Foto pertama album tidak tersedia. Pilih ulang foto tersebut.");
          return;
        }

        const data = new FormData();
        data.set("judul", judul);
        data.set("kategori", kategori);
        data.set("tanggalKegiatan", tanggal);
        data.set("deskripsi", deskripsi);
        data.set("status", statusKirim);
        data.set("foto", pertama.berkas);
        data.set("alt", pertama.alt);
        data.set("caption", pertama.caption);
        setPesan("Membuat album dan mengunggah foto pertama…");
        const hasil = await buatAlbumDenganFoto(data);
        if (!hasil.ok) {
          setGalat(hasil.galat);
          return;
        }
        setAlbumId(hasil.id);
        albumIdKerja = hasil.id;
        terapkanFotoBerhasil(pertama.id, hasil.foto);
      }

      for (const [indeks, item] of fotoKerja.filter((item) => item.baru).entries()) {
        if (!item.berkas) {
          setGalat("Salah satu berkas foto tidak tersedia. Pilih ulang foto tersebut.");
          return;
        }
        const data = new FormData();
        data.set("albumId", albumIdKerja);
        data.set("foto", item.berkas);
        data.set("alt", item.alt);
        data.set("caption", item.caption);
        setPesan(`Mengunggah foto ${indeks + 1} dari ${fotoKerja.filter((item) => item.baru).length}…`);
        const hasil = await unggahFotoAlbum(data);
        if (!hasil.ok) {
          setGalat(hasil.galat);
          return;
        }
        terapkanFotoBerhasil(item.id, hasil.foto);
      }

      setFoto(fotoKerja);
      setCoverId(coverIdKerja);
      const simpan = new FormData();
      simpan.set("id", albumIdKerja);
      simpan.set("judul", judul);
      simpan.set("kategori", kategori);
      simpan.set("tanggalKegiatan", tanggal);
      simpan.set("deskripsi", deskripsi);
      simpan.set("status", statusKirim);
      simpan.set("coverId", coverIdKerja || fotoKerja[0].id);
      simpan.set(
        "fotoJson",
        JSON.stringify(
          fotoKerja.map((item, urutan) => ({
            id: item.id,
            urutan,
            alt: item.alt,
            caption: item.caption,
          })),
        ),
      );
      setPesan("Menyimpan perubahan album…");
      const hasilSimpan = await simpanAlbum(simpan);
      if (!hasilSimpan.ok) setGalat(hasilSimpan.galat);
    } catch {
      setGalat("Permintaan belum selesai. Periksa koneksi lalu coba lagi.");
    } finally {
      setMengirim(false);
    }
  };

  const siap = Boolean(judul.trim() && kategori && tanggal && foto.length);
  const cover = foto.find((item) => item.id === coverId) ?? foto[0];

  return (
    <form onSubmit={kirimForm} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
        {(galat || pesan) && (
          <p
            role={galat ? "alert" : "status"}
            className={`rounded-xl px-4 py-3 text-[13px] font-semibold ${
              galat
                ? "border border-bata/35 bg-bata/10 text-bata"
                : "border border-emas-garis bg-emas-muda text-emas-teks"
            }`}
          >
            {galat || pesan}
          </p>
        )}

        <fieldset className={`${kartu()} p-4 md:p-5 lg:p-6`}>
          <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">INFORMASI ALBUM</legend>
          <div>
            <label className={label} htmlFor="judul-album">JUDUL ALBUM</label>
            <input
              id="judul-album"
              value={judul}
              onChange={(event) => setJudul(event.target.value)}
              placeholder="Kerja Bakti Majegan"
              className={isian}
              maxLength={120}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <label className={label} htmlFor="kategori-album">KATEGORI</label>
              <select
                id="kategori-album"
                value={kategori}
                onChange={(event) => setKategori(event.target.value as AlbumGaleri["kategori"])}
                className={isian}
              >
                {kategoriGaleri.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="tanggal-album">TANGGAL KEGIATAN</label>
              <input
                id="tanggal-album"
                type="date"
                value={tanggal}
                onChange={(event) => setTanggal(event.target.value)}
                className={isian}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className={label} htmlFor="deskripsi-album">DESKRIPSI · OPSIONAL</label>
            <textarea
              id="deskripsi-album"
              value={deskripsi}
              onChange={(event) => setDeskripsi(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Ceritakan konteks kegiatan dan kebersamaan warga…"
              className={`${isian} leading-relaxed`}
            />
          </div>
        </fieldset>

        <fieldset className={`${kartu()} p-4 md:p-5 lg:p-6`}>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">FOTO ALBUM</legend>
              <p className="mt-1 text-xs text-samar">Pilih beberapa foto, lalu atur urutan dan sampulnya.</p>
            </div>
            <span className="font-mono text-[11px] font-bold text-emas-tua">{foto.length}/{BATAS_FOTO} FOTO</span>
          </div>

          <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-krem px-4 py-5 text-center text-[13px] text-samar transition-colors hover:border-daun">
            <span className="text-3xl leading-none text-emas-tua" aria-hidden="true">+</span>
            <span><strong className="text-daun">Pilih foto</strong> dari komputer atau HP</span>
            <span className="text-[11px]">JPG/PNG/WEBP · maksimal 4 MB per foto</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                tambahFoto(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          {foto.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {foto.map((item, indeks) => (
                <article
                  key={item.id}
                  draggable
                  onDragStart={() => setDragId(item.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => lepaskan(item.id)}
                  className={`${kartu()} min-w-0 overflow-hidden p-2.5 ${dragId === item.id ? "border-emas shadow-[0_8px_20px_rgba(138,109,43,.18)]" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-foto">
                    {/* Preview memakai blob URL lokal; foto publik memakai next/image. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.pratinjau} alt={item.alt} className="size-full object-cover" />
                    <span className="absolute top-2 left-2 rounded-full bg-hutan/90 px-2 py-1 font-mono text-[10px] font-bold text-emas">
                      #{indeks + 1}
                    </span>
                    {coverId === item.id && (
                      <span className="absolute right-2 bottom-2 rounded-full bg-emas px-2 py-1 text-[10px] font-extrabold text-hutan">
                        SAMPUL
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <label className="flex min-h-10 flex-1 items-center gap-2 text-[11.5px] font-semibold text-teks">
                      <input
                        type="radio"
                        name="cover-preview"
                        checked={coverId === item.id}
                        onChange={() => setCoverId(item.id)}
                        className="size-4 accent-hutan"
                      />
                      Jadikan sampul
                    </label>
                    <button
                      type="button"
                      onClick={() => ubahUrutan(indeks, indeks - 1)}
                      disabled={indeks === 0}
                      aria-label={`Pindahkan foto ${indeks + 1} ke atas`}
                      className="flex size-10 items-center justify-center rounded-[9px] border border-garis-tebal text-sm text-hutan disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      &#8593;
                    </button>
                    <button
                      type="button"
                      onClick={() => ubahUrutan(indeks, indeks + 1)}
                      disabled={indeks === foto.length - 1}
                      aria-label={`Pindahkan foto ${indeks + 1} ke bawah`}
                      className="flex size-10 items-center justify-center rounded-[9px] border border-garis-tebal text-sm text-hutan disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      &#8595;
                    </button>
                    <button
                      type="button"
                      onClick={() => hapusFoto(item.id)}
                      aria-label={`Hapus foto ${indeks + 1}`}
                      className="flex size-10 items-center justify-center rounded-[9px] border border-bata/30 text-sm text-bata hover:bg-bata/8"
                    >
                      &times;
                    </button>
                  </div>

                  <label className={`${label} mt-2.5`} htmlFor={`alt-${item.id}`}>ALT TEXT</label>
                  <input
                    id={`alt-${item.id}`}
                    value={item.alt}
                    onChange={(event) => ubahFoto(item.id, "alt", event.target.value)}
                    className={isian}
                    maxLength={180}
                  />
                  <label className={`${label} mt-2.5`} htmlFor={`caption-${item.id}`}>CAPTION · OPSIONAL</label>
                  <input
                    id={`caption-${item.id}`}
                    value={item.caption}
                    onChange={(event) => ubahFoto(item.id, "caption", event.target.value)}
                    className={isian}
                    maxLength={300}
                  />
                </article>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset className={`${kartu()} p-4 md:p-5 lg:p-6`}>
          <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">STATUS PUBLIKASI</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["draft", "terbit"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={status === item}
                onClick={() => setStatus(item)}
                className={`min-h-11 rounded-full px-4 text-[13px] font-bold ${status === item ? "bg-hutan text-krem" : "border border-garis-tebal text-teks hover:border-daun"}`}
              >
                {item === "draft" ? "Simpan sebagai Draft" : "Siap Terbit"}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-samar">
            Draft hanya terlihat perangkat admin. Album terbit akan masuk halaman publik dan sitemap.
          </p>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" name="status" value="draft" disabled={!siap || mengirim} onClick={() => setStatus("draft")} className={`${tombol("sekunder")} min-h-11`}>
            Simpan Draft
          </button>
          <button type="submit" name="status" value="terbit" disabled={!siap || mengirim} onClick={() => setStatus("terbit")} className={`${tombol("primer")} min-h-11`}>
            {mengirim ? "Menyimpan…" : "Terbitkan Album"}
          </button>
          <span className="text-xs text-samar">Minimal satu foto diperlukan.</span>
        </div>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6">
        <div className={`${kartu()} overflow-hidden`}>
          <div className="border-b border-garis px-4 py-3.5 md:px-5">
            <h2 className="font-serif text-[16px] font-semibold text-hutan">Pratinjau album</h2>
            <p className="mt-1 text-xs text-samar">Tampilan sampul yang akan dilihat warga.</p>
          </div>
          <div className="p-3.5 md:p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-foto">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL preview lokal
                <img src={cover.pratinjau} alt={cover.alt} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-center text-xs text-samar">
                  Sampul akan tampil di sini
                </div>
              )}
              <span className="absolute top-3 left-3">
                <LencanaKategoriGaleri kategori={kategori} />
              </span>
            </div>
            <div className="px-1 pt-3">
              <p className="font-mono text-[10px] font-bold tracking-[.06em] text-emas-tua">
                {tanggal ? tanggalPanjang(`${tanggal}T00:00:00+07:00`) : "TANGGAL KEGIATAN"}
              </p>
              <h3 className="mt-1.5 font-serif text-lg leading-snug font-semibold text-tinta">
                {judul || "Judul album akan tampil di sini"}
              </h3>
              <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-teks">
                {deskripsi || "Deskripsi kegiatan akan tampil di bawah judul album."}
              </p>
            </div>
          </div>
        </div>

        <div className={`${kartu()} px-4 py-4 md:px-5`}>
          <h2 className="font-serif text-[15px] font-semibold text-hutan">Tips dokumentasi</h2>
          <ul className="mt-2.5 flex flex-col gap-2 text-[12px] leading-relaxed text-teks">
            <li>Gunakan foto yang jelas dan tidak terlalu gelap.</li>
            <li>Isi alt text dengan konteks kegiatan, bukan nama file.</li>
            <li>Taruh foto paling mewakili kegiatan sebagai sampul.</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}
