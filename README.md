mastodon-utils
=================

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mastodon-utils
$ mastodon-utils COMMAND
running command...
$ mastodon-utils (--version)
mastodon-utils/0.0.1 linux-x64 node-v18.12.0
$ mastodon-utils --help [COMMAND]
USAGE
  $ mastodon-utils COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mastodon-utils help [COMMAND]`](#mastodon-utils-help-command)
* [`mastodon-utils plugins`](#mastodon-utils-plugins)
* [`mastodon-utils plugins:install PLUGIN...`](#mastodon-utils-pluginsinstall-plugin)
* [`mastodon-utils plugins:inspect PLUGIN...`](#mastodon-utils-pluginsinspect-plugin)
* [`mastodon-utils plugins:install PLUGIN...`](#mastodon-utils-pluginsinstall-plugin-1)
* [`mastodon-utils plugins:link PLUGIN`](#mastodon-utils-pluginslink-plugin)
* [`mastodon-utils plugins:uninstall PLUGIN...`](#mastodon-utils-pluginsuninstall-plugin)
* [`mastodon-utils plugins:uninstall PLUGIN...`](#mastodon-utils-pluginsuninstall-plugin-1)
* [`mastodon-utils plugins:uninstall PLUGIN...`](#mastodon-utils-pluginsuninstall-plugin-2)
* [`mastodon-utils plugins update`](#mastodon-utils-plugins-update)

## `mastodon-utils help [COMMAND]`

Display help for mastodon-utils.

```
USAGE
  $ mastodon-utils help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mastodon-utils.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `mastodon-utils plugins`

List installed plugins.

```
USAGE
  $ mastodon-utils plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mastodon-utils plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.7/src/commands/plugins/index.ts)_

## `mastodon-utils plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mastodon-utils plugins:install PLUGIN...

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
  $ mastodon-utils plugins add

EXAMPLES
  $ mastodon-utils plugins:install myplugin 

  $ mastodon-utils plugins:install https://github.com/someuser/someplugin

  $ mastodon-utils plugins:install someuser/someplugin
```

## `mastodon-utils plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mastodon-utils plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mastodon-utils plugins:inspect myplugin
```

## `mastodon-utils plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mastodon-utils plugins:install PLUGIN...

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
  $ mastodon-utils plugins add

EXAMPLES
  $ mastodon-utils plugins:install myplugin 

  $ mastodon-utils plugins:install https://github.com/someuser/someplugin

  $ mastodon-utils plugins:install someuser/someplugin
```

## `mastodon-utils plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ mastodon-utils plugins:link PLUGIN

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
  $ mastodon-utils plugins:link myplugin
```

## `mastodon-utils plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-utils plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-utils plugins unlink
  $ mastodon-utils plugins remove
```

## `mastodon-utils plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-utils plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-utils plugins unlink
  $ mastodon-utils plugins remove
```

## `mastodon-utils plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mastodon-utils plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mastodon-utils plugins unlink
  $ mastodon-utils plugins remove
```

## `mastodon-utils plugins update`

Update installed plugins.

```
USAGE
  $ mastodon-utils plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
