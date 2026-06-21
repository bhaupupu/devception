/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  webpack: (config) => {
    // Fixes for Monaco Editor
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/ads.txt',
        destination: 'https://srv.adstxtmanager.com/19390/devception.xyz',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
