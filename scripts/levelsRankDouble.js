const html = require("html");
const {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
} = require("./utils/elements");
const { prToCentiseconds, centisecondsToPr } = require("./utils/pr");

const levelsData = [
  {
    name: "Lvl 1",
    prs: ["3:50", "3:60", "3:90", "3:90", "3:90", "60:59:59"],
  },
  { name: "Lvl 2", prs: ["10:00", "10:50", "11:00"] },
  { name: "Lvl 3", prs: ["21:00"] },
];

const getPrsSum = (prs) => {
  let totalCentiseconds = 0;
  for (const pr of prs) {
    totalCentiseconds += prToCentiseconds(pr);
  }

  return centisecondsToPr(totalCentiseconds);
};

const calculatePrsRank = ({ prs, bestPr }) => {
  console.log(bestPr, prToCentiseconds(bestPr), prToCentiseconds(bestPr) * 2);
  const lessOrEqualThanDoubleBestPr = (pr) =>
    prToCentiseconds(pr) <= prToCentiseconds(bestPr) * 2;
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
  const centiPrs = prs.map(prToCentiseconds);
  const orderedCentiPrs = centiPrs.sort();
  const uniqueCentiPrs = getUniqueValuesFromArray(orderedCentiPrs);
  return uniqueCentiPrs.map(centisecondsToPr);
};

const resultLevels = [];
for (const level of levelsData) {
  const uniquePrs = getUniqueSortedPrs(level.prs);
  const prsTotal = getPrsSum(uniquePrs);
  const rank = calculatePrsRank({ prs: uniquePrs, bestPr: uniquePrs[0] });

  resultLevels.push({ ...level, prsTotal, rank });
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
    const rankData = TableData(level.rank);

    const levelTop =
      rankedLevels.findIndex((item) => item.name === level.name) + 1;
    const topData = TableData(levelTop);

    rows.push(
      TableRow([nameData, prsData, totalData, rankData, topData].join(""))
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
};

const htmlResult = getTable(resultLevels);
console.log(htmlResult);
// console.log(html.prettyPrint(htmlResult, { indent_size: 2 }));
