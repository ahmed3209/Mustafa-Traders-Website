/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add remote image hosts here (e.g. Supabase storage) when product images are uploaded.
    remotePatterns: [
      // { protocol: "https", hostname: "your-project.supabase.co" },
    ],
  },
};

export default nextConfig;
