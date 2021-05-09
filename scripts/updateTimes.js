const fetch = require("node-fetch");
const { writeFile } = require("./utils/write");
const { FileNames } = require("./paths");
const { dataFiles, DataType } = require("./dataFiles");

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

updateFiles();
