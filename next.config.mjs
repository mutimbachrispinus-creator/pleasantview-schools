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
      },
      {
        source: '/junior-secondary',
        destination: '/s/pleasantview-jss',
        permanent: true
      },
      {
        source: '/senior-school',
        destination: '/s/pleasantview-senior',
        permanent: true
      },
      {
        source: '/sports-and-arts',
        destination: '/co-curricular',
        permanent: true
      },
      {
        source: '/sports',
        destination: '/co-curricular',
        permanent: true
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
