/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ow7zxw0pjoyp0q71.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
