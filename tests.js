const callfor = require('./index');

//For Getting Data in UTF-8 String or Readable Text Format
callfor('https://jsonplaceholder.typicode.com/posts')
.then(res => res.utf8())
.then(res => console.log(res));

//For Getting Data in ArrayBuffer Format
callfor('https://jsonplaceholder.typicode.com/posts')
.then(res => res.arrayBuffer())
.then(res => console.log(res));

//For Getting Data in JSON Buffer Format
callfor('https://jsonplaceholder.typicode.com/posts')
.then(res => res.json())
.then(res => cosole.log(res))

callfor('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
	    title: 'sbr',
	    body: 'shohidul bari',
	    userId: 1
    }),
    headers: {
	   "Content-type":  "application/json; charset=UTF-8" 
    }
}).then(res => res.utf8()).then(res => console.log(res));


(async () => {
    try {
      let data = await callfor('https://reqres.in/api/users', {
        method: 'POST',
        body: JSON.stringify({
            "name": "morpheus",
            "job": "leader"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  })();

  //Added to gitignore
  //Dont push to repo