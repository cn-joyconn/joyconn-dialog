
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // mode: 'production',
  mode: 'development',
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, '.'),
    filename: './dist/JoyDialog.js',
    // library: 'MA',
    // libraryTarget: 'umd'
  },
  module: {
    rules: [
        {
          //匹配哪些文件
          test: /\.css$/,
          //使用哪些loader进行处理
          use:[
            MiniCssExtractPlugin.loader,
            'css-loader',
          ]
          // use:[
          //     MiniCssExtractPlugin.loader,
          //     'css-loader',
          //     {
          //         loader: "postcss-loader",
          //         options:{
          //             ident:'postcss',
          //             plugins:()=>{
          //                 require('postcss-preset-env')()
          //             }
          //         }
          //     }
          // ]
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
      }, 
      {
        test:/\.md$/,
        loader:'vue-markdown-loader',
        // options:vueMarkdown,
      },
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
    new MiniCssExtractPlugin({
      filename: 'dist/JoyDialog.dev.css',
    }),    
    // new ExtractTextPlugin({ filename: 'dist/JoyDialog.css', allChunks: false })
    // , new HtmlWebpackPlugin({
    //   template: 'src/demo/demo.html',  // 输入文件
    //   filename: 'src/demo/demo.html',  // 输出文件
    // })
    // ,new BundleAnalyzerPlugin({ analyzerPort: 8919 }) // 预览打包后的文件大小组成
  ],
  optimization: {
    minimize: false, // 可省略，默认最优配置：生产环境，压缩 true。开发环境，不压缩 false
    minimizer: [
      // new TerserPlugin()    , 
    ]
  },
  
  devtool: 'cheap-module-source-map',
};