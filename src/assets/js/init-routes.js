import { blogRequireContext, blogRequireContextArray } from './blog-require-context'
import CatalogObj from './init-catalog'

//Vue路由列表
let vueRouter = []
let catalogObjQueue = [CatalogObj]
let pathQueue = []
while (catalogObjQueue.length > 0) {
  let catalogItem = catalogObjQueue.shift()
  let pathItem = pathQueue.shift() || ''
  let keys = Object.keys(catalogItem)
  for (let i = 0; i < keys.length; i++) {
    if (catalogItem[keys[i]] instanceof Object) {
      catalogObjQueue.push(catalogItem[keys[i]])
      pathQueue.push(pathItem + '/' + keys[i])
    } else {
      console.log(catalogItem[keys[i]])
      vueRouter.push({
        path: pathItem + '/' + keys[i],
        name: keys[i],
        component:
          resolve =>
            require.ensure(
              [],
              () => resolve(blogRequireContext(catalogItem[keys[i]])))
      })
    }
  }
}

console.log(vueRouter)

export default vueRouter