import type { NextConfig } from "next";

// `standalone` mengemas server + dependensi yang benar-benar dipakai ke
// `.next/standalone`, jadi VPS tidak perlu menyimpan `node_modules` lengkap.
// Dijalankan lewat `node .next/standalone/server.js`.
const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },

  images: {
    // Host yang boleh dipakai admin saat menempel tautan gambar di komposer.
    // next/image menolak host di luar daftar ini — sengaja, supaya panel tidak
    // bisa dipakai memuat gambar dari sembarang tempat.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
