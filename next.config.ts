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
    // bisa dipakai memuat gambar dari sembarang tempat. Termasuk domain publik
    // Cloudflare R2 (default r2.dev dan bucket yang dipasang ke domain custom).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
