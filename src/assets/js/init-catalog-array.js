import CatalogObj from './init-catalog-obj'

let CatalogArray = []

let catalogObjQueue = [CatalogObj]
let arrayObjQueue = [CatalogArray]
while (catalogObjQueue.length > 0) {
  let catalogItem = catalogObjQueue.shift()
  let arrayItem = arrayObjQueue.shift()

  let keys = Object.keys(catalogItem)
  for (let i = 0, len = keys.length; i < len; i++) {
    let keyItem = keys[i]
    let nodeObj = {
      name: keyItem,
      level: 1
    }

    if (catalogItem[keyItem] instanceof Object) {
      nodeObj.open = false
      nodeObj.children = []
      catalogObjQueue.push(catalogItem[keyItem])
      arrayObjQueue.push(nodeObj.children)
    }

    arrayItem.push(nodeObj)
  }
}

export default CatalogArray
