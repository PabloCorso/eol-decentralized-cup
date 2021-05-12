const { Link, Mark, Span, DataTable } = require("./utils/elements");
const { centisecondsToRecord } = require("./utils/record");

const getTopText = (top) => (top <= 5 ? Mark(`${top}*`) : top);

const percentage = (count, total) => {
  const percentage = (count / total) * 100;
  const fixedPercentage = Math.round(percentage);
  return `(${fixedPercentage}%)`;
};

const printSummary = (levels) => {
  const descendingOrderByRank = (a, b) => b.rank - a.rank;
  const rankedLevels = [...levels].sort(descendingOrderByRank);

  const columns = [
    { field: "top", header: "Top" },
    { field: "level", header: "Level" },
    { field: "wr", header: "Best time" },
    { field: "times", header: "Times count" },
    { field: "times_percentage", header: "" },
    { field: "unique", header: "Unique times" },
    { field: "unique_percentage", header: "" },
    { field: "shadow", header: "Shadow times" },
    { field: "above2x", header: "Times > 2x best" },
    { field: "removed", header: "Removed times" },
    { field: "rank", header: "Rank" },
    { field: "rank_percentage", header: "" },
    { field: "total", header: "Total sum" },
  ];

  let totalTimesCount = 0;
  let totalUniqueTimesCount = 0;
  let totalRank = 0;
  for (const level of rankedLevels) {
    totalTimesCount += level.timesCount;
    totalUniqueTimesCount += level.uniqueTimes.length;
    totalRank += level.rank;
  }

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];

    const top = i + 1;
    const bestTime = level.times[0];
    const uniqueTimesCount = level.uniqueTimes.length;

    rows.push({
      top: getTopText(top),
      level: Link({ children: level.name, href: level.url }),
      wr: centisecondsToRecord(bestTime),
      times: level.timesCount,
      times_percentage: percentage(level.timesCount, totalTimesCount),
      unique: uniqueTimesCount,
      unique_percentage: percentage(uniqueTimesCount, totalUniqueTimesCount),
      shadow: level.shadowTimesCount,
      above2x: level.timesTwiceBestCount,
      removed: level.removedTimesCount,
      rank: centisecondsToRecord(level.rank),
      rank_percentage: percentage(level.rank, totalRank),
      total: centisecondsToRecord(level.timesTotal),
    });
  }

  return DataTable({ columns, rows });
};

const printSummaryComparison = (ranksData, ranks) => {
  const shouldAddLevelInfoColumns = (index) => index % 2 === 0;
  const getLevelInfoColumns = (index) => [
    {
      field: `level_${index}`,
      header: "Level",
    },
    {
      field: `wr_${index}`,
      header: "Best time",
    },
  ];

  const columns = [];
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    if (shouldAddLevelInfoColumns(i)) {
      columns.push(...getLevelInfoColumns(i));
    }

    columns.push(
      { field: `${rank.name}_top`, header: `Top (${rank.name})` },
      { field: `${rank.name}_rank`, header: `Rank (${rank.name})` }
    );
  }

  const orderedLevelsByRank = {};
  for (const rank of ranks) {
    const levelsToSort = ranksData.levels.map((level) => ({
      name: level.name,
      rank: level[rank.name].rank,
    }));
    const descendingOrderByRank = (a, b) => b.rank - a.rank;
    orderedLevelsByRank[rank.name] = levelsToSort.sort(descendingOrderByRank);
  }

  const rows = [];
  for (const level of ranksData.levels) {
    const bestTime = centisecondsToRecord(level.prs.uniqueTimes[0]);

    const row = {};
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      if (shouldAddLevelInfoColumns(i)) {
        const levelInfoColumns = getLevelInfoColumns(i);
        row[levelInfoColumns[0].field] = Link({
          children: level.name,
          href: level[rank.name].url,
        });
        row[levelInfoColumns[1].field] = bestTime;
      }

      const top =
        orderedLevelsByRank[rank.name].findIndex(
          (lev) => lev.name === level.name
        ) + 1;
      row[`${rank.name}_top`] = getTopText(top);
      row[`${rank.name}_rank`] = centisecondsToRecord(level[rank.name].rank);
    }

    rows.push(row);
  }

  return DataTable({ columns, rows });
};

