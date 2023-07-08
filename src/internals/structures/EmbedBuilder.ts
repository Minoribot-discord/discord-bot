import { Embed } from "deps";

export class EmbedBuilder {
  embed: Embed = {};
  constructor(data?: Embed | EmbedBuilder) {
    if (data) {
      if (data instanceof EmbedBuilder) {
        this.embed = data.toJSON();
      } else {
        this.embed = data;
      }
    }
  }

  setTitle(title: string) {
    this.embed.title = title;
    return this;
  }

  setDescription(description: string) {
    this.embed.description = description;
    return this;
  }

  setUrl(url: string) {
    this.embed.url = url;
    return this;
  }

  setTimestamp(timestamp: number) {
    this.embed.timestamp = timestamp;
    return this;
  }

  setColor(color: number) {
    this.embed.color = color;
    return this;
  }

  setFooter(
    text: string,
    iconUrl?: string,
    proxyIconUrl?: string,
  ) {
    // @ts-ignore: we'll assign the required props anyway
    this.embed.footer ??= {};
    this.embed.footer!.text = text;
    this.embed.footer!.iconUrl = iconUrl;
    this.embed.footer!.proxyIconUrl = proxyIconUrl;

    return this;
  }

  setImage(url: string, proxyUrl?: string, height?: number, width?: number) {
    // @ts-ignore: we'll assign the required props anyway
    this.embed.image ??= {};
    this.embed.image!.url = url;
    this.embed.image!.proxyUrl = proxyUrl;
    this.embed.image!.height = height;
    this.embed.image!.width = width;

    return this;
  }

  setThumbnail(
    url: string,
    proxyUrl?: string,
    height?: number,
    width?: number,
  ) {
    // @ts-ignore: we'll assign the required props anyway
    this.embed.thumbnail ??= {};
    this.embed.thumbnail!.url = url;
    this.embed.thumbnail!.proxyUrl = proxyUrl;
    this.embed.thumbnail!.height = height;
    this.embed.thumbnail!.width = width;

    return this;
  }

  setAuthor(
    name: string,
    url?: string,
    iconUrl?: string,
    proxyIconUrl?: string,
  ) {
    // @ts-ignore: we'll assign the required props anyway
    this.embed.author ??= {};
    this.embed.author!.name = name;
    this.embed.author!.url = url;
    this.embed.author!.iconUrl = iconUrl;
    this.embed.author!.proxyIconUrl = proxyIconUrl;

    return this;
  }

  addField(name: string, value: string, inline?: boolean) {
    this.embed.fields ??= [];
    this.embed.fields.push({ name, value, inline });
    return this;
  }

  addFields(fields: NonNullable<Embed["fields"]>) {
    this.embed.fields ??= [];
    for (const field of fields) {
      this.embed.fields.push(field);
    }
    return this;
  }

  toJSON(): Embed {
    return { ...this.embed };
  }
}
