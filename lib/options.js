module.exports = {
    auth: {
        alias: 'a',
        describe: 'Github Access token or export GITHUB_ACCESS_TOKEN env variable with token.',
        'default': process.env.GITHUB_OAUTH || process.env.GITHUB_ACCESS_TOKEN,
        demandOption: true
    },
    duration: {
        alias: 'd',
        describe: 'Duration of past time to search (e.g. 1 day, 2 weeks, 5 months, etc).',
        'default': '1 week'
    },
    filter: {
        alias: 'f',
        describe: 'Comma separated list of repos to ignore.'
    },
    help: {
        alias: 'h',
        describe: 'Usage docs.'
    },
    host: {
        describe: 'GitHub host or export GITHUB_HOST env variable.',
        'default': process.env.GITHUB_HOST || 'api.github.com'
    },
    norc: {
        describe: 'Disable parsing of the ~./orgcommitsrc config.'
    },
    pathPrefix: {
        alias: 'path',
        describe: 'Path prefix for GitHub API requests. Typically used for GitHub Enterprise users.'
    },
    pulls: {
        alias: 'p',
        describe: 'Displays pull request commits only, grouped by labels (if applicable).'
    },
    org: {
        alias: 'o',
        describe: 'GitHub organization to retrieve repositories.'
    },
    repo: {
        alias: 'r',
        describe: 'Specify a repository to query.'
    },
    repoType: {
      describe: 'Repo type to pull: all, public, private, forks, sources, member',
      'default': 'public'
    },
    sha: {
        alias: 's',
        describe: 'Git sha or branch to pull data from (e.g. master, gh-pages, etc).',
        'default': 'master'
    },
    tag: {
        alias: 't',
        describe: 'Displays commits since a given tag, if no tag provided then after last tag.'
    },
    verbose: {
        alias: 'v',
        describe: 'Enable debug messages.'
    }
};
