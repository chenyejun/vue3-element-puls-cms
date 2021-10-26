// const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        // 全局注入scss变量，让所有组件可使用
        prependData: `@import "@/assets/styles/_shared.scss";`,
        sassOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    // svg图标配置
    // config.module.rule('svg')
    //   .exclude.add(path.resolve('./src/assets/icons'))
    // config.module.rule('icons')
    //   .test(/\.svg$/)
    //   .include.add(path.resolve('./src/assets/icons')).end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    if (isProduction) {
      // 为生产环境修改配置...
      config.set('externals', {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        'element-plus': 'ElementPlus',
      })
    } else {
      // 为开发环境修改配置...
    }
  },
  devServer: {
    'https': false,
    'host': 'localhost',
    'port': 3000,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://board.edm.zaobang.com', // 测试环境
        ws: true,
        changeOrigin: true
      }
    }
  }
}