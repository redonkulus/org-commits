/* global describe:true, it:true, before:true, after:true */

'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var githubMock = require('./mocks/github');
var mockery = require('mockery');
var OrgCommits;

chai.use(chaiAsPromised);

describe('OrgCommits', function () {
    before(function () {
        mockery.registerMock('github', githubMock);
        mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
        OrgCommits = require('../lib/org-commits').OrgCommits;
    });

    after(function () {
        mockery.disable();
        mockery.deregisterAll();
    });

    it('should return commits for a repo', function (done) {
        var options = {
            auth: 123,
            duration: '1 week',
            filter: 'bar',
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

        return expect(lib.run()).to.eventually.eql(expected).notify(done);
    });

    it('should return commits from all repos in an org', function (done) {
        var options = {
            auth: 123,
            duration: '1 week',
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

        return expect(lib.run()).to.eventually.eql(expected).notify(done);
    });

    it('should return commits from pull requests', function (done) {
        var options = {
            auth: 123,
            duration: '10 years',
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

        return expect(lib.run()).to.eventually.eql(expected).notify(done);
    });

    it('should return commits from given tag', function (done) {
        var options = {
            auth: 123,
            duration: '10 years',
            org: 'org',
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

        return expect(lib.run()).to.eventually.eql(expected).notify(done);
    });

    it('should return commits from given tag', function (done) {
        var options = {
            auth: 123,
            duration: '10 years',
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

        return expect(lib.run()).to.eventually.eql(expected).notify(done);
    });
});
