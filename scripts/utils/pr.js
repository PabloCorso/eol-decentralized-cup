const { secondsToCentiseconds, minutesToCentiseconds } = require("./time");

const timePartsToPr = ({ minutes, seconds, centiseconds }) => {
  const minutesPart = minutes > 0 ? `${minutes}:` : "";
  const secondsPart = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
  const centisecondsPart =
    centiseconds < 10 ? `${centiseconds}0` : centiseconds;
  return `${minutesPart}${secondsPart}${centisecondsPart}`;
};

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

const prToCentiseconds = (pr) => {
  const { minutes, seconds, centiseconds } = prToTimeParts(pr);

  return (
    centiseconds +
    secondsToCentiseconds(seconds) +
    minutesToCentiseconds(minutes)
  );
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

module.exports = {
  prToTimeParts,
  timePartsToPr,
  prToCentiseconds,
  centisecondsToPr,
};
