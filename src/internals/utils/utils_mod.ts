export * from "./fetch.ts";

const formatTime = (date: Date, separator = "_"): string => {
  const timePart = formatTimePart(date);
  const datePart = formatDatePart(date);

  return `${timePart}${separator}${datePart}`;
};

const formatTimePart = (date: Date): string => {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}-${minute}-${second}`;
};

const formatDatePart = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
};

export { formatDatePart, formatTime, formatTimePart };
