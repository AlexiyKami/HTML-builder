const path = require('path');
const dir = path.join(__dirname, 'secret-folder');
const fs = require('fs');

async function readFolder() {
  const files = await fs.promises.readdir(dir);
  for (let file of files) {
    fs.stat(path.join(__dirname, 'secret-folder', file),(err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(file.replace('.', ' - ') + ' - ' + stats.size + 'b');
      }
    })
  }
}

readFolder();
