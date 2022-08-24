/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/metadata/:tokenId*',
      destination: '/api/badges/:tokenId*',
    },
  ],
};

module.exports = nextConfig;
