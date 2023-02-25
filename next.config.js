module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/characters",
        destination: "/gh/characters",
        permanent: false,
      },
      {
        source: "/items",
        destination: "/gh/items",
        permanent: false,
      },
      {
        source: "/events",
        destination: "/gh/events",
        permanent: false,
      },
      {
        source: "/monsters",
        destination: "/gh/monsters",
        permanent: false,
      },
      {
        source: "/gh",
        destination: "/gh/characters",
        permanent: false,
      },
      {
        source: "/fh",
        destination: "/fh/characters",
        permanent: false,
      },
      {
        source: "/jotl",
        destination: "/jotl/characters",
        permanent: false,
      },
      {
        source: "/cs",
        destination: "/cs/characters",
        permanent: false,
      },
      {
        source: "/toa",
        destination: "/toa/characters",
        permanent: false,
      },
    ];
  },
};
