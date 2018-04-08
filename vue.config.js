module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      /** 
       * Vue v2.x之后NPM Package默认设置只会生成runtime-only 版本，若要使用standalone功能則需如下设置 
       * 否则会报错：Failed to mount component: template or render function not defined. 
       */
      alias: {
        'vue': 'vue'
      }
    }
  }
};
