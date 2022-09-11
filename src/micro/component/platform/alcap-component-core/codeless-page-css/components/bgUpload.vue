<template>
  <div class=" bg-upload">
    <el-upload
      class="upload-demo"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :multiple="false"
      :limit="1"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="dataValue"
      :on-change="handleChange"
      :http-request="customUpload"
      ref="upload"
    >
      <div class="h-full w-full flex flex-col justify-center items-center">
        <el-button type="primary" size="mini" icon="el-icon-plus" circle class=" w-7 h-7 mb-4"></el-button>
        <span class=" h-5 text-sm">上传图片</span>
      </div>
    </el-upload>
    <p class=" mt-3" v-if="dataValue.length < 1">建议图片尺寸：1920x1080</p>
    <p class=" mb-10" v-if="dataValue.length < 1">支持jpg/png，尺寸不超过2MB</p>
  </div>
</template>

<script>
const { getToken} = window.alcapCoreUtils;
export default {
  mixins: [ window.codelessMixins.customDialog ],
  props: {
    multiple: {
      type: Boolean,
      default: true,
    },
    tip: {
      type: String,
      default: () => {
        return "";
      },
    },
    value: {
      default: () => {
        return "";
      },
    },
    url: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
      };
    },
    uploadImg: {
      get() {
        return this.dataValue
      }
    }
  },
  mounted() {
    this.checkLimit();
  },
  watch: {
    dataValue: {
      handler(n, o) {
        if (n) {
          this.$emit("update:value", n[0]);
        }
      },
    },
    value: {
      handler(n, o) {
        if (n && n?.url !== o?.url) {
          this.dataValue = [ this.value ];
        }
      },
      immediate: true
    },
  },
  data() {
    return {
      fileList: [],
      dataValue: [],
      dialogVisible: false,
      dialogImageUrl: ''
    };
  },
  methods: {
    checkLimit() {
      const limit = 1
      const uploadDom = this.$refs['upload']
      if (this.dataValue.length === limit) {
        uploadDom.$children[1].$el.style.display = 'none'
      } else {
        uploadDom.$children[1].$el.style.display = ''
      }
    },
    async customUpload() {
      const ctx = this;
      // const { upload } = window.getBffApi();

      const file = ctx.fileList.map((i) => i.raw);

      console.log('要上传的文件', file);
      const { fileAdd } = window.getBffApi();
      const result = await fileAdd({ tenantId: this.$store.getters['user/tenantId'], file: file[0] });
      if (result.success) {
        this.dataValue.push({
        name: result.obj.name,
        url: axios.bff + result.obj.url
      });
      this.$message({
        message: "上传成功！",
        type: "success",
      });
      }else {
        this.$message.error("上传失败");
      }

          
    },
    handleChange(file, fileList) {
      this.fileList = [ fileList[fileList.length - 1] ];
      console.log("handleChange", fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.dataValue.splice(this.dataValue.findIndex(i=>i.name === file.name));
      this.checkLimit()
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log('file', file);
      this.openCustomDialog({
        title: '预览',
        path: "deleteConfirm",
        width: '70%',
        component: {
          template: `<img src="${file.url}" />`,
        },
      });
    },
    handleExceed(file, fileList) {
      console.log(file,fileList);
      this.dataValue = [];
      this.fileList = fileList;
      this.customUpload()

    },
    handleSuccess(response, file, fileList) {
      this.checkLimit()
    },
  },
};
</script>

<style lang="less" scoped>
.bg-upload {
  ::v-deep .el-upload--picture-card {
    width: 240px;
    height: 135px;
    background: rgba(247,250,251,0.39);
    border: 1px dashed #C8D0D4;
    opacity: 1;
    border-radius: 4px;
    i {
      font-size: 8px;
      font-weight: bold;
      color: white;
    }
  }
  ::v-deep .el-upload-list {
    .el-upload-list__item {
      width: 240px;
      height: 135px;
    }
  }
  p {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 21px;
    color: #7F8C93;
    opacity: 1;
  }
}
</style>