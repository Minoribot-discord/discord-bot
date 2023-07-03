export const formatTime = (date: Date, separator = "_"): string => {
  const timePart = formatTimePart(date);
  const datePart = formatDatePart(date);

  return `${timePart}${separator}${datePart}`;
};

export const formatTimePart = (date: Date): string => {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}-${minute}-${second}`;
};

export const formatDatePart = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
};

export function parseTime(timeString: string): number | null {
  const timeRegex = /(\d+)(\D+)/g;
  const timeUnits: { [key: string]: number } = {
    d: 24 * 60 * 60,
    h: 60 * 60,
    m: 60,
    s: 1,
  };
  let totalSeconds = 0;

  let match;
  while ((match = timeRegex.exec(timeString)) !== null) {
    console.log(match);
    const [_, amount, unit] = match;
    if (!(unit in timeUnits)) {
      return null;
    }
    totalSeconds += parseInt(amount) * timeUnits[unit];
  }

  return totalSeconds;
}
