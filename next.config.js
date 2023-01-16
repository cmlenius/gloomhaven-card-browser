module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
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
