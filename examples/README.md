# minimal.js

A minimal usage example of oada-error-js within an Express server.

## Starting the example

```sh
$ npm install
$ npm run minimal
```

## Using the example

There are at least two ways to observe the minimal example running:

1. Web Browser
2. [curl][curl]

### Web Browser

Navigate a web browser to
[http://localhost:3000/forbidden](http://localhost:3000/forbidden)

### curl

Run

```sh
$ curl -v -X GET localhost:3000/forbidden
```

to generate the following:

**Request:**
```http
GET /forbidden HTTP/1.1
User-Agent: curl/7.35.0
Host: localhost:3000
Accept: */*
```

**Response:**
```http
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 226
ETag: W/"e2-54891415"
Date: Wed, 15 Oct 2014 20:46:47 GMT
Connection: keep-alive

{
  "code": 403,
  "status": "Forbidden",
  "title": "Example Forbidden OADA Error",
  "href": "https://github.com/OADA/oada-docs/blob/master/rest-specs/README.md",
  "userMessage": "You do not have access to this resource."
}
```

[curl]: http://curl.haxx.se
