<template>
  <div class="codeless-page-select flex items-center">
    <el-button type="primary" @click="choosePage" size="mini" v-if="!disabled"
      >选择页面</el-button
    >
    <span class=" ml-1 mr-3">{{title||pageInfo.name}}</span>

    <!-- <codeless-page-data-binding  v-if="selectedPage.title"/> -->
    <!-- codelessDialogCtn -->
    <el-dialog
      top='10vh'
      title="页面选择"
      :visible.sync="dialogVisible"
      width="70%"
      height="500px"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        maxHeight="550px"
        @confirm="submit"
        @close="dialogVisible = false"
        @cancel="dialogVisible = false"
      >
      <template v-slot:dialogContent>
        <div class="w-full h-full grid grid-cols-4 gap-5 box-border overflow-scroll">
        <div
          class="
            w-full
            h-40
            relative
            rounded
            flex
            justify-center
            items-center
            cursor-pointer
            overflow-hidden
            hover:shadow-md
            item-layout
          "
          :class="{ 'actived': active === item.prototypeId }"
          v-for="item in menus"
          :key="item.id"
        >
          <codeless-icon
            style="width: 60px; height: 60px; margin-bottom: 16px"
            :icon="
              item.icon.indexOf('icon') > -1 ? item.icon : 'icon-' + item.icon
            "
            class="v2-a-svgicon"
          ></codeless-icon>
          <div
            class="
              preview-btn
              flex
              items-center
              rounded
              justify-center
              absolute
              w-16
              h-7
              cursor-pointer
              bg-white
              hover:bg-gray-50
            "
            v-if="!item.codelessType || item.codelessType === '0'"
            @click="openFolder(item)"
          >
            <i class="el-icon-folder-opened mr-1"></i>
            <span>打开</span>
          </div>
          <div
            class="
              preview-btn
              flex
              items-center
              rounded
              justify-center
              absolute
              w-16
              h-7
              cursor-pointer
              bg-white
              hover:bg-gray-50
            "
            v-if="(item.codelessType && item.codelessType !=='0') || item.pageType"
            @click="select(item)"
          >
            <i class="el-icon-document mr-1"></i>
            <span>选择</span>
          </div>
          <div
            class="absolute w-full top-32 -bottom-6 left-0 h-16 p-2 item-info"
            style="background-color: #f0f2f5"
          >
            <div>
              <i class="el-icon-folder mr-1" v-if="(!item.codelessType || item.codelessType === '0') && !item.pageType"></i>
              <i class="el-icon-tickets mr-1" v-if="(item.codelessType && item.codelessType !=='0') || item.pageType"></i>
              <span class="font-bold">{{ item.name }}</span>
            </div>
            <div class="text-gray-400 text-xs overflow-ellipsis">
              {{ item.path }}
            </div>
          </div>
        </div>
      </div>
      </template>
      
      <div class="flex items-center justify-between" slot="title">
        <span class="flex items-center">
          <codeless-back @back="returnMenu(titles.length - 2)" v-if="titles.length > 1" style="margin-right:8px"></codeless-back>
          <span>
            <span v-for="(title, index) in titles" :key="title" @click="returnMenu(index)" class=" cursor-pointer hover:opacity-70">{{ title }}/</span>
          </span>
          <!-- <span v-else>
            <span>搜索结果</span>
          </span> -->
          <codeless-search-input class=" ml-2" :value.sync="searchVal" @keydown="searchPage"  />
        </span>
      </div>
      </codeless-dialog-ctn>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "pageSelect",
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterByID:{
      type:String,
      default:''
    },
    title:{
      type:String,
      default:''
    },
    // menus: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    // },
    existAopsStore:{
      type: Boolean,
      default:false
    }

  },
  data() {
    return {
      dialogVisible: false,
      selectedList: [],
      selectedPage: this.value,
      active: "",
      appMenus: [],

      currentMenus: [],
      preMenus: [],
      titles: ['首页'],

      originMenus: [],

      searchVal: '',

      pageInfo: {}
    };
  },
  selectedPage: {
    handler(n) {
      if (this.$parent.config) {
        this.$parent.config.value = n;
      } else {
        this.$emit("update:value", n);
      }
    },
  },
  value: {
    handler(n){
      this.selectedPage = n;
    }
  },
  computed: {
    tenantId(){
      if(this.existAopsStore){
          return window.store.getters['user/tenantId']
      }else{
          return this.$store.getters['user/tenantId']
      }
    },
    menus() {
      return this.currentMenus;
    },
  },
  watch: {

  },
  async mounted() {
    const ctx = this;
    let params = {
         tenantId:ctx.tenantId,
         parentId:'root'
      }
    if (ctx.menus.length > 0) {
      ctx.appMenus = ctx.menus
    }else {
      if(ctx.existAopsStore){
         ctx.appMenus = await window.store.dispatch("page/getReleasePageList",params);
      }else{
         ctx.appMenus = await this.$store.dispatch("page/getReleasePageList",params);
      }
    }
    
    
    if(ctx.filterByID){
      ctx.currentMenus = ctx.appMenus.filter(
        (item) => item.id === ctx.filterByID
      );
    }else{
      ctx.currentMenus = ctx.appMenus
    }
    console.log("p_appMenus", ctx.appMenus);
    ctx.originMenus = ctx.appMenus = await this.$store.dispatch("page/getReleasePageList", { ...params, origin: true });
    ctx.getCurrentPage();
  },
  methods: {
    searchPage(val) {
      const ctx = this;
      // let searchMenus = ctx.originMenus.filter(i=>i.name.indexOf(val) > -1);
      // console.log('搜索后的结果', ctx.originMenus, ctx.currentMenus);
      // ctx.currentMenus = searchMenus;
    },
    getCurrentPage() {
      const ctx = this;
      if (!ctx.selectedPage.prototypeId) return;
      ctx.pageInfo = ctx.originMenus.find(i=>i.prototypeId === ctx.selectedPage.prototypeId);
      ctx.$emit('getPageInfo', JSON.parse(ctx.pageInfo.pageContent));
      ctx.$emit("select", { ...ctx.pageInfo });
      if(ctx.active === ctx.selectedPage.prototypeId || !ctx.pageInfo.parentId) return;
      ctx.active = ctx.pageInfo.prototypeId;

      let parents = [];
      ctx.getParentId(ctx.pageInfo.parentId, parents);
      parents.reverse().forEach(p=> {
        let folder = ctx.currentMenus.find(i=>i.id === p.id);
        ctx.openFolder(folder);
      })
    },
    getParentId(id, parents) {
      const ctx = this;
      let parentObj = ctx.originMenus.find(i=>i.id === id);
      parents.push(parentObj);
      if (parentObj.parentId !== 'root') {
        ctx.getParentId(parentObj.parentId, parents);
      }
    },
    returnMenu(index) {
      const ctx = this;
      if (index === ctx.preMenus.length) return
      let i = index
      ctx.currentMenus = ctx.preMenus[i]
      ctx.titles.splice(i + 1, ctx.titles.length - (i + 1));
      ctx.preMenus.splice(i, ctx.titles.length - i);
      console.log('删除后的菜单',ctx.preMenus, ctx.titles, index);
    },
    openFolder(folder) {
      const ctx = this;
      ctx.preMenus.push(ctx.currentMenus);
      ctx.titles.push(folder.name)
      ctx.currentMenus = folder.children;
      console.log('目录下', folder.children);
      console.log('之前的菜单',ctx.preMenus, ctx.titles);
    },
    select(e) {
      const ctx = this;
      ctx.selectedPage = { prototypeId: e.prototypeId, runtime: true };
      ctx.pageInfo = e;
      this.existAopsStore && (this.title = e.title);
      ctx.active = e.prototypeId;
      console.log(ctx.selectedPage)
    },
    submit() {
      const ctx = this;
      let selectedPage = JSON.parse(JSON.stringify(ctx.selectedPage));
      ctx.$emit("select", { ...ctx.pageInfo });
      ctx.$emit('getPageInfo', JSON.parse(ctx.pageInfo.pageContent));
      ctx.$emit("update:value", { ...selectedPage });
      ctx.dialogVisible = false;
    },
    choosePage() {
      const ctx = this;
      ctx.dialogVisible = true;
    },
    // handleSelect(key, keyPath) {
    //   const ctx = this;
    //   // console.log(JSON.parse(key), keyPath);
    //   if (JSON.parse(key).children) {
    //     ctx.selectedList = JSON.parse(key).children.filter(
    //       (i) =>
    //         i.path !== "codeLess/index" ||
    //         (i.path === "codeLess/index" &&
    //           i.codelessType &&
    //           i.codelessType !== "0")
    //     );
    //   } else {
    //     ctx.selectedList = [];
    //   }
    //   ctx.selectedPage = JSON.parse(key);
    //   // ctx.selectedList = ctx.selectedList.filter(i=>i.codelessType && Number(i.codelessType) > 0)
    // },
    
  },
};
</script>

