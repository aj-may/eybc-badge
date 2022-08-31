/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/metadata/:tokenId*',
      destination: '/api/metadata/:tokenId*',
    },
    {
      source: '/metadata',
      destination: '/api/contract',
    },
  ],
  headers: async () => [
    {
      source: '/metadata(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
