const fetch = require('node-fetch');
const axios = require('axios');

// fetch('https://the-showman-and-the-g-clef-u8pmjbhb7ixy.runkit.sh')
//     .then(res => res)
//     .then(body => console.log(body));

axios.get('https://the-showman-and-the-g-clef-u8pmjbhb7ixy.runkit.sh').then(res => {
    console.log(res);
})