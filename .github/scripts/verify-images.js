const { execSync } = require("child_process");

// Fetch only tree/commit metadata (no blobs) for the main branch
execSync(
  "git fetch --no-tags --filter=blob:none origin +refs/heads/main:refs/remotes/origin/main",
  {
    stdio: "inherit",
  },
);

const imageTreeOutput = execSync("git ls-tree -r --name-only HEAD", {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});
const imageTree = new Set(imageTreeOutput.trim().split("\n"));

const dataFilesOutput = execSync("git ls-tree --name-only origin/main:data", {
  encoding: "utf8",
});
const tsFiles = dataFilesOutput
  .trim()
  .split("\n")
  .filter((file) => file.endsWith(".ts"))
  .sort();

const referencedImages = new Set();
const imageRegex = /"([^"\s]+\.(?:jpeg|png|jpg))"/gi;

for (const file of tsFiles) {
  const content = execSync(`git show origin/main:data/${file}`, {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  for (const match of content.matchAll(imageRegex)) {
    referencedImages.add(match[1]);
  }
}

const missingImages = [...referencedImages].filter(
  (img) => !imageTree.has(`images/${img}`),
);

if (missingImages.length > 0) {
  console.error(
    `\nError: Found ${missingImages.length} image(s) referenced by 'main' that are missing in this PR:`,
  );
  for (const img of missingImages) {
    console.error(`  - images/${img}`);
  }
  process.exit(1);
}

console.log(
  `Verified all ${referencedImages.size} image reference(s) used by 'main' exist.`,
);
