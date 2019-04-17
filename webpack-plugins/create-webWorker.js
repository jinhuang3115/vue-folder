const rimraf = require('rimraf');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { transform } = require('babel-core');
const webWorkerMap = {};

const webWorkerPath = path.join(__dirname, '../public/static/web-worker');
const webWorkerMapPath = path.join(__dirname, '../src/assets/js/webworker-map.js');

rimraf.sync(webWorkerMapPath);
createwebWrokerMap(webWorkerPath);
fs.writeFileSync(webWorkerMapPath, `export default ${JSON.stringify(webWorkerMap)}`);

function createwebWrokerMap(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((value, index) => {
    let filePath  = path.join(dirPath, value);
    if(fs.statSync(filePath).isDirectory()){
      createwebWrokerMap(filePath);
    }else{
      const fileSource = fs.readFileSync(filePath, 'UTF-8');
      let md5sum = crypto.createHash('md5');
      md5sum.update(transform(fileSource, {
        minified: true,
        comments: false,
      }).code);
      let md5 = md5sum.digest('hex');
      let hashValue = `${md5}-${value}`;
      webWorkerMap[value.replace('.js', '')] = hashValue;
    }
  })
}
