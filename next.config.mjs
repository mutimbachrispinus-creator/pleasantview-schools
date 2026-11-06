/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['africastalking'],
  experimental: {
    serverActions: { bodySizeLimit: '50mb' }
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/staff-portal',
        permanent: false
      }
    ];
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
