const fs = require("fs");

const writeFile = (path, data) => {
  fs.writeFile(path, data, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`write file > ${path}`);
  });
};

module.exports = { writeFile };
