const path = require('path');
const fs = require('fs');
const {Transform, pipeline} = require('stream');

async function createDir(path) {
  await fs.promises.mkdir(path, {recursive:true});
}

async function deleteDir(target) {
  const files = await fs.promises.readdir(target);
  for (let file of files) {
    const targetFile = path.resolve(target, file);
    const stat = await fs.promises.stat(targetFile);
    if (stat.isDirectory()) {
      await deleteDir(targetFile);
      await fs.promises.rmdir(targetFile);
    } else {
      await fs.promises.unlink(targetFile);
    }
  }
}

async function updateDir(dist) {
  const stat = await fs.promises.stat(dist).catch(() => null);
  if (stat) {
    await deleteDir(dist);
  }
  await createDir(dist);
  await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await createStyleBundle();
  await replaceTags();
}

async function copyDir(source, target) {
  await createDir(target);
  const files = await fs.promises.readdir(source);
  for (let file of files) {
    const sourceFile = path.resolve(source, file);
    const targetFile = path.resolve(target, file);
    const stat = await fs.promises.stat(sourceFile);
    if (stat.isDirectory()) {
      await copyDir(sourceFile, targetFile)
    } else {
      await fs.promises.copyFile(sourceFile, targetFile);
    }
  }
}

async function createStyleBundle() {
  const bundlePath = path.join(__dirname,'project-dist','style.css');

  await fs.promises.writeFile(bundlePath, '');

  let files = await fs.promises.readdir(path.join(__dirname, 'styles'));
  
  files = files.filter((value) => value.substring(value.length-3) === 'css');
    for (let file of files) {
      const readStream = fs.createReadStream(path.join(__dirname,'styles', file));
      readStream.on('data', (chunk) => {
        fs.appendFile(bundlePath, chunk + '\n', (err) => {
          if (err) throw err;
        });
      })
    }
}

function replaceTags() {
  const transform = new Transform({
    transform(chunk,enc,callback) {
      let data = chunk.toString();
      fs.readdir(path.join(__dirname, 'components'),async (err, files) => {
        if (err) throw err;
        for (let file of files) {
          let filePath = path.join(__dirname, 'components', file);
  
          if (file.includes('.html')) {
            file = file.replace('.html','');
          }
  
          if (data.includes(`{{${file}}}`)) {
            const fileData = await fs.promises.readFile(filePath);
            data = data.replace(`{{${file}}}`, fileData);
          }
        }
        callback(null, data);
      });
      
    }
  })
  
  pipeline(
    fs.createReadStream(path.join(__dirname, 'template.html')),
    transform,
    fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html')),
    (err) => {
    if (err) throw err;
  })
}

updateDir(path.join(__dirname, 'project-dist'));




