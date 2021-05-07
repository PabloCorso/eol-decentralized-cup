const fetch = require("node-fetch");
const { printResult, prettyPrint } = require("./utils/print");
const { writeFile, readFile } = require("./utils/write");
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
  const times = bestTimes.slice(0, max).map((item) => item.Time);
  const url = `https://elma.online/levels/${levelId}`;
  return { name: level.LevelName, times, url };
};

const getAllTimesFromOnlineLevel = async (levelId, { max } = { max: 300 }) => {
  const level = await fetchJson(`https://api.elma.online/api/level/${levelId}`);
  const allTimes = await fetchJson(
    `https://api.elma.online/api/allfinished/${levelId}/`
  );
  const times = allTimes.slice(0, max).map((item) => item.Time);
  const url = `https://elma.online/levels/${levelId}`;
  return { name: level.LevelName, times, url };
};

const bestTimesFile = "scripts/results/bestTimes.json";
const allTimesFile = "scripts/results/allTimes.json";

const updateData = async () => {
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
  const levelsDataBestTimes = [];
  const levelDataAllTimes = [];
  for (const levelId of levelIds) {
    const levelWithPrs = await getPrsFromOnlineLevel(levelId, { max: 10000 });
    const levelWithAllTimes = await getAllTimesFromOnlineLevel(levelId, {
      max: 10000,
    });

    // Ignore internals
    // if (levelId > 160) {
    levelsDataBestTimes.push(levelWithPrs);
    levelDataAllTimes.push(levelWithAllTimes);
    // }
  }

  writeFile(bestTimesFile, JSON.stringify(levelsDataBestTimes));
  writeFile(allTimesFile, JSON.stringify(levelDataAllTimes));
};

const runExample = async () => {
  const levelsData = await readFile(bestTimesFile);
  const levelsDataAllTimes = await readFile(allTimesFile);

  const rankedLevels = levelsRankDouble(JSON.parse(levelsData));
  const tableResult = levelsRankDouble.printTable(rankedLevels);
  const summary = levelsRankDouble.printSummary(rankedLevels);

  const rankedLevelsAllTimes = levelsRankDouble(JSON.parse(levelsDataAllTimes));
  // const tableResult = levelsRankDouble.printTable(rankedLevelsAllTimes);
  const summaryAllTimes = levelsRankDouble.printSummary(rankedLevelsAllTimes);

  const content = `
  ### Summary with all finishes
  This takes into account all times finished from all kuskis. Max. 10.000 results per level. 
  Rank is equal to the sum of all unique non shadow times that are under 2 times the best time.
  ${prettyPrint(summaryAllTimes)}

  
  ### Summary with only PRs
  This takes into account only best times (PRs) from each kuskis. Rank is equal to the sum of all unique non shadow best times that are under 2 times the best time.
  ${prettyPrint(summary)}
  

  ### Full times data with only PRs
  ${prettyPrint(tableResult)}`;
  const result = printResult("Rank double", content, {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

runExample();
// updateData();
