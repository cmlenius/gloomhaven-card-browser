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
      {
        source: "/gh",
        destination: "/gh/characters",
        permanent: true,
      },
      {
        source: "/fh",
        destination: "/fh/characters",
        permanent: true,
      },
      {
        source: "/jotl",
        destination: "/jotl/characters",
        permanent: true,
      },
      {
        source: "/cs",
        destination: "/cs/characters",
        permanent: true,
      },
      {
        source: "/toa",
        destination: "/toa/characters",
        permanent: true,
      },
    ];
  },
};
