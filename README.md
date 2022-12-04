oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mastodon-feedbin
$ mastodon-feedbin COMMAND
running command...
$ mastodon-feedbin (--version)
mastodon-feedbin/0.0.0 darwin-x64 node-v18.12.1
$ mastodon-feedbin --help [COMMAND]
USAGE
  $ mastodon-feedbin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mastodon-feedbin help [COMMAND]`](#mastodon-feedbin-help-command)
* [`mastodon-feedbin plugins`](#mastodon-feedbin-plugins)
* [`mastodon-feedbin plugins:install PLUGIN...`](#mastodon-feedbin-pluginsinstall-plugin)
* [`mastodon-feedbin plugins:inspect PLUGIN...`](#mastodon-feedbin-pluginsinspect-plugin)
* [`mastodon-feedbin plugins:install PLUGIN...`](#mastodon-feedbin-pluginsinstall-plugin-1)
* [`mastodon-feedbin plugins:link PLUGIN`](#mastodon-feedbin-pluginslink-plugin)
* [`mastodon-feedbin plugins:uninstall PLUGIN...`](#mastodon-feedbin-pluginsuninstall-plugin)
* [`mastodon-feedbin plugins:uninstall PLUGIN...`](#mastodon-feedbin-pluginsuninstall-plugin-1)
* [`mastodon-feedbin plugins:uninstall PLUGIN...`](#mastodon-feedbin-pluginsuninstall-plugin-2)
* [`mastodon-feedbin plugins update`](#mastodon-feedbin-plugins-update)
* [`mastodon-feedbin sync`](#mastodon-feedbin-sync)

## `mastodon-feedbin help [COMMAND]`

Display help for mastodon-feedbin.

```
USAGE
  $ mastodon-feedbin help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mastodon-feedbin.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `mastodon-feedbin plugins`

List installed plugins.

```
USAGE
  $ mastodon-feedbin plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mastodon-feedbin plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.7/src/commands/plugins/index.ts)_

## `mastodon-feedbin plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mastodon-feedbin plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mastodon-feedbin plugins add

EXAMPLES
  $ mastodon-feedbin plugins:install myplugin 

  $ mastodon-feedbin plugins:install https://github.com/someuser/someplugin

  $ mastodon-feedbin plugins:install someuser/someplugin
```

## `mastodon-feedbin plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mastodon-feedbin plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mastodon-feedbin plugins:inspect myplugin
```

## `mastodon-feedbin plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mastodon-feedbin plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mastodon-feedbin plugins add

EXAMPLES
  $ mastodon-feedbin plugins:install myplugin 

  $ mastodon-feedbin plugins:install https://github.com/someuser/someplugin

  $ mastodon-feedbin plugins:install someuser/someplugin
```

## `mastodon-feedbin plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ mastodon-feedbin plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ mastodon-feedbin plugins:link myplugin
```

## `mastodon-feedbin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-feedbin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-feedbin plugins unlink
  $ mastodon-feedbin plugins remove
```

## `mastodon-feedbin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-feedbin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-feedbin plugins unlink
  $ mastodon-feedbin plugins remove
```

## `mastodon-feedbin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-feedbin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-feedbin plugins unlink
  $ mastodon-feedbin plugins remove
```

## `mastodon-feedbin plugins update`

Update installed plugins.

```
USAGE
  $ mastodon-feedbin plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `mastodon-feedbin sync`

sync mastodon followers with feedbin rss feeds

```
USAGE
  $ mastodon-feedbin sync [-r] [-c <value>]

FLAGS
  -c, --configFile=<value>  path to an alternate config file
  -r, --reset               reset any saved configuration

DESCRIPTION
  sync mastodon followers with feedbin rss feeds
```

_See code: [dist/commands/sync.ts](https://github.com/endquote/mastodon-feedbin/blob/v0.0.0/dist/commands/sync.ts)_
<!-- commandsstop -->
