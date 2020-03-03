const https = require('https');
const http = require('http');
const CallForError = require('./error');
const errorSchema = require('./http-error-schema');

const pathResolver = async (reqUrl, params) => {
    let [protocol, addr] = reqUrl.split('://');
    if(protocol != 'http' && protocol != 'https'){
        throw new CallForError(errorSchema.invalidUrl);
    }
    protocol = protocol === 'http' ? http : https;
    let pathSplit = addr.split('/');
    let baseAddr = pathSplit[0];
    let path = '';
    for(let i=1; i<pathSplit.length; i++){
        path = path + '/';
        path = path + pathSplit[i];
    }
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