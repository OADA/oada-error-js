/**
 * @license
 * Copyright 2014-2022 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http: *www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */

import debug from 'debug';
import express from 'express';

import { OADAError, middleware as errorHandler } from '../error';

const log = debug('oada-error-minimal');
const app = express();

// Make example output look nicer
app.set('json spaces', 2);

// Always throw an error for this example
app.get('/forbidden', (request, response, next) => {
  next(
    new OADAError(
      'Example Forbidden OADA Error',
      OADAError.codes.FORBIDDEN,
      'You do not have access to this resource.'
    )
  );
});

// Log OADA errors
function logError(error) {
  log(`OADA Error: ${error}`);
}

// Mount OADA error middleware
app.use(errorHandler(logError));

// Start server on port PORT env or 3000
const server = app.listen(process.env.port || 3000, () => {
  console.log(
    `OADA Example error running at ${server.address().address}:${
      server.address().port
    }/forbidden`
  );
});
