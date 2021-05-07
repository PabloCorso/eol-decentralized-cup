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
    2, // Warm Up
    4, // Flat Track
    156, // Lab Pro
    163, // Tutor1
    690, // Smibu80
    2417, // Uni001
    116878, // EOL01
    116880, // EOL02
    116882, // EOL05
    116898, // EOL21
    359892, // Pob1000
    74671, // PobFF003
    73243, // PobFF001
    2599, // Rambo101
    1697, // Pipo001
    331252, // TTC101
    483457, // CPC101
    237824, // WCup601
    371127, // WCup701
    371726, // WCup702
    471405, // WCup802
    472912, // WCup804
    475307, // WCup807
  ];
  const levelsDataBestTimes = [];
  const levelDataAllTimes = [];
  for (const levelId of levelIds) {
    const levelWithPrs = await getPrsFromOnlineLevel(levelId, { max: 10000 });
    const levelWithAllTimes = await getAllTimesFromOnlineLevel(levelId, {
      max: 10000,
    });

    levelsDataBestTimes.push(levelWithPrs);
    levelDataAllTimes.push(levelWithAllTimes);
  }

  writeFile(bestTimesFile, JSON.stringify(levelsDataBestTimes));
  writeFile(allTimesFile, JSON.stringify(levelDataAllTimes));
};

const runExample = async () => {
  const levelsData = await readFile(bestTimesFile);
  const levelsDataAllTimes = await readFile(allTimesFile);

  const rankedLevels = levelsRankDouble(JSON.parse(levelsData));
  // const tableResult = levelsRankDouble.printTable(rankedLevels);
  const summary = levelsRankDouble.printSummary(rankedLevels);

  const rankedLevelsAllTimes = levelsRankDouble(JSON.parse(levelsDataAllTimes));
  // const tableResult = levelsRankDouble.printTable(rankedLevelsAllTimes);
  const summaryAllTimes = levelsRankDouble.printSummary(rankedLevelsAllTimes);

  const content = `
  ## Summary with all finishes
  This takes into account all times finished from all kuskis. Max. 10.000 results per level. 
  Rank is equal to the sum of all unique non shadow times that are under 2 times the best time.
  ${prettyPrint(summaryAllTimes)}
  <br/>
  
  ## Summary with only PRs
  This takes into account only best times (PRs) from each kuskis. Rank is equal to the sum of all unique non shadow best times that are under 2 times the best time.
  ${prettyPrint(summary)}`;
  const result = printResult("Rank double", content, {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

runExample();
// updateData();
