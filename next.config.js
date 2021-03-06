module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/characters",
        permanent: true,
      },
    ];
  },
};
