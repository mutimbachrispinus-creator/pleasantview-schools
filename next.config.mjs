/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['africastalking'],
  experimental: {
    serverActions: { bodySizeLimit: '30mb' }
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
