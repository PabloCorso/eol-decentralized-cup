const DataType = {
  Levels: 0,
  Cup: 1,
  Pack: 2,
};

const levelsFileIds = [
  2, // Warm Up
  4, // Flat Track
  156, // Lab Pro
  163, // Tutor1
  690, // Smibu80
  2417, // Uni001
  116878, // EOL01
  116880, // EOL02
  116882, // EOL05
  116898, // EOL21
  359892, // Pob1000
  74671, // PobFF003
  73243, // PobFF001
  2599, // Rambo101
  1697, // Pipo001
  331252, // TTC101
  483457, // CPC101
  237824, // WCup601
  371127, // WCup701
  371726, // WCup702
  471405, // WCup802
  472912, // WCup804
  475307, // WCup807
];

const dataFiles = [
  {
    name: "Random levels",
    fileName: "levels1",
    type: DataType.Levels,
    levelIds: levelsFileIds,
  },
  {
    name: "Internals",
    fileName: "internals",
    type: DataType.Pack,
    packId: "Int",
  },
  { name: "32Cup", fileName: "32Cup", type: DataType.Cup, cupId: 8 },
  { name: "WCup8", fileName: "wcup8", type: DataType.Cup, cupId: 17 },
  { name: "WCup7", fileName: "wcup7", type: DataType.Cup, cupId: 10 },
  { name: "TTC1", fileName: "ttc1File", type: DataType.Cup, cupId: 6 },
  {
    name: "EOL level pack",
    fileName: "eol",
    type: DataType.Pack,
    packId: "EOL",
  },
  {
    name: "Pipo level pack",
    fileName: "pipo",
    type: DataType.Pack,
    packId: "Pipo",
  },
];

module.exports = { dataFiles, DataType };
