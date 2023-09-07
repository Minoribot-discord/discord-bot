import { OpenWeatherClient, Units } from "deps";
import { openWeatherConfig } from "config";

export const openWeatherClient = new OpenWeatherClient({
  apiKey: openWeatherConfig.apiKey,
  apiUrl: openWeatherConfig.apiUrl,
  defaults: {
    units: "metric",
  },
});

export function convertTemperatureIntoString(temp: number, units?: Units) {
  switch (units) {
    case undefined:
    case "standard":
      // Uses kelvin
      return `${temp} K`;
    case "metric":
      return `${temp}°C`;
    case "imperial":
      return `${temp}°F`;
  }
}
