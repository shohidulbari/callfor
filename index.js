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

// (async () => {
//     try {
//       let data = await callfor(
//         'http://localhost:3000/user',
//       );
//       data = await data.utf8();
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//   })();

//callfor('https://the-showman-and-the-g-clef-u8pmjbhb7ixy.runkit.sh').then(res => res.utf8()).then(res => console.log(res));
//callfor('https://jsonplaceholder.typicode.com/todos').then(res => res.utf8()).then(res=> console.log(res));


//callfor('https://jsonplaceholder.typicode.com/posts').then(res => res.arrayBuffer()).then(res => console.log(res));

callfor('http://localhost:3000/user').then(res => res.json()).then(res => console.log(res));


// callfor('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     body : JSON.stringify({
//         title: 'sbr',
//         body: 'this is new shohidul bari ritoo',
//         userId: 1
//     }),
//     headers: {
//         "Content-type": "application/json; charset=UTF-8"
//     }
// }).then(res => res.utf8()).then(res => console.log(res));

// callfor('https://jsonplaceholder.typicode.com/posts/1', {
//     method: 'DELETE'
// }).then(res => console.log(res));

// callfor('http://localhost:3000/user', {
//     method: 'DELETE',
//     body: JSON.stringify({
//         name : 'shohidul bari',
//         age : 25
//     }),
//     headers: {
//         "Content-type": "application/json; charset=UTF-8"
//     }
// }).then(res=> res.utf8()).then(res => console.log(res));