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

    console.log(reqParams);
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
                console.log(data);
                response.StatusCode = statusCode;
                response.RequestedUrl = reqUrl;
                response.Data = Buffer.concat(data);
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
        req.end();
    })

}

// (async () => {
//     try {
//       const data = await callfor(
//         'https://the-showman-and-the-g-clef-u8pmjbhb7ixy.runkit.sh',
//       );
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//   })();

callfor('https://the-showman-and-the-g-clef-u8pmjbhb7ixy.runkit.sh').then(res => res.text()).then(res => {
    console.log(res);
})