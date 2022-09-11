<template>
  <div class="codeless-sub-menu-wrapper">
    <div class="codeless-sub-menu relative">
      <div class="codeless-sub-menu-title font-bold">{{ title }}</div>
      <div class="codeless-sub-menu-list border-box">
        <el-menu @select="siderMenuSelect" :default-active="defaultActive">
          <template v-for="menu in subMenus">
            <template v-if="menu.children && menu.children.length" >
                 <sub-menu-item :subMenu="menu"  :key="menu.id"></sub-menu-item>
            </template>
            <template v-else>
              <menu-item :menu="menu" :key="menu.id" ></menu-item>
            </template>
          </template>
        </el-menu>
      </div>
      <div
        class="
          codeless-sub-menu-fixed-icon-wrapper
          absolute
          cursor-pointer
          text-center
        "
        @click="toggleFix"
      >
        <i
          v-if="fixed"
          class="iconfont icon-cebiansuodingjihuo icon-highlight codeless-font-size-8 inline-block"
        ></i>
        <i
          v-else
          class="iconfont icon-cebianjiesuo codeless-font-size-8 inline-block"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import subMenuItem from './subMenuItem.vue'
import menuItem from './menuItem.vue'

export default {
  components:{
    subMenuItem,
    menuItem
  },
  mixins:[window.V8.mixins],
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    subMenus: {
      type: Array,
      default: [],
    },
    defaultActiveMenu:{
      type: String,
      default: '',
    }
  },
  mounted(){
    // console.log(this.subMenus)
    // this.subMenuMap = this.$store.state.user.menuMap
    // this.generateMap(this.subMenus);
    this.setActivePath();
   
  },
  watch:{
    // subMenus(val){
    //   // this.generateMap(val);
    //   // this.generateMap(this.subMenus);
    //   this.setActivePath();
    // },
    "$route.query.menuId":{
      handler(val){
        if(val){
          this.setActivePath();
        }
      }
    }
  },
  computed:{
     subMenuMap(){
        return this.$store.state.user.menuMap||{}
     }
  },
  data(){
    return {
      // subMenuMap:{},
      defaultActive:''
    }
  },
  methods: {
    setActivePath(){
      
      let {menuId} = this.$route.query;
      console.log('defaultActiveMenu',menuId);
      if(this.subMenuMap[menuId]){
        this.defaultActive = menuId;
      }
      // else if(this.defaultActiveMenu){
       
      //   this.defaultActive = this.defaultActiveMenu;
      // }
    },
    // generateMap(menus){
    //   let menusCopy = [...menus];
    //   this.subMenuMap ={};
    //   let cursor = 0;
    //   while(menusCopy[cursor]){
    //     let item = menusCopy[cursor]
    //     this.subMenuMap[item.path] = item;
    //     if(item.children && item.children.length){
    //       menusCopy=[...menusCopy,...item.children]
    //     }
    //     cursor++
    //   }
    // },
    formatPath(path) {
      return `/${path}`.replace(/\/\//g, "/");
    },
    toggleFix() {
      this.$emit("toggleFix");
    },
     siderMenuSelect(index,path) {

      console.log('siderMenuSelect',index,path);
      let data = this.subMenuMap[index];
      console.log(this.subMenuMap);
      // console.log(data);
      if (data && data.path) {
        if(data.path === this.$route.path){
          return 
        }
        
        if(!this.fixed){
          let pid = data.parentId;
          let pData = null;
         while(pid){
            pData = this.subMenuMap[pid];
            pid = pData.parentId;
         };
         
         this.$emit('setSelectData',pData)
        
        }
         let openPath = this.formatPath(data.path);
        if (openPath) {
         
          console.log(openPath);
            let options = {
              path: openPath,
              params:{
                menuId:data.id
              }
            }
            if(data.pageType==="release"){
               options.params = {
                  prototypeId:data.prototypeId,
                  runtime:true,
                  menuId:data.id,
                  pageId:data.prototypeId,
               }
               
            }

          
            this.open(options);

        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.codeless-sub-menu-wrapper {
  width: 210px;
  height: 100%;
  background-color: var(--codeless-layout-menu-bg-color);
  

 &::v-deep .codeless-sub-menu {
    height: 100%;
    .codeless-sub-menu-title {
      color: var(--codeless-font-color-primary);
      font-size: 16px;
      padding: 20px;
    }
    .codeless-sub-menu-list {
      padding:0 8px;
      
      .el-menu {
        background-color: unset;
        border-right: none;
        // overflow-x:hidden;
        .el-submenu__title{
           height: 36px;
           line-height: 36px;
        }
        .el-menu-item {
          height: 36px;
          line-height: 36px;
          margin-bottom: 1px;
          // padding: 0 8px;
          border-radius:6px;
          color:var(--codeless-font-color-primary);
          &.is-active{
             background-color: var(--codeless-menu-hover-primary);
          }

          &:hover {
            background-color: var(--codeless-menu-hover-primary);
          }
        }

        .codeless-sub-menu-icon {
          margin-right: 8px;
        }
      }
    }

    .codeless-sub-menu-fixed-icon-wrapper {
      border-radius: 50%;
      width: 22px;
      height: 22px;
      border: 1px solid #d4dfe6;
      top: 18px;
      left: 198px;
      z-index: 1;
      line-height: 22px;
      background-color: var(--color-base);
      .iconfont {
        color: var(--color-gray);
        &.icon-highlight {
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>