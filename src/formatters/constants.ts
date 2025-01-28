export const ANSI_COLORS = {
  black: "\u001B[30m",
  blue: "\u001B[34m",
  cyan: "\u001B[36m",
  gray: "\u001B[90m",
  green: "\u001B[32m",
  magenta: "\u001B[35m",
  red: "\u001B[31m",
  white: "\u001B[37m",
  yellow: "\u001B[33m",
};

export const ANSI_COLORS_BRIGHT = {
  blackBright: "\u001B[90m",
  blueBright: "\u001B[94m",
  cyanBright: "\u001B[96m",
  grayBright: "\u001B[37m",
  greenBright: "\u001B[92m",
  magentaBright: "\u001B[95m",
  redBright: "\u001B[91m",
  whiteBright: "\u001B[97m",
  yellowBright: "\u001B[93m",
};

export const ANSI_BACKGROUND_COLORS = {
  black: "\u001B[40m",
  blue: "\u001B[44m",
  cyan: "\u001B[46m",
  gray: "\u001B[90m",
  green: "\u001B[42m",
  magenta: "\u001B[45m",
  red: "\u001B[41m",
  white: "\u001B[47m",
  yellow: "\u001B[43m",
};

export const ANSI_BACKGROUND_COLORS_BRIGHT = {
  blackBright: "\u001B[100m",
  blueBright: "\u001B[104m",
  cyanBright: "\u001B[106m",
  grayBright: "\u001B[100m",
  greenBright: "\u001B[102m",
  magentaBright: "\u001B[105m",
  redBright: "\u001B[101m",
  whiteBright: "\u001B[107m",
  yellowBright: "\u001B[103m",
};

export const ANSI_FORMATS = {
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  hidden: "\u001B[8m",
  inverse: "\u001B[7m",
  italic: "\u001B[3m",
  reset: "\u001B[0m",
  strikethrough: "\u001B[9m",
  underline: "\u001B[4m",
};

export const colors = { ...ANSI_COLORS, ...ANSI_COLORS_BRIGHT };
export const backgroundColors = { ...ANSI_BACKGROUND_COLORS, ...ANSI_BACKGROUND_COLORS_BRIGHT };
export const formats = { ...ANSI_FORMATS };
