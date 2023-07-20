import {
  BitwisePermissionFlags,
  Channel,
  Guild,
  Member,
  PermissionStrings,
  Role,
  separateOverwrites,
} from "deps";

// Some code stolen or inspired from "https://github.com/discordeno/discordeno/blob/1a717ddc7d97e31d3775747df9df153729d2925d/plugins/permissions/src/permissions.ts"

/** Returns the permissions that are not in the given permissionBits */
export function missingPermissions(
  permissionBits: bigint,
  permissions: PermissionStrings[],
) {
  if (permissionBits & 8n) return [];

  return permissions.filter((permission) =>
    !(permissionBits & BigInt(BitwisePermissionFlags[permission]))
  );
}

/** Calculates the permissions this member has in the given guild */
export function calculateBasePermissions(
  guild: Guild,
  member: Member,
): bigint {
  let permissions = 0n;

  // Calculate the role permissions bits, @everyone role is not in memberRoleIds so we need to pass guildId manually
  permissions |= [...member.roles, guild.id]
    .map((id) => guild.roles.get(id)?.permissions.bitfield)
    // Removes any edge case undefined
    .filter((perm) => perm)
    .reduce((bits, perms) => {
      bits! |= perms!;
      return bits;
    }, 0n) || 0n;

  // If the memberId is equal to the guild ownerId he automatically has every permission so we add ADMINISTRATOR permission
  if (guild.ownerId === member.id) permissions |= 8n;
  // Return the members permission bits as a string
  return permissions;
}

/** Calculates the permissions this member has for the given Channel */
export function calculateChannelOverwrites(
  guild: Guild,
  channel: Channel,
  member: Member,
): bigint {
  // This is a DM channel so return ADMINISTRATOR permission
  if (!channel?.guildId) return BigInt(BitwisePermissionFlags.ADMINISTRATOR);

  let permissions = calculateBasePermissions(
    guild,
    member,
  );

  // First calculate @everyone overwrites since these have the lowest priority
  const overwriteEveryone = channel.permissionOverwrites?.find((overwrite) => {
    const [_, id] = separateOverwrites(overwrite.id);
    return id === channel.guildId;
  });
  if (overwriteEveryone) {
    const [_type, _id, allow, deny] = separateOverwrites(overwriteEveryone.id);
    // First remove denied permissions since denied < allowed
    permissions &= ~deny;
    permissions |= allow;
  }

  const overwrites = channel.permissionOverwrites;

  // In order to calculate the role permissions correctly we need to temporarily save the allowed and denied permissions
  let allow = 0n;
  let deny = 0n;
  const memberRoles = member.roles || [];
  // Second calculate members role overwrites since these have middle priority
  for (const overwrite of overwrites || []) {
    const [_type, id, allowBits, denyBits] = separateOverwrites(overwrite.id);

    if (!memberRoles.includes(id)) continue;

    deny |= denyBits;
    allow |= allowBits;
  }
  // After role overwrite calculate save allowed permissions first we remove denied permissions since "denied < allowed"
  permissions &= ~deny;
  permissions |= allow;

  // Third calculate member specific overwrites since these have the highest priority
  const overwriteMember = overwrites?.find((overwrite) => {
    const [_, id] = separateOverwrites(overwrite.id);
    return id === member.id;
  });
  if (overwriteMember) {
    const [_type, _id, allowBits, denyBits] = separateOverwrites(
      overwriteMember.id,
    );

    permissions &= ~denyBits;
    permissions |= allowBits;
  }

  return permissions;
}

/** Checks if the given permission bits are matching the given permissions. `ADMINISTRATOR` always returns `true` */
export function validatePermissions(
  permissionBits: bigint,
  permissions: PermissionStrings[],
) {
  if (permissionBits & 8n) return true;

  return permissions.every(
    (permission) =>
      // Check if permission is in permissionBits
      permissionBits & BigInt(BitwisePermissionFlags[permission]),
  );
}

/** Checks if the given member has these permissions in the given guild */
export function hasGuildPermissions(
  guild: Guild,
  member: Member,
  permissions: PermissionStrings[],
) {
  // First we need the role permission bits this member has
  const basePermissions = calculateBasePermissions(
    guild,
    member,
  );
  // Second use the validatePermissions function to check if the member has every permission
  return validatePermissions(basePermissions, permissions);
}

/** Checks if the given member has these permissions for the given channel */
export function hasChannelPermissions(
  guild: Guild,
  channel: Channel,
  member: Member,
  permissions: PermissionStrings[],
) {
  // First we need the overwrite bits this member has
  const channelOverwrites = calculateChannelOverwrites(
    guild,
    channel,
    member,
  );
  // Second use the validatePermissions function to check if the member has every permission
  return validatePermissions(channelOverwrites, permissions);
}

/** Get the missing Guild permissions this member has */
export function getMissingGuildPermissions(
  guild: Guild,
  member: Member,
  permissions: PermissionStrings[],
) {
  // First we need the role permission bits this member has
  const permissionBits = calculateBasePermissions(
    guild,
    member,
  );
  // Second return the members missing permissions
  return missingPermissions(permissionBits, permissions);
}

/** Get the missing Channel permissions this member has */
export function getMissingChannelPermissions(
  guild: Guild,
  channel: Channel,
  member: Member,
  permissions: PermissionStrings[],
) {
  // First we need the role permission bits this member has
  const permissionBits = calculateChannelOverwrites(
    guild,
    channel,
    member,
  );
  // Second return the members missing permissions
  return missingPermissions(permissionBits, permissions);
}

/** Gets the highest role from the member in this guild */
export function highestRole(
  guild: Guild,
  member: Member,
) {
  // Get the roles from the member
  const memberRoles = member.roles;
  // This member has no roles so the highest one is the @everyone role
  if (memberRoles.length === 0) return guild.roles.get(guild.id)!;

  let memberHighestRole: Role | undefined;

  for (const roleId of memberRoles) {
    const role = guild.roles.get(roleId);
    // Rare edge case handling if undefined
    if (!role) continue;

    // If memberHighestRole is still undefined we want to assign the role,
    // else we want to check if the current role position is higher than the current memberHighestRole
    if (
      !memberHighestRole ||
      memberHighestRole.position < role.position ||
      memberHighestRole.position === role.position
    ) {
      memberHighestRole = role;
    }
  }

  // The member has at least one role so memberHighestRole must exist
  return memberHighestRole!;
}
