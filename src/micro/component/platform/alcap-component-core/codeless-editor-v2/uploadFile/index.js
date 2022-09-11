import E from 'wangeditor'
const { $, BtnMenu } = E

// 第一，菜单 class ，Button 菜单继承 BtnMenu class
export class uploadFileMenu extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
      const $elem = E.$(
          `<div class="w-e-menu" data-title="上传文件">
              <i class="el-icon-document"></i>
          </div>`
      )
      super($elem, editor)
      this.editor = editor;
  }
  // 菜单点击事件
  clickHandler() {
      // 做任何你想做的事情
      // 可参考【常用 API】文档，来操作编辑器
      const link = document.createElement("input"); //创建a标签
      link.type = 'file'; //a标签添加属性
      link.style.display = "none";
      document.body.appendChild(link);
      link.click(); //执行下载

      // 选中文件
      link.onchange = () => {
        let resultFile = link.files[0];
        let reader = new FileReader();
        reader.readAsText(resultFile,'UTF-8');
        reader.onload = function(e){
          let data = this.result;
        }
        this.uploadFile(resultFile) // 上传文件
        
      }
  }
  uploadFile(resultFile) {
    const editor = this.editor;
    const customUploadFile = editor.config.customUploadFile;

    if (customUploadFile && typeof customUploadFile === 'function') {
      
      customUploadFile(resultFile, (url, name)=> this.insertFile(url, name));
      return  
    }
  }
  insertFile(url, name) {
    // const resultText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;') // Link xss
    // const $elem = $(`<a target="_blank">${resultText}</a>`)
    // const linkDom = $elem.elems[0]
    // // fix: 字符转义问题，https://xxx.org?bar=1&macro=2 => https://xxx.org?bar=1¯o=2
    // linkDom.innerText = text
    // // 避免拼接字符串，带来的字符串嵌套问题：如: <a href=""><img src=1 xx />"> 造成xss攻击
    // linkDom.href = link
    // if (isActive(editor)) {
    //     // 选区处于链接中，则选中整个菜单，再执行 insertHTML
    //     selectLinkElem()
    //     editor.cmd.do('insertElem', $elem)
    // } else {
    //     // 选区未处于链接中，直接插入即可
    //     editor.cmd.do('insertElem', $elem)
    // }
    const editor = this.editor;

    const resultText = name.replace(/</g, '&lt;').replace(/>/g, '&gt;') // Link xss

    const $elem = $(`<a target="_blank" href="${url}">${name}</a>`)
    const linkDom = $elem.elems[0]

    // fix: 字符转义问题，https://xxx.org?bar=1&macro=2 => https://xxx.org?bar=1¯o=2
    linkDom.innerText = name

    // 避免拼接字符串，带来的字符串嵌套问题：如: <a href=""><img src=1 xx />"> 造成xss攻击
    linkDom.href = url
    
    editor.cmd.do(
      'insertHTML',
      `<a target="_blank" href="${url}">${name}</a>`
    )
  }
  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true

    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // // 2. this.this.isActive === false
    // this.unActive()
  }
}