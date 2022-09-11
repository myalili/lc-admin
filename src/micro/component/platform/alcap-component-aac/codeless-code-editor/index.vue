
<template>
  <div
    class="code-editor"
    :class="{ 'full-screen': isFullScreen, 'hide-right-menu': !showRightMenu }"
  >
    <div class="code-editor-statusbar code-editor-statusbar-top">
      <div class="code-editor-toolbar">
        <el-button
          type="text"
          class="el-icon-brush"
          title="切换主题"
          @click="switchTheme()"
        ></el-button>
        <el-button
          type="text"
          class="el-icon-search"
          title="查找/替换"
          @click="find()"
        ></el-button>
        <el-button
          type="text"
          class="el-icon-magic-stick"
          title="格式化代码"
          @click="formatCode()"
        ></el-button>
        <el-button
          type="text"
          class="el-icon-remove-outline"
          title="全部折叠"
          @click="foldAll()"
        ></el-button>
        <el-button
          type="text"
          class="el-icon-circle-plus-outline"
          title="全部展开"
          @click="unfoldAll()"
        ></el-button>
        <el-button
          type="text"
          :class="{
            'el-icon-full-screen': !isFullScreen,
            'el-icon-switch-button': isFullScreen,
          }"
          :title="isFullScreen ? '退出全屏' : '全屏'"
          @click="fullscreen()"
        ></el-button>
      </div>
    </div>
    <div class="code-editor-content" ref="target"></div>
    <div class="code-editor-statusbar code-editor-statusbar-bottom">
      <div class="code-editor-status">第 {{ line }} 行，{{ col }} 列</div>
    </div>
    

    <!-- <div class="extension-dialog" ref="extension-dialog">

    </div> -->
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { Gesture } from "monaco-editor/esm/vs/base/browser/touch";

let currentTheme = 0;
let themeList = ["vs", "vs-dark", "hc-black"];

