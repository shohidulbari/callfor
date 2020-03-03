const CallForError = require('./src/error');
const errorSchema = require('./src/http-error-schema');
const pathResolver = require('./src/path');

const callfor = async (reqUrl, params = {}) => {
    try{
        var resp = await pathResolver(reqUrl, params);
    }catch(error){
        throw new CallForError(errorSchema.invalidUrl);
    }

    const protocol = resp.protocol;
    const reqParams = resp.reqParams;
    
    return new Promise((resolve, reject) => {
        let req = protocol.request(reqParams, resp => {
            let statusCode = null;
            if(resp.statusCode >= 200 && resp.statusCode <= 300){
                statusCode = resp.statusCode;
            }
            else if(resp.statusCode == 400){
                return reject(new CallForError(errorSchema.badRequest));
            }else if(resp.statusCode == 404){
                return reject(new CallForError(errorSchema.notFound));
            }else{
                return reject(new CallForError(errorSchema.annonymous));
            }

            let data = [];
            resp.on('data', partOfData => {
                data.push(partOfData);
            })

            resp.on('end', () => {
                let response = {};
                let totalData = Buffer.concat(data);
                response.StatusCode = statusCode;
                response.RequestedUrl = reqUrl;
                response.Data = totalData;
                response.utf8 = async () => {
                    return totalData.toString('utf8')
                }
                response.json = async () => {
                    return totalData.toJSON();
                }
                response.arrayBuffer = async () => {
                    return totalData.buffer;
                }
                resolve(response);
            });
        })

        req.on('error',(error) => {
            if(error.code == 'ENOTFOUND'){
                reject(new CallForError(errorSchema.notFound));
            }else{
                reject(new CallForError(errorSchema.annonymous));
            }
        });

        if(params.body){
            req.write(params.body);
        }
        req.end();
    })

}

module.exports = callfor;