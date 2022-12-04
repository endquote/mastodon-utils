import { expect, test } from "@oclif/test";

describe("sync", () => {
  test
    .stdout()
    .command(["sync"])
    .it("runs sync cmd", (ctx) => {
      expect(ctx.stdout).to.contain("complete");
    });
});
