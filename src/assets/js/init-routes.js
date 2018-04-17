import { BlogRequireContextArray } from './blog-require-context'
import Blog from '../../components/BlogMain/blog'

// const ROUTE_MATCH_REGEX = /\.(.*).vue$/i
const ROUTE_MATCH_REGEX = /\.(.*).md$/i

//Vue路由列表
let vueRouter = []
for (let i = 0, len = BlogRequireContextArray.length; i < len; i++) {
  let item = BlogRequireContextArray[i]
  let path = item.match(ROUTE_MATCH_REGEX)[1]
  vueRouter.push({
    path: path,
    name: path,
    component: Blog
    // resolve =>
    //   require.ensure(
    //     [],
    //     () => resolve(BlogRequireContext(item)))
  })
}

export default vueRouter