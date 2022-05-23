const path = require('path');
const pathToTxt = path.join(__dirname, 'text.txt');

const fs = require('fs');
const readStream = new fs.ReadStream(pathToTxt);

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
})