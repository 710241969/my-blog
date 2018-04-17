import { BlogRequireContextArray } from './blog-require-context'

// const ROUTE_MATCH_REGEX = /^\.\/(.*).vue$/i

const ROUTE_MATCH_REGEX = /^\.\/(.*).md$/i

let CatalogObj = {}
let currentObj = CatalogObj
for (let i = 0, ilen = BlogRequireContextArray.length; i < ilen; i++) {
  let item = BlogRequireContextArray[i]
  let path = item.match(ROUTE_MATCH_REGEX)[1]
  let pathArray = path.split('/')

  for (let j = 0, jlen = pathArray.length; j < jlen; j++) {
    let pathItem = pathArray[j]
    if (1 == jlen) {
      CatalogObj[pathItem] = pathItem
      currentObj = CatalogObj
      continue
    }
    if (!currentObj[pathItem]) {
      currentObj[pathItem] = (j == (jlen - 1) ? pathItem : {})
    }
    currentObj = currentObj[pathItem]
  }

  currentObj = CatalogObj
}

export default CatalogObj
