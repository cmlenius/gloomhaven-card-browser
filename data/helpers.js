const fs = require("fs");
const path = require("path");
const vm = require("vm");

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  );

const readData = (dir) => {
  let data = [];
  fs.readdirSync(dir)
    .sort()
    .forEach((file) => {
      if (file.endsWith(".json")) {
        data = data.concat(JSON.parse(fs.readFileSync(`${dir}/${file}`)));
      }
    });
  return data;
};

const loadTsData = (relativeOrAbsolutePath) => {
  const filePath = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.resolve(__dirname, relativeOrAbsolutePath);
  const code = fs
    .readFileSync(filePath, "utf8")
    .replace(/^import\s+.*$/gm, "")
    .replace(/export\s+const\s+(\w+)\s*:[^=]+=/g, "exports.$1 =")
    .replace(/const\s+(\w+)\s*:[^=]+=/g, "const $1 =");
  const sandbox = { exports: {} };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.exports;
};

module.exports = {
  groupBy: groupBy,
  loadTsData: loadTsData,
  readData: readData,
};
