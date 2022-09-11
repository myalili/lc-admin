<template>
  <div class="flex items-center">
    <el-upload
      class="upload-demo"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      multiple
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-change="handleChange"
      :http-request="customUpload"
      :show-file-list="false"
    >
      <div
        class="btn"
        :style="{ background: !item.isThematic && item.color }"
        :class="{ btn_w: item.color === '#FFFFFF', 'bg-primary': item.isThematic }"
      >
        <codeless-icon class="btn-icon" :icon="item.icon" v-if="item.icon"></codeless-icon>
        <span>{{ item.name }}</span>
      </div>
    </el-upload>
  </div>
</template>

<script>
const { getToken} = window.alcapCoreUtils;
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
      };
    },
  },
  mounted() {},
  data() {
    return {
      fileList: [],
      dataValue: [],
    };
  },
  methods: {
    async customUpload() {
      const ctx = this;
      // const formData = new FormData();
      // ctx.fileList.map((i) => {
      //   formData.append("file", i.raw);
      // });
      let res = await pipe.entity.getEntityDetail(ctx.item.entityId);
      const { dbExportUpload, dataSourceExportUpload } = window.getBffApi();
      const urlMap = {
        'db': dbExportUpload,
        'data_source': dataSourceExportUpload
      }
      const file = ctx.fileList.map(i=>i.raw);

      urlMap[res.type]({ entityId: res.id, file }).then((res) => {
        if (res.success) {
          this.$message({
            message: "导入成功！",
            type: "success",
          });
          ctx.fileList = []
          ctx.$emit('handleChange')
        } else {
          this.$message.error(res.msg);
          ctx.fileList = []
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log("handleChange", fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log(this.fileList);
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleSuccess(response, file, fileList) {},
  },
};
</script>

<style lang="less" scoped>
.btn {
  width: fit-content;
  height: 28px;
  padding: 0 20px 0 16px;
  opacity: 1;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 22px;
  color: #ffffff;
  font-size: 14px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff;
  &:hover {
    opacity: 0.7;
  }
  .btn-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
}
</style>