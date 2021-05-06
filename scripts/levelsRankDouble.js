const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  Strike,
} = require("./utils/elements");
const { centisecondsToPr } = require("./utils/pr");

const getTable = (levels) => {
  const descendingOrderByRank = (a, b) => b.rank - a.rank;

  const rankedLevels = [...levels].sort(descendingOrderByRank);

  let maxPrsCount = 0;
  for (const level of levels) {
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
      TableHeader("Level"),
      ...prsHeaders,
      TableHeader("Total"),
      TableHeader("Rank"),
      TableHeader("Top"),
    ].join("")
  );

  const rows = [];
  for (const level of levels) {
    const nameData = TableData(level.name);
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

    const levelTop =
      rankedLevels.findIndex((item) => item.name === level.name) + 1;
    const topData = TableData(levelTop);

    rows.push(
      TableRow([nameData, prsData, totalData, rankData, topData].join(""))
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
  const orderedPrs = prs.sort();
  const uniquePrs = getUniqueValuesFromArray(orderedPrs);
  return uniquePrs;
};

const levelsRankDouble = (levelsData) => {
  const resultLevels = [];
  for (const level of levelsData) {
    const uniquePrs = getUniqueSortedPrs(level.prs);
    const prsTotal = getPrsSum(uniquePrs);
    const rank = calculatePrsRank({ prs: uniquePrs, bestPr: uniquePrs[0] });

    resultLevels.push({ ...level, prsTotal, rank });
  }

  return getTable(resultLevels);
};

module.exports = levelsRankDouble;
