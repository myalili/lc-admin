<template>
  <div>
    <el-upload
      action="#"
      accept="image/*"
      list-type="picture-card"
      :auto-upload="false"
      ref="upload"
    >
      <div slot="default">
        <i class="el-icon-plus"></i>
      </div>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>

          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <!-- <el-button type="primary" @click="submitUpload1">上传</el-button> -->

    <el-dialog 
     
      :visible="true" 
      v-if='dialogVisible' 
      :close-on-click-modal="false" 
      custom-class="no-header-and-footer-dialog" 
      :append-to-body="true">
     <codeless-dialog-ctn
              class="ctn-height"
              title="图片预览"
              @close="dialogVisible = false" 
              :hideFooter = 'true'
              >
        <template v-slot:dialogContent>
           <img :src="dialogImageUrl" alt="" />
        </template>
       
     </codeless-dialog-ctn>
     

    </el-dialog>
    <!-- <input style="width: 74px;" type="file" id="uFile" name="uFile" @change="upload($event)"/> -->
  </div>
</template>
<script>
const { saveTemplate,getNpmLibs } = window.getArmApi();
const {getAlcapPlatformVersion} = window.alcapCoreUtils

export default {
  name: 'uploadTemp',
  mixins:[window.codelessMixins.customDialog],
  props: {
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file) {
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(
        (item) => file.uid !== item.uid
      );
    },
    handlePictureCardPreview(file) {
      let ctx =this;
      ctx.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async upload() {
      if(!window.alcapConfig.needArm){
        return 
      }
      let ctx = this;
      let files = ctx.$refs.upload.uploadFiles;
      if (!files.length) {
        ctx.$notify({
          message: "至少上传一张图片",
          title: "提示",
          type: "warning",
        });
        return;
      }
      let type = ctx.params.type;
      let page = ctx.params.data;
      let formData = new FormData();
      // let allMenus = ctx.$store.state.application.allMenus;
      // let menus = allMenus.find((item) => item.id === ctx.params.id);
      let content = [page];
      // console.log(content)
      if (type !== "page") {
         let allMenus = await ctx.$store.dispatch("page/getReleasePageList",{
           tenantId:ctx.$store.getters['user/tenantId'],
           origin:true//返回原始数据
         });
         
        let i = -1,
          item;
        while ((item = content[++i])) {
          let ms = allMenus.filter((m) => m.parentId === item.id);
          if (ms.length) {
            content=[...content,...ms]
          }
        }
      }
      // console.log(content)

      let scope = `@alcap-${type}-template`;
      let name = `${scope}/${page.prototypeId}`;
      let scopeRes = await getNpmLibs({
        scope,
        version:getAlcapPlatformVersion(2)
      });
      let currentTemp;
      if (scopeRes.success) {
        currentTemp = scopeRes.content.find((item) => item.name === name);
      }
      let version = "1.0.0";
      if (currentTemp) {
        let versionArr = currentTemp.version.split(".");
        versionArr[versionArr.length - 1] =
          Number(versionArr[versionArr.length - 1]) + 1;
        version = versionArr.join(".");
      }
      let screenshots = [];
      for (let i = -1, item; (item = files[++i]); ) {
        let nameArr = item.name.split(".");
        let ext = nameArr[nameArr.length - 1];
        let index = i;
        let ipath = `screenshots/${page.prototypeId}${i}.${ext}`;
        if (i === 0) {
          ipath = `${page.prototypeId}.${ext}`;
          index = "";
        }
        formData.append("picture" + index, item.raw);

        screenshots.push(ipath);
      }
      let info = {
        package: {
          name: name,
          version: version,
          description: page.name,
          main: "index.js",
          icon: page.icon,
          scripts: {
            test: 'echo "Error: no test specified" && exit 1',
          },
          keywords: [],
          author: "",
          license: "ISC",
          screenshots,
        },
        content: content,
      };
      formData.append("info", JSON.stringify(info));
      let res = await saveTemplate(formData);
      if (res.success) {
        ctx.$notify({
          message: "发布模板成功",
          title: "成功",
          type: "success",
        });
      }
      return true;
    },
  },
};
</script>

<style lang = "less" scoped>
  .ctn-height{
    height:600px
  }
</style>