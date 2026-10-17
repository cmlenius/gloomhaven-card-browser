const { execSync } = require("child_process");

// Fetch only tree/commit metadata (no image blobs) for main and images branches
execSync(
  "git fetch --no-tags --filter=blob:none origin +refs/heads/main:refs/remotes/origin/main +refs/heads/images:refs/remotes/origin/images",
  {
    stdio: "inherit",
  },
);

const imageTreeOutput = execSync("git ls-tree -r --name-only origin/images", {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});
const imageTree = new Set(imageTreeOutput.trim().split("\n"));

const diffOutput = execSync("git diff -U0 origin/main -- 'data/*.ts'", {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});

const addedImages = new Set();
const imageRegex = /"([^"\s]+\.(?:jpeg|png|jpg))"/gi;

for (const line of diffOutput.split("\n")) {
  if (line.startsWith("+") && !line.startsWith("+++")) {
    for (const match of line.matchAll(imageRegex)) {
      addedImages.add(match[1]);
    }
  }
}

if (addedImages.size === 0) {
  console.log("No added or modified image references in data/*.ts.");
  process.exit(0);
}

const missingImages = [...addedImages].filter((img) => !imageTree.has(`images/${img}`));

if (missingImages.length > 0) {
  console.error(
    `\nError: Found ${missingImages.length} image(s) referenced in data/*.ts that do not exist on the 'images' branch:`,
  );
  for (const img of missingImages) {
    console.error(`  - images/${img}`);
  }
  process.exit(1);
}

console.log(`Verified ${addedImages.size} added/modified image reference(s) exist on the 'images' branch.`);
