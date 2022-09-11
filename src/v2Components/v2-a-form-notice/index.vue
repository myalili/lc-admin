<template>
  <div class="v2-a-article w-full h-full p-2">

    <div id="toolbar-container111" class="hidden"></div>
    <div id="editor-container321" class=" overflow-scroll z-50" style="height: 90%" ></div>

    <div class="flex items-center justify-center w-full">
      <el-checkbox size="mini" :checked="vModel">
      </el-checkbox>
      <span style="margin-left:12px;" @click.stop="vModel = true" >
        同意
        <span class=" cursor-pointer text-primary" @click="openDialog = true">《{{ title }}》</span>
      </span>
    </div>

    <text-dialog :visible.sync="openDialog" :value.sync="dialogContent" :title="title" v-if="openDialog" />
  </div>
</template>

<script>
import pck from "./package.json";
// import { createEditor } from "@wangeditor/editor";
import E from 'wangeditor'

import textDialog from './dialog.vue';

export default {
  name: "v2AArticle",
  inject: ['root'],
  _options: pck.docs,
  components: {
    textDialog
  },

  props: {
    textarea: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    dialogContent: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    value: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    title: {
      type: String,
      default: ()=> {
        return '';
      }
    },
  },

  data() {
    return {
      editor: null,
      openDialog: false
    };
  },

  mounted() {
    this.custom();
  },
  beforeDestroy() {
    if(!this.editor) return
    this.editor.destroy()
    this.editor = null
  },

  methods: {
    custom() {
      const ctx  = this;
      ctx.editor = new E('#toolbar-container111', '#editor-container321');
      console.log('ctx.editor', ctx.editor);
        ctx.editor.onChange = newHtml => {
          console.log(newHtml);
        }
        ctx.editor.config.zIndex = 500
        ctx.editor.create();
        ctx.editor.txt.html(ctx.textarea)
        ctx.editor.disable();
    }

  }
};
</script>
