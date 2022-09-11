
<template>
  <el-menu
    ref='elMenu'
    :mode="mode"
    :collapse="collapsed"
    @select="menuClick"
    :default-active="activeIndex"
    :style="{ width: (collapsed ? 50 : 210) + 'px' }"
  >
    <template v-for="(item, index) in menus">
      <!-- <div class="sider-menu-divider" :key="formatKey(item.path)" :index="index" v-if="index === 4"></div> -->
      <el-menu-item
        v-if="!item.hidden"
        :key="formatKey(item.path)"
        :index="formatKey(item.path)"
        class="hover:bg-secondary"
      >
        <codeless-icon
          :icon="item.meta.icon||'icon-yemianmingcheng2'"
          class="aweb-menu-icon v2-a-svgicon"
        ></codeless-icon>

        <span v-if="item.meta && item.meta.title" class="admin-menu-title text-muted"
          >{{ item.meta.title }}
        </span>
      </el-menu-item>
      <!-- <sub-menu
        v-else-if="!item.hidden"
        :key="formatKey(item.path)"
        :item="item"
        :tPath="formatKey(item.path)"
      ></sub-menu> -->
    </template>
  </el-menu>
</template>

<script>
// import subMenu from "./subMenu";
export default {
  name: "awebMenu",
  components: {
    // subMenu,
  },
  props: ["mode", "menus", "collapsed"],
  data() {
    return {
      openKeys: [],
      activeIndex:'',
      // currentSelectKeys: [],
      //  collapse:this.collapsed
    };
  },
  watch: {
    // $route: {
    //   immediate: true,
    //   handler(to, from) {
    //     if (!this.collapsed) {
    //       if (this.info.layout !== "tb-layout") {
    //         let matcher = this.$router.match(to.path);
    //         let ret = matcher.matched.map((item) => item.path);
    //         let data = ret.map((item) => {
    //           return item.replace(this.$store.state.user.currentHeadrMenus, "");
    //         });

    //         ret = [...ret, ...data];

    //         ret = ret.filter((item) => item);
    //         for (let i = -1, el; (el = ret[++i]); ) {
    //           if (!this.openKeys.includes(el)) {
    //             this.openKeys.push(el);
    //           }
    //         }
    //       }
    //     }
    //   },
    // },
  },
  mounted() {
    // console.log('this.menus',this.$store.state.user.menus);
   
    this.setActiveIndex();
   

  },
  computed: {
    // info() {
    //   return this.$store.getters["project/GET_PROJECT_INFO"] || {};
    // },

    currentSelectKeys: {
      get() {
        let matcher = this.$router.match(this.$route.path);
        let ret = matcher.matched.map((item) => item.path);

        let current = this.$route.path.replace(
          this.$store.state.user.currentHeadrMenus,
          ""
        );
        ret.push(current);
        return ret || [];
      },
      set(value) {
        // console.log(value);
        // this.$emit("update:selectedKey", value);
      },
    },
  },
  methods: {
    setActiveIndex(){
      let {name,path} = this.$route;
      let {pageId} = this.$route.query;
      let ctx = this;
      let menus = this.$store.state.user.menus;
    
      // console.log(name,pageId,path);
      // console.log(this.$route);
      if(name==='main' && menus && menus[0] && menus[0].name){
        let notCodelessTypeMenu = menus.filter(item=>{
          return !item.codelessType
        })
         ctx.activeIndex =  notCodelessTypeMenu[0].path;
      }
      for(let i=0;i<menus.length;i++){
        let item = menus[i];
          if(pageId && pageId === item.id){
           
              ctx.activeIndex = item.path;
              break;
           
          }else if(name && name===item.name){
           
              ctx.activeIndex = item.path;
              break
           
          }else if(path){
            let p = path.split('/');
            // console.log(p[1]);
            if(p[1]===item.name){
              // debugger;
              ctx.activeIndex = item.path;
              break
            }

          }
      }
      // console.log( ctx.activeIndex)
     
    },
    menuClick(key, keyPath) {
      let data = { key, keyPath }
      // console.log(data);
      this.$emit("select", data);
    },
    formatKey(path) {
      return `/${path}`.replace(/\/\//g, "/");
    },
  },
  created() {},
};
</script>


<style lang="less">

</style>