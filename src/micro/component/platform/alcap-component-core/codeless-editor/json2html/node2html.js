/**
 * @description node -> html
 * @author wangfupeng
 */

 import { SlateEditor, SlateNode, SlateElement, SlateText } from '@wangeditor/editor'
import elemToHtml from './elem2html'
import textToHtml from './text2html'

function node2html(node, editor) {
  console.log(SlateElement);
  if (SlateElement.isElement(node, editor)) {
    // elem node
    return elemToHtml(node, editor)
  } else {
    // text node
    return textToHtml(node, editor)
  }
}

export default node2html
