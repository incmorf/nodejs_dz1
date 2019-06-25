const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'incoming');
const targetDir = path.join(__dirname, 'outcoming');
// const args = process.argv.slice(2);
// const base = args[0];
// const targetDir = args[1];
// const del = args[2];

// if (!base || !targetDir) {
//   console.log('Укажите первым параметром папку с файлами. А вторым папку назначения. Укажите delete третим параметром, если хотите удалить исходную папку');
//   process.exit(1);
// }

const walk = function (dir, callbackOnFile, callbackOnFolder, done) {
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;

    const next = function (err) {
      if (err) return done(err);

      let filePath = list[i++];

      if (!filePath) return done(null);

      filePath = path.join(dir, filePath);

      fs.stat(filePath, (_, stat) => {
        if (stat && stat.isDirectory()) {
          callbackOnFolder(filePath, next);
          walk(filePath, callbackOnFile, callbackOnFolder, next);
        } else {
          callbackOnFile(filePath, next);
        }
      });
    };
    next();
  });

}
const onFolder = (filePath, done) => {  
  fs.readdir(filePath, (_, files) => {
    console.log(files);
  })
  done();
};

const onFIle = (filePath, done) => {
  try {

    let file = path.parse(filePath);
    let firstLetter = file.base.slice(0, 1);
    let newDIr = path.join(targetDir, firstLetter);

    fs.mkdir(newDIr, { recursive: true }, (err) => {
      if (err) throw err;
      fs.copyFile(filePath, path.join(newDIr, file.base), (_) => {
        fs.unlink(filePath, (_) => {

        });
      });
    });

    done();

  } catch (err) {
    done(err);
  }
};

walk(base, onFIle, onFolder, err => {
  if (err) {
    return process.exit(500);
  }

  console.log('Done!');
});
