import { Command, Flags } from "@oclif/core";
import axios from "axios";
import "axios-debug-log/enable";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
import { Config } from "../config";
import { sharedFlags } from "../constants";

const timelines = ["home", "public", "tag"];

export default class Timeline extends Command {
  static description = "write a mastodon timeline to an RSS feed";
  static examples = [];

  static flags = {
    ...sharedFlags,
    hours: Flags.integer({
      default: 48,
      multiple: false,
      char: "h",
      aliases: ["hours"],
      summary: "how many hours of posts to grab",
    }),
    boosts: Flags.boolean({
      default: false,
      char: "b",
      aliases: ["boosts"],
      summary: "whether to include boosts in the feed",
    }),
    feed: Flags.option({
      default: "home",
      multiple: false,
      char: "f",
      aliases: ["feed"],
      parse: async (f) => timelines.find((t) => t === f.toLocaleLowerCase()),
      options: timelines,
      summary: "which type of timeline to read",
      relationships: [
        {
          type: "all",
          flags: [{ name: "tag", when: async (flags) => flags.feed === "tag" }],
        },
      ],
    }),
    tag: Flags.string({
      multiple: false,
      char: "t",
      aliases: ["tag"],
      summary: "which hashtag to read",
    }),
    local: Flags.boolean({
      char: "l",
      aliases: ["local"],
      summary: "show only local statuses",
      default: false,
    }),
    remote: Flags.boolean({
      char: "r",
      aliases: ["remote"],
      summary: "show only remote statuses",
      default: false,
    }),
  };

  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(Timeline);

    const config = await Config.init(this, flags.reset, flags.configFile);
    await config.setMastodonAccount();
    await config.setPrivateToken("read+write+follow+push");
    await config.setFeedbinAccount();
    await config.setFeedbinTags();

    const mastodon = axios.create({
      baseURL: `${config.instance}/api`,
      headers: {
        Authorization: `Bearer ${config.tokens["read+write+follow+push"]}`,
      },
    });

    const oldest = flags.hours * 60 * 60 * 1000;

    let url = `/v1/timelines/home`;

    if (flags.feed === "public") {
      url = `/v1/timelines/public`;
    }

    if (flags.feed === "tag" && flags.tag) {
      url = `/v1/timelines/tag/${encodeURIComponent(flags.tag)}`;
    }

    let posts = [];
    while (url) {
      const res = await mastodon.get(url, {
        params: { local: flags.local, remote: flags.remote },
      });
      posts.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
      const last = res.data[res.data.length - 1];
      if (!last || Date.now() - Date.parse(last.created_at) > oldest) {
        break;
      }
    }

    if (!flags.boosts) {
      posts = posts.filter((p) => !p.reblog);
    }

    this.log("complete");
  }
}
