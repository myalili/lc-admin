
const path = require('path');
const config = require("./config/config.json")
const chalk = require('chalk')
const serverData = require("./config/serverData.json")
const dataSource = serverData.dataSource;
const serve = config.serve;
var argv = require('minimist')(process.argv.slice(2));
const webpack=require('webpack');

let plugins =  process.env.NODE_ENV === 'production'&& new webpack.optimize.LimitChunkCountPlugin({
  maxChunks: 10,
})||[]

// 当前运行环境
const isMicroPro = argv.runtime && (argv.runtime === 'micro');

let proxy = {};
if (dataSource) {
  dataSource.proxy.map(config => {

    let envTarget = config.target.find(item => process.env.BABEL_ENV.includes(item.env));
    if (envTarget && envTarget.target) {
      config.target = envTarget.target;
      proxy[dataSource.base + config.source] = {
        changeOrigin: config.changeOrigin || false,     // target是域名的话，需要这个参数，
        pathRewrite: config.pathRewrite || {},
        target: (envTarget && envTarget.target) || '',
        // headers: {    // 代理报HPE_INVALID_CHUNK_SIZE 错，需要开启
        //   Connection: 'keep-alive'    
        //  },
        bypass: function (req, res, proxyOptions) {
          console.log(chalk.magentaBright(`\n > ${req.url}`))
        },
        onProxyRes: function (proxyRes, req, res) {
          const cookies = proxyRes.headers['set-cookie']
          if (cookies) {
            const newCookies = cookies.map(cookie => {
              // config.source 是当前的代理名，与本地后台项目路径保持一致，如果不一样，请自行修改
              return cookie.replace(new RegExp(`Path=${config.source}`, 'g'), 'Path=/');
            })
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = newCookies
          }
        }
      };
    }


  });
}
console.log(proxy, 'PROXY')
const entry = ['./src/main.js'];
if (!isMicroPro) {
  entry.unshift(path.resolve(__dirname, './loader/dev_mixins_loader.js'))
}
module.exports = {
  pages: {
    app: {
      // page 的入口
      entry,
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',

    },

  },
  lintOnSave: false,
  publicPath: './',
  outputDir: './micro.pro/dist',
  devServer: {
    port: serve.port,
    disableHostCheck: true,
    hot: true,
    proxy: {
      //假数据

      ...proxy
    },
    after(app, server, compiler) {
    }
  },
  pluginOptions: {

  },
  
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : undefined,
    resolve: {
      alias: {
        packageJSON: path.resolve(__dirname, './package.json')
      }
    },
    plugins: plugins,
  },

  transpileDependencies: ['webpack-dev-server/client/clients/SockJSClient.js', /[/\\]node_modules[/\\]@uae[/\\]uae-bpmn-editor[/\\]/],
  chainWebpack(config) {
    config.plugins.delete('preload-app')
    config.plugins.delete('prefetch-app')
    config.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(path.resolve(__dirname, 'node_modules/@v2-lib'))
      // .add(path.resolve(__dirname, 'node_modules/pinyin'))
      // .add(path.resolve(__dirname, 'node_modules/@interactjs/utils'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', {
            modules: false
          }]
        ]
      });
    // config.plugin('monacoPlugin').use('monaco-editor-webpack-plugin');
    if (isMicroPro) {
      console.log("最小量打包");

      config.module
        .rule('aweb-rule')
        .test(/aweb\.components|vue\.spa\.plugin|micro\/index/g)
        .use(path.resolve(__dirname, './loader/empty.js'))
        .loader(path.resolve(__dirname, './loader/empty.js'))
        .end()



    } else {

      console.log("全量加载或打包");
      //旧的基版用到的,单独打包某个页面的时候不会把views的页面全部打包
      // config.module
      //   .rule('import-rule')
      //   .test(/_spa_import\.js/g)
      //   .use(path.resolve(__dirname, './vue.spa.plugin/loaders/import_loader.js'))
      //   .loader(path.resolve(__dirname, './vue.spa.plugin/loaders/import_loader.js'))
      //   .end()

      //测试用，实际没有用到
      // config.module
      //   .rule('dev-import-rule')
      //   .test(/^main\.js$/g)
      //   .use(path.resolve(__dirname, './loader/dev_mixins_loader.js'))
      //   .loader(path.resolve(__dirname, './loader/dev_mixins_loader.js'))
      //   .end()
    }




  },
  productionSourceMap: false,
  filenameHashing: false,
  css: {
    modules: false,
    extract: true,
    sourceMap: false,
    loaderOptions: {
      less: {
        lessOptions: {
          // modifyVars: modifyVars(),
          javascriptEnabled: true,
        },
      }
    }
  },
}
