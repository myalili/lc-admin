<template>
  <div class="w-full h-full full-screen-container">
    <div
      id="toolbar-container"
    ></div>
    <div
      id="editor-container"
      style="height: 490px;"
    ></div>
  </div>
</template>

<script>
import { createEditor, createToolbar, IEditorConfig } from "@wangeditor/editor";
import { Boot } from "@wangeditor/editor";

import uploadfile from "./uploadFile";
Boot.registerModule(uploadfile);


export default {
  name: "codelessEditor",
  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    isJson: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    html: {
      get() {
        console.log("富文本内容", this.value);
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.editorInit();
  },
  methods: {
    getEditorConfig() {
      const customUpload = async (file, insertFn) => {
        const { fileAdd } = window.getBffApi();
        const result = await fileAdd({
          tenantId: this.$store.getters["user/tenantId"],
          file,
        });
        if (result.success) {
          insertFn(`${axios.bff}${result.obj.url}`, result.obj.name);
        } else {
          this.$message.error("上传失败");
        }
      };
      return {
        MENU_CONF: {
          uploadImage: { customUpload },
          uploadVideo: { customUpload },
          uploadFile: { customUpload },
        },
      };
    },
    editorInit() {
      this.$nextTick(() => {
        // 自定义上传
        const editorConfig = this.getEditorConfig();

        editorConfig.placeholder = "请输入内容";
        editorConfig.onChange = (editor) => {
          // 当编辑器选区、内容变化时，即触发


          if (this.isJson) {
            this.html = JSON.stringify(editor.children);
          } else {
            this.html = editor.getHtml();
          }

          // const { children = [] } = editor
          // const html = children.map(child => node2html(child, editor)).join('')
          // console.log('json转html', html);
        };

        console.log("初始内容", this.html, this.isJson);

        let jsonData = null;
        let html = null;
        if (this.html) {
          if (this.isJson) {
            jsonData = JSON.parse(this.html.replaceAll("&quot;", '"'));
          } else {
            html = this.html;
          }
        }

        // 创建编辑器
        const editor = createEditor({
          html: html,
          content: jsonData,
          selector: "#editor-container",
          config: editorConfig,
          mode: "default", // 或 'simple' 参考下文
        });

        // 创建工具栏
        const toolbarConfig = {
          insertKeys: {
            index: 22, // 插入的位置，基于当前的 toolbarKeys
            keys: ["uploadFile"],
          },
        };
        const toolbar = createToolbar({
          editor,
          config: toolbarConfig,
          selector: "#toolbar-container",
          mode: "default", // 或 'simple' 参考下文
        });
      });
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.full-screen-container {
    // z-index: 2000; /* 如有需要，可以自定义 z-index */
  }
</style>
