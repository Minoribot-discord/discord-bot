const devModePrefix = "DEV_";

const databaseAddDevModePrefix = (devMode: boolean, name: string) => {
  return devMode ? `${devModePrefix}${name}` : name;
};

export { databaseAddDevModePrefix };
export * from "./collectors.ts";
export * from "./fetch.ts";
export * from "./time.ts";
