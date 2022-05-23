const path = require('path');
const fs = require('fs');

async function removeDir() {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      });
    }
  });
}

async function copyDir() {
  const files = await fs.promises.readdir(path.join(__dirname, 'files'));

  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive:true}, (err) => {
    if (err) throw err;
  });

  for (let file of files) {
    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
      if (err) throw err;
    });
  }
}
fs.stat(path.join(__dirname, 'files-copy'), (err,stats) => {
  if (!err) {
    removeDir();
  }
  copyDir();
})

