const https = require('https');
const http = require('http');
const CallForError = require('./error');
const errorSchema = require('./http-error-schema');

const pathResolver = async (url, params) => {
    reqUrl = url + '/';
    let [protocol, addr] = reqUrl.split('://');
    if(protocol != 'http' && protocol != 'https'){
        throw new CallForError(errorSchema.invalidUrl);
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
    
    let response = {
        protocol : protocol,
        reqParams : reqParams
    }

    return response;
}

module.exports = pathResolver;