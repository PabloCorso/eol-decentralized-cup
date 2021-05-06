const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
} = require("./utils/elements");
const { prToCentiseconds, centisecondsToPr } = require("./utils/pr");

const levelsRankAverage = (levelsData) => {
  const calculatePrsTotal = (prs) => {
    let totalCentiseconds = 0;
    for (const pr of prs) {
      totalCentiseconds += prToCentiseconds(pr);
    }

    return centisecondsToPr(totalCentiseconds);
  };

  const calculatePrsAverage = ({ total, count }) => {
    const totalCentiseconds = prToCentiseconds(total);
    const averageCentiseconds = Math.floor(totalCentiseconds / count);
    return centisecondsToPr(averageCentiseconds);
  };

  const calculatePrsRank = ({ prs, average }) => {
    const filteredPrs = prs.filter(
      (pr) => prToCentiseconds(pr) <= prToCentiseconds(average)
    );
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

  const descendingOrderByRank = (a, b) =>
    prToCentiseconds(b.rank) - prToCentiseconds(a.rank);

  const rankedLevels = [...resultLevels].sort(descendingOrderByRank);

  const getTable = (levels) => {
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
        const prData = level.prs[count] || "";
        prs.push(prData);
        count += 1;
      }

      const prsData = prs.map(TableData).join("");
      const totalData = TableData(level.prsTotal);
      const averageData = TableData(level.average);
      const rankData = TableData(level.rank);

      const levelTop =
        rankedLevels.findIndex((item) => item.name === level.name) + 1;
      const topData = TableData(levelTop);

      rows.push(
        TableRow(
          [nameData, prsData, totalData, averageData, rankData, topData].join(
            ""
          )
        )
      );
    }

    return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
  };

  return getTable(resultLevels);
};

module.exports = levelsRankAverage;
