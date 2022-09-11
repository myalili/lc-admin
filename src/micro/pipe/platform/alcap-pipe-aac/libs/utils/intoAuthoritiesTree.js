import { classifyList, reduceToTree  } from './listTools'

export function intoAuthoritiesTree(data) {
  // 将其转成树
  // parentId
  // id
  // 先根据平台分类，再更具id分类，再
  const typeMap = classifyList(data)
  return Object.keys(typeMap).map(key => {
    const classifyMap = classifyList(typeMap[key], 'parentId')
    return {
      id: '--' + key + '--',
      name: key,
      children: reduceToTree(classifyMap.__root__ || [], classifyMap)
    }
  })
}

export function checkIndeterminate(data) {
  if (!data.isWrapper) {
    return 0
  }
  if (data.children.length === 0) {
    return data.checked ? 2 : 0
  }
  let result = data.children.reduce((reuslt, item) => {
    return reuslt + checkIndeterminate(item)
  }, 0)
  return result > 0 ? result === data.children.length * 2 ? 2 : 1 : 0
}

export function intoTreeWrapper(tree, selectedMap) {
  if (!Array.isArray(tree)) {
    return []
  }
  return tree.map(item => {
    const children = intoTreeWrapper(item.children, selectedMap)
    let result = item
    if (!item.isWrapper) {
      result = {
        id: item.id,
        isWrapper: true,
        checked: selectedMap[item.id],
        indeterminate: false,
        data: { ...item, children: undefined },
        children
      }
    }
    const i = checkIndeterminate(result)
    result.indeterminate = i === 1
    result.checked = i === 2
    return result
  })
}

export function wrapperTreeIntoMap(tree) {
  if (!Array.isArray(tree)) {
    return {}
  }
  return tree.reduce((result, item) => {
    result = {
      ...result,
      [item.id]: {
        id: item.id,
        isWrapper: true,
        checked: item.checked,
        indeterminate: item.indeterminate,
      },
      ...wrapperTreeIntoMap(item.children)
    }
    return result
  }, {})
}

export function intoSelectedWrapper(tree, selectedMap) {
  const wrapperTree = intoTreeWrapper(tree, selectedMap)
  return wrapperTreeIntoMap(wrapperTree)
}

export function authorityChange(data, selectedMap, checked) {
  const hasChild = Array.isArray(data.children) && data.children.length > 0
  selectedMap[data.id] = checked
  if (hasChild) {
    data.children.forEach(item => {
      selectedMap = authorityChange(item, selectedMap, checked)
    })
  }
  return { ...selectedMap }
}
