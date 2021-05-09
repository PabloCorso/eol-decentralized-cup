const basePath = "scripts/times/";
const FileNames = {
  allTimes: (fileName) => `${basePath}${fileName}_all.json`,
  bestTimes: (fileName) => `${basePath}${fileName}_prs.json`,
};

module.exports = {
  FileNames,
};
