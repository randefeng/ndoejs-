const path = require('path');
//  生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  entry: {
    // app: './src/index.js',
    // print: './src/print.js',
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
       template: 'index.html',
      title: 'Output Management'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase: './dist',
   hot: true
  },
  output: { 
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};