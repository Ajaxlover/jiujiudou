"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  plugins: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "vue",
          entry:
            "https://find-1253402545.cos.ap-beijing.myqcloud.com/cdn/vue.js",
          global: "Vue"
        },
        {
          module: "vuex",
          entry:
            "https://find-1253402545.cos.ap-beijing.myqcloud.com/cdn/vuex.min.js",
          global: "Vuex"
        },
        {
          module: "element-ui",
          entry:
            "https://find-1253402545.cos.ap-beijing.myqcloud.com/cdn/index.js",
          global: "ELEMENT"
        },
        {
          module: "moment",
          entry:
            "https://find-1253402545.cos.ap-beijing.myqcloud.com/cdn/moment.min.js",
          global: "moment"
        }
      ]
    })
  ],
  context: path.resolve(__dirname, "../"),
  entry: {
    app: ["babel-polyfill", "./src/main.js"]
  },
  externals: {
    CKEDITOR: "window.CKEDITOR",
    AMap: "window.AMap"
    // echarts: "window.echarts"
  },
  output: {
    path: config.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig
      },
      {
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [resolve("src"), resolve("test")],
        options: {
          formatter: require("eslint-friendly-formatter")
          // 不符合Eslint规则时只警告(默认运行出错)
          // emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
          resolve("src"),
          resolve("test"),
          resolve("node_modules/webpack-dev-server/client")
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};
