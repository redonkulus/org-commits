# org-commits

Display and collect GitHub commit messages or PR's across repositories of an organization. This is typically useful for projects that span multiple repository of an organization and would like to gather commits or pull requests across all of them.

## Install

```
npm install org-commits -g
```

## Usage

You will need a GitHub Personal Access token to access the GitHub API. Go to your [Application Settings](https://github.com/settings/tokens) and click the "Generate new token" button (you typically only need `repo` scope). Once created, you can pass it in via the `-a` flag or export to the `GITHUB_ACCESS_TOKEN` environment variable.

```
Display commit messages across all repositories for an organization.
Usage: org-commits

Options:
  --auth, -a      Github OAuth token or export GITHUB_ACCESS_TOKEN env variable with token.    [required]
  --duration, -d  Duration of past time to search (e.g. 1 day, 2 weeks, 5 months, etc).        [default: "1 week"]
  --filter, -f    Comma separated list of repos to ignore.                                     
  --help, -h      Usage docs.
  --host,         GitHub host or export GITHUB_HOST env variable.                              [default: "api.github.com"]
  --pulls, -p     Displays pull request commits only, grouped by labels (if applicable).
  --org, -o       GitHub organization to retrieve repositories.
  --repo, -r      Specify a repository to query.
  --sha, -s       Git sha or branch to pull data from (e.g. master, gh-pages, etc).            [default: "master"]
  --tag, -t       Displays commits since a given tag, if no tag provided then after last tag.
  --verbose, -v   Enable debug messages.
```

## Examples

```bash
// display all commits from all repositories of an organization
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash

// display all commits for one repo
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -r lodash

// display all commits for one repo since the last month
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -r lodash -d "1 month"

// filter commits from certain repos
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -f "lodash-cli,lodash-migrate"

// display all pull requests since the last week
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -r lodash -p

// display all pull requests since the last tag
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -r lodash -p -t

// display all pull requests since a given tag
$ org-commits -a GITHUB_ACCESS_TOKEN -o lodash -r lodash -p -t v1.1.0
```

## Debugging

There are two ways to expose debugging information:

* `-v`: Pass this argument when running to expose GitHub's API request information.
* `DEBUG=org-commits`: Add the env var `DEBUG` before the `org-commits` command to expose additional debug information.

## GitHub Labels

When using the `--pulls` argument, `org-commits` will automatically group Pull Requests by label. If none exist, the default `Misc` group will be used.

```bash
## fluxible:

### Greenkeeper
- [#475] jsdom@9.5.0 untested ⚠️ (@greenkeeperio-bot)
- [#506] Update eslint-plugin-babel to version 4.0.0 🚀 (@greenkeeperio-bot)
- [#489] Update es6-promise to version 4.0.2 🚀 (@greenkeeperio-bot)
- [#490] Update babel-eslint to version 7.0.0 🚀 (@greenkeeperio-bot)
- [#469] Update yargs to version 5.0.0 🚀 (@greenkeeperio-bot)
- [#501] Update yargs to version 6.1.1 🚀 (@greenkeeperio-bot)

### Misc
- [#512] typo fix (@MaxKramnik)
- [#498] fluxible-router@1.0.0-alpha.6 (@knutties)
```

## License

MIT. See the [LICENSE](https://github.com/redonkulus/org-commits/blob/master/LICENSE.md) file for license text and copyright information.
