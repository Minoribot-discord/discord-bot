import { DiscordUser, Member, User } from "deps";
import { RedisJSONObject, Serializer } from "../types.ts";

const userSerializer: Serializer<User, DiscordUser> = {};
