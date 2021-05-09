const { printResult } = require("./utils/print");
const levelsRankAverage = require("./levelsRankAverage");
const levelsRankDouble = require("./levelsRankDouble");
const { prToCentiseconds } = require("./utils/pr");

const levelsData = [
  {
    name: "Lvl 1",
    prs: ["3:50", "3:60", "3:90", "3:90", "3:90", "60:59:59"].map(
      prToCentiseconds
    ),
  },
  { name: "Lvl 2", prs: ["10:00", "10:50", "11:00"].map(prToCentiseconds) },
  { name: "Lvl 3", prs: ["21:00"].map(prToCentiseconds) },
];

printResult("Rank average", levelsRankAverage(levelsData));
printResult("Rank double", levelsRankDouble(levelsData));
// console.log(html.prettyPrint(htmlResult, { indent_size: 2 }));
