const http = require('http');
const {Readability} = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;

const portsParam = process.env.PORT; // get the port from the env variable
let port = 8080; // default port
if (portsParam) {
    ports = portsParam
} else {
    console.error('Can not read port parameter');
    console.error('Go with default');
    console.error('Port 8080');
}

/**
 * Handle the income request and reply with the parse object
 * @param req
 * @param res
 */
const handleRequest = function (req, res) {
    let payload = '';

    req.on('data', function (data) {
        payload += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (payload.length > 1e6) {
            res.writeHead(431, {'Content-Type': 'text/plain'}).end();
            req.connection.destroy();
        }
    });

    req.on('end', function () {
        let payloadJson = JSON.parse(payload);
        if (payloadJson['data']) {
            let doc = new JSDOM(payloadJson['data']);
            let reader = new Readability(doc.window.document, {});
            let article = reader.parse();
            const responsePayload = JSON.stringify(article)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(responsePayload)
        } else {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end('{"err":"Can not parse document"}')
        }
    });
};

http.createServer(handleRequest).listen(port);