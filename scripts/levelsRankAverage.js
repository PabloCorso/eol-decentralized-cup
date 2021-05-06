const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
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
      TableHeader("Average"),
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

    const prsData = prs
      .map((pr) => TableData(pr ? centisecondsToPr(pr) : ""))
      .join("");
    const totalData = TableData(centisecondsToPr(level.prsTotal));
    const averageData = TableData(centisecondsToPr(level.average));
    const rankData = TableData(centisecondsToPr(level.rank));

    const levelTop =
      rankedLevels.findIndex((item) => item.name === level.name) + 1;
    const topData = TableData(levelTop);

    rows.push(
      TableRow(
        [nameData, prsData, totalData, averageData, rankData, topData].join("")
      )
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
};

const calculatePrsTotal = (prs) => {
  let total = 0;
  for (const pr of prs) {
    total += pr;
  }

  return total;
};

const calculatePrsAverage = ({ total, count }) => {
  return Math.floor(total / count);
};

const calculatePrsRank = ({ prs, average }) => {
  const filteredPrs = prs.filter((pr) => pr <= average);
  return calculatePrsTotal(filteredPrs);
};

const getUniquePrs = (prs) => {
  const result = [];
  for (const pr of prs) {
    if (!result.includes(pr)) {
      result.push(pr);
    }
  }

  return result;
};

const levelsRankAverage = (levelsData) => {
  const resultLevels = [];
  for (const level of levelsData) {
    const uniquePrs = getUniquePrs(level.prs);
    const prsTotal = calculatePrsTotal(uniquePrs);
    const average = calculatePrsAverage({
      total: prsTotal,
      count: uniquePrs.length,
    });
    const rank = calculatePrsRank({ prs: uniquePrs, average });

    resultLevels.push({ ...level, prsTotal, average, rank });
  }

  return getTable(resultLevels);
};

module.exports = levelsRankAverage;
