const fs = require("fs");

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
  fs.readdirSync(dir).forEach((file) => {
    if (file.endsWith(".json")) {
      data = data.concat(JSON.parse(fs.readFileSync(`${dir}/${file}`)));
    }
  });
  return data;
};

module.exports = {
  groupBy: groupBy,
  readData: readData,
};
