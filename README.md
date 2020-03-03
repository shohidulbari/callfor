# callfor
## Introduction
callfor is an light weight Node.js http/https client. This supports Promise as well as Async/Await. This can be use for fetching data from API or any http/https address.

## Features
* Fetch data from API or http/https URL.
* Common error handling.
* Data can be get in many format like Buffer, ArrayBuffer, JSON, UTF-8 or Readable Text.
* No other dependencies excepts Node.js.

## Documentation

### Installation

    npm install callfor

### Use
#### Basic
    const callfor = require('callfor');
    callfor('https://jsonplaceholder.typicode.com/posts').then(res => console.log(res));
#### Get Data In Different Format

    const callfor = require('callfor');
    
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
#### Async/Await

    cosnt asyncFunction = async () => {
	    let data = await callfor('https://jsonplaceholder.typicode.com/posts');
	    let utfData = await data.utf8();
	    let arrayBufferData = await data.arrayBuffer();
	    let jsonBufferData = await data.json();
    }
    
#### Main Response Format
In main response, Data will provided in Node Buffer format. This response also contain 3 utility function to change the format of data like utf8 string, ArrayBuffer, JSON Buffer.

    {
	  StatusCode: 200,
	  RequestedUrl: 'http://localhost:3000/user',
	  Data: <Buffer 7b 22 69 64 22 3a 31 30 31 2c 22 6e 61 6d 65 22 3a 22 73 68 6f 68 69 64 75 6c 20 62 61 72 69 22 2c 22 64 65 70 74 22 3a 22 69 63 74 22 2c 22 64 65 67 ... 11 more bytes>,
	  utf8: [Function],
	  json: [Function],
	  arrayBuffer: [Function]
    }

#### Utility Function Provided With Response
* utf8() : Readable Text or String Fromat.
* json() : implemented buffer.toJSON() method to format as JSON Buffer.
* arrayBuffer(): ArrayBuffer / Uint8Contents Format.


