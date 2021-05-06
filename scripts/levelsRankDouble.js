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

  let maxPrsCount = 0;
  for (const level of rankedLevels) {
    if (level.prs.length > maxPrsCount) {
      maxPrsCount = level.prs.length;
    }
  }

  const prTimesHeadings = Array.from({ length: maxPrsCount }).map(
    (_, index) => index + 1
  );
  const prsHeaders = prTimesHeadings.map(TableHeader).join("");

  const headers = TableRow(
    [
      TableHeader("Top"),
      TableHeader("Level"),
      TableHeader("Rank"),
      TableHeader("Total sum"),
      ...prsHeaders,
    ].join("")
  );

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];
    const nameData = TableData(Link({ children: level.name, href: level.url }));

    let count = 0;
    const prs = [];
    while (count < maxPrsCount) {
      const prData = level.prs[count] || 0;
      prs.push(prData);
      count += 1;
    }

    const bestTime = prs[0];
    const prsData = prs
      .map((pr) => {
        const prText = pr ? centisecondsToPr(pr) : "";
        const isOverDouble = pr > bestTime * 2;
        const text = isOverDouble ? Strike(prText) : prText;
        return TableData(text);
      })
      .join("");
    const totalData = TableData(centisecondsToPr(level.prsTotal));
    const rankData = TableData(centisecondsToPr(level.rank));

    const levelTop = i + 1;
    const topData = TableData(levelTop);

    rows.push(
      TableRow([topData, nameData, rankData, totalData, prsData].join(""))
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
      TableHeader("PRs count"),
      TableHeader("Unique PRs"),
      TableHeader("Best time"),
      TableHeader("Rank"),
      TableHeader("Total sum"),
      TableHeader("Times > 2x"),
      TableHeader("Removed times"),
    ].join("")
  );

  const rows = [];
  for (let i = 0; i < rankedLevels.length; i++) {
    const level = rankedLevels[i];

    const nameData = TableData(Link({ children: level.name, href: level.url }));
    const totalData = TableData(centisecondsToPr(level.prsTotal));
    const rankData = TableData(centisecondsToPr(level.rank));

    const levelTop = i + 1;
    const topData = TableData(levelTop);

    const prsCount = TableData(level.prs.length);
    const bestTimeData = TableData(centisecondsToPr(level.prs[0]));

    const uniqueTimes = level.uniquePrs.length;
    const uniqueTimesData = TableData(uniqueTimes);
    const lazyTimes = level.prs.filter((pr) => pr > level.prs[0] * 2).length;
    const lazyTimesData = TableData(lazyTimes);
    const removedTimesData = TableData(lazyTimes + uniqueTimes);

    rows.push(
      TableRow(
        [
          topData,
          nameData,
          prsCount,
          uniqueTimesData,
          bestTimeData,
          rankData,
          totalData,
          lazyTimesData,
          removedTimesData,
        ].join("")
      )
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
};

const getPrsSum = (prs) => {
  let total = 0;
  for (const pr of prs) {
    total += pr;
  }

  return total;
};

const calculatePrsRank = ({ prs, bestPr }) => {
  const lessOrEqualThanDoubleBestPr = (pr) => pr <= bestPr * 2;
  const filteredPrs = prs.filter(lessOrEqualThanDoubleBestPr);
  return getPrsSum(filteredPrs);
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

const getUniqueSortedPrs = (prs) => {
  const orderedPrs = prs.sort((a, b) => a - b);
  const uniquePrs = getUniqueValuesFromArray(orderedPrs);
  return uniquePrs;
};

const levelsRankDouble = (levelsData) => {
  const resultLevels = [];
  for (const level of levelsData) {
    const uniquePrs = getUniqueSortedPrs(level.prs);
    const prsTotal = getPrsSum(uniquePrs);
    const rank = calculatePrsRank({ prs: uniquePrs, bestPr: uniquePrs[0] });

    resultLevels.push({ ...level, prsTotal, rank, uniquePrs });
  }

  return resultLevels;
};

module.exports = levelsRankDouble;
module.exports.printTable = printTable;
module.exports.printSummary = printSummary;
