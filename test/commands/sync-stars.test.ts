import { expect, test } from "@oclif/test";

describe("sync-feeds", () => {
  test
    .stdout()
    .command(["sync-feeds"])
    .it("runs sync-feeds cmd", (ctx) => {
      expect(ctx.stdout).to.contain("complete");
    });
});
