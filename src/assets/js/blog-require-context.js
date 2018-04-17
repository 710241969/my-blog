// require.context获取博客文件上下文
const BlogRequireContext = require.context('../../../blogs/', true, /\.md$/)
const BlogRequireContextArray = BlogRequireContext.keys()
console.log(BlogRequireContextArray)
export { BlogRequireContext, BlogRequireContextArray }