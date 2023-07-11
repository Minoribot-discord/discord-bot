import { EmbedBuilder } from "structures/EmbedBuilder.ts";

export const baseEmbed = new EmbedBuilder().setColor(0xFCDD09);

export function makeBaseEmbed(): EmbedBuilder {
  return new EmbedBuilder(baseEmbed);
}
