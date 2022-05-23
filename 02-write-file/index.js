const path = require('path');
const pathToTxt = path.join(__dirname, 'text.txt');

const fs = require('fs');

const process = require('process');
const readLine = require('readline');

const rl = readLine.createInterface(process.stdin, process.stdout);

fs.appendFile(pathToTxt, '', (err) => {
  if (err) throw err;
});

process.stdout.write('Hello, write some text here! \n');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
    process.exit();
  }
  fs.appendFile(pathToTxt, input + '\n', (err) => {
    if (err) throw err;
  })
})

rl.on('close', () => {
  process.stdout.write('Goodbye!');
})