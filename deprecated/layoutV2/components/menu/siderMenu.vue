<template>
  <!-- <logo :collapsed="collapsed" /> -->
  <div class="aweb-sider-menu">
    <!-- :selectedKey.sync="menuSelect" -->
    <div class="aweb-sider-menu-header">
       <i class='iconfont icon-zuoshangjiaocaidan text-muted'></i>
       <el-tooltip class="item" effect="dark" :content="sideBarFix?'取消固定侧边栏':'固定侧边栏'" placement="bottom">
         <svg class="icon svg-icon" aria-hidden="true" @click='toggleFix'  v-show='!collapsed'>
          <use xlink:href="#icon-guding-jihuo" v-if='sideBarFix'></use>
          <use xlink:href="#icon-guding-weijihuo" v-else></use>
        </svg>
       </el-tooltip>
       
       <div class='aweb-sider-menu-header-divider' v-if='collapsed'></div>
    </div>
    <div style='height:calc(100% - 40px);overflow:overlay' >
      <aweb-menu
        ref='normalMenus'
        theme="dark"
        mode="inline"
        :menus="normalMenus"
        @select="select"
      ></aweb-menu>
      <div class="sider-menu-divider"></div>
      <aweb-menu
        ref='codeLessMenus'
        theme="dark"
        mode="inline"
        :menus="codeLessMenus"
        @select="codeLesSelect"
      ></aweb-menu>
    </div>
    
    <!-- <i
      class="aweb-menu-fold"
      :class="collapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
      @click="toggleCollapse"
      :title="collapsed ? '展开' : '折叠'"
      v-if="info.layout == 'lr-layout' || info.layout == 'lt-layout'"
    /> -->
  </div>
</template>

<script>
import awebMenu from "./awebMenu.vue";
// import logo from "../header/logo.vue";

export default {
  name: "siderMenu",
  mixins: [ window.V8.mixins ],
  components: {
    awebMenu,
    // logo,
  },
  props: ["collapsed", "menus"],
  data() {
    return {
      sideBarFix:false,
    };
  },
  computed: {
    // info() {
    //   return this.$store.getters["project/GET_PROJECT_INFO"] || {};
    // },
    normalMenus() {
      return this.menus.filter((item) => !item.codelessType || item.codelessType==='runtimeMenu');
    },
    codeLessMenus() {
      let menus = JSON.parse(JSON.stringify(this.menus));
      return menus.filter((item) => {
        if (item.codelessType) {
          item.children && delete item.children;
          return true;
        }
      });
    },

    // menuSelect: {
    //   get() {
    //     let currentPath = this.$route.path;

    //     // //多标签模式
    //     // // if(this.info.tabsMode){
    //     // //   let openedTabs=this.$store.state.tabs.openedTabs;
    //     // //   let hasIn=openedTabs.find(item=>item.path===currentPath)
    //     // // }
    //     // return [currentPath];
    //     return [currentPath];
    //   },
    //   set() {},
    // },
  },
  methods: {
    toggleFix(){
      this.sideBarFix = !this.sideBarFix;
      this.$emit('toggleCollapse')
      
    },
    findLeaf(array) {
      let nodes = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.children && Array.isArray(element.children)) {
          nodes = [...nodes,...this.findLeaf(element.children)];
        } else {
          if (element.id) {
            nodes.push(element);
          }
        }
      }
      return nodes;
    },

    codeLesSelect(data) {
      let currentMenus = this.menus;
      this.$refs.normalMenus.$refs.elMenu.activeIndex = null

      let menuInfo = currentMenus.find((item) => item.path === data.key);
      if (menuInfo) {
        let list = this.findLeaf(menuInfo.children || []);
        let item = list[0];
        if (item) {
          this.$router.replace({
            path: "/app/render",
            query: {
              pId: menuInfo.id,
              type: item.codelessType,
              title: item.meta && item.meta.title,
              pageId: item.id,
            },
          });
        }
      }
    },
    select(data) {
      this.$refs.codeLessMenus.$refs.elMenu.activeIndex = null
      this.$emit("menuSelect", data);
    },
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },
  },
  created() {
    // console.log(this.menus);
  },
};
</script>


<style lang="less">
</style>