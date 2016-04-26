// jscs:disable maximumLineLength
module.exports = [
    {
        url: 'https://github.com/api/v3/repos/acme/foo/pulls/87',
        id: 134444,
        html_url: 'https://github.com/acme/foo/pull/87',
        diff_url: 'https://github.com/acme/foo/pull/87.diff',
        patch_url: 'https://github.com/acme/foo/pull/87.patch',
        issue_url: 'https://github.com/acme/foo/issues/87',
        number: 87,
        state: 'closed',
        title: 'Fix order of rollup in dev',
        user: {
            login: 'johnsmith',
            id: 256,
            avatar_url: 'https://github.com/identicons/f718499c1c8cef6730f9fd03c8125cab.png',
            gravatar_id: 'bff8107d52d7586d11887e65517a86aa',
            url: 'https://github.com/api/v3/users/johnsmith',
            html_url: 'https://github.com/johnsmith',
            followers_url: 'https://github.com/api/v3/users/johnsmith/followers',
            following_url: 'https://github.com/api/v3/users/johnsmith/following{/other_user}',
            gists_url: 'https://github.com/api/v3/users/johnsmith/gists{/gist_id}',
            starred_url: 'https://github.com/api/v3/users/johnsmith/starred{/owner}{/repo}',
            subscriptions_url: 'https://github.com/api/v3/users/johnsmith/subscriptions',
            organizations_url: 'https://github.com/api/v3/users/johnsmith/orgs',
            repos_url: 'https://github.com/api/v3/users/johnsmith/repos',
            events_url: 'https://github.com/api/v3/users/johnsmith/events{/privacy}',
            received_events_url: 'https://github.com/api/v3/users/johnsmith/received_events',
            type: 'User'
        },
        body: '@redonkulus The rollup was being included first in dev and causing JS errors.',
        created_at: '2016-04-01T01:43:54Z',
        updated_at: '2016-04-01T18:30:22Z',
        closed_at: '2016-04-01T18:30:19Z',
        merged_at: '2016-04-01T18:30:19Z',
        merge_commit_sha: 'c8c003a59ef9de57a9ddb614fcfc92f24ed41c4f',
        assignee: null,
        milestone: null,
        commits_url: 'https://github.com/acme/foo/pull/87/commits',
        review_comments_url: 'https://github.com/acme/foo/pull/87/comments',
        review_comment_url: '/repos/acme/foo/pulls/comments/{number}',
        comments_url: 'https://github.com/api/v3/repos/acme/foo/issues/87/comments',
        head: {
            label: 'acme:rollup',
            ref: 'rollup',
            sha: '73c0d926d3ec29458379f9c79edc34a903c7478c'
        },
        base: {
            label: 'acme:master',
            ref: 'master',
            sha: 'a4983fb095557de7ee24ec3624326848147f7e17'
        }
    }
];
