import type { NextConfig } from "next";

// `standalone` mengemas server + dependensi yang benar-benar dipakai ke
// `.next/standalone`, jadi VPS tidak perlu menyimpan `node_modules` lengkap.
// Dijalankan systemd lewat `node .next/standalone/server.js` (DEPLOY_VPS.md §4.8).
const nextConfig: NextConfig = { output: "standalone" };

export default nextConfig;
