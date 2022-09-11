<template>
  <div class="v2-a-article w-full h-full p-2">
    <!-- <mavon-editor v-model="value" defaultOpen="preview" :subfield="false" /> -->
    <div id="toolbar-container" class="hidden"></div>
    <div class="article-html" v-html="articleValue"></div>
    <div id="editor-container" style="height: 100%"></div>
    <!-- <textarea id="textarea"></textarea> -->
  </div>
</template>

<script>
import pck from "./package.json";
// import { createEditor } from "@wangeditor/editor";
import E from 'wangeditor'

export default {
  name: "v2AArticle",
  inject: ['root'],
  _options: pck.docs,
  components: {
    
  },

  props: {
    content: {
      type: Object,
      default: ()=> {
        return {
          entityId: '',
          value: '',
          syncParam: '',
          type: 'entity'
        }
      }
    },
  },

  data() {
    return {
      entityValue: '',
      jsonHtml: '',
      editor: null
    };
  },

  watch: {
    "content.entityId": {
      handler(n) {
        if (n) {
          this.getEntityData(n)
        }
      },
      immediate: true
    },
  },

  mounted() {

  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  },
  computed: {
    articleValue() {
      const contentMap = {
        'entityId': this.entityValue,
        'value': this.content.value,
        'syncParam': this.getRootKey()
      }
      for (const key in contentMap) {
        if (this.content[key]) {
          console.log('this.contentMap[key]', contentMap);
          if (key === 'syncParam') {
            return this.jsonHtml
          }
          return contentMap[key]
        }
      }
    }
  },

  methods: {
    getEntityData(id) {
      const ctx = this;
      pipe.entity
        .getEntityData(id, pck.docs.schemaType)
        .then((res) => {
          if (res) {
            ctx.$notify({
              message: operationTypeMap.get(operationType) + "成功！",
              title: "成功",
              type: "success",
            });
            ctx.entityValue = res.response && res.response.content;
          }
        })
    },
    getRootKey(e, val) {
      const param = this.content.syncParam
      if (!param) return
      let p = param.substring(0,param.indexOf('.'));
      let c = param.substring(param.indexOf('.') + 1);
      if (val) {
        this.root.args[p][c] = val
      }
      console.log('页面获取到的参数是什么', this.root.args[p][c]);
      this.j2html(this.root.args[p][c])
      return this.root.args[p][c]
    },
    j2html(data) {
      if(!data) return;
      const ctx = this;
      let jsonData = null
      if (data.indexOf('{') && JSON.parse(data.replaceAll('&quot;', "\""))) {
        jsonData = JSON.parse(data.replaceAll('&quot;', "\""))
      }

      ctx.$nextTick(()=> {
        ctx.editor = new E('#toolbar-container', '#editor-container');
        ctx.editor.onChange = newHtml => {
          ctx.jsonHtml = newHtml;
          document.getElementById('textarea').value = jsonHtml;
        }

        ctx.editor.create();

        console.log('jsonData', jsonData);
        ctx.editor.txt.setJSON(jsonData)
        ctx.editor.disable();
        })
    }

  }
};
</script>
