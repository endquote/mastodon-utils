import { CliUx, Command } from "@oclif/core";
import axios from "axios";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

export class Config {
  command!: Command;
  instance?: string;
  clientId?: string;
  clientSecret?: string;
  tokens: Record<string, string> = {};
  account?: string;
  accountId?: string;
  path?: string;
  feedbinUser?: string;
  feedbinPass?: string;
  feedbinTags: string[] = [];

  static init = async (
    command: Command,
    reset: boolean,
    path?: string
  ): Promise<Config> => {
    const c = new Config();
    c.command = command;
    c.readConfig(reset, path);
    await c.initApp();
    return c;
  };

  /**
   * Load the contents of the local config file.
   * @param reset return an empty configuration
   * @param path an alternate config file path
   * @returns void
   */
  readConfig = (reset: boolean, path?: string): void => {
    const file = path || `${homedir()}/.mastobin.json`;

    let json = {} as Config;
    if (!reset) {
      try {
        json = JSON.parse(readFileSync(file).toString());
      } catch {}
    }

    this.instance = json.instance;
    this.clientId = json.clientId;
    this.clientSecret = json.clientSecret;
    this.tokens = json.tokens || {};
    this.account = json.account;
    this.accountId = json.accountId;
    this.feedbinUser = json.feedbinUser;
    this.feedbinPass = json.feedbinPass;
    this.feedbinTags = json.feedbinTags || [];
  };

  /**
   * Save to the local config file.
   * @param config the config object to save
   * @returns void
   */
  writeConfig = (): void => {
    const file = this.path || `${homedir()}/.mastobin.json`;
    const config = {
      instance: this.instance,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      tokens: this.tokens,
      account: this.account,
      accountId: this.accountId,
      feedbinUser: this.feedbinUser,
      feedbinPass: this.feedbinPass,
      feedbinTags: this.feedbinTags,
    };
    writeFileSync(file, JSON.stringify(config, null, 2));
  };

  /**
   * Register the app with the Mastodon instance.
   * @param config the config object to save to
   * @returns void
   */
  initApp = async (): Promise<void> => {
    if (!this.instance) {
      const instance = await CliUx.ux.prompt(
        "the url to your mastodon instance"
      );
      // could check that it's valid
      this.instance = instance;
      this.writeConfig();
    }

    if (!this.clientId || !this.clientSecret) {
      const res = await axios.post(`${this.instance}/api/v1/apps`, {
        client_name: "mastodon-utils",
        redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
        scopes: "read write follow push",
        website: "https://mousectrl.org",
      });
      this.clientId = res.data.client_id;
      this.clientSecret = res.data.client_secret;
      this.writeConfig();
    }
  };

  /**
   * Get the token needed to read public data.
   * @param config the config object to save to
   * @returns void
   */
  setPublicToken = async (): Promise<void> => {
    if (!this.tokens.public) {
      const res = await axios.post(`${this.instance}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "client_credentials",
      });
      this.tokens.public = res.data.access_token;
      this.writeConfig();
    }
  };

  /**
   * Get the token needed to read/write private data.
   * @param scopes the access scopes to request
   * @returns void
   */
  setPrivateToken = async (scopes: string): Promise<void> => {
    if (this.instance && this.clientId && !this.tokens[scopes]) {
      const authUrl = `${this.instance}/oauth/authorize?client_id=${this.clientId}&scope=${scopes}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`;
      const code = await CliUx.ux.prompt(authUrl, {
        required: true,
      });

      const res = await axios.post(`${this.instance}/oauth/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "authorization_code",
        code,
        scope: scopes.replace(/\+/g, " "),
      });

      this.tokens[scopes] = res.data.access_token;
      this.writeConfig();
    }
  };

  /**
   * set the account name/id on mastodon
   * @returns void
   */
  setMastodonAccount = async (): Promise<void> => {
    if (!this.account) {
      const account = await CliUx.ux.prompt(
        "enter the username on your instance",
        { required: true }
      );
      this.account = account;
      this.accountId = undefined;
      this.writeConfig();
    }

    if (!this.accountId) {
      await this.initApp();
      const res = await axios.get(
        `${this.instance}/api/v1/accounts/lookup?acct=${this.account}`
      );

      this.accountId = res.data.id;
      this.writeConfig();
    }
  };

  /**
   * set the username/password on feedbin
   * @return void
   */
  setFeedbinAccount = async (): Promise<void> => {
    if (!this.feedbinUser || !this.feedbinPass) {
      const username = await CliUx.ux.prompt("feedbin username", {
        required: true,
      });

      const password = await CliUx.ux.prompt("feedbin password", {
        required: true,
      });

      try {
        const res = await axios.get(
          "https://api.feedbin.com/v2/authentication.json",
          { auth: { username, password } }
        );
      } catch {
        this.command.log("couldn't authorize feedbin");
        this.command.exit();
      }

      this.feedbinUser = username;
      this.feedbinPass = password;
      this.writeConfig();
    }
  };
}
