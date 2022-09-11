

/**
 * 将列表转成树
 * @param {Array} list 
 * @param {String?} key 
 * @returns 
 */
export const listToMap = (list = [], key = 'id', valueFn = item => item) =>{
  return list.reduce((result, item) => {
    if (typeof valueFn === 'function') {
      result[item[key]] = valueFn(item)
    } else {
      result[item[key]] = valueFn ? item[valueFn] : item
    }
    return result
  }, {})
}
