const CompressionWebpackPlugin = require('compression-webpack-plugin')

const defaultPlugins = [
  new CompressionWebpackPlugin({
    test: /\.js$|\.html$|\.css$/,
    threshold: 10240,
    minRatio: 0.8
  })
]

module.exports = {
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: process.env.NODE_ENV !== 'production',
    proxy: {
      '/api': {
        target: 'http://localhost:8077',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {	// 打包时把css，js的预加载什么的删掉
      config.plugins.delete('preload')	// css图片的预加载
      config.plugins.delete('prefetch')	// js的预加载
      config.optimization.minimize(true)	// 最小化大文件的代码，如app.js的文件大小从9.6M->9.5M
      config.optimization.splitChunks({	// 将大文件的代码分割成两个文件，如app.js(9.5M)分割成app.js(2.5M)+venders~app.js(7M)
        chunks: 'all'
      })
    }
  },
  configureWebpack: config => {	// 不管是否打包都可以压缩压缩
    defaultPlugins.forEach(plugin => config.plugins.push(plugin))
  }
}
