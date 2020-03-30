const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '.'),
     filename: './dist/jdialog.js',
    library: 'MA',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
          test:/\.scss$/,
          use:[
              'style-loader',
              {
                  loader:'css-loader',
                  options:{
                      importLoaders:2
                  }                   
              },
              'sass-loader',
              'postcss-loader'
          ]
      },
      {
          test: /\.less$/,
          use: [
              'style-loader',
              {
                  loader:'css-loader',
                  options:{
                      importLoaders:2
                  }                   
              },
              'less-loader',
              'postcss-loader'
          ]
      },    
      {
        test: /\.ts$/,
        use: ['babel-loader'],
        exclude: [path.resolve(__dirname, 'node_modules')]
      }
    ]
  },
  resolve: {
    extensions: ['.js','.css','.json'],
  },
 
  plugins:[
    new ExtractTextPlugin({ filename: 'dist/jdialog.css', allChunks: false })
    // ,new BundleAnalyzerPlugin({ analyzerPort: 8919 }) // 预览打包后的文件大小组成
  ],
  optimization: {
    minimizer: [
             new UglifyJSPlugin({
                 uglifyOptions: {
                     output: {
                         comments: false
                     },
                     compress: {
                         warnings: false,
                         drop_debugger: true,
                         drop_console: true
                     }
                 }
             }),
         ]
   },
  // devtool: "inline-source-map"
};