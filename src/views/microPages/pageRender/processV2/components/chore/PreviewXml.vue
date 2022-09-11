<!-- 逻辑节点配置页面 -->
<template>
  <el-container class="PreviewXml">
    <el-main style="padding: 0;">
      <CodeEditor :options="options" v-model="AParams.xml"></CodeEditor>
    </el-main>
    <el-footer style="text-align: right; height: auto !important; padding: 10px 20px 20px;">
      <el-button type="primary" @click="close()">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import CodeEditor from '../common/CodeEditor';

export default {
  name: 'PreviewXml',
  mixins:[window.V8.mixins],
  components: {
    CodeEditor
  },
  data() {
    return {
      logicCodeActiveTab: 'codeOutput',
      options: {
        readOnly: true,
        mode: 'xml'
      }
    };
  }
};
</script>

<style lang="scss">
.el-dialog .PreviewXml {
  .el-main {
    height: 500px
  }
}
</style>
