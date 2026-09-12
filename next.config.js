/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-64919f93e7b1426dbd14328099e8e1c0.r2.dev",
      },
    ],
  },
};

module.exports = nextConfig;
