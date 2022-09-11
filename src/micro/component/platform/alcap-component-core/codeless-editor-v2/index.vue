<template>
  <div class="codeless-editor w-full h-96" >
    <div id="toolbar-container" :class="{ 'hidden': disabled }" class="toolbar" ref="toolbar"></div>
    <div id="text-container" class="text-editor" :style="{ height: editorHeight }"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
import {uploadFileMenu} from './uploadFile'

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
    disabled: {
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
    return {
      editor: null,
      editorHeight: '100%'
    };
  },
  mounted() {
    this.editorInit();

    this.calcHeight();
    window.addEventListener("resize", this.calcHeight);
  },
  methods: {
    calcHeight() {
      this.$nextTick(() => {
        let toolbar = this.$refs.toolbar;
        if (toolbar) {
          let height = toolbar.offsetHeight < 960 ? toolbar.offsetHeight: 80;
          console.log('工具栏的高度', height);
          this.editorHeight = `calc(100% - ${height}px)`;
        }
      });
    },
    getEditorConfig() {
      const ctx = this;
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
      // 上传图片
      ctx.editor.config.customUploadImg;
      ctx.editor.config.uploadImgMaxSize = 10 * 1024 * 1024;
      ctx.editor.config.customUploadImg = customUpload;

      // 上传视频
      ctx.editor.config.customUploadVideo = customUpload;
      
      // 上传文件 
      ctx.editor.config.customUploadFile = customUpload;
    },
    editorInit() {
      const ctx = this;
      ctx.editor = new E('#toolbar-container', '#text-container');
      ctx.editor.config.zIndex = 500;

      ctx.getEditorConfig();

      ctx.editor.menus.extend('uploadFile', uploadFileMenu);
      ctx.editor.config.menus = ctx.editor.config.menus.concat('uploadFile')
      
      ctx.editor.config.onchange = newHtml => {
            //为了解决实时显示编辑器内容

        if (ctx.isJson) {
          ctx.html = JSON.stringify(ctx.editor.txt.getJSON());
        } else {
          ctx.html = newHtml;
        }
      }

      console.log("初始内容", ctx.html, ctx.isJson);

      ctx.editor.create();
    
      // let jsonData = null;
      // let html = null;
      if (ctx.html) {
        if (ctx.isJson) {
          // jsonData = JSON.parse(ctx.html.replaceAll("&quot;", '"'));
          ctx.editor.txt.setJSON(JSON.parse(ctx.html.replaceAll("&quot;", '"')))
        } else {
          // html = ctx.html;
          ctx.editor.txt.html(ctx.html);
        }
      }

      if(ctx.disabled) {
        ctx.editor.disable();
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calcHeight);
    this.editor.destroy()
    this.editor = null
  },
};
</script>

<style lang="scss" scoped>
.codeless-editor {
}
.full-screen-container {
    // z-index: 2000; /* 如有需要，可以自定义 z-index */
  }
</style>
