/* !!! DO NOT IMPORT config.js TO FRONTEND CODE !!! */

export default {
  usePrivate: process.env.USE_PRIVATE || "0", // "1" | "0"
  hsClientSecret: process.env.HIVESIGNER_SECRET || "", // when USE_PRIVATE=0 and HIVESIGNER client section must be provided,
  hive_id: process.env.HIVE_ID || "hive-173115",
  theme: process.env.THEME || "sky",
  tags: process.env.TAGS?.split(",") || "gnars",
  availibleAccounts: process.env.ACCOUNTS ? +process.env.ACCOUNTS : 0,
  baseApiUrl: process.env.API_URL || "https://account-creator.3speak.tv/api"
};
