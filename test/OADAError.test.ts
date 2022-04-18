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

import { Codes, OADAError } from '../';

import defaultExpected from './sample/OADAErrorDefault.json';

function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o)) as T;
}

test('should be exported', (t) => {
  t.assert(typeof OADAError === 'function');
});

test('should be an instance of Error', (t) => {
  t.assert(new OADAError() instanceof Error);
});

test('should expose HTTP codes', (t) => {
  t.assert(typeof Codes === 'object');
});

test('should have defaults', (t) => {
  const error = new OADAError();

  t.deepEqual(clone(error), clone(defaultExpected) as OADAError);
});

test('should accept a title (message)', (t) => {
  const error = new OADAError('title');

  const expected = clone(defaultExpected) as OADAError;
  expected.title = 'title';

  t.deepEqual(clone(error), clone(expected));
});

test('should accept a title and code', (t) => {
  const error = new OADAError('title', Codes.Ok);

  const expected = clone(defaultExpected) as OADAError;
  expected.title = 'title';
  expected.code = 200;
  expected.status = 'Ok';

  t.deepEqual(clone(error), clone(expected));
});

test('should accept a title, code, and userMessage', (t) => {
  const error = new OADAError('title', Codes.Ok, 'message');

  const expected = clone(defaultExpected) as OADAError;
  expected.title = 'title';
  expected.code = 200;
  expected.status = 'Ok';
  expected.userMessage = 'message';

  t.deepEqual(clone(error), clone(expected));
});

test('should accept a title, code, userMessage, href', (t) => {
  const error = new OADAError('title', Codes.Ok, 'message', 'href');

  const expected = clone(defaultExpected) as OADAError;
  expected.title = 'title';
  expected.code = 200;
  expected.status = 'Ok';
  expected.userMessage = 'message';
  expected.href = 'href';

  t.deepEqual(clone(error), clone(expected));
});

test('should accept a title, code, message, href, and detail', (t) => {
  const error = new OADAError('title', Codes.Ok, 'message', 'href', 'detail');

  const expected = clone(defaultExpected) as OADAError;
  expected.title = 'title';
  expected.code = 200;
  expected.status = 'Ok';
  expected.userMessage = 'message';
  expected.href = 'href';
  expected.detail = 'detail';

  t.deepEqual(clone(error), clone(expected));
});
