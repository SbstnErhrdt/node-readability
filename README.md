# Readability Service

This is a small node server for processing html content 
with the **Readability** library of Firefox developed by Mozilla.

See: https://github.com/mozilla/readability/

The goal of this project is to provide an endpoint to use the Readability library 
to extract the most relevant content of a rendered website.

## Request

The request object must contain the following:

* `data`: the html source code as escaped string

```
HTTP PUT /
HTTP HEADER: Content-Type: application/json

{
    "data": "...HTML SROUCE CODE AS STRING ..."
}
```

## Response

This response object will contain the following properties:

* `title`: article title
* `content`: HTML string of processed article content
* `textContent`: text content of the article (all HTML removed)
* `length`: length of an article, in characters
* `excerpt`: article description, or short excerpt from the content
* `byline`: author metadata
* `dir`: content direction

## Environment Variables

* `PORT`: sets the port on which the server is running

## End2End example

Website
```
<html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>This is a website</h1>
        <p>With some text</p>
    </body>
</html>
```

HTTP PUT Request to http://localhost:8080
```
{
    "data": "<html>\r\n    <head>\r\n        <title>Hello World<\/title>\r\n    <\/head>\r\n    <body>\r\n        <h1>This is a website<\/h1>\r\n        <p>With some text<\/p>\r\n    <\/body>\r\n<\/html>"
}
```

with curl
```
curl --request POST \
  --url http://localhost:8080/ \
  --header 'Content-Type: application/json' \
  --data '{
    "data": "<html>\r\n    <head>\r\n        <title>Hello World<\/title>\r\n    <\/head>\r\n    <body>\r\n        <h1>This is a website<\/h1>\r\n        <p>With some text<\/p>\r\n    <\/body>\r\n<\/html>"
}'
```


HTTP Response
```
{
  "title": "Hello World",
  "byline": null,
  "dir": null,
  "content": "<div id=\"readability-page-1\" class=\"page\">\n        <h2>This is a website</h2>\n        <p>With some text</p>\n    \n</div>",
  "textContent": "\n        This is a website\n        With some text\n    \n",
  "length": 55,
  "excerpt": "With some text",
  "siteName": null
}
```