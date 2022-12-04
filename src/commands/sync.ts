import { Command } from "@oclif/core";
import axios from "axios";
import * as dotenv from "dotenv";
import parseLinkHeader from "parse-link-header";
import {
  getMastodonAccount,
  getPublicToken,
  initApp,
  readConfig,
} from "../config";
import { sharedFlags } from "../constants";

export default class Sync extends Command {
  static description = "sync mastodon followers with feedbin rss feeds";
  static examples = [];
  static flags = { ...sharedFlags };
  static args = [];

  async run(): Promise<void> {
    dotenv.config();
    const { args, flags } = await this.parse(Sync);

    let config = readConfig(flags.reset, flags.configFile);
    config = await initApp(config);
    config = await getPublicToken(config);
    config = await getMastodonAccount(config);

    const http = axios.create({
      baseURL: `${config.instance}/api/v1`,
      headers: { Authorization: `Bearer: ${config.tokens.public}` },
    });

    const following = [];
    let url = `/accounts/${config.accountId}/following`;
    while (url) {
      const res = await http.get(url);
      following.push(...res.data);
      const links = parseLinkHeader(res.headers.link);
      url = links && links.next ? links.next.url : "";
    }

    this.log(`got ${following.length} accounts`);
    this.log("complete");
  }
}
