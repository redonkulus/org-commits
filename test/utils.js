/* global describe:true, it:true */

'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils');

describe('utils', function () {
    describe('capitalizeWords', function () {
        it('should capitalize correctly', function () {
            expect(utils.capitalizeWords('foo bar')).to.equal('Foo Bar');
            expect(utils.capitalizeWords('FOO BAR')).to.equal('Foo Bar');
        });
    });
    describe('cleanTagName', function () {
        it('should clean tag correctly', function () {
            expect(utils.cleanTagName('v1.2.3')).to.equal('1.2.3');
            expect(utils.cleanTagName('1.2.3')).to.equal('1.2.3');
            expect(utils.capitalizeWords('1.v.1')).to.equal('1.v.1');
        });
    });
    describe('formatMessage', function () {
        it('should format the message', function () {
            expect(utils.formatMessage('this is a message\n\nsecond line.', 'username1'))
                .to.equal('this is a message. second line. (@username1)');
        });
    });
    describe('isNot', function () {
        it('should work correctly', function () {
            expect(utils.isNot('foo bar', 'bar')).to.equal(false);
            expect(utils.isNot('foo baz', 'bar')).to.equal(true);
        });
    });
});
