/**
 * 对象数组分类，返回指定对象字段值的对象
 * @param {Array} data
 * @param {String?} type 根据某个字段分类
 * @param {String?} defaultType 如果字段不存在，则存放的分类
 */
 export function classifyList(data = [], type = 'type', defaultType = '__root__') {
  return data.reduce((reuslt, item) => {
    const itemType = item[type] || defaultType
    if (!reuslt[itemType]) {
      reuslt[itemType] = []
    }
    reuslt[itemType].push(item)
    return reuslt
  }, {})
}


export function reduceToTree(array, childrenMap) {
  return array.map(item => {
    const children = reduceToTree(childrenMap[item.id] || [], childrenMap)
    return { ...item, children }
  })
}

/**
 * 数组转成树
 * @param {Array} array
 * @param {String} parentKey 表示父类键
 * @param {any} root 父类id
 */
export function listToTree(array, parentKey = 'parentId', root = '__root__') {
  const typeMap = classifyList(array, parentKey)
  // 有根
  if (typeMap[root]) {
    return reduceToTree(typeMap[root], typeMap)
  } else if(typeMap.__root__) {
    return reduceToTree(typeMap.__root__, typeMap)
  } else {
    return array
  }
}

/**
 * 将列表转成树
 * @param {Array} list 
 * @param {String?} key 
 * @returns 
 */
// export function listToMap(list = [], key = 'id', valueFn = item => item) {
//   return list.reduce((result, item) => {
//     if (typeof valueFn === 'function') {
//       result[item[key]] = valueFn(item)
//     } else {
//       result[item[key]] = valueFn ? item[valueFn] : item
//     }
//     return result
//   }, {})
// }

export function treeFindNode(tree, callback = () => false, childrenField = 'children') {
  if (!Array.isArray(tree)) {
    return undefined
  }
  for (let item of tree) {
    if (callback(item)) {
      return item
    }
    const result = treeFindNode(item[childrenField], callback, childrenField)
    if (result) {
      return result
    }
  }
  return undefined
}