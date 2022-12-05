import { expect, test } from "@oclif/test";

describe("sync-stars", () => {
  test
    .stdout()
    .command(["sync-stars"])
    .it("runs sync-stars cmd", (ctx) => {
      expect(ctx.stdout).to.contain("complete");
    });
});
