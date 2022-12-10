import { Command } from "@oclif/core";
import axios from "axios";
import "axios-debug-log/enable";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
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

    // get mastodon followings
    const following: any[] = [];
    let url = `/v1/accounts/${config.accountId}/following`;
    while (url) {
      const res = await mastodon.get(url);
      following.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
    }

    // get starred entries on feedbin
    const starIds: number[] = (await feedbin.get("/starred_entries.json")).data;
    const starEntries: any[] = [];

    // you can get 100 at a time
    while (starIds.length > 0) {
      const page = starIds.splice(0, 100);
      const params = { ids: page.join(",") };
      const entries = (await feedbin.get("/entries.json", { params })).data;
      starEntries.push(...entries);
    }

    // match starred entries with mastodon users
    const stars = starEntries
      .map((s) => ({
        entry: s,
        user: following.find((f) => s.url.includes(f.url)),
      }))
      .filter((s) => s.user);

    for (const star of stars) {
      // search for the post on my instance
      const res = await mastodon.get(`/v2/search`, {
        params: {
          q: star.entry.url,
          following: true,
          type: "statuses",
          resolve: true,
          account_id: star.user.acct,
        },
      });

      const id = res.data.statuses?.[0]?.id;
      if (id) {
        // favourite the post
        await mastodon.post(`/v1/statuses/${id}/favourite`);

        // delete the star on feedbin
        await feedbin.delete("/starred_entries.json", {
          data: { starred_entries: [star.entry.id] },
        });
      }
    }

    this.log("complete");
  }
}
