<template>
  <div class="flex items-center upload">
    <el-upload
      class="upload-demo"
      :headers="headers"
      :on-preview="handlePreview"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :file-list="dataValue"
      :on-change="handleChange"
      :http-request="customUpload"
      disabled
    >
      <span>附件({{ dataValue.length }})</span>
    </el-upload>
  </div>
</template>

<script>
const { getToken} = window.alcapCoreUtils;
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ATextUpload",
  props: {
    multiple: {
      type: Boolean,
      default: false,
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
    action() {
      return `${axios.bff}/file/upload`;
    },
    headers() {
      return {
        Authorization: "Bearer " + getToken(),
      };
    },
  },
  mounted() {
    if (this.value) {
      const jsonObj = JSON.parse(this.value.replaceAll("&quot;", '"'));
      console.log('this.dataValue', jsonObj);
      this.dataValue.push(jsonObj);
    }
  },
  watch: {
    dataValue: {
      handler(n, o) {
        if (n) {
          let data = n
            .map((i) => {
              return JSON.stringify(i);
            })
            .toString();
          this.$emit("update:value", data);
        }
      },
    },
  },
  data() {
    return {
      fileList: [],
      dataValue: [],
    };
  },
  methods: {
    customUpload() {
      const ctx = this;
      const { upload } = window.getBffApi();

      const file = ctx.fileList.map((i) => i.raw);
      upload({ module: "keguan", file }).then((res) => {
        console.log("this.dataValue", this.dataValue);
        this.dataValue.push({
          name: res[0].name,
          path: res[0].path,
        });

        this.$message({
          message: "上传成功！",
          type: "success",
        });
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

      let url = `${axios.bff}/file/download?filePath=${file.path}`;
      let link = document.createElement("a"); //创建a标签
      link.style.display = "none"; //将a标签隐藏
      link.href = url; //给a标签添加下载链接
      link.setAttribute("download", file.name); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
      document.body.appendChild(link);
      link.click();
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
.upload {
  .upload-demo {
    ::v-deep .el-upload-list {
      .el-upload-list__item {
        .el-icon-close {
          font-size: 0;
        }
      }
    }
  }
}
</style>