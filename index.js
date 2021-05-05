const levelsData = [
  {
    name: "Lvl 1",
    prs: ["3:50", "3:60", "3:90", "3:90", "3:90", "60:59:59"],
  },
  { name: "Lvl 2", prs: ["10:00", "10:50", "11:00"] },
  { name: "Lvl 3", prs: ["21:00"] },
];

const prToTimeParts = (pr) => {
  const split = pr.split(":");
  const hasMinutes = split.length >= 3;
  const centiseconds = split[split.length - 1];
  const seconds = split[split.length - 2];
  const minutes = hasMinutes ? split[split.length - 3] : 0;
  return {
    minutes: Number(minutes),
    seconds: Number(seconds),
    centiseconds: Number(centiseconds),
  };
};

const timePartsToString = ({ minutes, seconds, centiseconds }) => {
  const minutesPart = minutes > 0 ? `${minutes}:` : "";
  const secondsPart = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
  const centisecondsPart =
    centiseconds < 10 ? `${centiseconds}0` : centiseconds;
  return `${minutesPart}${secondsPart}${centisecondsPart}`;
};

const secondsToCentiseconds = (seconds) => seconds * 100;
const minutesToCentiseconds = (minutes) => minutes * 6000;
const prToCentiseconds = (pr) => {
  const { minutes, seconds, centiseconds } = prToTimeParts(pr);

  return (
    centiseconds +
    secondsToCentiseconds(seconds) +
    minutesToCentiseconds(minutes)
  );
};

const timePartsToPr = ({ minutes, seconds, centiseconds }) => {
  const minutesPart = minutes > 0 ? `${minutes}:` : "";
  const secondsPart = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
  const centisecondsPart =
    centiseconds < 10 ? `${centiseconds}0` : centiseconds;
  return `${minutesPart}${secondsPart}${centisecondsPart}`;
};

const centisecondsToPr = (centiseconds) => {
  let seconds = Math.floor(centiseconds / 100);
  const remainingCentiseconds = centiseconds - seconds * 100;

  const minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;

  return timePartsToPr({
    minutes,
    seconds,
    centiseconds: remainingCentiseconds,
  });
};

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

const Table = (children) => `<table>${children}</table>`;

const TableHead = (children) => `<thead>${children}</thead>`;

const TableRow = (children) => `<tr>${children}</tr>`;

const TableHeader = (children) => `<th>${children}</th>`;

const TableBody = (children) => `<tbody>${children}</tbody>`;

const TableData = (children) => `<td>${children}</td>`;

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
        [nameData, prsData, totalData, averageData, rankData, topData].join("")
      )
    );
  }

  return Table([TableHead(headers), TableBody(rows.join(""))].join(""));
};

console.log(getTable(resultLevels));