<style lang="scss" scoped>
.iactived {
  border: 3px solid red;
  border-radius: 4px;
  background: rgba(255, 182, 193, 0.3);
}
::v-deep .el-dialog__wrapper {
  overflow: hidden;
  .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
      max-height: 500px !important;
      overflow: scroll;
    }
  }
}
::v-deep .el-menu {
  max-height: 500px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
.item-layout {
  background-color: #f0f2f5;
  .preview-btn {
    background-color: rgb(255, 255, 255, 0.7);
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    display: none;
  }
  &:hover {
    background-color: #a8a9ab;
    .preview-btn {
      display: flex;
      &:hover {
        background-color: rgba(216, 216, 216, 0.8);
      }
    }
    .item-info {
      transform: translateY(-26px);
      transition: transform 0.2s;
    }
  }
}
.actived {
    background-color: #a8a9ab;
    .preview-btn {
      display: flex;
      &:hover {
        background-color: rgba(216, 216, 216, 0.8);
      }
    }
    .item-info {
      transform: translateY(-26px);
      transition: transform 0.2s;
    }
  }
// .back {
//     width: 20px;
//     height: 20px;
//     // background: linear-gradient(316deg, #15c0ff 0%, #00ddaa 100%);
//     background-color:var(--color-primary);
//     border-radius: 50%;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     margin-right: 6px;
//     .v2-a-svgicon {
//       width: 12px;
//       height: 12px;
//     }
//   }
</style>