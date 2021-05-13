module.exports = {
    productionSourceMap: false // 生产打包时不输出map文件，增加打包速度
    ,outputDir:"./doc"
    ,chainWebpack: config => {
        config.module
          .rule("md")
          .test(/\.md$/)
          .use("vue-loader")
          .loader("vue-loader")
          .end()
          .use("vue-markdown-loader")
          .loader("vue-markdown-loader/lib/markdown-compiler")
          .options({
            raw: true
          });
      }
}