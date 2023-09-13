import { ApplicationCommandOptionTypes, Coordinates, unitsSchema } from "deps";
import { CommandScope } from "structures";
import { createCommand, createSubCommand } from "internals/loadStuff.ts";
import {
  convertTemperatureIntoString,
  makeBaseEmbed,
  openWeatherClient,
} from "utils";

createCommand({
  name: "weather",
  category: "misc",
  scope: CommandScope.GLOBAL,
  description: "Get the weather for a location",
  dmPermission: true,
});

const locationOptionName = "location";
const zipCodeOptionName = "zip-or-post-code";

createSubCommand("weather", {
  name: "current",
  description: "Get the current weather for a location",
  options: [
    {
      name: locationOptionName,
      description:
        "The name of the location to get weather for (chooses zip code if not provided)",
      type: ApplicationCommandOptionTypes.String,
      minLength: 1,
      required: false,
    },
    {
      name: zipCodeOptionName,
      description:
        "The zip/postal code of the location (chooses location if not provided)",
      type: ApplicationCommandOptionTypes.String,
      minLength: 1,
      required: false,
    },
    {
      name: "units",
      description:
        "The units to display temperature in (Default is metric. Uses Celcius)",
      type: ApplicationCommandOptionTypes.String,
      choices: [
        { name: "Standard (Uses Kelvin)", value: "standard" },
        { name: "Metric (The default. Uses Celsius)", value: "metric" },
        { name: "Imperial (Uses Fahrenheit)", value: "imperial" },
      ],
      required: false,
    },
  ],
  execute: async (ctx, i18n) => {
    const coordinates: Coordinates | undefined =
      ctx.args.getString(locationOptionName)
        ? (await openWeatherClient.getCoordinatesByLocationName(
          ctx.args.getString(locationOptionName)!,
          1,
        ))[0]
        : ctx.args.getString(zipCodeOptionName)
        ? await openWeatherClient.getCoordinatesByZipOrPostCode(
          ctx.args.getString(zipCodeOptionName)!,
        )
        : undefined;

    if (!coordinates) {
      await ctx.reply(
        i18n.translate(
          "COMMAND.GLOBAL.ERRORS.PROVIDE_CORRECT_LOCATION_OR_POST_CODE",
        ),
      );
      return;
    }

    const units = unitsSchema.parse(ctx.args.getString("units") || "metric");

    const currentWeather = await openWeatherClient.getCurrentWeather(
      coordinates,
      units,
    );

    console.log(currentWeather);
    await ctx.reply(
      makeBaseEmbed()
        .setTitle(
          i18n.translate("COMMAND.APP.WEATHER.CURRENT.EMBED.TITLE", [
            currentWeather.name,
          ]),
        )
        .setDescription(currentWeather.weather[0]?.description ?? "** **")
        .addField(
          i18n.translate(
            "COMMAND.APP.WEATHER.CURRENT.EMBED.FIELDS.MAX_TEMP.NAME",
          ),
          convertTemperatureIntoString(currentWeather.main.temp_max, units),
        ).addField(
          i18n.translate(
            "COMMAND.APP.WEATHER.CURRENT.EMBED.FIELDS.MIN_TEMP.NAME",
          ),
          convertTemperatureIntoString(currentWeather.main.temp_min, units),
        ),
    );
  },
});
