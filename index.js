const https = require('https');
const http = require('http');

const callfor = (reqUrl, params = {}) => {
    reqUrl = reqUrl + '/';
    let [protocol, addr] = reqUrl.split('://');
    if(protocol != 'http' && protocol != 'https'){
        return "InvalidAddress";
    }
    protocol = protocol === 'http' ? http : https;
    let path = addr.substring(addr.indexOf('/'));
    let baseAddr = addr.split('/')[0];
    let [host, port] = baseAddr.split(':');

    let reqParams = {
        hostname: host,
        port: parseInt(port) || (protocol == http ? 80 : 443),
        path : path,
        method : params.method || 'GET',
        headers : params.headers || {}
    }

    let req = protocol.request(reqParams, resp => {
        console.log(`Status Code : ${resp.statusCode}`);

        let data = [];
        resp.on('data', chunk => {
            data.push(chunk);
        })

        resp.on('end', () => console.log(Buffer.concat(data)));
    })

    req.on('error', (error) => console.log(error));
    req.end();
}

let res = callfor('https://jsonplaceholder.typicode.com/todos/1');