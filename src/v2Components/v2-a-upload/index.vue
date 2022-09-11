<template>
  <div class="flex items-center">
    <el-upload
      class="upload-demo"
      :headers="headers"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :multiple="multiple"
      :limit="2"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="dataValue"
      :on-change="handleChange"
      :http-request="customUpload"
    >
      <el-button size="mini" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
const { getToken} = window.alcapCoreUtils;
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AUpload",
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
  },
  mounted() {},
  watch: {
    dataValue: {
      handler(n, o) {
        if (n) {
          let data = n
            .map((i) => {
              return JSON.stringify(i);
            })
            .toString();
            console.log('格式化后的', data);
          this.$emit("update:value", data);
        }
      },
    },
    // value: {
    //   handler(n, o) {
    //     if (n) {
    //       const jsonObj = JSON.parse(this.value.replaceAll("&quot;", '"'));
    //       this.dataValue.push(JSON.parse(jsonObj));
    //       console.log('this.dataValue', jsonObj);
    //     }
    //   },
    // },
  },
  data() {
    return {
      fileList: [],
      dataValue: [],
    };
  },
  mounted() {
    if (this.value) {
      const jsonObj = JSON.parse(this.value.replaceAll("&quot;", '"'));
      console.log('this.dataValue', jsonObj);
      this.dataValue.push(jsonObj);
    }
          
  },
  methods: {
    async customUpload() {
      const ctx = this;
      // const { upload } = window.getBffApi();

      const file = ctx.fileList.map((i) => i.raw);
      // upload({ module: "keguan", file }).then((res) => {
      //   console.log("this.dataValue", this.dataValue);
      //   this.dataValue.push({
      //     name: res[0].name,
      //     path: res[0].path,
      //   });

      //   this.$message({
      //     message: "上传成功！",
      //     type: "success",
      //   });
      // });
      console.log('要上传的文件', file);
      const { fileAdd } = window.getBffApi();
      const result = await fileAdd({ tenantId: this.$store.getters['user/tenantId'], file: file[0] });
      if (result.success) {
        this.dataValue.push({
        name: result.obj.name,
        path: result.obj.url,
      });
      console.log('上床陈工',this.dataValue);
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
      this.dataValue = [];
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.dataValue.splice(this.dataValue.findIndex(i=>i.name === file.name));
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(file, fileList) {
      console.log(file,fileList);
      this.dataValue = [];
      this.fileList = fileList;
      this.customUpload()
    },
    handleSuccess(response, file, fileList) {},
  },
};
</script>

<style lang="less" scoped>
</style>