import type { NextConfig } from "next";

// İçerik Güvenliği Politikası: yalnız kendi kaynağımızdan betik, stil, yazı tipi, istek.
// Nonce'suz sürüm: nonce her isteği dinamik yapar, sayfa statik kalamazdı. Next.js sayfaya
// kendi satır içi betiklerini koyduğu için 'unsafe-inline' gerekli; dışarıdan betik yüklenemez.
// Geliştirme sunucusu 'unsafe-eval' ister (yalnız `next dev`).
const gelistirme = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${gelistirme ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
