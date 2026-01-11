/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.adhreline.com',
        port: '',
        pathname: '/**'          // or '/media/**' if that’s where files live
      },
      {
        protocol: "https",
        hostname: process.env.STRAPI_HOSTNAME || 'api.adhreline.com',
        pathname: '/uploads/**',
      }
    ]
  }
};


export default nextConfig;