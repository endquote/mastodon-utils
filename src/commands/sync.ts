import { Command } from "@oclif/core";
import axios from "axios";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
import { Config } from "../config";
import { feedTag, sharedFlags } from "../constants";

export default class Sync extends Command {
  static description = "sync mastodon followers with feedbin rss feeds";
  static examples = [];
  static flags = { ...sharedFlags };
  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(Sync);

    const config = await Config.init(this, flags.reset, flags.configFile);
    await config.getPublicToken();
    await config.getMastodonAccount();
    await config.getFeedbinAccount();
    await config.getFeedbinTags();

    const mastodon = axios.create({
      baseURL: `${config.instance}/api/v1`,
      headers: { Authorization: `Bearer: ${config.tokens.public}` },
    });

    const feedbin = axios.create({
      baseURL: "https://api.feedbin.com/v2",
      auth: { username: config.feedbinUser!, password: config.feedbinPass! },
    });

    // get mastodon followings
    const following = [];
    let url = `/accounts/${config.accountId}/following`;
    while (url) {
      const res = await mastodon.get(url);
      following.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
    }

    this.log(`got ${following.length} accounts`);

    // get feedbin subscriptions
    const subscriptions = (await feedbin.get("/subscriptions.json")).data;

    // get feedbin tags
    const taggings = (await feedbin.get("/taggings.json")).data;

    // get subscriptions created by this tool
    const followedSubscriptions = taggings
      .filter((t: any) => t.name === feedTag)
      .map((t: any) => subscriptions.find((s: any) => s.feed_id === t.feed_id));

    // for each following, if no followed subscription, add subscription

    // for each followed subscription, if no following, remove subscription

    this.log("complete");
  }
}
