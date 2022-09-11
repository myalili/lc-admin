<script>
export default {
  name:'main',
  mixins: [window.V8.mixins],
  data() {
    return {
      keepAlive: false,
    };
  },
  created() {
    if (!this.keepAlive) {
      this.redirect();
    }
  },
  activated() {
    if (this.keepAlive) {
      this.redirect();
    }
  },
  deactivated() {
    this.keepAlive = true;
  },
  computed: {
    menus() {
      return this.$store.state.user.menus || [];
    },
    // firstMenu() {
    //   let m = this.menus.filter((item) => {
    //     return item.codelessType === "runtimeMenu";
    //   });
    //   return m[0];
    // },
    firstMenu(){
      let runtimeMenus = this.menus.filter(item=>item.codelessType === 'caseMenu'|| item.codelessType==='runtimeMenu');
      let devMenus = this.menus.filter(item=>item.codelessType==='devMenu');
      let menus = [...runtimeMenus,...devMenus];
      let m = menus[0];
      while(m.children && m.children.length){
        m= m.children[0];
      }
      return m
    }
  },
  methods: {
    formatPath(path) {
      return `/${path}`.replace(/\/\//g, "/");
    },
    redirect() {
      // const { params, query } = this.$route;
      // let { path } = params;
      // // path = path ? "/" + path : this.$route.path;
        // console.log(this.AParams)
       let {id,path,pageType,prototypeId} = this.firstMenu;
       let openPath = this.formatPath(path);
       let params = {
         menuId:id,
       }
       if(pageType==='release'){
              params = {
                  ...params,
                  prototypeId,
                  runtime:true,
                  pageId:id,
                  // pageId:data.prototypeId,
               } 
        
       }
       
        this.open({
          path: openPath,
          params
        });
        this.close("/main")
      
   
      // this.$router.replace({
      //   path: "/workbench",
      //   query: {
      //     pageId: "menu-ZMVYhr1n",
      //     type: "1",
      //     title: "工作台",
      //     preview: false,
      //     class:"workbench"
      //   },
      // });
    },
  },
  render: function (h) {
    return h();
  },
};
</script>
