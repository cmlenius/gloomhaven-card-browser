const fs = require("fs");
const vm = require("vm");

function loadTsData(filePath) {
  const code = fs
    .readFileSync(filePath, "utf8")
    .replace(/^import\s+.*$/gm, "")
    .replace(/export\s+const\s+(\w+)\s*:[^=]+=/g, "exports.$1 =")
    .replace(/const\s+(\w+)\s*:[^=]+=/g, "const $1 =");
  const sandbox = { exports: {} };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.exports;
}

const { games } = loadTsData("./data/games.ts");
const { characters } = loadTsData("./data/characters.ts");

const baseUrl = "https://gloomhavencards.com";
const urls = [{ loc: `${baseUrl}/`, priority: "1.00" }];

for (const game of games) {
  urls.push({ loc: `${baseUrl}/${game.id}`, priority: "0.80" });
}

for (const game of games) {
  const priority = game.id === "gh" ? "0.80" : "0.64";

  for (const route of game.routes) {
    urls.push({ loc: `${baseUrl}/${game.id}/${route.id}`, priority });
  }

  if (game.routes.some((route) => route.id === "characters")) {
    const gameCharacters = characters.filter((char) => char.game === game.id && !char.hidden);
    for (const char of gameCharacters) {
      urls.push({ loc: `${baseUrl}/${game.id}/characters/${char.class}`, priority });
    }
  }
}

const xmlEntries = urls
  .map(
    ({ loc, priority }) => `<url>
  <loc>${loc}</loc>
  <priority>${priority}</priority>
</url>`,
  )
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${xmlEntries}
</urlset>
`;

fs.writeFileSync("./public/sitemap.xml", sitemapXml);
console.log(`sitemap ${urls.length}`);