const printSummaryCompatibleComparison = (ranksData, ranks) => {
  const columns = [
    { field: `level`, header: "Level" },
    { field: `wr`, header: "Best time" },
    { field: "times", header: "Times count" },
    { field: "times_percentage", header: "" },
    { field: "unique", header: "Unique times" },
    { field: "unique_percentage", header: "" },
  ];
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    columns.push(
      { field: `${rank.name}_top`, header: `Top (${rank.name})` },
      { field: `${rank.name}_rank`, header: `Rank (${rank.name})` }
    );
  }

  const orderedLevelsByRank = {};
  for (const rank of ranks) {
    const levelsToSort = ranksData.levels.map((level) => ({
      name: level.name,
      rank: level[rank.name].rank,
    }));
    const descendingOrderByRank = (a, b) => b.rank - a.rank;
    orderedLevelsByRank[rank.name] = levelsToSort.sort(descendingOrderByRank);
  }

  let totalTimesCount = 0;
  let totalUniqueTimesCount = 0;
  for (const level of ranksData.levels) {
    const levelInfo = level[ranks[0].name];
    totalTimesCount += levelInfo.timesCount;
    totalUniqueTimesCount += levelInfo.uniqueTimes.length;
  }

  const rows = [];
  for (const level of ranksData.levels) {
    const levelInfo = level[ranks[0].name];
    const bestTime = centisecondsToRecord(levelInfo.uniqueTimes[0]);
    const levelNameLink = Link({
      children: level.name,
      href: levelInfo.url,
    });
    const uniqueTimesCount = levelInfo.uniqueTimes.length;

    const row = {
      level: levelNameLink,
      wr: bestTime,
      times: levelInfo.timesCount,
      times_percentage: percentage(levelInfo.timesCount, totalTimesCount),
      unique: uniqueTimesCount,
      unique_percentage: percentage(uniqueTimesCount, totalUniqueTimesCount),
    };
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      const top =
        orderedLevelsByRank[rank.name].findIndex(
          (lev) => lev.name === level.name
        ) + 1;
      row[`${rank.name}_top`] = getTopText(top);
      row[`${rank.name}_rank`] = centisecondsToRecord(level[rank.name].rank);
    }

    rows.push(row);
  }

  return DataTable({ columns, rows });
};

const getTimesTotal = (times) => {
  let total = 0;
  for (const pr of times) {
    total += pr;
  }

  return total;
};

const getTimesLessThanTwiceBest = ({ times, bestTime }) => {
  const lessOrEqualThanDoubleBestTime = (time) => time <= bestTime * 2;
  return times.filter(lessOrEqualThanDoubleBestTime);
};

const getUniqueValuesFromArray = (values) => {
  const result = [];
  for (const value of values) {
    if (!result.includes(value)) {
      result.push(value);
    }
  }

  return result;
};

const getUniqueSortedTimes = (times) => {
  const orderedTimes = times.sort((a, b) => a - b);
  const uniqueTimes = getUniqueValuesFromArray(orderedTimes);
  return uniqueTimes;
};

const levelsRankDouble = (
  levelsData,
  { useUniqueTimes } = { useUniqueTimes: false }
) => {
  const resultLevels = [];
  for (const level of levelsData) {
    const timesTotal = getTimesTotal(level.times);
    const uniqueTimes = getUniqueSortedTimes(level.times);
    const timesLessThanTwiceBest = getTimesLessThanTwiceBest({
      times: useUniqueTimes ? uniqueTimes : level.times,
      bestTime: uniqueTimes[0],
    });
    const rank = getTimesTotal(timesLessThanTwiceBest);

    const timesCount = level.times.length;
    const shadowTimesCount = timesCount - uniqueTimes.length;
    const timesTwiceBestCount = timesCount - timesLessThanTwiceBest.length;
    const removedTimesCount = useUniqueTimes
      ? timesTwiceBestCount + shadowTimesCount
      : timesTwiceBestCount;

    resultLevels.push({
      ...level,
      timesTotal,
      rank,
      uniqueTimes,
      timesCount,
      shadowTimesCount,
      timesTwiceBestCount,
      removedTimesCount,
    });
  }

  return resultLevels;
};

module.exports = levelsRankDouble;
module.exports.printSummary = printSummary;
module.exports.printSummaryComparison = printSummaryComparison;
module.exports.printSummaryCompatibleComparison =
  printSummaryCompatibleComparison;
