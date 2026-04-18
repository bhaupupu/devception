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
};

export default nextConfig;
