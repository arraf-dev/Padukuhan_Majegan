import type { Metadata } from "next";
import Link from "next/link";
import { KopHalaman, isian, kartu, kartuPutus, label, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusStatistik, simpanStatistik } from "@/app/admin/statistik/aksi";
import { wajibSuperadmin } from "@/lib/sesi";
import { daftarStatistik, TAHUN_DATA, tahunTersedia } from "@/lib/statistik";

export const metadata: Metadata = { title: "Statistik Penduduk" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  tersimpan: "Angka tersimpan — halaman /statistik dan beranda sudah diperbarui.",
  hapus: "Baris dihapus.",
  "galat-label": "Label tidak boleh kosong.",
  "galat-persen": "Persentase kelompok usia harus antara 0 dan 100.",
  "galat-negatif": "Nilai tidak boleh negatif.",
};

/**
 * Seluruh kategori dalam skema ditampilkan karena halaman publik sekarang
 * memakai data jenis kelamin, pekerjaan, dan pendidikan juga.
 */
const KATEGORI = [
  {
    nilai: "ringkasan" as const,
    judul: "Angka Ringkasan",
    keterangan: "Tampil sebagai kartu angka di beranda dan halaman Statistik.",
    satuan: "jumlah",
    contohLabel: "jiwa penduduk",
  },
  {
    nilai: "usia" as const,
    judul: "Kelompok Usia",
    keterangan: "Tinggi batang grafik. Isi persentase 0–100, bukan jumlah jiwa.",
    satuan: "persen (0–100)",
    contohLabel: "0–14",
  },
  {
    nilai: "jenis_kelamin" as const,
    judul: "Jenis Kelamin",
    keterangan: "Komposisi penduduk, misalnya Laki-laki dan Perempuan.",
    satuan: "jiwa",
    contohLabel: "Perempuan",
  },
  {
    nilai: "pendidikan" as const,
    judul: "Pendidikan",
    keterangan: "Jumlah penduduk berdasarkan pendidikan terakhir.",
    satuan: "jiwa",
    contohLabel: "SMA/sederajat",
  },
  {
    nilai: "pekerjaan" as const,
    judul: "Pekerjaan",
    keterangan: "Jumlah penduduk berdasarkan pekerjaan utama.",
    satuan: "jiwa",
    contohLabel: "Petani",
  },
];

