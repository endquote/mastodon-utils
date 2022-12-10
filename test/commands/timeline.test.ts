import { expect, test } from "@oclif/test";

describe("timeline", () => {
  test
    .stdout()
    .command(["timeline"])
    .it("runs timeline cmd", (ctx) => {
      expect(ctx.stdout).to.contain("complete");
    });
});
