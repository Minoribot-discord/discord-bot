import { User } from "deps";
import { userUsernameAndDiscriminator } from "utils";
import { I18nContext } from "structures/context/I18nContext.ts";
import { EmbedBuilder } from "structures/EmbedBuilder.ts";

export const baseEmbed = new EmbedBuilder().setColor(0xFCDD09);

export function makeBasePunishmentEmbed(
  i18n: I18nContext,
  user: User,
  reason?: string,
) {
  const embed = makeBaseEmbed()
    .addField(
      i18n.translate("EMBED.PUNISHMENT.FIELDS.USER.NAME"),
      `\`${userUsernameAndDiscriminator(user)}\`` +
        `\n<@${user.id}>\n\`${user.id}\``,
    );

  if (reason) {
    embed.addField(
      i18n.translate("EMBED.PUNISHMENT.FIELDS.REASON.NAME"),
      `\`${reason}\`` ??
        i18n.translate("EMBED.PUNISHMENT.FIELDS.REASON.VALUE.NO_REASON"),
    );
  }

  return embed;
}

export function makeBaseEmbed(): EmbedBuilder {
  return new EmbedBuilder(baseEmbed);
}
