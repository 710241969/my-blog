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

# v0.09
简化vue-router路由配置生成；重构左侧导航目录代码

# v0.10
调整左侧目录导航手风琴样式和代码逻辑

# v0.11
完善左侧导航栏；调整右侧博客视图

# v0.11
完善左侧导航栏（刷新保留目录状态）；修复font-awesome引入问题；使用marked作为markdown解析器

# v0.12
修改markdown样式，添加部分移动端适配标样式

# v0.12
大幅度调整markdown的写入方式，通过markdown-loader引入MD文件

# v0.13
修复markdown页面初始化时，内容不被渲染的问题；修复路由修改视图渲染的问题；修复路由下目录不展开的问题；修改部分样式

# v0.14
添加代码文本高亮

# v0.15
修改部分markdown的css样式

# v0.16
添加QQ邮件发送

# v0.17
修复代码高亮识别问题（highlight的方法加入language参数）；调整markdown代码样式

# v0.17
修复页面刷新博客组件不被加载问题（注册vue-router路由path中不该使用中文，应该使用encodeURI编码）