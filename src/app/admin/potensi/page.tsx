import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/potongan";
import { IsianBerkas } from "@/components/isian-berkas";
import { KopHalaman, isian, kartu, kartuPutus, label, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { getAdminPotensi } from "@/lib/potensi";
import { wajibMasuk } from "@/lib/sesi";
import {
  hapusInfografis,
  hapusPotensi,
  simpanInfografis,
  simpanKategoriPotensi,
  ubahStatusPotensi,
} from "@/app/admin/potensi/aksi";

export const metadata: Metadata = { title: "Kelola Potensi" };
export const dynamic = "force-dynamic";

const pesan: Record<string, string> = {
  kategori: "Kategori Potensi tidak valid.",
  "kategori-isi": "Judul, pengantar, dan deskripsi kategori wajib diisi.",
  isi: "Periksa kembali judul, ringkasan, dan deskripsi Potensi.",
  berkas: "Berkas gambar belum dapat diproses.",
  album: "Album dokumentasi sudah ditautkan ke Potensi lain.",
  infografis: "Label wajib diisi dan nilai tidak boleh negatif.",
  status: "Status Potensi tidak valid.",
  "tidak-ditemukan": "Data yang dipilih tidak ditemukan.",
};

export default async function KelolaPotensi({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tersimpan?: string; terhapus?: string; galat?: string; konfirmasi?: string; berkas?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const q = await searchParams;
  const semua = await getAdminPotensi();
  const cari = q.q?.trim().toLowerCase() ?? "";
  const daftar = semua.map((kategori) => ({
    ...kategori,
    potensi: kategori.potensi.filter((item) => {
      const cocokCari = !cari || `${item.judul} ${item.ringkasan} ${item.deskripsi} ${item.subkategori ?? ""}`.toLowerCase().includes(cari);
      const cocokStatus = q.status === "draft" || q.status === "terbit" ? item.status === q.status : true;
      return cocokCari && cocokStatus;
    }),
  }));

  const info = q.galat
    ? pesan[q.galat] ?? "Perubahan Potensi belum dapat diproses."
    : q.terhapus
      ? q.terhapus === "infografis" ? "Baris infografis dihapus." : "Potensi dihapus."
      : q.tersimpan
        ? q.tersimpan === "kategori" ? "Pengaturan kategori tersimpan." : q.tersimpan === "infografis" ? "Infografis tersimpan." : `Potensi tersimpan sebagai ${q.tersimpan === "terbit" ? "terbit" : "draft"}.`
        : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Kelola Potensi"
        keterangan="Pariwisata, UMKM, dan Budaya · konten, media, serta infografis"
        aksi={<Link href="/admin/potensi/baru" className={tombol("primer")}><span className="text-base leading-none">+</span> Tambah Potensi</Link>}
      />

      {info && (
        <p role={q.galat ? "alert" : "status"} className={`mb-5 rounded-xl px-4 py-3 text-[13px] font-semibold ${q.galat ? "border border-bata/35 bg-bata/10 text-bata" : "border border-emas-garis bg-emas-muda text-emas-teks"}`}>
          {info}{q.berkas ? " Sebagian berkas Blob perlu dibersihkan manual." : ""}
        </p>
      )}

      <form className="mb-6 flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="cari-potensi" className="sr-only">Cari Potensi</label>
        <input id="cari-potensi" name="q" defaultValue={q.q} placeholder="Cari judul, ringkasan, atau subkategori…" className={`${isian} min-h-11 min-w-0 flex-1`} />
        <label htmlFor="status-potensi" className="sr-only">Filter status</label>
        <select id="status-potensi" name="status" defaultValue={q.status ?? ""} className={`${isian} min-h-11 sm:w-36`}>
          <option value="">Semua status</option>
          <option value="terbit">Terbit</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className={`${tombol("sekunder")} min-h-11`}>Cari</button>
      </form>

      <div className="flex flex-col gap-8 lg:gap-10">
        {daftar.map((kategori, indeks) => (
          <section key={kategori.id} id={kategori.kode} className="scroll-mt-6">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[.14em] text-emas-tua">{String(indeks + 1).padStart(2, "0")} — {kategori.label}</p>
                <h2 className="mt-1 font-serif text-xl font-semibold text-hutan lg:text-2xl">{kategori.judul}</h2>
              </div>
              <span className="text-[12px] text-samar">{kategori.potensi.length} item pada filter ini</span>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
              <form action={simpanKategoriPotensi} className={`${kartu()} p-4 md:p-5`}>
                <input type="hidden" name="id" value={kategori.id} />
                <input type="hidden" name="gambarUrl" value={kategori.gambarUrl ?? ""} />
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-serif text-base font-semibold text-hutan">Storytelling kategori</h3>
                  <span className="text-[10px] font-bold tracking-[.1em] text-samar">PUBLIK</span>
                </div>
                <label className={label} htmlFor={`judul-kategori-${kategori.id}`}>HEADING</label>
                <input id={`judul-kategori-${kategori.id}`} name="judul" defaultValue={kategori.judul} className={isian} />
                <label className={`${label} mt-3`} htmlFor={`pengantar-kategori-${kategori.id}`}>PENGANTAR</label>
                <textarea id={`pengantar-kategori-${kategori.id}`} name="pengantar" defaultValue={kategori.pengantar} rows={2} className={`${isian} leading-relaxed`} />
                <label className={`${label} mt-3`} htmlFor={`deskripsi-kategori-${kategori.id}`}>DESKRIPSI</label>
                <textarea id={`deskripsi-kategori-${kategori.id}`} name="deskripsi" defaultValue={kategori.deskripsi} rows={3} className={`${isian} leading-relaxed`} />
                <div className="mt-3">
                  <span className={label}>GAMBAR KATEGORI · OPSIONAL</span>
                  <IsianBerkas name="gambarKategoriBerkas" jenis="gambar" awal={kategori.gambarUrl ?? undefined} />
                </div>
                <button type="submit" className={`${tombol("primer", "kecil")} mt-4 min-h-11`}>Simpan Kategori</button>
              </form>

              <div className={`${kartu()} p-4 md:p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-hutan">Infografis</h3>
                    <p className="mt-1 text-[11.5px] text-samar">Angka placeholder dapat diganti dari sini.</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-[.1em] text-emas-tua">{kategori.infografis.length} DATA</span>
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  {kategori.infografis.map((statistik) => (
                    <div key={statistik.id} className="rounded-xl border border-garis bg-panel/60 p-3">
                      <form action={simpanInfografis} className="flex flex-wrap items-end gap-2.5">
                        <input type="hidden" name="id" value={statistik.id} />
                        <input type="hidden" name="kategoriId" value={kategori.id} />
                        <div className="min-w-32 flex-1"><label className={label} htmlFor={`label-${statistik.id}`}>LABEL</label><input id={`label-${statistik.id}`} name="label" defaultValue={statistik.label} className={isian} /></div>
                        <div className="w-20"><label className={label} htmlFor={`nilai-${statistik.id}`}>NILAI</label><input id={`nilai-${statistik.id}`} name="nilai" type="number" min="0" defaultValue={statistik.nilai} className={isian} /></div>
                        <div className="w-28"><label className={label} htmlFor={`satuan-${statistik.id}`}>SATUAN</label><input id={`satuan-${statistik.id}`} name="satuan" defaultValue={statistik.satuan ?? ""} className={isian} /></div>
                        <div className="w-16"><label className={label} htmlFor={`urutan-${statistik.id}`}>URUTAN</label><input id={`urutan-${statistik.id}`} name="urutan" type="number" min="0" defaultValue={statistik.urutan} className={isian} /></div>
                        <button type="submit" className={`${tombol("sekunder", "kecil")} min-h-11 border-daun`}>Simpan</button>
                      </form>
                      <form action={hapusInfografis} className="mt-1 text-right"><input type="hidden" name="id" value={statistik.id} /><button type="submit" className="text-[11px] font-semibold text-redup hover:text-bata">Hapus data</button></form>
                    </div>
                  ))}
                </div>
                <form action={simpanInfografis} className="mt-3 flex flex-wrap items-end gap-2.5 rounded-xl border border-dashed border-garis-tebal bg-panel px-3 py-3">
                  <input type="hidden" name="kategoriId" value={kategori.id} />
                  <div className="min-w-32 flex-1"><label className={label} htmlFor={`label-baru-${kategori.id}`}>LABEL BARU</label><input id={`label-baru-${kategori.id}`} name="label" className={isian} placeholder="Potensi Wisata" /></div>
                  <div className="w-20"><label className={label} htmlFor={`nilai-baru-${kategori.id}`}>NILAI</label><input id={`nilai-baru-${kategori.id}`} name="nilai" type="number" min="0" defaultValue="0" className={isian} /></div>
                  <div className="w-28"><label className={label} htmlFor={`satuan-baru-${kategori.id}`}>SATUAN</label><input id={`satuan-baru-${kategori.id}`} name="satuan" className={isian} placeholder="unit" /></div>
                  <button type="submit" className={`${tombol("primer", "kecil")} min-h-11`}>Tambah</button>
                </form>
              </div>
            </div>

            <div className="mt-4">
              {kategori.potensi.length === 0 ? (
                <p className={kartuPutus}>{cari || q.status ? "Tidak ada Potensi pada filter ini." : "Belum ada Potensi pada kategori ini."}</p>
              ) : (
                <ul className="grid gap-3 xl:grid-cols-2">
                  {kategori.potensi.map((item) => {
                    const konfirmasi = q.konfirmasi === item.id;
                    const draft = item.status === "draft";
                    return (
                      <li key={item.id} className={`${kartu()} min-w-0 p-3.5 md:p-4`}>
                        <div className="flex min-w-0 gap-3.5">
                          <Foto src={item.gambarUrl} keterangan={item.judul} sizes="96px" className="size-24 flex-none rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${draft ? "border border-garis-tebal text-samar" : "bg-daun text-krem"}`}>{draft ? "DRAFT" : "TERBIT"}</span>{item.subkategori && <span className="text-[11px] font-semibold text-emas-tua">{item.subkategori}</span>}</div>
                            <h3 className="mt-2 line-clamp-2 font-serif text-[17px] leading-snug font-semibold text-tinta">{item.judul}</h3>
                            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-teks">{item.ringkasan}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-garis pt-3">
                          <Link href={`/admin/potensi/${item.id}`} className={`${tombol("sekunder", "kecil")} border-daun`}>Edit</Link>
                          <form action={ubahStatusPotensi}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value={draft ? "terbit" : "draft"} /><button type="submit" className="min-h-9 rounded-[10px] border border-garis-tebal px-3.5 py-2 text-[12px] font-semibold text-teks hover:border-daun hover:bg-emas-lembut">{draft ? "Terbitkan" : "Jadikan Draft"}</button></form>
                          <a href={konfirmasi ? "/admin/potensi" : `/admin/potensi?konfirmasi=${item.id}`} className="min-h-9 rounded-[10px] px-3 py-2 text-[12px] font-semibold text-redup hover:text-bata">{konfirmasi ? "Batal" : "Hapus"}</a>
                        </div>
                        {konfirmasi && <form action={hapusPotensi} className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-bata/35 bg-bata/10 px-4 py-3"><input type="hidden" name="id" value={item.id} /><span className="flex-1 text-[12.5px] leading-relaxed text-bata">Hapus <strong>{item.judul}</strong>?</span><button type="submit" className="min-h-10 rounded-[10px] bg-bata px-4 py-2 text-xs font-bold text-krem">Ya, hapus</button></form>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </Kerangka>
  );
}
