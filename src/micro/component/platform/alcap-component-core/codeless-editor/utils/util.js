
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

/**
 * 替换 html 特殊字符，如 > 替换为 &gt;
 * @param str html str
 */
 export function replaceHtmlSpecialSymbols(str) {
  return str
    .replace(/ /g, '&nbsp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/®/g, '&reg;')
    .replace(/©/g, '&copy;')
    .replace(/™/g, '&trade;')
}

/**
 *【反转】替换 html 特殊字符，如 &gt; 替换为 >
 * @param str html str
 */
export function deReplaceHtmlSpecialSymbols(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&reg;/g, '®')
    .replace(/&copy;/g, '©')
    .replace(/&trade;/g, '™')
}