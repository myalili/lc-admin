<template>
  <div
    class="
      grid
      md:grid-cols-6
      lg:grid-cols-7
      sm:grid-cols-5
      gap-5
      overflow-y-scroll
    "
  >
    <div
      class="
        bg-white
        rounded-lg
        h-40
        flex
        items-center
        justify-center
        hover:shadow-lg
        cursor-pointer
        relative
        overflow-hidden
      "
      v-for="(item, index) in tempData"
      :key="index"
    >
      <div class="w-full h-full flex flex-col pt-6 app-temp-item box-border">
        <div class="flex justify-center items-center px-3 box-border">
          <el-image :src="getImgs(item) && getImgs(item)[0]">
            <div
              slot="error"
              class="image-slot"
              style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
              "
            >
              <img src="img/project-cover.png" style="width: 100%" />
            </div>
          </el-image>
        </div>
        <div class="mt-4 font-bold text-center">{{ item.description }}</div>
        <div
          class="
            absolute
            w-full
            h-full
            flex flex-col
            items-center
            justify-center
            hover:bg-gray-500 hover:bg-opacity-60
            top-0
            app-temp-item__btn
          "
        >
          <div
            class="
              w-20
              h-8
              bg-white
              rounded-full
              flex
              items-center
              justify-center
              cursor-pointer
            "
            @click.stop="preview(item)"
          >
            <i class="el-icon-view mr-1.5" slot="prefix"></i>
            预览
          </div>
          <div
            class="
              w-20
              h-8
              mt-4
              bg-white
              rounded-full
              flex
              items-center
              justify-center
              cursor-pointer
            "
            @click="addModule(item, index)"
          >
            <i class="el-icon-news mr-1.5" slot="prefix"></i>
            新建
          </div>
        </div>
      </div>
    </div>
    <el-dialog 
      :visible="true" 
      v-if='visible' 
      :close-on-click-modal="false" 
      custom-class="no-header-and-footer-dialog" 
      :append-to-body="true">
        <codeless-dialog-ctn
                  class="ctn-height"
                  title="图片预览"
                  @close="visible = false" 
                  :hideFooter = 'true'
                  >
            <template v-slot:dialogContent>
              <el-carousel :interval="5000" arrow="always">
                <el-carousel-item v-for="(item, index) in picList" :key="index">
                  <img :src="item" alt="" />
                </el-carousel-item>
              </el-carousel>
            </template>
          
        </codeless-dialog-ctn>
     </el-dialog>
  </div>
</template>
<script>
const { getArmUnpkg } = window.getArmApi();

export default {
  name: 'appTemp',
  inheritAttrs: true,

  props: {
    tempData: {
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      picList: [],
    };
  },
  async mounted() {},
  methods: {
    getImgs(item) {
      let screenshots = JSON.parse(item.package).screenshots||[];
      screenshots = screenshots.map(
        (s) => `${getArmUnpkg()}/${item.name}@${item.version}/${s}`
      );
      return screenshots;
    },
    preview(item) {
      this.picList = this.getImgs(item);
      if (!this.picList.length) {
        this.$message({
          type: "warning", // success/warning/info/error
          message: "没有预览图片，暂时无法预览",
        });
        return;
      }

      this.visible = true;
    },
    addModule(item) {
      this.$emit("addModule", item);
    },
    setData(data){
      this.tempData=data;
    }
  },
};
</script>

<style lang="less" scoped>
.app-temp-item {
  .el-image {
    height: 80px;
  }
  &__btn {
    display: none;
  }
  &:hover {
    .app-temp-item__btn {
      display: flex;
    }
  }
  .image-slot {
    img {
      height: 100%;
    }
  }
}
</style>