export default async function KelolaStatistik({
  searchParams,
}: {
  searchParams: Promise<{ tahun?: string; tersimpan?: string; terhapus?: string; galat?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const q = await searchParams;

  const diminta = Number.parseInt(q.tahun ?? "", 10);
  const tahun = Number.isFinite(diminta) ? diminta : TAHUN_DATA;

  const [baris, tahunAda] = await Promise.all([daftarStatistik(tahun), tahunTersedia()]);
  const pesan = q.terhapus
    ? kabar.hapus
    : q.galat
      ? kabar[`galat-${q.galat}`]
      : q.tersimpan
        ? kabar.tersimpan
        : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Statistik Penduduk"
        keterangan={
          <>
            Data tahun {tahun} · tampil di beranda dan{" "}
            <Link
              href="/statistik"
              className="font-semibold text-daun underline-offset-2 transition-colors duration-200 ease-out hover:text-hutan hover:underline"
            >
              /statistik
            </Link>
          </>
        }
        aksi={
          <div className="flex flex-wrap items-center gap-2">
            {tahunAda.map((t) => (
              <Link
                key={t}
                href={`/admin/statistik?tahun=${t}`}
                aria-current={t === tahun ? "page" : undefined}
                className={`min-h-11 rounded-[10px] px-4 py-2.5 text-[13px] font-bold transition-colors duration-200 ease-out ${
                  t === tahun
                    ? "bg-hutan text-krem"
                    : "border border-garis text-tinta hover:border-daun hover:bg-emas-lembut"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        }
      />

      {pesan && (
        <p
          role="status"
          className={`mb-4 rounded-xl px-4 py-3 text-[13px] font-semibold ${
            q.galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      {KATEGORI.map((k) => {
        const isi = baris.filter((b) => b.kategori === k.nilai);

        return (
          <section key={k.nilai} className="mb-9 lg:mb-12">
            <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">{k.judul}</h2>
            <p className="mt-0.5 mb-3 text-[12.5px] text-samar lg:mb-4 lg:text-[13.5px]">{k.keterangan}</p>

            {/* Tanpa cabang ini, kategori kosong hanya menyisakan borang tambah tanpa keterangan. */}
            {isi.length === 0 && (
              <p className={kartuPutus}>
                Belum ada angka untuk {k.judul.toLowerCase()} tahun {tahun}. Isi borang di bawah.
              </p>
            )}

            <div className="flex flex-col gap-2.5 lg:gap-3">
              {isi.map((b) => (
                <div
                  key={b.id}
                  className={`${kartu()} flex flex-wrap items-end gap-3 px-4 py-3.5 md:px-5 lg:gap-4 lg:px-6 lg:py-4`}
                >
                  {/* Label jadi bagian kunci unik, jadi disunting = baris baru.
                      Ditampilkan mati supaya tidak ada duplikat tak disengaja. */}
                  <div className="min-w-40 flex-1">
                    <span className={label}>LABEL</span>
                    <div className="py-2.5 text-[13.5px] font-semibold text-tinta">{b.label}</div>
                  </div>

                  <form action={simpanStatistik} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="tahun" value={tahun} />
                    <input type="hidden" name="kategori" value={k.nilai} />
                    <input type="hidden" name="label" value={b.label} />

                    <div className="w-32">
                      <label className={label} htmlFor={`nilai-${b.id}`}>
                        {k.satuan.toUpperCase()}
                      </label>
                      <input
                        id={`nilai-${b.id}`}
                        name="nilai"
                        type="number"
                        defaultValue={b.nilai}
                        className={isian}
                      />
                    </div>
                    <div className="w-20">
                      <label className={label} htmlFor={`urutan-${b.id}`}>
                        URUTAN
                      </label>
                      <input
                        id={`urutan-${b.id}`}
                        name="urutan"
                        type="number"
                        defaultValue={b.urutan}
                        className={isian}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`${tombol("sekunder", "kecil")} min-h-11 border-daun`}
                    >
                      Simpan
                    </button>
                  </form>

                  <form action={hapusStatistik}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="tahun" value={tahun} />
                    <button
                      type="submit"
                      className="min-h-11 rounded-[10px] px-3 py-2.5 text-xs font-semibold text-redup transition-colors duration-200 ease-out hover:text-bata"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <form
              action={simpanStatistik}
              className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5 lg:mt-5 lg:gap-4 lg:rounded-2xl lg:px-6 lg:py-5"
            >
              <input type="hidden" name="tahun" value={tahun} />
              <input type="hidden" name="kategori" value={k.nilai} />

              <div className="min-w-40 flex-1">
                <label className={label} htmlFor={`label-baru-${k.nilai}`}>
                  LABEL BARU
                </label>
                <input
                  id={`label-baru-${k.nilai}`}
                  name="label"
                  placeholder={k.contohLabel}
                  className={isian}
                />
              </div>
              <div className="w-32">
                <label className={label} htmlFor={`nilai-baru-${k.nilai}`}>
                  {k.satuan.toUpperCase()}
                </label>
                <input
                  id={`nilai-baru-${k.nilai}`}
                  name="nilai"
                  type="number"
                  defaultValue={0}
                  className={isian}
                />
              </div>
              <div className="w-20">
                <label className={label} htmlFor={`urutan-baru-${k.nilai}`}>
                  URUTAN
                </label>
                <input
                  id={`urutan-baru-${k.nilai}`}
                  name="urutan"
                  type="number"
                  defaultValue={isi.length}
                  className={isian}
                />
              </div>
              <button type="submit" className={`${tombol("primer")} min-h-11`}>
                <span className="text-base leading-none">+</span> Tambah
              </button>
            </form>
          </section>
        );
      })}
    </Kerangka>
  );
}
