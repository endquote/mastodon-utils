import { Command } from "@oclif/core";
import axios from "axios";
import "axios-debug-log/enable";
import * as dotenv from "dotenv";
import { Config } from "../config";
import { sharedFlags } from "../constants";

export default class SyncStars extends Command {
  static description = "sync feedbin stars with mastodon favourites";
  static examples = [];
  static flags = { ...sharedFlags };
  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(SyncStars);

    const config = await Config.init(this, flags.reset, flags.configFile);
    await config.setPublicToken();
    await config.setMastodonAccount();
    await config.setPrivateToken("read+write+follow+push");
    await config.setFeedbinAccount();

    const mastodon = axios.create({
      baseURL: `${config.instance}/api`,
      headers: {
        Authorization: `Bearer ${config.tokens["read+write+follow+push"]}`,
      },
    });

    const feedbin = axios.create({
      baseURL: "https://api.feedbin.com/v2",
      auth: { username: config.feedbinUser!, password: config.feedbinPass! },
    });

    // get starred entries on feedbin
    const starIds: number[] = (await feedbin.get("/starred_entries.json")).data;
    let stars: any[] = [];

    // you can get 100 at a time
    while (starIds.length > 0) {
      const page = starIds.splice(0, 100);
      const params = { ids: page.join(",") };
      const entries = (await feedbin.get("/entries.json", { params })).data;
      stars.push(...entries);
    }

    // get starred entries from mastodon
    stars = stars.filter((s) => s.url.includes(config.instance));

    for (const star of stars) {
      const id = star.url.split("/").pop();
      if (id) {
        // favourite the post
        try {
          await mastodon.post(`/v1/statuses/${id}/favourite`);
        } catch (e) {
          // might be a 404 if the post was deleted
        }

        // delete the star on feedbin
        await feedbin.delete("/starred_entries.json", {
          data: { starred_entries: [star.id] },
        });
      }
    }

    this.log("complete");
  }
}
