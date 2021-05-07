const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  Strike,
  Link,
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

  const headers = TableRow(
    [
      TableHeader("Top"),
      TableHeader("Level"),
      TableHeader("Best time"),
      TableHeader("Times count"),
      TableHeader("Unique times"),
      TableHeader("Shadow times"),
      TableHeader("Times > 2xWR"),
      TableHeader("Removed times"),
      TableHeader("Rank"),
      TableHeader("Total sum"),
    ].join("")
  );

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];

    const nameData = TableData(Link({ children: level.name, href: level.url }));
    const totalData = TableData(centisecondsToPr(level.timesTotal));
    const rankData = TableData(centisecondsToPr(level.rank));

    const levelTop = i + 1;
    const topData = TableData(levelTop);

    const timesCount = level.times.length;
    const timesCountData = TableData(timesCount);

    const bestTime = level.times[0];
    const bestTimeData = TableData(centisecondsToPr(bestTime));

    const uniqueTimes = level.uniqueTimes.length;
    const uniqueTimesData = TableData(uniqueTimes);

    const shadowTimes = timesCount - uniqueTimes;
    const shadowTimesData = TableData(shadowTimes);

    const timesTwiceBest = level.times.filter((pr) => pr > bestTime * 2).length;
    const timesTwiceBestData = TableData(timesTwiceBest);

    const removedTimesData = TableData(timesTwiceBest + shadowTimes);

    rows.push(
      TableRow(
        [
          topData,
          nameData,
          bestTimeData,
          timesCountData,
          uniqueTimesData,
          shadowTimesData,
          timesTwiceBestData,
          removedTimesData,
          rankData,
          totalData,
        ].join("")
      )
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
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
