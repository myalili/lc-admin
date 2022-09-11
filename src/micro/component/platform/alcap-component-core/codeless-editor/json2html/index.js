
// ------------------------------------ style to html ------------------------------------

export const styleToHtmlFnType = (node, elemHtml) => string

export const STYLE_TO_HTML_FN_LIST = []

/**
 * 注册 toHtml 处理文本样式的函数
 * @param fn 处理 toHtml 文本样式的函数
 */
export function registerStyleToHtmlHandler(fn) {
  STYLE_TO_HTML_FN_LIST.push(fn)
}

// ------------------------------------ elem node to html ------------------------------------

export let ElemToHtmlFnType = (
  elemNode,
  childrenHtml,
  editor
) => string

// 注册 element->html 配置
export const ELEM_TO_HTML_CONF = {
  key: ElemToHtmlFnType
} = {}

/**
 * 注册 elem to html 函数
 * @param conf { type, elemToHtml } ，type 即 node.type
 */
export function registerElemToHtmlConf(conf) {
  const { type, elemToHtml } = conf
  const key = type || ''

  // key 如果重复了，就后者覆盖前者
  ELEM_TO_HTML_CONF[key] = elemToHtml
}
