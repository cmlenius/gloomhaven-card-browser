const { execSync } = require("child_process");
const fs = require("fs");

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

const missingImages = [...referencedImages].filter((img) => !imageTree.has(`images/${img}`));

if (missingImages.length > 0) {
  console.error(
    `\nError: Found ${missingImages.length} image(s) referenced in data/*.ts that do not exist on the 'images' branch:`,
  );
  for (const img of missingImages) {
    console.error(`  - images/${img}`);
  }
  process.exit(1);
}

console.log(`Verified ${referencedImages.size} image reference(s) exist on the 'images' branch.`);
