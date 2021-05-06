const fetch = require("node-fetch");
const { printResult, prettyPrint } = require("./utils/print");
const { writeFile } = require("./utils/write");
const levelsRankDouble = require("./levelsRankDouble");

const fetchJson = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getPrsFromOnlineLevel = async (levelId, { max } = { max: 300 }) => {
  const level = await fetchJson(`https://api.elma.online/api/level/${levelId}`);
  const bestTimes = await fetchJson(
    `https://api.elma.online/api/besttime/${levelId}/${max}/0`
  );
  const prs = bestTimes.slice(0, max).map((item) => item.Time);
  const url = `https://elma.online/levels/${levelId}`;
  return { name: level.LevelName, prs, url };
};

const runExample = async () => {
  const levelIds = [
    163, // Tutor1
    2, // WarmUp
    156, // LabPro
    359892, // Pob1000
    2599, // Rambo101
    1697, // Pipo001
    690, // Smibu80
    331252, // TTC101
    237824, // WCup601
    371127, // WCup701
    483457, // CPC101
  ];
  const levelsData = [];
  for (const levelId of levelIds) {
    const prs = await getPrsFromOnlineLevel(levelId);
    levelsData.push(prs);
  }

  const rankedLevels = levelsRankDouble(levelsData);
  const tableResult = levelsRankDouble.printTable(rankedLevels);
  const summary = levelsRankDouble.printSummary(rankedLevels);

  const content = `### Summary
  ${prettyPrint(summary)}

  ### Full times data
  ${prettyPrint(tableResult)}`;
  const result = printResult("Rank double", content, {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

runExample();
