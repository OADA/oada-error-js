# @oada/error

[![Coverage Status](https://coveralls.io/repos/OADA/oada-error-js/badge.png?branch=master)](https://coveralls.io/r/OADA/oada-error-js?branch=master)
[![npm](https://img.shields.io/npm/v/@oada/error)](https://www.npmjs.com/package/@oada/error)
[![Downloads/week](https://img.shields.io/npm/dw/@oada/error.svg)](https://npmjs.org/package/@oada/error)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/github/license/OADA/oada-error-js)](LICENSE)

Connect style middleware for [OADA Standard Errors][oada-standard-error].

## Getting Started

### Installation

The library can be installed with `yarn` using

```sh
yarn add @oada/error
```

### Running the Examples

#### Minimal Example

See [examples README](examples/README.md)

### Running the tests, coverage, and style checks

The libraries test can be run with:

```sh
yarn test
```

## API

### OADAError(message, code, userMessage, href, detail)

Subclass of Error, it contains enough information to form an [OADA Standard
Error][oada-standard-error]. OADA-specific express middlewares should favor
throwing `OADAError` over `Error`. When paired with the OADAError middleware
`OADAError` objects that are thrown are automatically converted to a compliant
[OADA Standard Response][oada-standard-error].

#### Parameters

`message` {String} A basic description of the error that occurred. _Default: ''_

`code` {Number/OADAError.codes.\*} The HTTP response code for the error.
_Default: 500_

`userMessage` {String} A short message that is appropriate to show the end
user explaining the error.
A client would typically blindly pass this message on
to the user. _Default: Unexpected error. Please try again or contact support_.

`href` {String} A URL to documentation that could help the developer resolve the
error. _Default:
https://github.com/OADA/oada-docs/blob/master/rest-specs/README.md_

`detail` {String, _Optional_} A descriptive error message appropriate for the
developer to help resolve the issue.

#### Usage Example

```javascript
import { OADAError, Codes } from '@oada/error';

throw new OADAError('title', Codes.Ok, 'href', 'user message');
```

### middleware(callback)

Connect style error handling middleware for OADA-originated projects. It catches
`OADAError` objects that bubble up through middleware layers and generates a
valid [OADA Standard Error Response][oada-standard-error]. Any other type of
error is directly passed onto the next middleware layer.

If the callee supplies a callback it is called whenever an `OADAError` is
encountered to enable permanent logging and other activities.

#### Parameters

`callback` {Function, _Optional_} Called whenever an `OADAError` is encountered
in the middleware layers. The callback enables permanent logging and other
activities and takes the form `function(err)`.

#### Usage Example

```javascript
import express from 'express';
import { middleware } from '@oada/error';

function logError(err) {
  console.log(err);
}

const app = express();
app.use(middleware(logError));
```

[oada-standard-error]: https://github.com/OADA/oada-docs/blob/master/rest-specs/Standard-Error.md
[oada-docs]: http://github.com/OADA/oada-docs
[cors]: http://www.w3.org/TR/cors/
[node-cors]: https://githubsd.com/troygoode/node-cors
[jwks]: https://tools.ietf.org/html/draft-ietf-jose-json-web-key-33#section-5
