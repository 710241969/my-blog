import CatalogObj from './init-catalog-obj'

let CatalogArray = []

let catalogObjQueue = [CatalogObj]
let arrayObjQueue = [CatalogArray]
let levelQueue = [1]
while (catalogObjQueue.length > 0) {
  let catalogItem = catalogObjQueue.shift()
  let arrayItem = arrayObjQueue.shift()
  let levelItem = levelQueue.shift()

  let keys = Object.keys(catalogItem)
  for (let i = 0, len = keys.length; i < len; i++) {
    let keyItem = keys[i]
    let nodeObj = {
      name: keyItem,
      heightNum: 0,
      level: levelItem
    }

    if (catalogItem[keyItem] instanceof Object) {
      nodeObj.open = false
      nodeObj.children = []
      catalogObjQueue.push(catalogItem[keyItem])
      arrayObjQueue.push(nodeObj.children)
      levelQueue.push(levelItem + 1)
    }

    arrayItem.push(nodeObj)
  }
}

export default CatalogArray
