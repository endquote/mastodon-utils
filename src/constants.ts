import { Flags } from "@oclif/core";

export const sharedFlags = {
  reset: Flags.boolean({
    char: "r",
    summary: "reset any saved configuration",
  }),
  configFile: Flags.string({
    char: "c",
    summary: "path to an alternate config file",
  }),
};
