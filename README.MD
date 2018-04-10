# v0.01
vue-cli v3.0初始化

# v0.02
通过require.context构建目录结构，简单初始化左侧目录导航（无样式）

# v0.03
根据目录生成vue-router路由配置

# v0.04
优化路由配置，不使用嵌套路由

# v0.05
通过showdown实现Markdown转html，并添加markdown样式

# v0.06
优化App.vue的视图页面，各自放入承载该页面的组件中，将左侧导航和右侧主视图通过组件分离

# v0.07
解决 npm run build 后打开网页静态资源 net::ERR_FILE_NOT_FOUND 的问题
在vue.config.js中加入，在production环境中，修改output.publicPath
``` js
  configureWebpack: config => {
    console.log(config)
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath='./'
    } 
  }
```

# v0.08
设置showdown配置，符合流行的markdown语法
文档https://github.com/showdownjs/showdown
  omitExtraWLInCodeBlocks: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  requireSpaceBeforeHeadingText: true,
  emoji: true,
