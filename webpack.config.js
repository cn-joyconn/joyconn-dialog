const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: './dist/JoyDialog.js',
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
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
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
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /(iconfont.svg)|\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',  //[path] 上下文环境路径
              publicPath: './iconfont/',    //公共路径
              outputPath: 'dist/iconfont/',  //输出路径                          
            }
          }
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
    extensions: ['.js', '.css', '.json'],
  },

  devServer:{
    port:8088,
    // host:'0.0.0.0',
    // contentBase:  path.join(__dirname, "src/demo/demo.html"),
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'dist/JoyDialog.css', allChunks: false })
    // , new HtmlWebpackPlugin({
    //   template: 'src/demo/demo.html',  // 输入文件
    //   filename: 'src/demo/demo.html',  // 输出文件
    // })
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
            drop_console: false
          }
        }
      }),
    ]
  },
  // devtool: "inline-source-map"
};