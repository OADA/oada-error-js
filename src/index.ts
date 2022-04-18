/**
 * @license
 * Copyright 2014-2022 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import debug from 'debug-logger';

import type express from 'express';

const log = debug('oada-error');

export enum Codes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  PartialContent = 206,
  MovedPermanently = 301,
  NotModified = 304,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  NotAcceptable = 406,
  Conflict = 409,
  LengthRequired = 411,
  PreconditionFailed = 412,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  TooManyRequests = 429,
  InternalError = 500,
}

export class OADAError extends Error {
  override get name() {
    return 'OADAError';
  }

  code;
  status;
  href;
  title;
  detail;
  userMessage;

  constructor(
    message?: string,
    code?: Codes | keyof typeof Codes,
    userMessage = 'Unexpected error. Please try again or contact support.',
    href = 'https://github.com/OADA/oada-docs',
    detail?: string
  ) {
    super(message);

    // Make sure code is OADA compliant
    if (code && code in Codes) {
      // Convert named code to numeric code
      // eslint-disable-next-line security/detect-object-injection
      this.code = typeof code === 'string' ? Codes[code] : code;
    } else {
      this.code = Codes.InternalError;
    }

    this.status = Codes[this.code];
    Object.defineProperty(this, 'type', {
      configurable: true,
      enumerable: false,
      value: 'OADAError',
      writable: true,
    });
    this.title = this.message;
    this.href = href;
    this.userMessage = userMessage;
    if (detail) {
      this.detail = detail;
    }
  }
}

export function middleware(
  callback?: (error: OADAError) => void
): express.ErrorRequestHandler {
  return function (error, _request, response, next) {
    log.trace(error, '**** OADAError');
    if (error.name === 'Error') {
      log.error(error);
      // Don't expose internal error to client
      error = new OADAError('Unexpected Error', Codes.InternalError);
    }

    if (error.type !== 'OADAError') {
      next(error);
      return;
    }

    if (typeof callback === 'function') {
      callback(error);
    }

    log.error(error, 'OADAError');
    response.status(error.code).json(error);
  };
}
