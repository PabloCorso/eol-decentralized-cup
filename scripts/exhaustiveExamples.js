const fetch = require("node-fetch");
const { printResult, prettyPrint } = require("./utils/print");
const { writeFile, readFile } = require("./utils/write");
const levelsRankDouble = require("./levelsRankDouble");

const fetchJson = async (url) => {
  console.log(`fetching > ${url}`);
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

const getLevelsFromCup = async (cupId, { max } = { max: 10000 }) => {
  const cup = await fetchJson(
    `https://api.elma.online/api/cups/events/${cupId}`
  );

  const result = [];
  for (const event of cup) {
    const data = await getAllTimesFromOnlineLevel(event.LevelIndex, { max });
    result.push(data);
  }

  return result;
};

const basePath = "scripts/results/";
const bestTimesFile = basePath + "bestTimes.json";
const allTimesFile = basePath + "allTimes.json";
const cup32File = basePath + "32cup.json";
const wcup8File = basePath + "wcup8.json";
const wcup7File = basePath + "wcup7.json";

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
    const levelWithPrs = await getPrsFromOnlineLevel(levelId);
    const levelWithAllTimes = await getAllTimesFromOnlineLevel(levelId);

    levelsDataBestTimes.push(levelWithPrs);
    levelDataAllTimes.push(levelWithAllTimes);
  }

  writeFile(bestTimesFile, JSON.stringify(levelsDataBestTimes));
  writeFile(allTimesFile, JSON.stringify(levelDataAllTimes));
};

const updateCupsData = async () => {
  const cups = [
    { id: 8, name: "32Cup", file: cup32File },
    { id: 17, name: "WCup8", file: wcup8File },
    { id: 10, name: "WCup7", file: wcup8File },
  ];

  for (const cup of cups) {
    const levelsData = await getLevelsFromCup(cup.id);
    writeFile(cup.file, JSON.stringify(levelsData));
  }
};

const runExample = async () => {
  const data = [
    {
      title: "Summary with all finishes",
      description:
        "This takes into account all times finished from all kuskis. Max. 10.000 results per level. Rank is equal to the sum of all unique non shadow times that are under 2 times the best time.",
      file: allTimesFile,
    },
    {
      title: "Summary with only PRs",
      description:
        "This takes into account only best times (PRs) from each kuskis. Rank is equal to the sum of all unique non shadow best times that are under 2 times the best time.",
      file: bestTimesFile,
    },
    {
      title: "32Cup levels with all finishes",
      description: "",
      file: cup32File,
    },
    {
      title: "WCup8 levels with all finishes",
      description: "",
      file: wcup8File,
    },
    {
      title: "WCup7 levels with all finishes",
      description: "",
      file: wcup7File,
    },
  ];

  let content = "";
  for (const item of data) {
    const levelsData = await readFile(item.file);
    const rankedLevels = levelsRankDouble(JSON.parse(levelsData));
    const summary = levelsRankDouble.printSummary(rankedLevels);
    content += `## ${item.title}
${item.description}
${prettyPrint(summary)}
<br/>

`;
  }

  const result = printResult("Rank double", content, {
    pretty: true,
  });
  writeFile("scripts/results/doubleExhaustive.md", result);
};

// runExample();
// updateData();
updateCupsData();
