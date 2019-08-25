const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
module.exports = function () {
return {
    entry: ["@babel/polyfill", path.resolve(__dirname, 'src/index.js')],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.(sc|sa|c)ss$/,
          use: [ 'style-loader', 'css-loader', "sass-loader"]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new VueLoaderPlugin()
    ],
    // devtool: arguments[1].mode === 'production'? 'source-map': '',
    devtool: 'source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'src'),
      watchContentBase: true,
      overlay: true,
      port: 8888,
      hot: true,
      // progress: true
    }
  }
}