<template>
  <div class="auth-center-wrapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      >
        <!-- <component :is='tab.name'></component> -->
        <span slot="label">
          {{ tab.label }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <router-view class="router-wrapper" :params="params"></router-view>
  </div>
</template>

<script>
// import authManagement from  '@/views/microPages/authManagement/index.vue'
// import group from  '@/views/microPages/group/index.vue'
// import menuManagement from '@/views/microPages/menuManagement/index.vue'
// import operateRecord from '@/views/microPages/operateRecord/index.vue'
// import rolePage from '@/views/microPages/rolePage/index.vue'
// import userPage from '@/views/microPages/userPage/index.vue'
// import tenantManagement from '@/views/microPages/tenantManagement/index.vue'

export default {
  // components:{
  //     authManagement,
  //     group,
  //     menuManagement,
  //     operateRecord,
  //     rolePage,
  //     userPage,
  //     tenantManagement
  // },
  methods: {
    handleClick(tab) {
      // console.log(tab.name);
      // console.log(this.$router);

      this.$router.push(tab.name);
    },
    setActiveName(name) {
      if (this.activeName === "0") {
        this.activeName = name;
        this.$router.push(name);
      }
    },
    refresh() {
      this.pid = this.$route.query.pageId;
      if (!this.pid) {
        this.activeName = this.$route.path;
        let name = this.activeName.split("/")[1];
        this.menus.forEach((m) => {
          if (m.name === name) {
            this.pid = m.id;
          }
        });
      }
    },
  },
  computed: {
    menus() {
      return this.$store.state.user.menus || [];
    },
    subMenus() {
      return this.$store.getters["user/subMenus"](this.pid) || [];
    },
    tabs() {
      //    console.log(this.subMenus);
      let ret = this.subMenus.map((m) => {
        return {
          label: m.meta.title,
          name: m.path,
        };
      });
      if (ret && ret[0] && ret[0].name) {
        this.setActiveName(ret[0].name);
      }
      // console.log(ret);
      return ret;
    },
  },
  watch: {
    "$route.query.pageId": {
      handler(val) {
        this.activeName = "0";
        this.refresh();
      },
    // },
    //   "$route": {
    //   handler(val) {
    //     // if(!this.pid){
    //     this.activeName = this.$route.path;

    //     // }
    //   },
    },
  },

  mounted() {
    this.refresh();

    // console.log(this.$route)
    // console.log(this.$store.state.user.menus);
  },
  data() {
    return {
      pid: "",
      activeName: "",

      // tabs:[{
      //     label:"租户管理",
      //     name:"/authCenter/tenantManagement",
      // },{
      //     label:"用户管理",
      //     name:"/authCenter/userPage",
      // },{
      //     label:"角色权限管理",
      //     name:"/authCenter/roleManagement",
      // },{
      //     label:"权限管理",
      //     name:"/authCenter/authManagement",
      // },{
      //     label:"菜单管理",
      //     name:"/authCenter/menuManagement",
      // },{
      //     label:"操作记录",
      //     name:"/authCenter/operateRecord",
      // }]
    };
  },
};
</script>

<style lang='scss' scoped>
.auth-center-wrapper {
  padding: 16px 20px 20px 20px;
  height: 100%;
  width: 100%;
  .tab-active {
    background-color: #ecf5ff;
    color: #66b1ff;
    color: rgba(229, 231, 235, 1);
  }
  ::v-deep .el-tabs {
    margin-bottom: 1px;
    .el-tabs__header {
      .el-tabs__nav-wrap {
        &::after {
          opacity: 0;
        }
        .el-tabs__nav {
          padding-bottom: 8px;
          .el-tabs__active-bar {
            background-image: linear-gradient(360deg, #22d5e6 0%, #3b8bf5 100%);
          }
        }
      }
    }

    .el-tabs__item {
      color: #333333;
      font-weight: 400;
      font-size: 14px;
      height: auto;
      line-height: unset;
      padding: 0 15px;
      &.is-active {
        color: #333333;
        font-weight: bold;
      }
    }
  }

  ::v-deep .el-table {
    color: #333333;
    .thead {
      color: #7f8c93;
    }
  }

  .router-wrapper {
    height: calc(100% - 46px);
    border-radius: 6px;
    // overflow: hidden;
    background-color: #f0f2f5;

    // ::v-deep .el-button--mini {
    //   padding: 8px 12px;
    // }

    ::v-deep .el-loading-spinner {
      .circular {
        display: inline;
      }
    }

    // ::v-deep .el-button--primary {
    //   background-image: linear-gradient(135deg, #0ae6f4 0%, #2772fa 100%);
    //   border: none;
    // }
    ::v-deep .is-plain {
      border-color: #4769b3;
      color: #4769b3;
    }

    ::v-deep .el-tree-node__expand-icon {
      margin-left: 16px;
    }
    ::v-deep .common-el-tree {
      .el-tree-node__content {
        height: 32px;
        line-height: 32px;
        margin-bottom: 2px;
      }
    }
    ::v-deep .is-current {
      > .el-tree-node__content {
        background-color: #e3f2fc !important;
        // border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3 !important;
        border-right: 3px solid #ffffff;
        font-weight: 500;
      }
    }
    ::v-deep .el-tree {
      color: #333333;
    }
  }
}
</style>