/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // static HTML export — `npm run build` writes plain HTML/CSS/JS to /out,
  // ready to upload to any static host (Netlify, Vercel, GitHub Pages...)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
