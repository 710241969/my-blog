import FatherRoute from '../../views/FatherRoute.vue'
import { blogRequireContext, blogRequireContextArray } from './blog-require-context'

let catalogObj = {}
let currentObj = {}
//获取上下文列表
for (let i = 0, len = blogRequireContextArray.length; i < len; i++) {
  let blogFilePath = blogRequireContextArray[i]
  let pathArray = blogFilePath.substring(2).split('/')
  for (let j = 0, len = pathArray.length; j < len; j++) {
    let pathItem = pathArray[j]
    if (j == len - 1) {
      let fileNamePrefix = pathItem.substring(0, pathItem.lastIndexOf('.'))
      if (0 == j) {
        catalogObj[fileNamePrefix] = blogFilePath
      } else {
        currentObj[fileNamePrefix] = blogFilePath
      }
      continue
    }

    if (0 == j) {
      if (!catalogObj[pathItem]) {
        catalogObj[pathItem] = {}
      }
      currentObj = catalogObj[pathItem]
      continue
    }

    if (!currentObj[pathItem]) {
      currentObj[pathItem] = {}
    }
    currentObj = currentObj[pathItem]
  }
}

//Vue路由列表
let vueRouter = []
let catalogObjQueue = [catalogObj]
let vueRouterObjQueue = [vueRouter]
let isRoot = true
while (catalogObjQueue.length > 0) {
  let catalogItem = catalogObjQueue.shift()
  let vueRouterItem = vueRouterObjQueue.shift()
  let keys = Object.keys(catalogItem)
  for (let i = 0; i < keys.length; i++) {
    let vueRouteObj = {
      path: (isRoot ? '/' : '') + keys[i],
      name: keys[i],
    }
    if (catalogItem[keys[i]] instanceof Object) {
      vueRouteObj.component = FatherRoute
      vueRouteObj.children = []
    } else {
      // 重点!!!
      vueRouteObj.component =
        resolve =>
          require.ensure(
            [],
            () => resolve(blogRequireContext(catalogItem[keys[i]])))
      vueRouterItem.push(vueRouteObj)
      continue
    }
    vueRouterItem.push(vueRouteObj)
    catalogObjQueue.push(catalogItem[keys[i]])
    vueRouterObjQueue.push(vueRouteObj.children)
  }
  isRoot = (isRoot && false)
}

console.log(vueRouter)

export default vueRouter