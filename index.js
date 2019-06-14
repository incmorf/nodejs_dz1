const fs = require('fs');
const path = require('path');

// const base = path.join(__dirname, 'incoming');
// const targetDir = path.join(__dirname, 'outcoming');

const args = process.argv.slice(2);
const base = args[0];
const targetDir = args[1];
const del = args[2];

if (!base || !targetDir) {
  console.log('Укажите первым параметром папку с файлами. А вторым папку назначения. Укажите delete третим параметром, если хотите удалить исходную папку');
  process.exit(1);
}

const delBase = (base) => {
  fs.readdir(base, (err, files) => {
    if (err) throw err;
    if (files.length === 0) {
      fs.rmdir(base, (err) => {
        if (err) throw err;
      });
    } else delBase(base);
  });
};

const qreadDir = (base, onFile) => {
  fs.readdir(base, (err, files) => {
    if (err) throw err;

    for (let i = 0; i < files.length; i++) {
      let pathF = path.join(base, files[i]);

      fs.stat(pathF, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          qreadDir(pathF, onFile);
          qDeldir(pathF);
        } else {
          onFile(pathF);
        }
      });
    }
  });
};

const qDeldir = (base) => {
  fs.readdir(base, (err, files) => {
    if (err) throw err;
    if (files.length === 0) {
      fs.rmdir(base, (err) => {
        if (err) throw err;
      });
    } else qDeldir(base);
  });
};

qreadDir(base, (file) => {
  let fileData = path.parse(file);
  let firstL = fileData.name[0];
  let newDir = path.join(targetDir, firstL);
  fs.mkdir(newDir, { recursive: true }, (err) => {
    if (err) throw err;

    fs.link(file, path.join(newDir, fileData.base), (err) => {
      if (err && err.code !== 'EEXIST') throw err;
      fs.unlink(file, (err) => {
        if (err) throw err;
        console.log('File deleted');
      });
    });
  });
});

if (del === 'delete') {
  delBase(base);
}
