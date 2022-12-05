import { Command } from "@oclif/core";
import axios from "axios";
import "axios-debug-log/enable";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
import { Config } from "../config";
import { sharedFlags } from "../constants";

export default class Sync extends Command {
  static description = "sync mastodon followers with feedbin rss feeds";
  static examples = [];
  static flags = { ...sharedFlags };
  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(Sync);

    const config = await Config.init(this, flags.reset, flags.configFile);
    await config.setPublicToken();
    await config.setMastodonAccount();
    await config.setPrivateToken("read+write+follow+push");
    await config.setFeedbinAccount();

    const mastodon = axios.create({
      baseURL: `${config.instance}/api/v1`,
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
    let url = `/accounts/${config.accountId}/following`;
    while (url) {
      const res = await mastodon.get(url);
      following.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
    }

    // get starred entries on feedbin
    const ids: number[] = (await feedbin.get("/starred_entries.json")).data;
    const stars: any[] = [];

    // you can get 100 at a time
    while (ids.length > 0) {
      const page = ids.splice(0, 100);
      const params = { ids: page.join(",") };
      const entries = (await feedbin.get("/entries.json", { params })).data;
      stars.push(...entries);
    }

    // get the starred entries which are mastodon posts
    const mastoStars = stars.filter((s) =>
      following.find((f) => s.url.includes(f.url))
    );

    for (const star of mastoStars) {
      this.log(`favouriting ${star.url}`);
      // favourite the post on mastodon
      const id = star.url.split("/").pop();
      try {
        await mastodon.post(`/statuses/${id}/favourite`);
      } catch {}
    }

    this.log("complete");
  }
}
