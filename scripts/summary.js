const { printResult, prettyPrint } = require("./utils/print");
const { writeFile, readFile } = require("./utils/write");
const levelsRankDouble = require("./levelsRankDouble");
const { FileNames } = require("./paths");
const { dataFiles } = require("./dataFiles");

const runSummary = async ({
  title,
  data,
  resultFileName,
  getDataFileSummary,
}) => {
  let content = "";
  for (const dataFile of data) {
    const summary = await getDataFileSummary(dataFile);
    content += `## ${dataFile.name}
${prettyPrint(summary)}
<br/>
<br/>
  
`;
  }

  const result = printResult(title, content, { pretty: true });
  writeFile(`scripts/summaries/${resultFileName}`, result);
};

const runExample = async () => {
  runSummary({
    data: dataFiles,
    resultFileName: "summary_prs.md",
    title: "Rank best times",
    getDataFileSummary: async (dataFile) => {
      const times = await readFile(FileNames.bestTimes(dataFile.fileName));
      const rankedTimes = levelsRankDouble(JSON.parse(times));
      return levelsRankDouble.printSummary(rankedTimes);
    },
  });
  runSummary({
    data: dataFiles,
    resultFileName: "summary_unique_prs.md",
    title: "Rank best times",
    getDataFileSummary: async (dataFile) => {
      const times = await readFile(FileNames.bestTimes(dataFile.fileName));
      const rankedTimes = levelsRankDouble(JSON.parse(times), {
        useUniqueTimes: true,
      });
      return levelsRankDouble.printSummary(rankedTimes, {
        useUniqueTimes: true,
      });
    },
  });
  runSummary({
    data: dataFiles,
    resultFileName: "summary_all.md",
    title: "Rank all times",
    getDataFileSummary: async (dataFile) => {
      const times = await readFile(FileNames.allTimes(dataFile.fileName));
      const rankedTimes = levelsRankDouble(JSON.parse(times));
      return levelsRankDouble.printSummary(rankedTimes);
    },
  });
  runSummary({
    data: dataFiles,
    resultFileName: "summary_unique_all.md",
    title: "Rank all times",
    getDataFileSummary: async (dataFile) => {
      const times = await readFile(FileNames.allTimes(dataFile.fileName));
      const rankedTimes = levelsRankDouble(JSON.parse(times), {
        useUniqueTimes: true,
      });
      return levelsRankDouble.printSummary(rankedTimes, {
        useUniqueTimes: true,
      });
    },
  });
  runSummary({
    data: dataFiles,
    resultFileName: "summary_comparison.md",
    title: "Rank prs vs all",
    getDataFileSummary: async (dataFile) => {
      const ranks = [
        { name: "prs", fileName: FileNames.bestTimes(dataFile.fileName) },
        {
          name: "unique_prs",
          fileName: FileNames.bestTimes(dataFile.fileName),
          options: {
            useUniqueTimes: true,
          },
        },
        { name: "all", fileName: FileNames.allTimes(dataFile.fileName) },
        {
          name: "unique_all",
          fileName: FileNames.allTimes(dataFile.fileName),
          options: {
            useUniqueTimes: true,
          },
        },
      ];

      const levels = [];
      for (const rank of ranks) {
        const times = await readFile(rank.fileName);
        const rankedTimes = levelsRankDouble(JSON.parse(times), rank.options);

        for (const rankedLevel of rankedTimes) {
          const level = levels.find((level) => level.name === rankedLevel.name);
          if (!level) {
            levels.push({
              name: rankedLevel.name,
              [rank.name]: { ...rankedLevel },
            });
          } else {
            level[rank.name] = { ...rankedLevel };
          }
        }
      }

      const ranksData = {
        name: dataFile.name,
        levels,
      };

      return levelsRankDouble.printSummaryComparison(ranksData, ranks);
    },
  });
};

runExample();
