import debugLib from 'debug';
import fs from 'fs';
import GitHubApi from 'github';
import homedir from 'os-homedir';
import moment from 'moment';
import path from 'path';
import semver from 'semver';
import {
    capitalizeWords,
    cleanTagName,
    formatMessage
} from './utils';

let debug = debugLib('org-commits');
const rcPath = process.env.ORG_COMMITS_RC || path.join(homedir(), '.orgcommitsrc');

export class OrgCommits {
    constructor(options) {
        debug('options', options);
        this.options = options = this.loadRcConfig(options);

        // used to collect repo commit data
        this.output = {};

        // org / repo info
        this.host = options.host;
        this.pathPrefix = options.pathPrefix;
        this.repo = options.repo;
        this.org = options.org;

        this.repoFilter = options.filter ? options.filter.split(',') : undefined;

        // parse moment compatible date (e.g. "2 weeks")
        let timeSplit = options.duration.split(' ');
        this.since = moment().subtract(timeSplit[0], timeSplit[1]).format();

        // hack to enable dynamically, @see https://github.com/visionmedia/debug/issues/275
        if (options.verbose) {
            debugLib.enable('org-commits');
            debug = debugLib('org-commits');
        }

        this.setupGithub();
    }

    loadRcConfig(options) {
        // bail out if norc option used
        if (options.norc) {
            return options;
        }

        let rcConfig;

        try {
            if (fs.existsSync(rcPath)) {
                rcConfig = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
            }
        } catch (e) {
            console.error(rcPath + ' could not be loaded', e);
        }

        if (rcConfig) {
            options = Object.assign({}, options, rcConfig);
            debug(rcPath + ' used, final options are ', options);
        }

        return options;
    }

    setupGithub() {
        // setup github api instance
        this.github = new GitHubApi({
            version: '3.0.0',
            debug: this.options.verbose,
            protocol: 'https',
            host: this.host,
            pathPrefix: this.pathPrefix,
            timeout: 5000
        });

        // authenticate the requests
        this.github.authenticate({
            type: 'oauth',
            token: this.options.auth
        });
    }

    run() {
        if (this.repo) {
            // if repo specified, then execute directly
            return this.getCommits(this.repo).then(() => {
                this.displayOutput();
                return this.output;
            });
        } else if (this.org) {
            // otherwise collect repo's across the org
            return this.getFromOrg(this.org).then(() => {
                this.displayOutput();
                return this.output;
            });
        } else {
            console.error('Missing required arguments: org');
        }
    }

    async getCommits(repo) {
        debug('getCommits ', repo);
        this.output[repo] = [];
        if (this.options.tag) {
            let date;
            try {
                date = await this.getDateFromTag(repo);
            } catch (e) {
                console.error('get date error', e);
            }
            if (date) {
                debug('overwrite default date (%s) with new date (%s)', this.since, date);
                this.since = date;
            }
            await this.getAllCommitsOrPulls(repo);
        } else {
            await this.getAllCommitsOrPulls(repo);
        }
    }

