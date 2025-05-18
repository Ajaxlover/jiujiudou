const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/student' : '/student',
  outputDir:
    process.env.NODE_ENV === 'production'
      ? 'student_pc_production'
      : 'student_pc_tf',
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8,
      })
    )
    // 开启分离js
    config.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          // vendor: {
          //   test: /[\\/]node_modules[\\/]/,
          //   name(module) {
          //     // get the name. E.g. node_modules/packageName/not/this/part.js
          //     // or node_modules/packageName
          //     const packageName = module.context.match(
          //       /[\\/]node_modules[\\/](.*?)([\\/]|$)/
          //     )[1];
          //     // npm package names are URL-safe, but some servers don't like @ symbols
          //     return `npm.${packageName.replace("@", "")}`;
          //   },
          // },
        },
      },
    }
    // 取消webpack警告的性能提示
    config.performance = {
      hints: 'warning',
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      },
    }
    config.externals = {
      vue: 'Vue',
      vuex: 'Vuex',
    }
  },
})
