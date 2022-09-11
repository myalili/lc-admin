import { Editor, Transforms } from 'slate'
import { IButtonMenu, IDomEditor, DomEditor, t } from '@wangeditor/core'
import { UPLOAD_FILE_SVG } from '../../constants/icon-svg'
import uploadFile from '../upload-file'

class uploadFileMenu {
  title = t('上传文件')
  iconSvg = UPLOAD_FILE_SVG
  tag = 'button'
  getValue(editor) {
    // 用不到 getValue
    return ''
  }

  isActive(editor) {
    const node = DomEditor.getSelectedNodeByType(editor, 'uploadFile')
    return !!node
  }

  isDisabled(editor) {
    if (editor.selection == null) return true

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => {
        const type = DomEditor.getNodeType(n)

        // 只可用于 p 和 uploadFile
        if (type === 'paragraph') return true
        if (type === 'uploadFile') return true

        return false
      },
      universal: true,
      mode: 'highest', // 匹配最高层级
    })

    // 匹配到 p uploadFile ，不禁用
    if (nodeEntry) {
      return false
    }
    // 未匹配到，则禁用
    return false
  }

  getMenuConfig(editor) {
    // 获取配置，见 `./config.js`
    return editor.getMenuConfig('uploadFile')
  }

  /**
   * 执行命令
   * @param editor editor
   * @param value node.type
   */
  exec(editor, value) {
    const { allowedFileTypes = [] } = this.getMenuConfig(editor)

    // 设置选择文件的类型
    let acceptAttr = ''
    if (allowedFileTypes.length > 0) {
      acceptAttr = `accept="${allowedFileTypes.join(', ')}"`
    }

    // 添加 file input（每次重新创建 input）
    const link = document.createElement("input"); //创建a标签
    link.type = 'file'; //a标签添加属性
    link.style.display = "none";
    document.body.appendChild(link);
    link.click(); //执行下载

    // 选中文件
    link.onchange = () => {
      let resultFile = link.files[0];
      // let reader = new FileReader();
      // reader.readAsText(resultFile,'UTF-8');
      // reader.onload = function(e){
      //   let data = this.result;
      //   console.log(data);
      // }
      uploadFile(editor, resultFile) // 上传文件
    }
  }
}

export default uploadFileMenu
