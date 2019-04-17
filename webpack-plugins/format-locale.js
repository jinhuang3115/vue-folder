const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const basePath = path.join(__dirname, '../public/static/locales');
const imgBuildPath = path.join(__dirname, '../public/static/img');
const crypto = require('crypto');
const rimraf = require('rimraf');
const defaultLocaleName = 'zh_CN';
const imgPath = path.join(__dirname, '../imgTheme');
const imgMap = {};

function emit() {
  let files = _.without(fs.readdirSync(path.join(__dirname, '../src/locale')), 'index.js', 'filesMap.json', 'default.js');
  let jsonData = getJsonData(files);
  let errorMessage = [];
  for (let key in jsonData.localeMaps) {
    def(jsonData.defaultLocale, jsonData.localeMaps[key], key, errorMessage)
  }
  if (errorMessage.length) {
    throw 'miss keys of locales:' + '\n' + errorMessage.join("\n")
  }
  rimraf.sync(basePath);
  fs.mkdirSync(basePath);
  writeFiles(jsonData);
}

function def(item, compareItem, fileName, errorMessage) {
  for (let key in item) {
    let obj = item[key]
    if (!compareItem[key]) {
      errorMessage.push(fileName + " : " + key + ' ' + JSON.stringify(obj))
    } else {
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        def(obj, compareItem[key], fileName, errorMessage)
      }
    }
  }
}

function writeFiles(jsonData) {
  let filesMap = {}
  let filesMapPath = path.join(__dirname, '../src/locale/', 'filesMap.json');
  let content = JSON.stringify(jsonData.defaultLocale)
  let md5sum = crypto.createHash('md5');
  md5sum.update(content)
  let md5 = md5sum.digest('hex');
  fs.writeFileSync(path.join(basePath, md5 + '-' + defaultLocaleName + '.json'), content);
  filesMap[defaultLocaleName] = md5 + '-' + defaultLocaleName + '.json';
  for (let key in jsonData.localeMaps) {
    let fileName = key.replace('js', 'json')
    content = JSON.stringify(jsonData.localeMaps[key]);
    md5sum = crypto.createHash('md5')
    md5sum.update(content)
    md5 = md5sum.digest('hex');
    filesMap[key.replace('.js', '')] = md5 + '-' + fileName;
    fs.writeFileSync(path.join(basePath, md5 + '-' + fileName), content);
  }
  rimraf.sync(filesMapPath);
  fs.writeFileSync(filesMapPath, JSON.stringify(filesMap));
}

function getJsonData(list) {
  let localeMaps = {}
  let defaultLocale = {}
  for (let i = 0, len = list.length; i < len; i++) {
    delete require.cache[require.resolve(path.join(__dirname, '../src/locale/', list[i]))]
    let locale = require(path.join(__dirname, '../src/locale/', list[i]))
    if (list[i] !== (defaultLocaleName + '.js')) {
      localeMaps[list[i]] = locale
    } else {
      defaultLocale = locale
    }
  }
  return {
    localeMaps: localeMaps,
    defaultLocale: defaultLocale
  }
}

function createImgMap(dirPath) {
  rimraf.sync(path.join(__dirname, `../src/utils/imgMap.json`));
  const dirs = fs.readdirSync(dirPath);
  dirs.forEach((dir) => {
    if (dir === '.DS_Store') {return false};
    const imgs = fs.readdirSync(path.join(dirPath, dir));
    imgMap[dir] = {};
    imgs.forEach((item) => {
      const imgKeys = item.split('.');
      const suffix = imgKeys[1];
      const imgKey = imgKeys[0];
      const source = fs.readFileSync(path.join(dirPath, dir, item));
      const md5sum = crypto.createHash('md5');
      md5sum.update(source);
      const md5 = md5sum.digest('hex');
      imgMap[dir][imgKey] = `/static/img/${dir}/${md5}.${suffix}`;
    });
    fs.writeFileSync(path.join(__dirname, `../src/utils/imgMap.json`), JSON.stringify(imgMap), 'utf-8');
  });
}

function copyImg() {
  let dirs = fs.readdirSync(imgPath);
  rimraf.sync(imgBuildPath);
  fs.mkdirSync(imgBuildPath);
  dirs.forEach((dirItem) => {
    if (dirItem === '.DS_Store') {return false};
    const inPath = path.join(imgPath, dirItem);
    const paths = fs.readdirSync(inPath);
    paths.forEach((item) => {
      const source = fs.readFileSync(path.join(inPath, item));
        const imgKeys = item.split('.');
        const suffix = imgKeys[1];
        if(!fs.existsSync(path.join(imgBuildPath, dirItem))){
          fs.mkdirSync(path.join(imgBuildPath, dirItem));
        }
        fs.writeFileSync(path.join(imgBuildPath, dirItem, getIconFontScript(source) + '.' + suffix), source);
    });
  });
}

function getIconFontScript(source){
  let md5sum = crypto.createHash('md5');
  md5sum.update(source);
  let md5 = md5sum.digest('hex');
  return md5;
}

copyImg();
createImgMap(imgPath);
emit();
