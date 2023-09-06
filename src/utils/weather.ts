import { OpenWeatherClient } from "deps";
import { openWeatherConfig } from "config";

export const openWeatherClient = new OpenWeatherClient({
  apiKey: openWeatherConfig.apiKey,
  apiUrl: openWeatherConfig.apiUrl,
  defaults: {
    units: "metric",
  },
});
