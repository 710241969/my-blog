import { blogRequireContextArray } from './blog-require-context'

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

export default catalogObj
