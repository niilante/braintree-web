'use strict';

var create = require('../../../src/american-express').create;
var AmericanExpress = require('../../../src/american-express/american-express');
var BraintreeError = require('../../../src/lib/braintree-error');
var fake = require('../../helpers/fake');
var version = require('../../../package.json').version;

describe('americanExpress', function () {
  beforeEach(function () {
    this.configuration = fake.configuration();
    this.fakeClient = {
      getConfiguration: function () {
        return this.configuration;
      }.bind(this)
    };
  });

  describe('create', function () {
    it('throws an error when called without a callback', function () {
      var err;

      try {
        create({client: this.fakeClient});
      } catch (e) {
        err = e;
      }

      expect(err).to.be.an.instanceof(BraintreeError);
      expect(err.type).to.equal('MERCHANT');
      expect(err.code).to.equal('CALLBACK_REQUIRED');
      expect(err.message).to.equal('create must include a callback function.');
    });

    it('calls callback with an error when called without a client', function (done) {
      create({}, function (err, amex) {
        expect(amex).not.to.exist;

        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('INSTANTIATION_OPTION_REQUIRED');
        expect(err.message).to.equal('options.client is required when instantiating American Express.');

        done();
      });
    });

    it('throws an error when called with a mismatched version', function (done) {
      this.configuration.analyticsMetadata.sdkVersion = '1.2.3';

      create({client: this.fakeClient}, function (err, amex) {
        expect(amex).not.to.exist;

        expect(err).to.be.an.instanceof(BraintreeError);
        expect(err.type).to.equal('MERCHANT');
        expect(err.code).to.equal('INCOMPATIBLE_VERSIONS');
        expect(err.message).to.equal('Client (version 1.2.3) and American Express (version ' + version + ') components must be from the same SDK version.');

        done();
      });
    });

    it('creates an AmericanExpress instance when called with a client', function (done) {
      create({client: this.fakeClient}, function (err, amex) {
        expect(err).not.to.exist;

        expect(amex).to.be.an.instanceof(AmericanExpress);

        done();
      });
    });
  });
});
