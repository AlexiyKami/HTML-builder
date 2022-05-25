const path = require('path');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const fs = require('fs');

fs.writeFile(bundlePath, '', (err) => {
  if (err) throw err;
});

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) throw err;
  files = files.filter((value) => path.extname(value) === '.css');
  for (let file of files) {
    const readStream = fs.createReadStream(path.join(__dirname, 'styles', file));
    readStream.on('data', (chunk) => {
      fs.appendFile(bundlePath, chunk + '\n', (err) => {
        if (err) throw err;
      });
    })
    
  }
});