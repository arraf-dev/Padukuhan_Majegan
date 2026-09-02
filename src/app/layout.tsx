import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { desa, situsUrl } from "@/content/majegan";
import { Reveal } from "@/components/gerak";
import { validasiEnvironmentProduksi } from "@/lib/env";
import "./globals.css";

validasiEnvironmentProduksi();

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(situsUrl),
  title: {
    default: "Padukuhan Majegan | Pandowoharjo, Sleman",
    template: "%s | Padukuhan Majegan",
  },
  description:
    "Website resmi Padukuhan Majegan, Kalurahan Pandowoharjo, Kapanewon Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta.",
  keywords: [
    "Padukuhan Majegan",
    "Pandowoharjo",
    "Kapanewon Sleman",
    "Kabupaten Sleman",
    "Daerah Istimewa Yogyakarta",
    "situs resmi padukuhan",
    "informasi desa Sleman",
  ],
  authors: [{ name: "Pemerintah Padukuhan Majegan" }],
  creator: "Pemerintah Padukuhan Majegan",
  publisher: "Pemerintah Padukuhan Majegan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: desa.nama,
    title: {
      default: "Padukuhan Majegan | Pandowoharjo, Sleman",
      template: "%s | Padukuhan Majegan",
    },
    description:
      "Website resmi Padukuhan Majegan, Kalurahan Pandowoharjo, Kapanewon Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Padukuhan Majegan | Pandowoharjo, Sleman",
      template: "%s | Padukuhan Majegan",
    },
    description:
      "Website resmi Padukuhan Majegan, Kalurahan Pandowoharjo, Kapanewon Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta.",
  },
};

/**
 * `viewport-fit: cover` diperlukan agar `env(safe-area-inset-bottom)` terisi —
 * tanpa itu navigasi bawah tertimpa home indicator iPhone.
 * `themeColor` menyamakan bilah browser HP dengan warna header.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d3825",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${lora.variable} ${jakarta.variable}`}>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
