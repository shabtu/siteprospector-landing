/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for Cloudflare Pages: `npm run build` writes the site to out/.
  // There is no server, so no API routes and no middleware (see DEPLOY.md).
  output: "export",
};

module.exports = nextConfig;
