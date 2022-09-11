
import { nanoid } from 'nanoid'

/**
 * 获取随机数字符串
 * @param prefix 前缀
 * @returns 随机数字符串
 */
export function genRandomStr(prefix = 'r') {
  return `${prefix}-${nanoid()}`
}

export function replaceSymbols(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
