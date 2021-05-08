const fetch = require("node-fetch");
const { printResult, prettyPrint } = require("./utils/print");
const { writeFile, readFile } = require("./utils/write");
const levelsRankDouble = require("./levelsRankDouble");

const fetchJson = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getPrsFromOnlineLevel = async (levelId, { max } = { max: 10000 }) => {
  const level = await fetchJson(`https://api.elma.online/api/level/${levelId}`);
  const bestTimes = await fetchJson(
    `https://api.elma.online/api/besttime/${levelId}/${max}/0`
  );
  const times = bestTimes.slice(0, max).map((item) => item.Time);
  const url = `https://elma.online/levels/${levelId}`;
  return { name: level.LevelName, times, url };
};

const getAllTimesFromOnlineLevel = async (
  levelId,
  { max } = { max: 10000 }
) => {
  const level = await fetchJson(`https://api.elma.online/api/level/${levelId}`);
  const allTimes = await fetchJson(
    `https://api.elma.online/api/allfinished/${levelId}/`
  );
  const times = allTimes.slice(0, max).map((item) => item.Time);
  const url = `https://elma.online/levels/${levelId}`;
  return { name: level.LevelName, times, url };
};

const DataType = {
  Levels: 0,
  Cup: 1,
  Pack: 2,
};

const levelsFileIds = [
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

const dataFiles = [
  {
    name: "Random levels",
    fileName: "levels1",
    type: DataType.Levels,
    levelIds: levelsFileIds,
  },
  { name: "32Cup", fileName: "32Cup", type: DataType.Cup, cupId: 8 },
  { name: "WCup8", fileName: "wcup8", type: DataType.Cup, cupId: 17 },
  { name: "WCup7", fileName: "wcup7", type: DataType.Cup, cupId: 10 },
  { name: "TTC1", fileName: "ttc1File", type: DataType.Cup, cupId: 6 },
  {
    name: "EOL level pack",
    fileName: "eol",
    type: DataType.Pack,
    packId: "EOL",
  },
];

const getCupLevelIds = async (cupId) => {
  const cup = await fetchJson(
    `https://api.elma.online/api/cups/events/${cupId}`
  );
  return cup.map((event) => event.LevelIndex);
};

const getPackLevelIds = async (packId) => {
  const stats = await fetchJson(
    `https://api.elma.online/api/levelpack/${packId}/stats/0`
  );
  return stats.records.map((record) => record.LevelIndex);
};

const getDataFileLevels = async (dataFile) => {
  let levelIds = [];
  if (dataFile.type === DataType.Levels) {
    levelIds = dataFile.levelIds;
  } else if (dataFile.type === DataType.Cup) {
    levelIds = await getCupLevelIds(dataFile.cupId);
  } else if (dataFile.type === DataType.Pack) {
    levelIds = await getPackLevelIds(dataFile.packId);
  }

  return levelIds;
};

const basePath = "scripts/times/";
const FileNames = {
  allTimes: (fileName) => `${basePath}${fileName}_all.json`,
  bestTimes: (fileName) => `${basePath}${fileName}_prs.json`,
};

const updateFiles = async () => {
  for (const dataFile of dataFiles) {
    console.log(`updating file > ${dataFile.fileName}\n`);
    console.log(`getting levels > ${dataFile.name}`);
    const levelIds = await getDataFileLevels(dataFile);

    const bestTimes = [];
    const allTimes = [];
    for (const levelId of levelIds) {
      console.log(`\ngetting best times > ${dataFile.name} > ${levelId}`);
      const levelWithPrs = await getPrsFromOnlineLevel(levelId);
      console.log(`\ngetting all times > ${dataFile.name} > ${levelId}`);
      const levelWithAllTimes = await getAllTimesFromOnlineLevel(levelId);

      bestTimes.push(levelWithPrs);
      allTimes.push(levelWithAllTimes);
    }

    console.log(`\nwritting files > ${dataFile.fileName}`);
    await writeFile(
      FileNames.bestTimes(dataFile.fileName),
      JSON.stringify(bestTimes)
    );
    await writeFile(
      FileNames.allTimes(dataFile.fileName),
      JSON.stringify(allTimes)
    );
    console.log(`\nfinished update > ${dataFile.fileName}\n\n`);
  }
};

const runExample = async () => {
  let bestTimesContent = "";
  let allTimesContent = "";
  for (const dataFile of dataFiles) {
    const bestTimes = await readFile(FileNames.bestTimes(dataFile.fileName));
    const allTimes = await readFile(FileNames.allTimes(dataFile.fileName));

    const rankedBestTimes = levelsRankDouble(JSON.parse(bestTimes));
    const rankedAllTimes = levelsRankDouble(JSON.parse(allTimes));

    const bestTimesSummary = levelsRankDouble.printSummary(rankedBestTimes);
    const allTimesSummary = levelsRankDouble.printSummary(rankedAllTimes);

    bestTimesContent += `## ${dataFile.name}
${prettyPrint(bestTimesSummary)}
<br/>
<br/>

`;
    allTimesContent += `## ${dataFile.name}
${prettyPrint(allTimesSummary)}
<br/>
<br/>

`;
  }

  const resultBestTimes = printResult(
    "Rank double - best times",
    bestTimesContent,
    {
      pretty: true,
    }
  );
  const resultAllTimes = printResult(
    "Rank double - all times",
    allTimesContent,
    {
      pretty: true,
    }
  );
  writeFile("scripts/summaries/summary_prs.md", resultBestTimes);
  writeFile("scripts/summaries/summary_all.md", resultAllTimes);
};

runExample();
// updateFiles();
