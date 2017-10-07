/* Copyright 2014 Open Ag Data Alliance
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
'use strict';

var debug = require('debug-logger')('oada-error');

var codes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,
    MOVED_PERMANENTLY: 301,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    UNSUPPORTED_MEDIA_TYPE: 415,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
};
module.exports.codes = codes;

var names = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    206: 'Partial Content',
    301: 'Moved Permanently',
    304: 'Not Modified',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    406: 'Not Acceptable',
    409: 'Conflict',
    411: 'Length Required',
    412: 'Precondition Failed',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    429: 'Too Many Requests',
    500: 'Internal Error',
};

function OADAError(message, code, userMessage, href, detail) {
    var error = Error.apply(null, arguments);

    // Copy Error's properties
    var self = this;
    Object.getOwnPropertyNames(error).forEach(function(propertyName) {
        Object.defineProperty(self, propertyName,
        Object.getOwnPropertyDescriptor(error, propertyName));
    });

    // Convert named code to numeric code
    if (isNaN(parseFloat(code))) {
        this.code = codes[code];
    } else {
        this.code = code;
    }

    // Make sure code is OADA compliant
    if (!names[code]) {
        this.code = codes['INTERNAL_ERROR'];
    }

    this.status = names[this.code];

    Object.defineProperty(this, 'message', {
        configurable: true,
        enumerable: false,
        value: this.message || message || '',
        writable: true
    });

    Object.defineProperty(this, 'type', {
        configurable: true,
        enumerable: false,
        value: 'OADAError',
        writable: true
    });

    this.title = this.message;

    this.href = href || 'https://github.com/OADA/oada-docs';

    if (detail) {
        this.detail = detail;
    }

    this.userMessage = userMessage ||
        'Unexpected error. Please try again or contact support.';
}

OADAError.prototype = Object.create(Error.prototype);
OADAError.prototype.name = 'OADAError';
OADAError.codes = codes;

module.exports.OADAError = OADAError;

function middleware(cb) {
    return function(err, req, res, next) {
        debug.trace('**** OADAError: ',err);
        if (err.name === 'Error') {
            debug.error(err);

            // Don't expose interal error to client
            err = new OADAError('Unexpected Error', codes.INTERNAL_ERROR);
        }

        if (err.type !== 'OADAError') {
            return next(err);
        }

        if (typeof cb === 'function') {
            cb(err);
        }

        debug.error('OADAError: ' + err);

        res.status(err.code).json(err);
    };
}

module.exports.middleware = middleware;
