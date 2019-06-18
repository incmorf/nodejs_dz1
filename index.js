const fs = require('fs');
const path = require('path');
const util = require('util')

const mkdir = util.promisify(fs.mkdir);
const link = util.promisify(fs.link);
const copyFile = util.promisify(fs.copyFile);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);

const args = process.argv.slice(2);
const base = args[0];
const targetDir = args[1];
const del = args[2];

if (!base || !targetDir) {
  console.log('Укажите первым параметром папку с файлами. А вторым папку назначения. Укажите delete третим параметром, если хотите удалить исходную папку');
  process.exit(1);
}

const delBase = async (base) => {
  let files = await readdir(base);
  if (files.length === 0) {
    await rmdir(base);
  } else await delBase(base);
};

const qreadDir = async (base) => {
  let files = await readdir(base);

  for (let i = 0; i < files.length; i++) {
    let pathF = path.join(base, files[i]);

    let stats = await lstat(pathF);
    if (stats.isDirectory()) {
      await qreadDir(pathF);
      await qDeldir(pathF);
    } else {
      await onFile(pathF);
    }
  }
};

const qDeldir = async (base) => {
  let files = await readdir(base);
  if (files.length === 0) {
    await rmdir(base);
  } else await qDeldir(base);
};

const onFile = async (file) => {
  let fileData = path.parse(file);
  let firstL = fileData.name[0];
  let newDir = path.join(targetDir, firstL);
  try {
    await mkdir(newDir, { recursive: true });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  try {
    await copyFile(file, path.join(newDir, fileData.base));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  await unlink(file);
};

qreadDir(base).then(function () {
  console.log('success');
});

if (del === 'delete') {
  delBase(base);
  console.log('All done');
}
