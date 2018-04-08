// require.context获取博客文件上下文
const blogRequireContext = require.context('../../blogs/', true, /\.vue$/)
const blogRequireContextArray = blogRequireContext.keys()

export { blogRequireContext, blogRequireContextArray }