export default {
  name: "codeEditor",
  components: {
   
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    lang: {
      type: String,
      default: "javascript",
    },
    modelId: {
      default: "",
    },
    showRightMenu: {
      type: Boolean,
      default: true,
    },
    insertCode: {
      default: "",
    }
  },
  data() {
    return {
      editor: null,
      line: 0,
      col: 0,
      isFullScreen: false,
      actions: [],
      actionConfig: {},
      documentCode: '', // 文档的代码
      extensionVM: []
    };
  },
  computed: {
    monacoTheme() {
      return themeList[currentTheme]
    }
  },
  methods: {
    initMonaco() {
      if (this.editor) {
        this.$refs.target.innerHTML = "";
      }
      this.editor = monaco.editor.create(this.$refs.target, {
        value: this.value,
        scrollBeyondLastLine: false,
        language: this.lang,
        theme: themeList[currentTheme],
        wordBasedSuggestions: false, // 目前无效 https://github.com/microsoft/monaco-editor/issues/1498
      });
      this.__inputedValue = this.value;
      this.editor.setValue(this.value);
      this.formatCode();
      this.editor.onDidChangeModelContent((_) => {
        let new_value = this.editor.getValue();
        // if (new_value !== this.__inputedValue) {//不注释的话数据篮子二次修改为0时无法保存，无法刷新绑定值
          this.$emit("input", new_value);
        // }
        this.$emit("change", new_value); // after input
      });
      this.editor.onDidChangeCursorPosition((ev) => {
        this.line = ev.position.lineNumber;
        this.col = ev.position.column;
      });
      
    //  codeEditor.rightMenu

      // 拓展自定义菜单
      // const extension = IDE.activator.get('v2sual.codeEditor.rightClickMenu')
      // if (extension) {
      //   console.log(extension)
      //   for (const key in extension) {
      //     extension[key](this, this.$store)
      //   }
      // }
    },

    resize() {
      // this.initMonaco()
      this.editor.layout();
    },
    fullscreen() {
      
      this.isFullScreen = !this.isFullScreen;

      this.$emit("fullScreen");
      
    },
    formatCode() {
      if (!this.editor) {
        return;
      }
      this.editor.getAction("editor.action.formatDocument").run();
      this.editor.getAction(["editor.action.formatDocument"])._run();
    },
    find() {
      if (!this.editor) {
        return;
      }
      this.editor.getAction("actions.find").run();
    },
    foldAll() {
      if (!this.editor) {
        return;
      }
      this.editor.getAction("editor.foldAll").run();
    },
    unfoldAll() {
      if (!this.editor) {
        return;
      }
      this.editor.getAction("editor.unfoldAll").run();
    },
    switchTheme() {
      currentTheme = (currentTheme + 1) % themeList.length;
      monaco.editor.setTheme(themeList[currentTheme]);
    },
    addDeltaDecorations(info) {
      const range = new monaco.Range(info.row, info.start, info.row, info.end);
      return this.editor.deltaDecorations(
        [],
        [
          {
            range,
            options: { inlineClassName: "myInlineDecoration" },
          },
        ]
      );
    },
    highLightText(result = [], oldDeltaDecorations) {
      monaco.languages.register({ id: this.lang });
      // 先清空所有
      // this.editor.deltaDecorations(oldDeltaDecorations, [])
      return result.map((info) => {
        // this.addContentWidget(info);
        return this.addDeltaDecorations(info);
        // this.registerHoverEvent(range, info);
      });
    },
    registerHoverEvent(range, info) {
      monaco.languages.registerHoverProvider(this.lang, {
        provideHover: function (model, position) {
          const flag =
            position.lineNumber === info.row &&
            position.column >= info.start &&
            position.column <= info.end;
          if (flag) {
            return {
              range,
              contents: [
                { value: "**提示**" },
                {
                  value:
                    "连续访问有可能出现空指针风险，请确保代码正确。",
                },
              ],
            };
          }
          return null;
        },
      });
    },
    highLightTextChange({ result, deltaDecorations }) {
      const newVal = this.editor.getValue();
      const newValArr = newVal.split("\n");
      const newDeltaDecorations = [...deltaDecorations];
      if (this.line > 0 && this.col > 0) {
        result.forEach((info, index) => {
          const flag =
            this.line === info.row &&
            this.col >= info.start - 1 &&
            this.col <= info.end + 1;
            console.log('flag', flag);
          if (flag) { 
            // 在指定区域文本的改变
            // console.log('1111', newValArr[this.line - 1].indexOf(info.code) !== -1);
            // 清空之前高亮的样式
            const oldDecorations = deltaDecorations[index];
            newDeltaDecorations[index] = this.editor.deltaDecorations([oldDecorations], []); //要保存返回值
            // console.log('lineCOde', newValArr[this.line - 1]);
            // console.log('info.code', info.code);
            if (newValArr[this.line - 1].indexOf(info.code) !== -1) {
              // 恢复高亮
              newDeltaDecorations[index] = this.addDeltaDecorations(info);
            }
          }
        });
      }
      return newDeltaDecorations;
    },
    resetValue() {
      this.editor.setValue(this.value);
    },
    addContentWidget(info) {
      const warningContentWidget = {
        domNode: null,
        getId: function () {
          return "my.content.widget";
        },
        getDomNode: function () {
          if (!this.domNode) {
            this.domNode = document.createElement("div");
            this.domNode.innerHTML =
              "这是一段错误原因语句，具体内容根据实际使用需要修改内容；";
            this.domNode.style.background = "#fff";
          }
          return this.domNode;
        },
        getPosition: function () {
          return {
            position: {
              lineNumber: info.row,
              column: Math.floor(info.end / 2),
            },
            preference: [monaco.editor.ContentWidgetPositionPreference.BELOW],
          };
        },
      };
      this.editor.addContentWidget(warningContentWidget);
    },
  },
  watch: {
    insertCode(code) {
      if (this.editor) {
        let selection = this.editor.getSelection();

        let range = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        );
        let id = { major: 1, minor: 1 };
        let op = {
          identifier: id,
          range: range,
          text: code,
          forceMoveMarkers: true,
        };
        this.editor.executeEdits("my-code", [op]);
        this.editor.focus();
      }
    },
    value(new_value) {
      if (new_value !== this.editor.getValue()) {
        this.__inputedValue = new_value;
        this.editor && this.editor.setValue(new_value);
        //  this.editor.getAction("editor.action.formatDocument").run();
      }
    },
    theme(new_value) {
      monaco.editor.setTheme(new_value);
    },
  },
  created () {

  },
  mounted() {
    // if (this.modelId) {
    //   let viewConfig = IDE.viewRegistry[this.modelId];
    //   if (viewConfig && viewConfig.actions) {
    //     for (let i in viewConfig.actions) {
    //       if (viewConfig.actions[i].type) {
    //         this.actions.push(viewConfig.actions[i]);
    //         console.log(this.actions);
    //       }
    //     }
    //   }
    // }
    

    this.initMonaco();
    try {
      // https://developers.google.com/web/updates/2016/10/resizeobserver
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
      let ob = new ResizeObserver((_) => {
        this.resize();
      });
      ob.observe(this.$refs.target);
      this.__resize_ob = ob;
    } catch (e) {
      console.log(e);
    }
  },
  beforeDestroy() {
    //销毁改善内存
    this.__resize_ob && this.__resize_ob.unobserve(this.$refs.target);
    this.editor && this.editor.dispose();
    // let config = this.editor._contentWidgets["editor.widget.suggestWidget"];
    // let x;
    // if ((x = config && config.widget)) {
    //   x.dispose();
    //   x.elememt = null;
    //   x.editor = null;
    //   x.list.dispose();
    //   x.details.editor = null;
    //   x.details.dispose();
    //   for (let k in x) {
    //     delete x[k];
    //   }
    // }
    for (let k in this.editor) {
      if (this.editor[k] && this.editor[k].dispose) this.editor[k].dispose();
      delete this.editor[k];
    }
    Gesture.INSTANCE && Gesture.INSTANCE.dispose();
    Gesture.INSTANCE = null;

    this.editor = null;
    this.__resize_ob = null;
    
    
  }
};
</script>

