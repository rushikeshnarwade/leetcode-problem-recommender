/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enable static export for Firebase Hosting
  trailingSlash: true, // Ensure trailing slash for static hosting
  distDir: 'build', // Use different directory to avoid permission issues
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  // Webpack config to handle Windows permission issues
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false; // Disable webpack cache in production
    }
    return config;
  }
}

module.exports = nextConfig