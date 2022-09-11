<template>
  <codeless-dialog-ctn
    title="图片选择"
    @cancel="cancel"
    @confirm="confirm"
    @close="cancel"
    class="icon-select-dialog"
    :loading="loading"
  >
    <template v-slot:dialogContent>
      <div class="dialog-type-icon w-full">
        <el-tabs v-model="tab" type="card">
          <el-tab-pane label="本地图片" name="1">
            <div class="icon-list overflow-scroll" style="height: 450px">
              <div
                class="icon-content"
                v-for="i in $store.state.public.publicImg"
                :key="i"
                :class="{ iactived: active ===   '/img' + i }"
                @click.stop="iconSelect(i)"
              >
                <el-image
                  style="width: 60px; height: 60px"
                  :src=" '/img' + i"
                  lazy
                >
                </el-image>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="服务器图片" name="2">
            <div class="">
              <div class="icon-list" style="height: 450px">
              <div class="img-upload" style="width: 90px; height: 90px">
                <el-upload
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-preview="handlePreview"
                  :on-change="handleChange"
                  :http-request="customUpload"
                  :show-file-list="false"
                >
                  <div class="flex items-center justify-center" style="width: 90px; height: 90px;">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </div>
              <div
                class="icon-content"
                v-for="i in netImgs"
                :key="i"
                :class="{ iactived: active === netImgSrc(i) }"
                @click.stop="iconSelect(i)"
              >
                <img
                  style="width: 60px; height: 60px"
                  :src="netImgSrc(i)"
                  lazy
                >
                
              </div>
            </div>
            </div>
            <el-pagination
              :style="`text-align:right;padding-top:15px;`"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </codeless-dialog-ctn>
</template>

<script>
export default {
  mixins: [window.V8.mixins],
  data() {
    return {
      // publicPath: process.env.BASE_URL,

      active: "",
      tab: "1",

      fileList: [],
      previewVisible: false,

      netImgs: [],

      // 当前页码
      currentPage: 1,
      // 用户总数据
      totalCount: 1,
      // 每页数量
      pageSize: 10,
    };
  },
  mounted() {
    const ctx = this;
    console.log(process);
    ctx.getFileList();
    if (ctx.AParams.obj.model[ctx.AParams.item.name]) {
      ctx.active = ctx.AParams.obj.model[ctx.AParams.item.name];
    }
  },
  computed: {
    netImgSrc() {
      return (item=> {
        return `${axios.bff}${item.url}` || ''
      })
    }
  },
  methods: {
    handleSizeChange(val) {
      const ctx = this;
      ctx.pageSize = val;
      ctx.currentPage = 1;
      ctx.getFileList(ctx.currentPage, ctx.pageSize);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.currentPage = val;
      ctx.getFileList(ctx.currentPage, ctx.pageSize);
    },
    async getFileList(page, size) {
      const ctx = this;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      const { getPictureList } = window.getBffApi();
      let res = await getPictureList({ tenantId: ctx.$store.getters['user/tenantId'], pageNum: ctx.currentPage, pageSize: ctx.pageSize });
      if (res.success) {
        console.log('拿到的图片列表', res);
        ctx.netImgs = res.obj.content;
        ctx.totalCount = res.obj.totalElements;
      }
      console.log();
    },
    async customUpload() {
      const ctx = this;
      const { uploadPicture } = window.getBffApi();
      const file = ctx.fileList.map((i) => i.raw);
      const result = await uploadPicture({ tenantId: this.$store.getters['user/tenantId'], file });
      if (result.success) {
      console.log('上床陈工',result);
      this.$message({
        message: "上传成功！",
        type: "success",
      });
      ctx.getFileList();
      }else {
        this.$message.error("上传失败");
      }
    },
    iconSelect(i) {
      const ctx = this;
      if (typeof i === 'string') {
        ctx.active = i;
      }else {
        ctx.active = this.netImgSrc(i);
      }
      console.log(ctx.active);
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {

      this.active = file.path;
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log("handleChange", fileList);
    },
    cancel() {
      this.$root.cancel();
    },
    confirm() {
      this.$root.confirm(this.active);
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-type-icon {
  --size: 90px;
  width: 100%;
  max-height: 100%;
  .icon-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--size));
    grid-row-gap: 40px;
    grid-column-gap: 40px;
      ::v-deep  .el-upload--picture-card {
        width: 90px;
        height: 90px;
      }
    
    .icon-content {
      height: var(--size);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid initial;
      &:hover {
        cursor: pointer;
      }
    }
    .iactived {
      border: 3px solid red;
      border-radius: 4px;
      background: rgba(255, 182, 193, 0.3);
    }
  }
}
</style>