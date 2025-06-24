/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },

  // ✅ Ignore ESLint during build (especially helpful on Vercel if ESLint isn't critical)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Force nodejs runtime to allow static generation
  experimental: {
    runtime: 'nodejs',
  },
};

export default nextConfig;
