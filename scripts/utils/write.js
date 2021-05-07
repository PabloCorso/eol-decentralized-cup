const fs = require("fs");

const writeFile = async (path, data) => {
  try {
    await fs.promises.writeFile(path, data);
  } catch (error) {
    console.log(`write file error > ${error}`);
  }

  console.log(`write file > ${path}`);
};

const readFile = async (path) => {
  return fs.promises.readFile(path);
};

module.exports = { writeFile, readFile };
