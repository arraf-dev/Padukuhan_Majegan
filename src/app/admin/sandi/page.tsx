import type { Metadata } from "next";
import { KopHalaman, isian, label, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { gantiSandi } from "@/app/admin/akun/aksi";
import { PANJANG_SANDI_MIN } from "@/lib/auth";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Ganti Sandi" };

const kabar: Record<string, string> = {
  "galat-sandi-lama": "Sandi lama salah.",
  "galat-sandi-pendek": `Sandi baru minimal ${PANJANG_SANDI_MIN} karakter.`,
  "galat-tidak-cocok": "Ulangan sandi tidak sama dengan sandi baru.",
};

/** AUTH-4 — terbuka untuk peran `admin` juga, bukan hanya superadmin. */
export default async function GantiSandi({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; galat?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { tersimpan, galat } = await searchParams;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Ganti Sandi"
        keterangan={`Akun ${nama} · sandi ini satu-satunya pintu masuk panel`}
      />

      {(tersimpan || galat) && (
        <p
          role="status"
          className={`mb-4 max-w-md rounded-xl px-4 py-3 text-[13px] font-semibold ${
            galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {galat ? kabar[`galat-${galat}`] : "Sandi berhasil diganti."}
        </p>
      )}

      <form action={gantiSandi} className="flex max-w-md flex-col gap-4">
        <div>
          <label className={label} htmlFor="lama">
            SANDI LAMA
          </label>
          <input
            id="lama"
            name="lama"
            type="password"
            autoComplete="current-password"
            className={isian}
          />
        </div>
        <div>
          <label className={label} htmlFor="baru">
            SANDI BARU
          </label>
          <input
            id="baru"
            name="baru"
            type="password"
            autoComplete="new-password"
            placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`}
            className={isian}
          />
          <p className="mt-1.5 text-[11.5px] text-samar">
            Kalimat pendek yang mudah diingat lebih aman daripada satu kata bercampur simbol —
            misalnya <em>ronda malam kamis</em>.
          </p>
        </div>
        <div>
          <label className={label} htmlFor="ulangi">
            ULANGI SANDI BARU
          </label>
          <input
            id="ulangi"
            name="ulangi"
            type="password"
            autoComplete="new-password"
            className={isian}
          />
        </div>

        <button type="submit" className={`${tombol("primer")} min-h-11`}>
          Ganti Sandi
        </button>
      </form>
    </Kerangka>
  );
}
