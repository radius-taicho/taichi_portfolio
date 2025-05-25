/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // SCSS support is built-in with Next.js
  sassOptions: {
    includePaths: ['./src/styles'],
  },
}

module.exports = nextConfig
