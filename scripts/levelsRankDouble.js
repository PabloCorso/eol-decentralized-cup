const { Link, Bold, Underline, DataTable } = require("./utils/elements");
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
    const bestTime = level.times[0];
    const uniqueTimes = level.uniqueTimes.length;

    rows.push({
      top: top <= 5 ? Underline(Bold(top)) : top,
      level: Link({ children: level.name, href: level.url }),
      wr: centisecondsToRecord(bestTime),
      times: level.timesCount,
      unique: uniqueTimes,
      shadow: level.shadowTimesCount,
      above2x: level.timesTwiceBestCount,
      removed: level.removedTimesCount,
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
      const top =
        orderedLevelsByRank[rank.name].findIndex(
          (lev) => lev.name === level.name
        ) + 1;
      row[`${rank.name}_top`] = top <= 5 ? Underline(Bold(top)) : top;
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
      : 0;

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
