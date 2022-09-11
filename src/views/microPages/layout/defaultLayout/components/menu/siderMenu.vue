<template>
  <div
   
    class="codeless-sider-menu-wrapper flex relative"
    :class="{ 'menu-unfixed': !fixed || !subMenus || !subMenus.length }"
  >
    <div class="codeless-sider-menu-ctn overflow-hidden">
      <div class="codeless-sider-menu-list flex flex-col flex-wrap" :class="{'show-change-btn':true}" :style="`transform:translateX(${left}px)`" ref="menuListCtn">
        <div
          class="
            codeless-sider-menu-item
            cursor-pointer
            flex
            justify-around
            items-center
            flex-col
          "
          v-for="menu in customMenus"
          :key="menu.id"
          :class="{ 'selected': menu.id === selectedItem.id }"
          @click="selectMenu(menu)"
          @mouseenter="hoverHandler(menu)"
          @mouseover="hoverHandler(menu)"
          @mouseout="cancalHoverHandler(menu)"
        >
          <codeless-icon
            :icon="menu.meta.icon"
            style="height: 16px; width: 16px"
          ></codeless-icon>
          <div
            class="codeless-sider-menu-item-title truncate text-center"
            :title="menu.meta.title"
          >
            {{ menu.meta.title }}
          </div>
        </div>
      </div>
      <div class="codeless-sider-menu-change-btns flex justify-around" v-if="canMoveLeft||canMoveRight">
        <i class="el-icon-arrow-left change-btn inline-block box-border" :class="{'cursor-pointer btn-highlint':canMoveLeft}" @click="moveLeft"></i>
        <i class="el-icon-arrow-right change-btn inline-block box-border" :class="{'cursor-pointer btn-highlint':canMoveRight}" @click="moveRight"></i>
      </div>
      <div
        v-if="devMenu"
        class="
          fixed
          bottom-0
          left-0
          codeless-sider-dev-menu
          cursor-pointer
          flex
          justify-center
          items-center
          flex-col
        "
        :class="{ selected: devMenu.id === selectedItem.id }"
        @click="selectMenu(devMenu)"
        @mouseenter="hoverHandler(devMenu)"
        @mouseover="hoverHandler(devMenu)"
        @mouseout="cancalHoverHandler(devMenu)"
      >
        <codeless-icon
          :icon="devMenu.meta.icon"
          style="height: 32px; width: 32px"
        ></codeless-icon>
      </div>
    </div>
    <sub-menu
      :class="{
        'menu-unfixed': !fixed,
        'menu-fixed': fixed,
        'menu-hover': menuHover,
      }"
      @setSelectData = "highLightMenu"
      :fixed="fixed"
      @toggleFix="toggleFixHandler"
      :subMenus="subMenus"
      v-if="subMenus && subMenus.length"
      :title="subMenuTitle"
    ></sub-menu>
  </div>
</template>

