const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  Strike,
  Link,
  DataTable,
} = require("./utils/elements");
const { centisecondsToPr } = require("./utils/pr");

const printTable = (levels) => {
  const descendingOrderByRank = (a, b) => b.rank - a.rank;

  const rankedLevels = [...levels].sort(descendingOrderByRank);

  let maxTimesCount = 0;
  for (const level of rankedLevels) {
    if (level.times.length > maxTimesCount) {
      maxTimesCount = level.times.length;
    }
  }

  const prTimesHeadings = Array.from({ length: maxTimesCount }).map(
    (_, index) => index + 1
  );
  const timesHeaders = prTimesHeadings.map(TableHeader).join("");

  const headers = TableRow(
    [
      TableHeader("Top"),
      TableHeader("Level"),
      TableHeader("Rank"),
      TableHeader("Total sum"),
      ...timesHeaders,
    ].join("")
  );

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];
    const nameData = TableData(Link({ children: level.name, href: level.url }));

    let count = 0;
    const times = [];
    while (count < maxTimesCount) {
      const prData = level.times[count] || 0;
      times.push(prData);
      count += 1;
    }

    const bestTime = times[0];
    const timesData = times
      .map((pr) => {
        const prText = pr ? centisecondsToPr(pr) : "";
        const isOverDouble = pr > bestTime * 2;
        const text = isOverDouble ? Strike(prText) : prText;
        return TableData(text);
      })
      .join("");
    const totalData = TableData(centisecondsToPr(level.timesTotal));
    const rankData = TableData(centisecondsToPr(level.rank));

    const levelTop = i + 1;
    const topData = TableData(levelTop);

    rows.push(
      TableRow([topData, nameData, rankData, totalData, timesData].join(""))
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
};

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
      wr: bestTime,
      times: timesCount,
      unique: uniqueTimes,
      shadow: shadowTimes,
      above2x: timesTwiceBest,
      removed: timesTwiceBest + shadowTimes,
      rank: centisecondsToPr(level.rank),
      total: centisecondsToPr(level.timesTotal),
    });
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
module.exports.printTable = printTable;
module.exports.printSummary = printSummary;
