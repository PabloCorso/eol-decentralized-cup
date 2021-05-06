const { printResult } = require("./utils/print");
const levelsRankAverage = require("./levelsRankAverage");
const levelsRankDouble = require("./levelsRankDouble");

const levelsData = [
  {
    name: "Lvl 1",
    prs: ["3:50", "3:60", "3:90", "3:90", "3:90", "60:59:59"],
  },
  { name: "Lvl 2", prs: ["10:00", "10:50", "11:00"] },
  { name: "Lvl 3", prs: ["21:00"] },
];

printResult("Rank average", levelsRankAverage(levelsData));
console.log();
printResult("Rank double", levelsRankDouble(levelsData));
// console.log(html.prettyPrint(htmlResult, { indent_size: 2 }));
