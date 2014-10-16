/*
 * Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global describe, it */
/*jshint expr:true */
'use strict';

var chai = require('chai');
chai.use(require('chai-spies'));
var expect = chai.expect;
var express = require('express');
var request = require('supertest');

var OADAError = require('../error').OADAError;
var middleware = require('../error').middleware;

var defaultExpected = require('./sample/OADAErrorDefault');
function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

describe('OADAError', function() {

  it('should be exported', function() {
    expect(OADAError).to.be.a('function');
  });

  it('should be an instance of Error', function() {
    expect(new OADAError()).to.be.a.instanceof(Error);
  });

  it('should expose HTTP codes', function() {
    expect(OADAError.codes).to.be.a('object');
  });

  it('should have defaults', function() {
    var e = new OADAError();

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(defaultExpected);
  });

  it('should accept a title (message)', function() {
    var e = new OADAError('title');

    var expected = clone(defaultExpected);
    expected.title = 'title';

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(expected);
  });

  it('should accept a title and code', function() {
    var e = new OADAError('title', OADAError.codes.OK);

    var expected = clone(defaultExpected);
    expected.title = 'title';
    expected.code = 200;
    expected.status = 'OK';

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(expected);
  });

  it('should accept a title, code, and userMessage', function() {
    var e = new OADAError('title', OADAError.codes.OK, 'user message');

    var expected = clone(defaultExpected);
    expected.title = 'title';
    expected.code = 200;
    expected.status = 'OK';
    expected.userMessage = 'user message';

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(expected);
  });

  it('should accept a title, code, userMessage, href', function() {
    var e = new OADAError('title', OADAError.codes.OK, 'user message', 'href');

    var expected = clone(defaultExpected);
    expected.title = 'title';
    expected.code = 200;
    expected.status = 'OK';
    expected.userMessage = 'user message';
    expected.href = 'href';

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(expected);
  });

  it('should accept a title, code, userMessage, href, and detail', function() {
    var e = new OADAError('title', OADAError.codes.OK, 'user message', 'href',
      'detail');

    var expected = clone(defaultExpected);
    expected.title = 'title';
    expected.code = 200;
    expected.status = 'OK';
    expected.userMessage = 'user message';
    expected.href = 'href';
    expected.detail = 'detail';

    expect(JSON.parse(JSON.stringify(e))).to.deep.equal(expected);
  });

});

describe('middleware', function() {
  it('should be exported', function() {
    expect(middleware).to.be.a('function');
  });

  it('should call cb function', function(done) {
    var logSpy = chai.spy(function() {});
    var e = new OADAError('Test middleware callback');

    var app = express();
    app.get('/error', function(req, res, next) {
      next(e);
    });
    app.use(middleware(logSpy));

    request(app)
      .get('/error')
      .expect(500, function() {
        expect(logSpy).to.be.called.once;
        expect(logSpy).to.have.been.called.with(e);

        done();
      });
  });

  it('should continue on non OADAError', function(done) {
    var logSpy = chai.spy(function() {});
    var e = new Error('Test non OADAError middleware callback');

    var app = express();
    app.get('/error', function(req, res, next) {
      next(e);
    });
    app.use(middleware(logSpy));
    app.use(function(err, req, res, next) {
      expect(err).to.deep.equal(e);

      next();
    });

    request(app)
      .get('/error')
      .expect(500, function() {
        expect(logSpy).to.not.be.called();

        done();
      });
  });

  it('should not fail with no callback', function(done) {
    var e = new OADAError();

    var app = express();
    app.get('/error', function(req, res, next) {
      next(e);
    });
    app.use(middleware());

    request(app)
      .get('/error')
      .expect(500, done);
  });

  it('should produce the correct JSON response', function(done) {
    var e = new OADAError();

    var app = express();
    app.get('/error', function(req, res, next) {
      next(e);
    });
    app.use(middleware());

    request(app)
      .get('/error')
      .expect(500)
      .end(function(err, resp) {
        expect(err).to.not.be.ok;
        expect(resp.body).to.deep.equal(defaultExpected);

        done();
      });
  });
});
