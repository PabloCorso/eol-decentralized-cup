const { Link, DataTable } = require("./utils/elements");
const { centisecondsToRecord } = require("./utils/record");

const printSummary = (levels) => {
  const descendingOrderByRank = (a, b) => b.rank - a.rank;
  const rankedLevels = [...levels].sort(descendingOrderByRank);

  const columns = [
    { field: "top", header: "Top" },
    { field: "level", header: "Level" },
    { field: "wr", header: "Best time" },
    { field: "times", header: "Times count" },
    { field: "unique", header: "Unique times" },
    { field: "shadow", header: "Shadow times" },
    { field: "above2x", header: "Times > 2x best" },
    { field: "removed", header: "Removed times" },
    { field: "rank", header: "Rank" },
    { field: "total", header: "Total sum" },
  ];

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];

    const top = i + 1;
    const timesCount = level.times.length;
    const bestTime = level.times[0];
    const uniqueTimes = level.uniqueTimes.length;
    const shadowTimes = timesCount - uniqueTimes;
    const timesTwiceBest = level.times.filter((pr) => pr > bestTime * 2).length;

    rows.push({
      top,
      level: Link({ children: level.name, href: level.url }),
      wr: centisecondsToRecord(bestTime),
      times: timesCount,
      unique: uniqueTimes,
      shadow: shadowTimes,
      above2x: timesTwiceBest,
      removed: timesTwiceBest + shadowTimes,
      rank: centisecondsToRecord(level.rank),
      total: centisecondsToRecord(level.timesTotal),
    });
  }

  return DataTable({ columns, rows });
};

const printSummaryComparison = (ranksData, ranks) => {
  const columns = [
    { field: "level", header: "Level" },
    { field: "wr", header: "Best time" },
  ];
  for (const rank of ranks) {
    const rankColumns = [
      { field: `${rank.name}_top`, header: `Top (${rank.name})` },
      { field: `${rank.name}_rank`, header: `Rank (${rank.name})` },
    ];
    columns.push(...rankColumns);
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
    const row = {
      level: level.name,
      wr: centisecondsToRecord(level.prs.uniqueTimes[0]),
    };
    for (const rank of ranks) {
      const top = orderedLevelsByRank[rank.name].findIndex(
        (lev) => lev.name === level.name
      );
      row[`${rank.name}_top`] = top + 1;
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

const calculateTimesRank = ({ times, bestTime }) => {
  const lessOrEqualThanDoubleBestPr = (time) => time <= bestTime * 2;
  const filteredTimes = times.filter(lessOrEqualThanDoubleBestPr);
  return getTimesTotal(filteredTimes);
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

const levelsRankDouble = (levelsData) => {
  const resultLevels = [];
  for (const level of levelsData) {
    const uniqueTimes = getUniqueSortedTimes(level.times);
    const timesTotal = getTimesTotal(level.times);
    const rank = calculateTimesRank({
      times: uniqueTimes,
      bestTime: uniqueTimes[0],
    });

    resultLevels.push({ ...level, timesTotal, rank, uniqueTimes });
  }

  return resultLevels;
};

module.exports = levelsRankDouble;
module.exports.printSummary = printSummary;
module.exports.printSummaryComparison = printSummaryComparison;
