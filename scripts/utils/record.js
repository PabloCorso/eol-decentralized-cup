const { secondsToCentiseconds, minutesToCentiseconds } = require("./time");

const timePartsToRecord = ({ minutes, seconds, centiseconds }) => {
  const minutesPart = minutes > 0 ? `${minutes}:` : "";
  const secondsPart = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
  const centisecondsPart =
    centiseconds < 10 ? `${centiseconds}0` : centiseconds;
  return `${minutesPart}${secondsPart}${centisecondsPart}`;
};

const recordToTimeParts = (record) => {
  const split = record.split(":");
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

const recordToCentiseconds = (record) => {
  const { minutes, seconds, centiseconds } = recordToTimeParts(record);

  return (
    centiseconds +
    secondsToCentiseconds(seconds) +
    minutesToCentiseconds(minutes)
  );
};

const centisecondsToRecord = (centiseconds) => {
  let seconds = Math.floor(centiseconds / 100);
  const remainingCentiseconds = centiseconds - seconds * 100;

  const minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;

  return timePartsToRecord({
    minutes,
    seconds,
    centiseconds: remainingCentiseconds,
  });
};

module.exports = {
  recordToTimeParts,
  timePartsToRecord,
  recordToCentiseconds,
  centisecondsToRecord,
};
