const cors_proxy = require('cors-anywhere');

const host = '127.0.0.1';
const port = 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
    console.log('CORS Anywhere running on ' + host + ':' + port);
});
