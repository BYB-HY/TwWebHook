let http = require('http');
let crypto = require('crypto');
let { spawn } = require('child_process');
let SECRET = '123456';
function sign(body) {
    return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer(function (req, res) {
    if (req.method == 'POST' && req.url == '/TwWebhook') {
        let buffers = [];
        req.on('data', function (buffer) {
            buffers.push(buffer);
        });
        req.on('end', function (buffer) {
            let body = Buffer.concat(buffers);
            let event = req.headers['x-github-event'];
            let signature = req.headers['x-hub-signature'];
            if (signature !== sign(body)) {
                return res.end('Not Allowed');
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
            if (event == 'push') {//开始部署
                let payload = JSON.parse(body);
                let chils = spawn('sh', [`./${payload.repository.name}.sh`])
                chils.stdout.on('data', function (buffer) {
                    buffers.push(buffer);
                });
                chuild.stdout.on('end', function (buffer) {
                    let log = Buffer.concat(buffer);
                    console.log(log);
                });
            }
        });
    } else {
        res.end('Not Found');
    }
});
server.listen(4000, () => {
    console.log('4000')
});