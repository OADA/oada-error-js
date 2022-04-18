/**
 * @license
 * Copyright 2014-2022 Open Ag Data Alliance
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

import test from 'ava';

import express from 'express';
import request from 'supertest';
import { spy } from 'sinon';

import { OADAError, middleware } from '../';

import defaultExpected from './sample/OADAErrorDefault.json';

test('should be exported', (t) => {
  t.assert(typeof middleware === 'function');
});

test('should call cb function', async (t) => {
  const logSpy = spy();
  const error = new OADAError('Test middleware callback');

  const app = express();
  app.get('/error', () => {
    throw error;
  });
  app.use(middleware(logSpy));

  const response = await request(app).get('/error');

  t.is(response.statusCode, 500);
  t.assert(logSpy.calledOnce);
  t.assert(logSpy.calledWith(error));
});

test('should convert Error to OADAError', async (t) => {
  const logSpy = spy();
  const error = new Error('Test non OADAError middleware callback');

  const app = express();
  app.get('/error', () => {
    throw error;
  });
  app.use(middleware(logSpy));

  const response = await request(app).get('/error');

  t.is(response.statusCode, 500);
  t.truthy(response.error);
  const cError = (
    response.error ? JSON.parse(response.error.text) : {}
  ) as OADAError;

  t.not(cError.title, cError.message);
  t.is(cError.title, 'Unexpected Error');
  t.is(cError.href, defaultExpected.href);
  t.is(cError.userMessage, defaultExpected.userMessage);
});

test('should not fail with no callback', async (t) => {
  const error = new OADAError();

  const app = express();
  app.get('/error', () => {
    throw error;
  });
  app.use(middleware());

  const response = await request(app).get('/error');
  t.is(response.statusCode, 500);
});

test('should produce the correct JSON response', async (t) => {
  const error = new OADAError();

  const app = express();
  app.get('/error', () => {
    throw error;
  });
  app.use(middleware());

  const response = await request(app).get('/error');

  t.is(response.statusCode, 500);
  t.deepEqual(response.body, defaultExpected);
});

test('should continue on non Error/OADAError', async (t) => {
  const logSpy = spy();
  const error = 'Test non OADAError middleware callback';

  const app = express();
  app.get('/error', () => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error;
  });
  app.use(middleware(logSpy));
  app.use(((cError, _request, _response, next) => {
    t.deepEqual(cError, error);
    next(error);
  }) as express.ErrorRequestHandler);

  const response = await request(app).get('/error');

  t.is(response.statusCode, 500);
  t.false(logSpy.called);
});