<script>
import subMenu from "./subMenu.vue";
export default {
  mixins: [window.V8.mixins],
  components: {
    subMenu,
  },
  props: ["menus"],
  data() {
    return {
      fixed: true,
      left:0,
      maxLeft:0,
      canMoveRight:false,
      canMoveLeft:false,
      selectedItem: {},
      subMenus: [],
      menuHover: false,
      subMenuTitle:'',
      defaultActiveMenu:""
    };
  },
  computed: {
    tenantId(){
      return this.$store.getters['user/tenantId']
    },
    rawMenus(){
      return this.$store?.state?.user?.currentMenus||[]
    },
    customMenus() {
      let ret = [];
      ret = this.menus.filter(
        (item) =>
          item.codelessType === "runtimeMenu" ||
          item.codelessType === "caseMenu"
      );
      // ret = this.menus.filter((item) => !item.codelessType)
      console.log("customMenus", ret);
      return ret;
    },
    devMenu() {
      // let menus = JSON.parse(JSON.stringify(this.menus));
      let ret = [];
      ret = this.menus.filter((item) => {
        return item.codelessType === "devMenu";
      });
      // console.log(ret);
      return ret[0];
    },
  },
  mounted() {
    this.init();
    let ctx = this;
    this.resizeHandler();
    window.addEventListener('resize',ctx.resizeHandler,true);
    window.addEventListener('popstate',ctx.init,true);
  },
  methods: {
    init(){
      let { path } = this.$route;
      let {menuId} = this.$route.query;
      let menus = this.menus.filter((item) => item.name === path.split("/")[1]);
      if(menus.length){
        this.setSelectedData(menus[0]);
      }else if(!menuId){
        this.setSelectedData(this.menus[0]);
      }else{
        // let {menuId} = this.$route.query;
        // console.log('menuId',menuId);
        let tMenu = null;
        let rawMenusMap = {};
        // console.log('rawMenus',this.rawMenus)
        this.rawMenus.forEach(m=>{
          rawMenusMap[m.id] = m;
          if(m.id ===menuId){
            tMenu = m;
          }
        })
        // console.log('tMenu',tMenu);
        if(tMenu){
          // let pathArr = [];
          // pathArr.unshift(tMenu.name);
          let pMenu = rawMenusMap[tMenu.parentId];
          // pathArr.unshift(pMenu.name);
          while(pMenu && pMenu.parentId){
            pMenu = rawMenusMap[pMenu.parentId];
            // pMenu&&(pathArr.unshift(pMenu.name));
          }
          menus = this.menus.filter((item) => item.id ===pMenu.id);
          // console.log('menus',menus);
          this.setSelectedData(menus[0]);
          // this.defaultActiveMenu = menuId;
        }
      }
    },
    highLightMenu(menu){
      if(this.selectedItem.id!==menu.id){
         this.selectedItem = menu||{};
      }
      
    },
    setSelectedData(menu){
      this.selectedItem = menu||{};
      this.subMenus = this.selectedItem?.children|| [];
      this.subMenuTitle = this.selectedItem?.meta?.title||''
      // console.log(this.selectedItem.meta)
    },
    resizeHandler(){
      
     let clientHeight = this.$refs['menuListCtn'].clientHeight;
     let customMenusTotalHeight = this.customMenus.length*(56+12);
     if(clientHeight && (customMenusTotalHeight-clientHeight+12>0)){
        this.canMoveRight = true;
        this.maxLeft = - (Math.ceil(customMenusTotalHeight/clientHeight)-1)*60;
        // console.log(this.maxLeft)
     }else{
        this.left = 0;
        this.maxLeft=0;
        this.canMoveRight=false;
        this.canMoveLeft=false;
     }
    },
    moveRight(){
      if(this.canMoveRight){
        this.left = this.left-60;
        this.canMoveLeft = true;
        if(this.left===this.maxLeft){
          this.canMoveRight = false;
        }
      }
      
    },
    moveLeft(){
      if(this.canMoveLeft){
        this.left = this.left+60;
        this.canMoveRight = true;
        if(this.left===0){
          this.canMoveLeft = false;
        }
      }
     
    },
    toggleFixHandler() {
      this.fixed = !this.fixed;
      this.fixed && (this.menuHover = false);
    },
    cancalHoverHandler(item) {
      if (!this.fixed) {
        this.menuHover = false;
      }
    },
    hoverHandler(item) {
      if (!this.fixed) {
        // if (item.id !== this.selectedItem.id) {
          this.subMenus = item?.children||[];
          this.subMenuTitle = item.meta?.title||"";
        // }
        this.menuHover = true;
      }
    },
    selectMenu(item) {
      // if(this.selectedItem.id===item.id){
      //   return
      // }
      this.setSelectedData(item);
      // console.log(this.subMenus);
      let i = this.selectedItem;
      let subMenus = this.subMenus;
      while (subMenus && subMenus.length) {
        i = subMenus[0];
        subMenus = (subMenus[0] && subMenus[0].children) || [];
      }
      this.$emit("menuSelect", i);
    },
  },
  watch:{
    menus(val){
      this.setSelectedData(val[0])
    }
    // tenantId:{
    //   handler(){
    //     this.setSelectedData(this.menus[0]);
    //   },
      
    //   //  this.setSelectedData(this.menus[0]);
    // }
  },
  beforeDestroy(){
      let ctx = this;
      window.removeEventListener('resize',ctx.resizeHandler,true);
      window.removeEventListener('popstate',ctx.init,true);
  }
};
</script>

<style lang="less" scoped>
.codeless-sider-menu-wrapper {
  width: 270px;
  height: 100%;
  background-color: var(--codeless-layout-menu-bg-color);

  &.menu-unfixed {
    width: 60px;
  }
  .codeless-sider-menu-ctn {
    height: 100%;
    width: 60px;
    border-right: 1px solid #d5e0ed;
    .codeless-sider-menu-list {
      height: calc(100% - 56px);
      transition:transform .2s;

      &.show-change-btn{
        height: calc(100% - 106px);
       
      }
   
      .codeless-sider-menu-item {
        height: 56px;
        width: 60px;
        margin-bottom: 12px;

        &:hover,
        &.selected {
          background-color: var(--codeless-menu-hover-primary);
          .codeless-sider-menu-item-title{
            color:#333333;
          }
        }
        .codeless-sider-menu-item-title {
          min-height: 12px;
          width: 56px;
          font-size: 12px;
          color: var(--codeless-menu-font-color);
        }
      }
    }
     .codeless-sider-menu-change-btns{
       width:60px;
       height:20px;
        .change-btn{
          border:1px solid #E8EBED;
          height:20px;
          width:20px;
          border-radius:50%;
          line-height:20px;
          text-align: center;
          background-color: #E8EBED;
          color:#BBBBBB;

          &.btn-highlint{
            border-color:var(--color-primary);
            color:var(--color-primary);
            background-color:var(--color-base);
          }
        }
    }
    .codeless-sider-menu-change-btns{
      height:20px;
    }
    .codeless-sider-dev-menu {
      height: 56px;
      width: 60px;

      &:hover,
      &.selected {
        background-color: var(--codeless-menu-hover-primary);

      }
      // .codeless-sider-dev-menu-icon-wrapper{
      //     width:32px;
      //     height:32px;
      //     border-radius:8px;

      //     background-color:var(--color-primary) ;
      //     bottom:12px;
      //     left:14px;
      //     z-index:-1;
      // }
    }
  }
  .menu-unfixed {
    position: absolute;
    top: 0;
    left: 60px;
    box-shadow: 11px 0px 10px -10px rgba(137, 162, 183, 0.2);
    z-index: 3;
    visibility: hidden;
    &.menu-hover {
      visibility: visible;
    }
    &:hover {
      visibility: visible;
    }
    &::v-deep .codeless-sub-menu-fixed-icon-wrapper {
      &:hover {
        visibility: visible;
      }
    }
  }
  .menu-fixed {
    border-right: 1px solid #d5e0ed;
  }
}
</style>