import { Context, I18nContext } from "structures";
import { isNumberNegative } from "utils";

export function formatDate(date: Date, separator = "_"): string {
  const timePart = formatDateIntoHourMinuteSecond(date);
  const datePart = formatDateIntoDayMonthYear(date);

  return `${timePart}${separator}${datePart}`;
}

export function formatDateIntoHourMinuteSecond(date: Date): string {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}-${minute}-${second}`;
}

export function formatDateIntoDayMonthYear(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
}

export const timeUnitsParseTime: { [key: string]: number } = {
  y: 365 * 24 * 60 * 60,
  d: 24 * 60 * 60,
  h: 60 * 60,
  m: 60,
  s: 1,
};
export function parseTime(timeString: string): number | null {
  let reversed = false;

  if (timeString.startsWith("-")) {
    reversed = true;
    timeString = timeString.slice(1);
  }
  const timeRegex = /(\d+)(\D+)/g;
  let totalSeconds = 0;

  let match;
  let matched = false;
  while ((match = timeRegex.exec(timeString)) !== null) {
    const [_, amount, unit] = match;
    if (!(unit in timeUnitsParseTime)) {
      return null;
    }
    matched = true;
    totalSeconds += parseInt(amount) * timeUnitsParseTime[unit];
  }

  if (!matched) return null;
  return reversed ? -totalSeconds : totalSeconds;
}

const timeUnitsFormatTime: { [key: string]: number } = {
  "day(s)": 24 * 60 * 60,
  "hour(s)": 60 * 60,
  "month(s)": 60,
  "second(s)": 1,
};
export function formatTime(seconds: number): string {
  let reversed = false;
  if (isNumberNegative(seconds)) {
    reversed = true;
    seconds = -seconds;
  }

  const units = Object.keys(timeUnitsFormatTime); // Reverse the order of units

  for (const unit of units) {
    const unitValue = timeUnitsFormatTime[unit];
    if (seconds >= unitValue) {
      const amount = (seconds / unitValue).toFixed(2);
      return `${reversed ? "-" : ""}${amount}${unit}`;
    }
  }

  return "0s"; // Return '0s' if the input is 0 seconds
}

const max_time_range_ = parseTime("10y");
if (!max_time_range_) {
  throw new Error("Could not parse max time range");
}
export const max_time_range = max_time_range_;
export const min_time_range = -max_time_range;

export async function parseTimeAndCheckIfCorrect(
  ctx: Context,
  i18n: I18nContext,
  timeString: string,
  range: { min?: number; max?: number } = {},
): Promise<number | null> {
  if (range.min === null || range.min === undefined) {
    range.min = 0;
  }
  if (range.max === null || range.max === undefined) {
    range.max = max_time_range;
  }

  const parsedTime = parseTime(timeString);
  if (parsedTime === null) {
    await ctx.reply(
      i18n.translate("COMMAND.GLOBAL.PROVIDE_CORRECT_TIME"),
      { private: true },
    );
    return null;
  }

  if (parsedTime < range?.min || parsedTime > range?.max) {
    await ctx.reply(
      i18n.translate("COMMAND.GLOBAL.PROVIDE_CORRECT_TIME_RANGE", [
        formatTime(range.min),
        formatTime(range.max),
      ]),
      { private: true },
    );
    return null;
  }

  return parsedTime;
}