    // get all repo's from organization
    getFromOrg(org) {
        debug('get from org');
        return new Promise((resolve, reject) => {
            // grab repos for the org
            this.github.repos.getForOrg({
                org: org,
                type: 'public',
                per_page: 100
            }, (err, results) => {
                if (err || !results) {
                    return reject(new Error('No repos found for ' + org));
                }

                // pull repo names
                var repos = results.map(item => item.name);
                var repoFilter = this.repoFilter;
                debug(repos);

                // filter repos
                if (repoFilter) {
                    repos = repos.filter(repo => {
                        for (let x in repoFilter) {
                            if (repoFilter.hasOwnProperty(x)) {
                                if (repo.indexOf(repoFilter[x]) !== -1) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    });
                }

                return Promise.all(
                    repos.map(async function (repo) {
                        this.output[repo] = [];
                        await this.getCommits(repo);
                    }.bind(this))
                ).then(() => {
                    return resolve();
                })['catch'](e => {
                    return reject(e);
                });
            });
        });
    }

    async getAllCommitsOrPulls(repo) {
        debug('get all commits or pulls');
        if (this.options.pulls) {
            await this.getPullRequests(repo);
        } else {
            await this.getAllCommits(repo);
        }
    }

    getAllCommits(repo) {
        debug('getAllCommits ' + repo);
        return new Promise((resolve) => {
            this.github.repos.getCommits({
                owner: this.org,
                repo: repo,
                sha: this.options.sha,
                since: this.since
            }, (err, result) => {
                if (err || !result) {
                    console.log(`[${this.org}/${repo}]`, err ? JSON.parse(err.message).message : 'No commits found');
                    return resolve();
                }

                // strip commits with no author
                var commits = result.filter(item => item.author !== null);

                commits.forEach((item) => {
                    this.output[repo].push({
                        commit: formatMessage(item.commit.message, item.author.login)
                    });
                });

                return resolve();
            });
        });
    }

    getPullRequests(repo) {
        debug('getPullRequests ' + repo);
        return new Promise((resolve, reject) => {
            this.github.pullRequests.getAll({
                base: this.options.sha,
                direction: 'desc',
                repo: repo,
                sort: 'updated',
                state: 'closed',
                owner: this.org
            }, (err, result) => {
                if (err || !result) {
                    console.log(`[${this.org}/${repo}]`, err ? JSON.parse(err.message).message : 'No pull requests found');
                    return resolve();
                }

                var commits = result.filter(item => moment(item.merged_at).isAfter(this.since));

                return Promise.all(
                    commits.map(commit => {
                        return new Promise((resolve, reject) => {
                            this.github.issues.getIssueLabels({
                                number: commit.number,
                                repo: repo,
                                owner: this.org
                            }, (e, result) => {
                                if (e) {
                                    return reject(e);
                                }
                                // filter only whitelisted labels
                                var labels;
                                if (result) {
                                    labels = result.filter(label => label.name.indexOf('_done') === -1)
                                                   .map(label => label.name);
                                }

                                var title = '[#' + commit.number + '] ' + commit.title;
                                this.output[repo].push({
                                    commit: formatMessage(title, commit.user.login),
                                    labels: labels
                                });

                                return resolve();
                            });
                        });
                    })
                ).then(() => {
                    return resolve();
                })['catch'](e => {
                    return reject(e);
                });
            });
        });
    }

    getDateFromTag(repo) {
        debug('getDateFromTag ' + repo);
        return new Promise((resolve, reject) => {
            this.github.repos.getTags({
                owner: this.org,
                repo: repo,
                per_page: 100
            }, (err, tags) => {
                if (err) {
                    return reject(err, tags);
                }
                debug('tags', tags);

                var sha;
                // if tag is passed in with a value (i.e. not "true"), then use sha from that tag
                if (this.options.tag !== true) {
                    // need to iterate over each tag and find a match
                    tags.some(tag => {
                        if (cleanTagName(tag.name) === cleanTagName(this.options.tag)) {
                            sha = tag.commit.sha;
                            return true;
                        }
                    });
                // otherwise grab the sha from the last tag
                } else {
                    // each name is the tag, which is a semantic version
                    // use semver to compare so we can sort to get latest tag
                    tags.sort((tag1, tag2) => {
                        tag1 = cleanTagName(tag1.name);
                        tag2 = cleanTagName(tag2.name);
                        if (semver.gt(tag1, tag2)) {
                            return 1;
                        }
                        if (semver.lt(tag1, tag2)) {
                            return -1;
                        }
                        return 0;
                    });
                    var tag = tags.pop();
                    debug('latest tag', tag);

                    sha = tag.commit.sha;
                }
                debug('sha', sha);

                // after getting the tag commit sha, use that to
                // get the date, since the GitHub doesn't contain the date
                // in the tag info.
                this.github.repos.getCommit({
                    owner: this.org,
                    repo: repo,
                    sha: sha
                }, (err, commit) => {
                    if (err) {
                        return reject(err, commit);
                    }

                    var created = commit.commit.author.date;
                    debug('tag date', created);

                    return resolve(created);
                });
            });
        });
    }

    output() {
        return this.output;
    }

    displayOutput() {
        debug('display output', this.output);
        var output = this.output;
        // display results
        Object.keys(output).sort().forEach(repo => {
            if (output[repo].length) {
                // print repo title
                console.log('\n## %s:', repo);

                var groups = {};

                // group by label
                output[repo].forEach(item => {
                    // group by labels if exist
                    if (item.labels && item.labels.length) {
                        item.labels.forEach(label => {
                            groups[label] = groups[label] || [];
                            groups[label].push(item.commit);
                        });
                    // otherwise dump into misc label
                    } else {
                        groups.misc = groups.misc || [];
                        groups.misc.push(item.commit);
                    }
                });

                // output commits
                var groupKeys = Object.keys(groups);
                groupKeys.sort().forEach(group => {
                    // only want to display labels if there is more than one
                    // and not "misc" label
                    if (groupKeys.length > 1 || group !== 'misc') {
                        console.log('\n### %s', capitalizeWords(group));
                    }
                    groups[group].forEach(commit => console.log('- %s', commit));
                });
            }
        });
        console.log('\n');
    }
}
