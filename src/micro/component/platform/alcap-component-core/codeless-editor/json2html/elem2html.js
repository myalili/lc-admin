/**
 * @description elem -> html
 * @author wangfupeng
 */

import { Editor } from 'slate'
import node2html from './node2html'
import { ELEM_TO_HTML_CONF, STYLE_TO_HTML_FN_LIST } from './index'

/**
 * 默认的 toHtml 函数
 * @param elemNode elem node
 * @param childrenHtml children html
 * @param editor editor
 */
function defaultParser(elemNode, childrenHtml, editor) {
  const isInline = editor.isInline(elemNode)
  const tag = isInline ? 'span' : 'div'
  return `<${tag}>${childrenHtml}</${tag}>`
}

/**
 * 根据 type 获取 toHtml 函数
 * @param type node.type
 */
function getParser(type) {
  const fn = ELEM_TO_HTML_CONF[type]
  return fn || defaultParser
}

function elemToHtml(elemNode, editor) {
  const { type = '', children = [] } = elemNode
  const isVoid = Editor.isVoid(editor, elemNode)

  // 计算 children html
  let childrenHtml = ''
  if (!isVoid) {
    // 非 void node
    childrenHtml = children.map(child => node2html(child, editor)).join('')
  }

  // 生成 html
  const toHtmlFn = getParser(type)
  let elemHtml = toHtmlFn(elemNode, childrenHtml, editor)

  // 添加样式（如 text-align line-height 等）
  if (!isVoid) {
    STYLE_TO_HTML_FN_LIST.forEach(fn => (elemHtml = fn(elemNode, elemHtml)))
  }

  return elemHtml
}

export default elemToHtml
