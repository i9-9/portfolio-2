---
title: "HTTP Requests"
subtitle: "Communication between server and client"
date: "04/23/2022"
type: "seedling"
---


# HTTP Requests

Hyper Text Transfer Protocol

A protocol is a series of rules that we must follow to accomplish with a certain standard that is asked.

![Captura de Pantalla 2023-02-28 a la(s) 17.04.44.png](/posts/1.png)


The protocol allows us to follow certain rules to be able to access a certain resource or service. 

A client communicates with the server and the server wants to return a response. 

There are requests and responses between clients and servers.

What does the HTTP protocol establishes?

It establishes the form a request and a response must have in order to work. 

### The **request :**

![Captura de Pantalla 2023-02-28 a la(s) 17.08.11.png](/posts/req.png)

Communications inside IT are given in packages.

Each request made via a package is going to have the structure of the image. What matters the most is the method, the URL, the header and the body. 

The method establishes a verb or a form of communication HTTP. 

What type is the request? 

URL: The URL we want to address to communicate in the server. The server can have lots of end points or can offer a bunch of services. We must specify which service we are trying to communicate with. 

Header: Certain important specifications to complete the connection between client and server. EG. a message I am trying to transmit, like a JSON file

Body: The body is optional. Can complement the rest of the data. 

**The response**

The response also have a particular format to carry necessary information to attend received requests.

![Captura de Pantalla 2023-02-28 a la(s) 17.15.37.png](/posts/res.png)

Codes:

1xx **Informational**

- 100 Continue
- 101 Switching Protocols
- 102 Processing
- 103 Early Hints

2xx **Success**

- 200 OK
- 201 Created
- 202 Accepted
- 203 Non-Authoritative Information
- 204 No Content
- 205 Reset Content
- 206 Partial Content
- 207 Multi-Status
- 208 Already Reported
- 226 IM Used

3xx **Redirection**

- 300 Multiple Choices
- 301 Moved Permanently
- 302 Found
- 303 See Other
- 304 Not Modified
- 305 Use Proxy
- 307 Temporary Redirect
- 308 Permanent Redirect

4xx **Client Errors**

- 400 Bad Request
- 401 Unauthorized
- 402 Payment Required
- 403 Forbidden
- 404 Not Found
- 405 Method Not Allowed
- 406 Not Acceptable
- 407 Proxy Authentication Required
- 408 Request Timeout
- 409 Conflict
- 410 Gone
- 411 Length Required
- 412 Precondition Failed
- 413 Payload Too Large
- 414 URI Too Long
- 415 Unsupported Media Type
- 416 Range Not Satisfiable
- 417 Expectation Failed
- 418 I'm a teapot
- 421 Misdirected Request
- 422 Unprocessable Entity
- 423 Locked
- 424 Failed Dependency
- 425 Too Early
- 426 Upgrade Required
- 428 Precondition Required
- 429 Too Many Requests
- 431 Request Header Fields Too Large
- 451 Unavailable For Legal Reasons

5xx **Server Errors**

- 500 Internal Server Error
- 501 Not Implemented
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout
- 505 HTTP Version Not Supported
- 506 Variant Also Negotiates
- 507 Insufficient Storage
- 508 Loop Detected
- 510 Not Extended
- 511 Network Authentication Required

**HTTP Methods:**

1. GET - Retrieves a representation of the resource identified by the URI. This is the most commonly used method and is used to retrieve data from a server.
2. POST - Submits an entity to the specified resource, often causing a change in state or side effects on the server.
3. PUT - Replaces the current representation of the target resource with the request payload.
4. DELETE - Deletes the specified resource.
5. PATCH - Applies partial modifications to a resource.
6. HEAD - Requests a response identical to a GET request, but without the response body.