import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://172.21.208.1",
  ]
}

export default nextConfig;
