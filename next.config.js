/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/metadata/:tokenId*',
      destination: '/api/badges/:tokenId*',
    },
    {
      source: '/metadata',
      destination: '/api/contract',
    },
  ]
};

module.exports = nextConfig;
