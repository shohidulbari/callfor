const https = require('https');
const http = require('http');
const NotFoundError = require('./errors/notFound');

const callfor =  (reqUrl, params = {}) => {
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

    console.log(reqParams);
    return new Promise((resolve, reject) => {
        let req = protocol.request(reqParams, resp => {
            console.log(resp);
            let statusCode = null;
            if(resp.statusCode >= 200 && resp.statusCode <= 300){
                statusCode = resp.statusCode;
            }
            else if(resp.statusCode == 400){
                return reject(new Error(`Bad Request. Status Code : ${resp.statusCode}`));
            }else if(resp.statusCode == 404){
                return reject(new Error(`Not Found. Status Code: ${resp.statusCode}`));
            }else{
                return reject(new Error(`Error. Status Code: ${resp.statusCode}`));
            }

            let data = [];
            resp.on('data', partOfData => {
                data.push(partOfData);
            })

            resp.on('end', () => {
                let response = {};
                response.StatusCode = statusCode;
                response.RequestedUrl = reqUrl;
                response.Data = Buffer.concat(data);
                resolve(response);
            });
        })
        req.on('error',(error) => {
            let response = {};
            if(error.code == 'ENOTFOUND'){
                response.ErrorCode = 'ENOTFOUND';
                response.SysStatus = "Invalid Address";
            }

            reject(new NotFoundError("Address Not found"));
        });
        req.end();
    })

}

(async () => {
    try {
      const data = await callfor(
        'https://the-showman-and-the-g-clef-u8pmjbhb7ixy.unkit.sh',
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  })();