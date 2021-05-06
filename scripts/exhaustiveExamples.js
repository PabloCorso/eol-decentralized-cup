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
  const prs1 = await getPrsFromOnlineLevel(163);
  const prs2 = await getPrsFromOnlineLevel(2);

  const levelsData = [prs1, prs2];

  const result = printResult("Rank double", levelsRankDouble(levelsData), {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

runExample();

// console.log(html.prettyPrint(htmlResult, { indent_size: 2 }));
