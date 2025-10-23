/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    authInterrupts: true
  },
  images: {
    remotePatterns: []
  },
  transpilePackages: ['geist'],
  serverExternalPackages: ['sequelize', 'sqlite3']
};

module.exports = nextConfig;
