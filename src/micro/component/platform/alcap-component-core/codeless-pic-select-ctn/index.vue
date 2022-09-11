<template>
  <codeless-dialog-ctn
    :title="title"
    @cancel="cancel"
    @confirm="confirm"
    @close="cancel"
    class="pic-select-dialog"
    :loading="loading"
  >
    <template v-slot:titleRight>
      <el-upload
        accept="image/*"
        :file-list="fileList"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :http-request="customUpload"
        :show-file-list="false"
        v-show="currentCategory.name === 'netImgs'"
      >
        <span class="h-full flex items-center">
          <el-button title="上传图片" size="mini" circle class=" ml-2 w-5 h-5 p-0 flex items-center justify-center" type="primary">
            <i class="el-icon-plus"></i>
          </el-button>
        </span>
      </el-upload>
    </template>
    <template v-slot:default>
      <el-input
        prefix-pic="picfont pic-inquiry"
        size="mini"
        class="mr-5 w-200"
        v-model="searchText"
        placeholder="请输入关键词"
        clearable
        @input="searchPic"
      ></el-input>
    </template>
    <template v-slot:dialogContent>
      <div class="codeless-pic-select-ctn" v-loading="loading">
        <!-- <div v-if='!picVisible' class='text-center'>加载图片中...</div> -->
        <div
          class="flex border-t border-b border-gray-F0F5F7 border-solid h-400px"
        >
          <div class="w-200 bg-gray-F0F5F7 py-3" style="overflow: overlay">
            <div
              class="
                h-8
                hover:bg-white
                flex
                justify-between
                px-3.5
                cursor-pointer
                items-center
                pic-list
              "
              v-for="c in tabs"
              :key="c.name"
              :class="{ active: c.name === currentCategory.name }"
              @click="selectCategory(c)"
            >
              <span>{{ c.title }}</span>
            </div>
          </div>
          <div class="flex-1">
            <div class="pic-wrapper">
              <codeless-dialog-input-pic
                :pic.sync="pic"
                :pics="showPics"
                :netImgsOrg="netImgsOrg"
                @del="delPic"
              ></codeless-dialog-input-pic>
            </div>

            <el-pagination
              v-show="currentCategory.name === 'netImgs'"
              class="flex justify-center items-center pagination-wrapper"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="10"
              layout="total, prev, pager, next"
              :total="totalCount"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
  </codeless-dialog-ctn>
