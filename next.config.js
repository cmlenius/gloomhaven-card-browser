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
        destination: "/gh/characters",
        permanent: true,
      },
      {
        source: "/characters",
        destination: "/gh/characters",
        permanent: true,
      },
      {
        source: "/items",
        destination: "/gh/items",
        permanent: true,
      },
    ];
  },
};
