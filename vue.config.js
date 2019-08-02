const {evnConfig} = require('./pathConfig');
const MoveFiles = require('./webpack-plugins/move-files');
const InlineHtmlPlugin = require('./webpack-plugins/inline-html');

const paths = evnConfig.map(item => `/${item}/*`);
module.exports = {
  configureWebpack: {
    plugins: process.env.NODE_ENV === 'production' ?
      [new MoveFiles(), new InlineHtmlPlugin()] : [new InlineHtmlPlugin()]
  },
  pages: {
    'ex-index': {
      // page 的入口
      entry: 'src/pages/ex-home/main',
      // 模板来源
      template: 'public/ex-index.html',
      // 在 dist/index.html 的输出
      filename: 'ex-index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Exchange',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'ex-index']
    },
  },
  devServer: {
    before(app, self) {
      app.get(paths, (req, res) => {
        let pathName = req.path.replace('/', '');
        let fileName = pathName.split('/');
        let files = fileName[0];
        if (pathName.indexOf('.') === -1) {
          files = `${fileName[0]}-index.html`;
        }
        res.send(self._stats.compilation.assets[files].source());
      });
    },
    compress: true,
    open: true,
/*    proxy: {
      '/fe-ex-api': {
        target: '',
        pathRewrite: {
          '^/fe-ex-api': '',
        },
      },
    },*/
  },
};
