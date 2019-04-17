const fs = require('fs');
const jsFiles = fs.readFileSync('./public/static/js/html-init.js', 'utf-8');
const { transform } = require('babel-core');
const cp = require('child_process');
const {evnConfig} = require('../pathConfig');
let gitVersion = "";
let lastTagCommand = 'git describe --abbrev=0 --tags';

try{
  const gitHead = fs.readFileSync('.git/HEAD', 'utf-8').trim();
  gitVersion = gitHead.split('/')[2];
}catch (e) {
  console.log('no git version');
}

if(!gitVersion){
  try{
    gitVersion = cp.execSync(lastTagCommand, {cwd: '.'}).toString();
  }catch (e) {
    console.log('no git tag');
  }
}

class InlineHtmlPlugin{
  apply(compiler){

    if (compiler.hooks) {
      const plugin = { name: 'inline-html-plugin' };
      compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
      compiler.plugin('emit', emit);
    }
  }
}

function emit(compilation, cb) {
  const keys = Object.keys(compilation.assets);
  keys.forEach((item) => {
    if (evnConfig.indexOf(item.split('-')[0]) > -1) {
      let html = resloveHtml(compilation.assets[item].source());
      let obj = {
        source: () => html,
        size: () => html.size
      };
      compilation.assets[item] = obj;
    }
  });
  cb();
}

function resloveHtml(html){
  const script = transform(jsFiles, {
    minified: true,
    comments: false,
  }).code;
  let str = html.replace('<script inline-html></script>',`<script>window.sysVersion = "${gitVersion}";window.updateDate="${new Date()}"; ${script}</script>`);
  return str;

}

module.exports = InlineHtmlPlugin;