<style lang="less" scoped>
.code-editor {
  overflow: visible;
  border: 1px solid hsl(0, 0%, 90%);
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  min-width: 210px;

  &.full-screen {
    position: fixed;
    top: 0;
    right: calc(100% - 34px);
    bottom: 0;
    left: 0;
    z-index: 3;

    &.hide-right-menu {
      right: 0;

      .code-editor-content {
        width: 100%;
      }
      .code-editor-statusbar {
        width: 100%;
      }
    }

    .code-editor-content {
      width: calc(100% - 28px);
    }
    .code-editor-statusbar {
      width: calc(100% - 28px);
    }
    &::v-deep .right-menu {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      border-left: 1px solid #dedee4;
      .toolbar {
        height: auto;
        color: #83949c;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .dialog-rightMenu {
        border-left: none;
        line-height: normal;
        // padding:10px;
      }
    }
  }
}
.code-editor-content {
  height: 100%;
  width: 100%;
  //border: 1px solid hsl(0, 0%, 90%);
  > :first-child {
    /* 强行使 monaco editor 适应容器尺寸 */
    overflow: auto;
    height: 100% !important;
    width: 100% !important;
    > .overflow-guard {
      height: 100% !important;
      width: 100% !important;
    }
  }
}
.code-editor-statusbar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  background-color: #EFF3F6;
  padding: 0px 8px;

  // &.top{
  //     border-top-left-radius:4px;
  //     border-top-right-radius:4px;
  // }

  // &.bottom{
  //     border-bottom-left-radius:4px;
  //     border-bottom-right-radius:4px;
  // }

  //line-height: 18px;

  .code-editor-toolbar {
    line-height: 16px;

    .el-button {
      vertical-align: middle;
      padding: 4px 0;
    }
  }
}

.code-editor-status {
  line-height: 16px;
}
/*
.code-editor-toolbar {
    > button {
        padding: 0px !important;
        line-height: normal !important;
    }
}
*/


</style>

<style lang="scss">
.myInlineDecoration {
  background: #fb8d00;
  cursor: pointer;
  position: relative;
  &:hover {
    &:after {
      content: "连续访问有可能出现空指针风险，请确保代码正确。\n 修改建议: 如a.b.c 改成a && a.b && a.b.c";
      position: absolute;
      display: inline-block;
      width: 370px;
      background: #fff;
      border: 2px solid #f65656;
      border-radius: 6px;
      padding: 16px;
      color: #1d2636;
      font-family: Source Han Sans CN;
      font-weight: 400;
      white-space: pre-wrap;
      overflow: hidden;
      top: 100%;
      left: 0;
      z-index: 999;
    }
  }
}
</style>