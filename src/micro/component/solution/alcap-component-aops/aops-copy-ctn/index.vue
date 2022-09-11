<template>
  <span>
    <template v-if="!right">
      <el-tooltip v-if="showTooltip" effect="dark" :content="content" placement="top" :enterable="false">
        <el-button type="text" icon="el-icon-document-copy" @click.stop="copy(value)" />
      </el-tooltip>
      <el-button v-else type="text" icon="el-icon-document-copy" @click.stop="copy(value)" />
    </template>
    {{ value }}
    <template v-if="right">
      <el-tooltip v-if="showTooltip" effect="dark" :content="content" placement="top" :enterable="false">
        <el-button type="text" icon="el-icon-document-copy" @click.stop="copy(value)" />
      </el-tooltip>
      <el-button v-else type="text" icon="el-icon-document-copy" @click.stop="copy(value)" />
    </template>
  </span>
</template>

<script>
export default {
  name:'CopyCtn',
  props: {
    value: String,
    right: Boolean,
    showTooltip: Boolean,
    content: {
      type: String,
      default: '复制'
    }
  },
  methods:{
    copy(str) {
      const input = document.createElement('input');
      input.value = str;
      document.body.appendChild(input);
      input.select();
      document.execCommand('Copy');
      input.remove();
      this.$message({ message: '拷贝成功', type: 'success' });
    }
  }
};
</script>