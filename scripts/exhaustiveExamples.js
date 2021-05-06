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
  //tutor1, warmpup, labpro, pob1000, rambo101, pipo, smibu90
  const levelIds = [163, 2, 156, 359892, 2599, 1697, 690];
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