</template>
<script>
// const { uploadPicture, deletePicture, getPictureList } = window.getBffApi();
export default {
  name: "codelessPicSelectCtn",
  mixins: [window.V8.mixins],
  data() {
    return {
      title: "选择图片",
      loading: false,

      tabs: [
        {
          name: "publicImgs",
          title: "本地图片",
        },
        {
          name: "netImgs",
          title: "服务器图片",
        },
      ],

      active: "",
      currentCategory: {
        name: "publicImgs",
        title: "本地图片",
      },

      fileList: [],
      previewVisible: false,

      netImgs: [],
      netImgsOrg: [],

      // 当前页码
      currentPage: 1,
      // 用户总数据
      totalCount: 1,
      // 每页数量
      pageSize: 10,

      searchText: "",
    };
  },
  mounted() {
    console.log(this);
    let { title, pic, operationEnable } = this.AParams;

    this.title = title || this.headerTitle || "图片选择";
    this.pic = pic || this.selectPic;
    this.operationEnable =
      operationEnable || this.showOperation || this.operationEnable;

    this.getPicSource();

    if (this.pic.indexOf("/bff") > -1) {
      this.currentCategory = {
        name: "netImgs",
        title: "服务器图片",
      };
    }
  },
  beforeDestroy() {},
  computed: {
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
    showPics() {
      const ctx = this;
      if (ctx.currentCategory.name === "publicImgs") {
        return ctx[ctx.currentCategory.name].filter(
          (i) => i.indexOf(ctx.searchText) > -1
        );
      } else {
        return ctx[ctx.currentCategory.name];
      }
    },
    publicImgs() {
      return this.$store.state.public.publicImg.map((i) => {
        return "/img" + i;
      });
    },
  },
  props: {
    headerTitle: {
      type: "String",
      default: "",
    },
    showOperation: {
      type: "Boolean",
      default: false,
    },
    selectPic: {
      type: "String",
      default: "",
    },
  },

  methods: {
    searchPic(v) {
      const ctx = this;
      if (ctx.currentCategory.name === "netImgs") {
        ctx.getPicSource();
      }
    },
    selectCategory(item) {
      this.currentCategory = item;
    },
    handleSizeChange(val) {
      const ctx = this;
      ctx.pageSize = val;
      ctx.currentPage = 1;
      ctx.getPicSource(ctx.currentPage, ctx.pageSize);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.currentPage = val;
      ctx.getPicSource(ctx.currentPage, ctx.pageSize);
    },
    async getPicSource(page, size) {
      const ctx = this;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      const { getPictureList } = window.getBffApi();
      let res = await getPictureList({
        tenantId: ctx.$store.getters["user/tenantId"],
        pageNum: ctx.currentPage,
        pageSize: ctx.pageSize,
        name: ctx.searchText,
      });
      if (res.success) {
        console.log("拿到的图片列表", res);
        ctx.netImgs = res.obj.content.map((i) => {
          return `${axios.bff}${i.url}`;
        });
        ctx.netImgsOrg = res.obj.content;
        ctx.totalCount = res.obj.totalElements;
      }
      console.log();
    },
    delPic(id) {
      const ctx = this;
      const { deletePicture } = window.getBffApi();
      deletePicture(id).then((res) => {
        if (res.success) {
          ctx.$message({
            message: "删除成功！",
            type: "success",
          });
          ctx.getPicSource();
        } else {
          ctx.$message.error("删除失败");
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log("handleChange", fileList);
    },
    handleSuccess(file, fileList) {
      this.fileList = [];
    },
    async customUpload() {
      const ctx = this;
      const { uploadPicture } = window.getBffApi();
      const file = ctx.fileList.map((i) => i.raw);
      const result = await uploadPicture({
        tenantId: this.$store.getters["user/tenantId"],
        file,
      });
      if (result.success) {
        this.$message({
          message: "上传成功！",
          type: "success",
        });
        ctx.getPicSource();
      } else {
        this.$message.error("上传失败");
      }
    },
    iconSelect(i) {
      const ctx = this;
      if (typeof i === "string") {
        ctx.active = i;
      } else {
        ctx.active = this.netImgSrc(i);
      }
      console.log(ctx.active);
    },
    cancel() {
      this.$root.cancel();
    },
    confirm() {
      const ctx = this;
      if (ctx.currentCategory.name === "netImgs") {
        const resource_img = {
          wid: ctx.AParams.obj.model.wid,
          id: ctx.netImgsOrg.find(i=>ctx.pic.indexOf(i.url) > -1).id
        }
        ctx.$root.confirm(ctx.pic, resource_img);
      }else {
        ctx.$root.confirm(ctx.pic);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pic-select-dialog {
  color: #333333;
  // .el-dialog__header{
  //   padding:0;
  //   height:52px;
  //   line-height:52px;

  ::v-deep .el-input__inner {
    border-radius: 200px;
  }
  ::v-deep .el-input__prefix {
    margin-left: 6px;
  }

  ::v-deep .add-pic {
    &.el-button {
      padding: 0;
      width: 18px;
      height: 18px;
      position: relative;
      margin-left: 12px;

      &:hover {
        background-image: linear-gradient(135deg, #0ae6f4 0%, #2772fa 100%);
        border: none;
      }

      > span {
        margin-left: 0;
        .pic-summary-upload-btn {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }
      }
    }
  }

  // }
  ::v-deep .codeless-custom-dialog-body-ctn {
    padding: 0;
  }
  .codeless-pic-select-ctn {
    // padding:0;
    font-size: 12px;
    .pic-list {
      &:hover {
        i {
          visibility: visible;
        }
      }
    }
    .active {
      border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3;
      border-left: 3px solid #ffffff;
      background-color: #ffffff;
    }
    .delete {
      &.picfont {
        font-size: 12px;
      }
    }

    .pic-wrapper {
      height: calc(100% - 44px);
      overflow: overlay;
      display: flex;
      .uploader {
        ::v-deep .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 104px;
          height: 96px;
          box-sizing: border-box;
          margin: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            border-color: var(--color-primary);
          }
        }
        .uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }
      }
    }
    .pagination-wrapper {
      height: 44px;
    }
  }
}
</style>
