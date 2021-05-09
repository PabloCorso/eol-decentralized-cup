const { printResult } = require("./utils/print");
const levelsRankDouble = require("./levelsRankDouble");
const { recordToCentiseconds } = require("./utils/record");

const levelsData = [
  {
    name: "Lvl 1",
    prs: ["3:50", "3:60", "3:90", "3:90", "3:90", "60:59:59"].map(
      recordToCentiseconds
    ),
  },
  { name: "Lvl 2", prs: ["10:00", "10:50", "11:00"].map(recordToCentiseconds) },
  { name: "Lvl 3", prs: ["21:00"].map(recordToCentiseconds) },
];

printResult("Rank double", levelsRankDouble(levelsData));
