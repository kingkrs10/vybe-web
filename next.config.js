/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    appDir: true,
    optimizeCss: true,
  },
  output: "standalone",
  images: {
    // domains: ["storage.googleapis.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "storage.googleapis.com",
    //     port: "",
    //     pathname: "/tickets_dev/**",
    //   },
    // ],
  },
};

module.exports = nextConfig;
