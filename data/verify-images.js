const { execSync } = require("child_process");
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

// Fetch only tree/commit metadata (no image blobs) for the images branch
execSync("git fetch --no-tags --filter=blob:none origin +refs/heads/images:refs/remotes/origin/images", {
  stdio: "inherit",
});

const imageTreeOutput = execSync("git ls-tree -r --name-only origin/images", {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});
const imageTree = new Set(imageTreeOutput.trim().split("\n"));

const referencedImages = new Set();
const imageRegex = /"([^"\s]+\.(?:jpeg|png|jpg))"/gi;

const tsFiles = fs
  .readdirSync("./data")
  .filter((file) => file.endsWith(".ts"))
  .sort();

for (const file of tsFiles) {
  const content = fs.readFileSync(`./data/${file}`, "utf8");
  for (const match of content.matchAll(imageRegex)) {
    referencedImages.add(match[1]);
  }
}

// Character class icons (used in CharactersPage.tsx and Settings.tsx)
const { characters } = loadTsData("./data/characters.ts");
for (const char of characters) {
  referencedImages.add(`icons/characters/${char.game}/${char.class}.png`);
}

// Item slot & activation filter icons (used in pages/[game]/items.tsx)
const itemFilterIcons = ["head", "body", "1h", "2h", "legs", "small", "consumed", "spent"];
for (const icon of itemFilterIcons) {
  referencedImages.add(`icons/items/${icon}.png`);
}

// Site & CSS assets (used in components/Layout.tsx and public/global.css)
referencedImages.add("logo.png");
referencedImages.add("background.jpeg");
referencedImages.add("icons/select.svg");

const missingImages = [...referencedImages].filter((img) => !imageTree.has(`images/${img}`));

if (missingImages.length > 0) {
  console.error(`\nError: Found ${missingImages.length} referenced image(s) that do not exist on the 'images' branch:`);
  for (const img of missingImages) {
    console.error(`  - images/${img}`);
  }
  process.exit(1);
}

console.log(`Verified ${referencedImages.size} image reference(s) exist on the 'images' branch.`);
