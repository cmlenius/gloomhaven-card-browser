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
    ];
  },
};
