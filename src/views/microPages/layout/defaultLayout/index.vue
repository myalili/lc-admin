<template>
  <div class="h-full flex bg-base relative flex-col codeless-main-layout ">
    <admin-header
    class="codeless-main-layout-header"
        @lock="isLock = true"
    ></admin-header>
    <div class="codeless-main-layout-content">
        <!-- <tabs-header></tabs-header> -->
        <!--   如果有全局tabs，需要加class="has-tabs" -->
         <div
          class="codeless-contanier flex"
         >
          <sider-menu
            @menuSelect="siderMenuSelect"
            :menus="siberMenus"
          ></sider-menu>
          <pages-view class="codeless-content-pages-view bg-base flex-1"></pages-view>
         </div>
        
       <lock-mask :show.sync="isLock" />
    </div>
   
  </div>
</template>
<script>
import siderMenu from "./components/menu/siderMenu";
import adminHeader from "./components/header/adminHeader";
import pagesView from "./components/views/pagesView";
import lockMask from "./components/views/lockMask";
import tabsHeader from "./components/header/tabsHeader";

// import "@/utils/Activator";
// import { getToken } from "@/utils/user";

export default {
  name: "defaultLayout",
  components: {
    siderMenu,
    adminHeader,
    pagesView,
    tabsHeader,
    lockMask,
  },
  data() {
    return {
      isLock: false,
    };
  },

  mixins: [window.V8.mixins],
  computed: {
    menus() {
      return this.$store.state.user.menus || [];
    },
    siberMenus() {
      return this.menus;
    },
    
  },
  methods: {
    // getPid(path) {
    //   let pid = "";
    //   let menu = this.menus.filter((m) => {
    //     return m.path === path;
    //   });
    //   menu[0] && menu[0].id && (pid = menu[0].id);
    //   return pid;
    // },
    //点击侧边栏菜单
    siderMenuSelect(data) {
      console.log('siderMenuSelect',data);
      if (data && data.path) {
        let openPath = this.formatPath(data.path);

        if (openPath) {
         
          console.log(openPath);
            let options = {
              path: openPath,
              params:{
                menuId:data.id,
              }
            }
            if(data.pageType==="release"){
               options.params = {
                  prototypeId:data.prototypeId,
                  runtime:true,
                  menuId:data.id,
                  pageId:data.prototypeId
               } 
            }

          
            this.open(options);

        }
      }
    },
    // getMenuInfo(key) {
    //   let currentMenus = this.$store.state.user.currentMenus;
    //   key = key.split("/").pop();

    //   return currentMenus.find((item) => item.id === key);
    // },
    formatPath(path) {
      return `/${path}`.replace(/\/\//g, "/");
    },
    //获取用户信息解密
    // getUsers() {
    //   let privateKey =
    //     "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJBmMsJ7cQ2v2aDumuLkKG8VXfNSJWri3LVWVoxTRdfxYQju4NoDIPDQFgLmXN/09z11fNWjCWnAjWgTeUVTi672lynAJP7tB/QfAkangMMHVfZpDmQY9Lvdl4vO7FP6DgnJ3Pz5sR4OimuT3+Wlu3yX6MzZaiD96RpQKgmyCY1NAgMBAAECgYA+esn51rm7J1yuQq/n/rr0HbWyI9gm4JSJLhtyylFNN5c560qFapclO5RamtyS1wbno99o/QuEo5lL8Ckn8xdb6UQ2M6AvcSNr5w2AX/qmpVnIP/S6tGSsp5NG172q4lLTWez40Q1FHQurhmEXTMv1W1TaFshFguObTqkjcFPwwQJBAPMFThk/GynQVh2ihQETgglDGiVBuqF+dyQvez1y2a7F7TEQwwsZoe97ZmRwIKzSBhksD/nIYgE+ACMbXD4emZECQQCYHH41BwesC1OhZXeXUrc1/Nq25PxeDfF8cVUbV33Z4K8FLpqjF4PUA05dI3hBZwmb1PJI+TH7JpBkW3nKsrn9AkBNFb20HGRNWxw1wjtWIA37SiGc98BvQWIhRD5fO3L5EScvjRWRC8xl3kqYSUjUCLqOeX+Hx5vusO/yMteLjMFBAkA0OFvvknlEzCKq3u2+iowRQbxIW7Z0B69mvHWuTEwNV4BedBBsey8rwvLNMNchBOGcmO+Qs9Q/145slabrOo51AkEAyKyVCZsxDrLl7ISiB+gDsrq8GWTXQTHCQCxXRKCEVRH8S9blk5QE0vix2MJYNsRiEpaZfBF7uJgoDHATiCarwQ==";
    //   //
    //   axios.get(`${axios.bff}/get-user?token=${getToken()}`).then((res) => {
    //     let user = window.pipe.rsa.decrypt(privateKey, res.obj);
    //     if (this.isFirst) {
    //       this.openSetting();
    //     }
    //   });
    // },
    // openSetting() {

    //   console.log('打开登录向导');
    //   const ctx = this
    //   ctx.open({
    //       title: '登录向导',
    //       type: 'BLANK',
    //       component: 'loginWizard/index',
    //       beforeConfirm: ($el) => {
    //         //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
    //         return true;
    //       },
    //       confirmCallback: ($el) => {},
    //       cancelCallback: ($el) => {
    //         console.log("点击取消");
    //       },
    //     });
    // }
  },

  mounted() {
    // this.isFirst = this.$route.query.isFirst ? true : false
    // this.getUsers();
  },

  watch: {},
};
</script> 

<style  lang="less" scoped>
  // .aweb-main-layout {
  //   height: 100%;
  //   display:flex;
  // }
  .codeless-main-layout-content{
    height:calc(100% - 40px);

    .codeless-contanier{
      height:100%;
      .codeless-content-pages-view {
        position: relative;
        // background: #fff;
        // padding: 20px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        // background: #f0f2f5;
        box-sizing: border-box;
        &.has-tabs {
          height: calc(100% - 40px);
        }
      }
    }
    
    
  }
</style>