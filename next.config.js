if (process.env.NODE_OPTIONS?.includes("--use-openssl-ca")) {
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS.replace("--use-openssl-ca", "").trim();
}

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
