<template>
  <div class="aweb-main-layout bg-base relative">
    <div
      class="aweb-main-layout-left bg-base"
      :class="{ collapsed: collapsed }"
    >
      <sider-menu
        class="aweb-sider"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
        @menuSelect="siderMenuSelect"
        :menus="siberMenus"
      ></sider-menu>
    </div>
    <div class="aweb-main-layout-right" :class="{ collapsed: collapsed }">
      <admin-header
        :collapsed="collapsed"
        :showMenu="hasHeaderMenu"
        @lock="isLock = true"
      ></admin-header>

      <div class="aweb-layout-wrapper">
        <div
          class="aweb-contanier has-sider-menu'"
          :class="{ collapsed: collapsed }"
        >
          <!-- <tabs-header></tabs-header> -->
          <!--   如果有全局tabs，需要加class="has-tabs" -->
          <pages-view></pages-view>
        </div>
      </div>
    </div>
    <lock-mask :show.sync="isLock" />
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
  name: "layout",
  components: {
    siderMenu,
    adminHeader,
    pagesView,
    tabsHeader,
    lockMask,
  },
  data() {
    return {
      collapsed: true,
      // isFirst: false,
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
    hasHeaderMenu() {
      return false;
    },
  },
  methods: {
    openMarket(arg) {
      arg && window.open(arg);
    },
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    getPid(path) {
      let pid = "";
      let menu = this.menus.filter((m) => {
        return m.path === path;
      });
      menu[0] && menu[0].id && (pid = menu[0].id);
      return pid;
    },
    //点击侧边栏菜单
    siderMenuSelect(data, d) {
      console.log(data, d);
      if (data && data.key) {
        let openPath = this.formatPath(data.key);

        if (openPath) {
          // let meuInfo = this.getMenuInfo(openPath);
          let pid = this.getPid(data.key);
          // console.log(pid);
          if (pid) {
            this.open({
              path: openPath,
              params: {
                pageId: pid,
              },
              // params: {
              //   pageId: meuInfo && meuInfo.pageId,
              //   type: meuInfo && meuInfo.type,
              // },
            });
          } else {
            this.open({
              path: openPath,
            });
          }
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

<style  lang="less">
@import "./layout.less";
</style>