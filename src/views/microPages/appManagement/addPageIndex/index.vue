<template>
  <div class="h-full">
    <div
      v-if="!showTemp"
      class="
        app-page-index
        h-full
        flex
        justify-center
        items-center
        overflow-y-scroll
      "
    >
      <div class="flex items-center flex-wrap">
        <div
          class="app-page-index-item"
          v-for="(item, index) in pageList"
          :key="index"
          :style="{ width: item.width }"
          @click="addPage(item)"
        >
          <div
            class="rounded-lg flex items-center justify-center cursor-pointer"
            :style="{ background: item.background }"
          >
            <img :src="item.img" class="w-px-36" alt="" srcset="" />
            <div class="block sm:hidden md:block">
              <span
                class="
                  text-lg
                  font-bold
                  flex
                  whitespace-nowrap
                  overflow-hidden overflow-ellipsis
                "
              >
                新建{{ item.name }}
              </span>
              <p
                class="
                  text-gray-500
                  mt-1
                  overflow-hidden overflow-ellipsis
                "
                :title="item.desc"
              >
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="px-3.5 h-full box-border app-page-temp-wrapper">
      <div class="app-page-temp-title flex items-center">
        <!-- <codeless-back @back="showTemp = false" class="mr-2"></codeless-back> -->
        页面模板
      </div>
      <app-temp
        class="app-content"
        ref="appTemp"
        :tempData="tempData"
        @addModule="addModule"
      ></app-temp>
    </div>
  </div>
</template>
<script>
const {getUnkgData,getNpmLibs } = window.getArmApi();
// import appTemp from "./components/appTemp.vue";
const {getAlcapPlatformVersion} = window.alcapCoreUtils;
export default {
  mixins:[window.V8.mixins],
  // inject: ["detail"],
  data() {
    return {
      showTemp: false,
      tempData: [],
      // details:{},
    };
  },
  // watch: {
  //   "$route.query.showTemp"(val) {
  //     if (val) {
  //       this.showTemp = true;
  //     }else{

  //     }
  //   },
  // },
  // components: { appTemp },
  computed: {
    pages() {
      let rets = [];
      let pages = activator.get("alcap.create");
      if (pages && pages.pannel) {
        rets = pages.pannel;
      }
      return rets;
    },
    pageList() {
      let ret = this.pages;
      return ret.filter((item) => item !== "sp");
    },
  },
  async mounted() {
    // console.log(this.AParams.showTemp)
    // this.showTemp = this.AParams.showTemp;
    await this.getTemplateData();
  },
  watch:{
    "AParams.showTemp":{
      handler(val){
        this.showTemp = val
      },
      immediate:true
    }
  },
  methods: {
    addPage(item) {
      if (item.type) {
        window.msgHub.$emit("addAppInAppDetails",item)
        // this.detail.addApp(item);
      } else {
        this.showTemp = true;
      }
    },

    async getTemplateData() {
      try {
        let res = await getNpmLibs({
            version:getAlcapPlatformVersion(2),
            scope:"@alcap-page-template",
          });
        if (res.success) {
          this.tempData = res.content;
          // this.$refs.appTemp.setData(res.content);
        }
      } catch (error) {
        console.log("获取模板出错" + error);
      }
    },
    async addModule(data) {
      let res = await getUnkgData(`${data.name}@${data.version}/data.json`);
      if (res && res[0]) {

        window.msgHub.$emit("openDialogInAppDetails",{
          type:"tempCreate",
          data:res[0]
        })
       
        // this.detail.openDialog("tempCreate",res[0]);
      }
    },
  },
};
</script>
<style scoped lang="less">
.app-page-index {
  padding: 0 15%;

  &-item {
    padding-right: 20px;
    > div {
      height: 200px;
      margin: 10px 0;
      padding: 0 20px;
    }
    img {
      width: 36px;
      margin-right: 20px;
    }
    p {
      text-overflow: -o-ellipsis-lastline;

      overflow: hidden;

      text-overflow: ellipsis;

      display: -webkit-box;

      -webkit-line-clamp: 2;

      line-clamp: 2;

      -webkit-box-orient: vertical;
    }
  }
}
.app-page-temp-title {
  height: 50px;

  // span {
  //   width: 20px;
  //   height: 20px;
  //   // background-color: linear-gradient(316deg, #15c0ff 0%, #00ddaa 100%);
  //   background-color:var(--color-primary);
  //   border-radius: 50%;
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: center;
  //   cursor: pointer;
  //   .v2-a-svgicon {
  //     width: 12px;
  //     height: 12px;
  //   }
  // }
}
.app-page-temp-wrapper {
  // position: fixed;
  // left: 0;
  // right: 0;
  // top:0;
  // bottom: 0;
  background-color: rgb(249, 250, 252);
  // z-index: 99;
}
.app-content {
  max-height: calc(100% - 50px);
}
</style>