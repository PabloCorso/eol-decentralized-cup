const fetch = require("node-fetch");
const { printResult } = require("./utils/print");
const { writeFile } = require("./utils/write");
const { centisecondsToPr } = require("./utils/pr");
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
  const shorterTimesData = bestTimes.slice(0, max);
  const prs = shorterTimesData.map((item) => centisecondsToPr(item.Time));
  return { name: level.LevelName, prs };
};

const runExample = async () => {
  const levelIds = [163, 2, 156];
  const levelsData = [];
  for (const levelId of levelIds) {
    const prs = await getPrsFromOnlineLevel(levelId);
    levelsData.push(prs);
  }

  const result = printResult("Rank double", levelsRankDouble(levelsData), {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

runExample();
