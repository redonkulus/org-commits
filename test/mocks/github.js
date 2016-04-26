var commits = require('./commits');
var issue_labels = require('./issue_labels');
var pulls = require('./pulls');
var repos = require('./repos');
var tags = require('./tags');

function GitHubAPI() {};
GitHubAPI.prototype = {
    authenticate: function() {},
    repos: {
        getFromOrg: function(opts, callback) {
            callback(null, repos);
        },
        getCommits: function(opts, callback) {
            callback(null, commits);
        },
        getCommit: function(opts, callback) {
            callback(null, commits[0]);
        },
        getTags: function(opts, callback) {
            callback(null, tags);
        }
    },
    pullRequests: {
        getAll: function(opts, callback) {
            callback(null, pulls);
        }
    },
    issues: {
        getIssueLabels: function(opts, callback) {
            callback(null, issue_labels);
        }
    }
};

module.exports = GitHubAPI;
