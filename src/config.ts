import { CliUx } from "@oclif/core";
import axios from "axios";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";

export type Config = {
  instance?: string;
  clientId?: string;
  clientSecret?: string;
  tokens: Record<string, string>;
  account?: string;
  accountId?: string;
};

/**
 * Load the contents of the local config file.
 * @param reset return an empty configuration
 * @param path an alternate config file path
 * @returns the contents of the local config file
 */
export const readConfig = (reset: boolean, path?: string): Config => {
  const file = path || `${homedir()}/.mastobin.json`;
  let txt = "{}";
  try {
    txt = readFileSync(file).toString();
  } catch {}

  let json = {} as Config;
  if (!reset) {
    try {
      json = JSON.parse(txt);
    } catch {}
  }

  json.tokens = json.tokens || {};

  return json;
};

/**
 * Save to the local config file.
 * @param config the config object to save
 * @returns void
 */
export const writeConfig = (config: Config): void => {
  const file = `${homedir()}/.mastobin.json`;
  writeFileSync(file, JSON.stringify(config, null, 2));
};

/**
 * Register the app with the Mastodon instance.
 * @param config the config object to save to
 * @returns the config object with a clientid/clientsecret
 */
export const initApp = async (config: Config): Promise<Config> => {
  if (!config.instance) {
    const instance = await CliUx.ux.prompt("the url to your mastodon instance");
    // could check that it's valid
    config.instance = instance;
    writeConfig(config);
  }

  if (!config.clientId || !config.clientSecret) {
    const res = await axios.post(`${config.instance}/api/v1/apps`, {
      client_name: "Mastodon RSS Feed Sync",
      redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
      scopes: "read",
      website: "https://mousectrl.org",
    });
    config.clientId = res.data.client_id;
    config.clientSecret = res.data.client_secret;
    writeConfig(config);
  }

  return config;
};

/**
 * Get the token needed to read public data.
 * @param config the config object to save to
 * @returns the config object with a public read token
 */
export const getPublicToken = async (config: Config): Promise<Config> => {
  if (!config.tokens.public) {
    const res = await axios.post(`${config.instance}/oauth/token`, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "client_credentials",
    });
    config.tokens.public = res.data.access_token;
    writeConfig(config);
  }

  return config;
};

/**
 * Get the token needed to read/write private data.
 * @param config the config object to save to
 * @param scopes the access scopes to request
 * @returns the config object with the requested scope token
 */
export const getPrivateToken = async (
  config: Config,
  scopes: string
): Promise<Config> => {
  if (config.instance && config.clientId && !config.tokens[scopes]) {
    const tokenUrl = `${config.instance}/oauth/authorize?client_id=${config.clientId}&scope=${scopes}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`;
    await CliUx.ux.anykey("press any key to grant permission");
    await CliUx.ux.open(tokenUrl);
    const token = await CliUx.ux.prompt("enter the token", { required: true });
    config.tokens[scopes] = token;
    writeConfig(config);
  }

  return config;
};

export const getMastodonAccount = async (config: Config): Promise<Config> => {
  if (!config.account) {
    const account = await CliUx.ux.prompt(
      "enter the username on your instance",
      { required: true }
    );
    config.account = account;
    config.accountId = undefined;
    writeConfig(config);
  }

  if (!config.accountId) {
    config = await initApp(config);
    const res = await axios.get(
      `${config.instance}/api/v1/accounts/lookup?acct=${config.account}`
    );

    config.accountId = res.data.id;
    writeConfig(config);
  }

  return config;
};
