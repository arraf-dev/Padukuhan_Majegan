import { ImageResponse } from "next/og";
import { desa } from "@/content/majegan";

/**
 * Gambar pratinjau saat tautan situs disebar — terutama lewat WhatsApp, kanal
 * utama warga. Tanpa ini pratinjaunya kosong dan tautan terlihat mencurigakan.
 *
 * ponytail: dirender dari kode, bukan berkas gambar. Tidak ada aset yang harus
 * diunduh, ikut ter-commit, atau kedaluwarsa saat nama padukuhan berubah.
 */
export const alt = `Website Resmi ${desa.nama}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Gambar() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "#0d3825",
          color: "#f7f3e8",
        }}
      >
        {/* garis atap joglo */}
        <div style={{ display: "flex", gap: 10, marginBottom: 44 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 0,
                height: 0,
                borderLeft: "17px solid transparent",
                borderRight: "17px solid transparent",
                borderBottom: "15px solid #d6b45c",
                opacity: 0.75,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            color: "#d6b45c",
            fontWeight: 700,
          }}
        >
          WEBSITE RESMI PEMERINTAH PADUKUHAN
        </div>

        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
          {desa.nama}
        </div>

        <div style={{ fontSize: 34, color: "#cddccf", marginTop: 20 }}>
          {desa.wilayahSingkat}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 46,
            paddingTop: 26,
            borderTop: "2px solid rgba(247,243,232,0.22)",
            fontSize: 27,
            color: "#a9b4a9",
          }}
        >
          Berita · Layanan Surat · Pengaduan Warga · Transparansi Anggaran
        </div>
      </div>
    ),
    size,
  );
}
