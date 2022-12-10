import { Command } from "@oclif/core";
import axios from "axios";
import "axios-debug-log/enable";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
import { Config } from "../config";
import { sharedFlags } from "../constants";

export default class SyncFeeds extends Command {
  static description = "sync mastodon followers with feedbin rss feeds";
  static examples = [];
  static flags = { ...sharedFlags };
  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(SyncFeeds);

    const config = await Config.init(this, flags.reset, flags.configFile);
    await config.setMastodonAccount();
    await config.setPublicToken();
    await config.setFeedbinAccount();

    const mastodon = axios.create({
      baseURL: `${config.instance}/api`,
      headers: { Authorization: `Bearer ${config.tokens.public}` },
    });

    const feedbin = axios.create({
      baseURL: "https://api.feedbin.com/v2",
      auth: { username: config.feedbinUser!, password: config.feedbinPass! },
    });

    // get mastodon followings
    const following = [];
    let url = `/v1/accounts/${config.accountId}/following`;
    while (url) {
      const res = await mastodon.get(url);
      following.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
    }

    // get feedbin subscriptions
    const subscriptions = (await feedbin.get("/subscriptions.json")).data;

    // get feedbin tags
    const taggings = (await feedbin.get("/taggings.json")).data;

    // get subscriptions created by this tool
    const followedSubs = taggings
      .filter((t: any) => t.name === config.feedbinTags[0])
      .map((t: any) => subscriptions.find((s: any) => s.feed_id === t.feed_id));

    // for each following
    for (const follow of following) {
      const feed_url = `${follow.url}.rss`;
      // find subscription
      const sub = subscriptions.find((f: any) => f.feed_url === feed_url);
      if (!sub) {
        // no subscription found, add one
        const res = await feedbin.post("/subscriptions.json", { feed_url });
        const feed_id = res.data.feed_id;
        for (const tag of config.feedbinTags) {
          // add tags
          await feedbin.post("/taggings.json", { feed_id, name: tag });
        }
      }
    }

    // for each subscription
    for (const sub of followedSubs) {
      // find follow
      const follow = following.find((f) => f.url === sub.site_url);
      if (!follow) {
        // if there's no follow, remove the subscription
        await feedbin.delete(`/subscriptions/${sub.id}.json`);
      }
    }

    this.log("complete");
  }
}
