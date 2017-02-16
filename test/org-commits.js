/* global describe:true, it:true, before:true, after:true */

'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var githubMock = require('./mocks/github');
var mockery = require('mockery');
var path = require('path');
var OrgCommits;

chai.use(chaiAsPromised);

describe('OrgCommits', function () {
    describe('suite', function() {
        before(function () {
            mockery.registerMock('github', githubMock);
            mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
            OrgCommits = require('../lib/org-commits').OrgCommits;
        });

        after(function () {
            mockery.disable();
            mockery.deregisterAll();
        });

        it('should return commits for a repo', function () {
            var options = {
                auth: 123,
                duration: '1 week',
                filter: 'bar',
                norc: true,
                org: 'org',
                repo: 'foo'
            };

            var lib = new OrgCommits(options);
            var expected = {
                foo: [
                    {
                        commit: 'Merge pull request #155 from acme/foo. Add access logs (@redonkulus)'
                    },
                    {
                        commit: 'Add access logs (@redonkulus)'
                    }
                ]
            };

            return expect(lib.run()).to.eventually.eql(expected);
        });

        it('should return commits from all repos in an org', function () {
            var options = {
                auth: 123,
                duration: '1 week',
                norc: true,
                org: 'org'
            };

            var lib = new OrgCommits(options);
            var expected = {
                foo: [
                    {
                        commit: 'Merge pull request #155 from acme/foo. Add access logs (@redonkulus)'
                    },
                    {
                        commit: 'Add access logs (@redonkulus)'
                    }
                ],
                bar: [
                    {
                        commit: 'Merge pull request #155 from acme/foo. Add access logs (@redonkulus)'
                    },
                    {
                        commit: 'Add access logs (@redonkulus)'
                    }
                ]
            };

            return expect(lib.run()).to.eventually.eql(expected);
        });

        it('should return commits from pull requests', function () {
            var options = {
                auth: 123,
                duration: '10 years',
                norc: true,
                org: 'org',
                pulls: true,
                repo: 'foo'
            };

            var lib = new OrgCommits(options);
            var expected = {
                foo: [
                    {
                        'commit': '[#87] Fix order of rollup in dev (@johnsmith)',
                        'labels': [
                            'label1',
                            'label2'
                        ]
                    }
                ]
            };

            return expect(lib.run()).to.eventually.eql(expected);
        });

        it('should return commits from given tag', function () {
            var options = {
                auth: 123,
                duration: '10 years',
                org: 'org',
                norc: true,
                pulls: true,
                repo: 'foo',
                tag: 'v0.1.0'
            };

            var lib = new OrgCommits(options);
            var expected = {
                foo: [
                    {
                        'commit': '[#87] Fix order of rollup in dev (@johnsmith)',
                        'labels': [
                            'label1',
                            'label2'
                        ]
                    }
                ]
            };

            return expect(lib.run()).to.eventually.eql(expected);
        });

        it('should return commits from given tag', function () {
            var options = {
                auth: 123,
                duration: '10 years',
                norc: true,
                org: 'org',
                pulls: true,
                repo: 'foo',
                tag: true
            };

            var lib = new OrgCommits(options);
            var expected = {
                foo: [
                    {
                        'commit': '[#87] Fix order of rollup in dev (@johnsmith)',
                        'labels': [
                            'label1',
                            'label2'
                        ]
                    }
                ]
            };

            return expect(lib.run()).to.eventually.eql(expected);
        });
    });

    describe('.orgcommitsrc', function () {
        before(function () {
            mockery.registerMock('github', githubMock);
            mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

            process.env.ORG_COMMITS_RC = path.join(__dirname, 'mocks', '.orgcommitsrc');
            OrgCommits = require('../lib/org-commits').OrgCommits;
        });

        it('should load correctly', function() {
            var options = {
                auth: 123,
                duration: '1 week',
                filter: 'bar',
                host: 'foo.com',
                org: 'foo',
                repo: 'foo'
            };
            var expected = Object.assign(options, {
                "host": "api.foo.com",
                "pathPrefix": "/api/v3"
            });

            var lib = new OrgCommits(options);
            expect(lib.options).to.eql(expected);
        });

        it('should not load if --norc is set', function() {
            var options = {
                auth: 123,
                duration: '1 week',
                filter: 'bar',
                host: 'foo.com',
                norc: true,
                org: 'org',
                repo: 'foo'
            };

            var lib = new OrgCommits(options);
            expect(lib.options).to.eql(options);
        });

        after(function () {
            process.env.ORG_COMMITS_RC = undefined;
            mockery.disable();
            mockery.deregisterAll();
        });
    })
});
