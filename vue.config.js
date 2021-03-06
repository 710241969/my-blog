module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    //解决 npm run build 后打开网页静态资源 net::ERR_FILE_NOT_FOUND 的问题 在vue.config.js中加入，在production环境中，修改output.publicPath
    // console.log(config.module.rules)
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = './'
      config.module.rules[4].use[0].options.publicPath = '../'
    }
    // font-awesome

    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: "html-loader"
        },
        {
          loader: "markdown-loader",
          options: {
            renderer: new require("marked").Renderer(),
            highlight: (code, language) => {
              return require("highlight.js").highlightAuto(code, language ? [language] : undefined).value
            }
          }
        }
      ]
    })
  }
};


/* 官方文档
 module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: '/',

  // where to output built files
  outputDir: 'dist',

  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: true,

  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  compiler: false,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => { },
  configureWebpack: () => { },

  // vue-loader options
  // https://vue-loader.vuejs.org/en/options.html
  vueLoader: {},

  // generate sourceMap for production build?
  productionSourceMap: true,

  // CSS related options
  css: {
    // extract CSS in components into a single CSS file (only in production)
    extract: true,

    // enable CSS source maps?
    sourceMap: false,

    // pass custom options to pre-processor loaders. e.g. to pass options to
    // sass-loader, use { sass: { ... } }
    loaderOptions: {},

    // Enable CSS modules for all css / pre-processor files.
    // This option does not affect *.vue files.
    modules: false
  },

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // split vendors using autoDLLPlugin?
  // can also be an explicit Array of dependencies to include in the DLL chunk.
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  dll: false,

  // options for the PWA plugin.
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: null, // string | Object
    before: app => { }
  },

  // options for 3rd party plugins
  pluginOptions: {
    // ...
  }
}
 */