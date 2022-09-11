<template>
  <div class="code-less-app" v-loading="loading">
    <div class="code-less-app-menu">
      <div class="code-less-app-menu-title">
        <div class="app-detail-title" :title="currentTree.name">
          <codeless-back @back="returnMenu"></codeless-back>
          {{ currentTree.name }}
        </div>
        <div>
          <el-dropdown trigger="hover" @command="addApp($event)">
            <el-button
              icon="el-icon-plus"
              size="mini"
              round
              @click="openNewPage({
                  showTemp: false,
                })"
              type="primary"
              class="codeless-mr-12"
              >新建</el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in pageList"
                :key="index"
                :command="item"
              >
                <hr v-if="item == 'sp'" />
                <span v-else class="flex items-center">
                  <codeless-icon
                    :icon="item.icon"
                    style="float: left; width: 15px; margin-right: 4px"
                  ></codeless-icon>
                  {{ item.name }}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="code-less-app-menu-search">
        <el-input v-model="search" size="mini" placeholder="搜索关键词">
          <codeless-icon
            icon="icon-sousuo"
            style="margin-top: 0px; width: 14px; height: 14px; margin-left: 5px"
            slot="prefix"
          ></codeless-icon>
        </el-input>
        <i
          class="el-icon-refresh cursor-pointer"
          @click="refresh"
          style="font-size: 16px; margin-left: 6px"
          title="刷新"
        ></i>
      </div>
      <div v-if="currentTree.children" class="code-less-app-menu-tree">
        <el-tree
          ref="appMenuTree"
          :data="currentTrees.reverse()"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
          :current-node-key="currentKey"
          @node-click="openPage"
          highlight-current
        >
        </el-tree>
      </div>
      <div class="flex items-center justify-center flex-col mt-52" v-else>
        <img class="w-36" src="/img/bg_noTree.png" alt="" />
        <p class="text-base font-bold mt-5">暂无分类或页面</p>
        <p class="text-gray-500 text-xs mt-2">请在右侧选择新建模式</p>
      </div>
    </div>

    <div class="code-less-app-content">
      <router-view @update="refresh"></router-view>
    </div>
  </div>
</template>

<script>
const { addPage, deletePage, updatePage, getPageVersions, getPageDetails } =
  window.getBffApi();
const { getSource } = window.alcapCoreUtils;
export default {
  mixins: [window.codelessMixins.customDialog],
  provide() {
    return {
      detail: this,
    };
  },
  data() {
    return {
      loading: false,
      currentTree: {},
      search: "",
      extendKeys: [],

      // 树映射
      defaultProps: {
        children: "children",
        label: "name",
      },

      dialogInfo: {
        title: "标题",
        visible: false,
        width: "600px",
        params: {},
      },
      treeDatas: [],
      currentKey: "",
    };
  },
  watch: {
    $route: {
      async handler(to, from) {
        if (to.query.pageId !== from.query.pageId) {
          this.refresh();
        }
      },
    },
  },
  async mounted() {
    let ctx = this;
    window.msgHub.$on("openDialogInAppDetails", (params) => {
      let { type, data } = params;
      ctx.openDialog(type, data);
    });
    window.msgHub.$on("addAppInAppDetails", (params) => {
      ctx.addApp(params);
    });
    this.refresh();
  },
  computed: {
    // myPageOpenOptions(){
    //   return this.$store.state.application.myPageOpenOptions
    // },
    pageList() {
      let rets = [];
      let pages = activator.get("alcap.create");
      if (pages && pages.pannel) {
        rets = pages.pannel;
      }
      return rets;
    },
    currentTrees() {
      // console.log(this.currentTree);
      let ctx = this;
      let data = JSON.parse(JSON.stringify(this.currentTree));
      return data.children.filter((d) => {
        if (d.children && d.children.length) {
          d.children = d.children.reverse().filter((item) => {
            return item.name.includes(ctx.search);
          });
          return d.children.length;
        } else {
          return d.name.includes(ctx.search);
        }
      });
    },
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
  },
  methods: {
    // 树节点自定义渲染
    renderContent(h, { node, data, store }) {
      const ctx = this;
      return (
        <span class="app-menu-item  relative overflow-hidden flex items-center ">
          {data.codelessType === "0" &&
            !(data.children && data.children.length) && (
              <span class="app-menu-category  el-icon-caret-right"></span>
            )}
          <span class="app-menu-title  w-full flex items-center">
            <codeless-icon
              icon={data.icon || "icon-kuaijierukou3"}
            ></codeless-icon>
            <span
              class="ml-3 overflow-hidden overflow-ellipsis"
              title={node.label}
            >
              {node.label}
            </span>
          </span>

          <span class="flex items-center">
            <el-dropdown
              trigger="hover"
              on-command={(e) => {
                ctx.treeMoreClick(data, e);
              }}
            >
              <i class="app-menu-more el-icon-more transform rotate-90 absolute right-0 hidden"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
                {data.codelessType !== "0" && (
                  <el-dropdown-item command="temp">发布模板</el-dropdown-item>
                )}
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      );
    },
    async treeMoreClick(data, command) {
      console.log(data);
      const ctx = this;
      if (command === "edit") {
        ctx.newUpdate(data);
      } else if (command === "del") {
        ctx.deleteTree(data);
      } else {
        let versionList = await ctx.getPageVersionsList(data.id);
        let releaseVersion = {};
        releaseVersion = versionList.filter((item) => {
          return item.status === "release";
        });

        if (releaseVersion.length) {
          let { id } = releaseVersion[0];
          await getPageDetails({ id }).then((res) => {
            if (res.success) {
              let { obj } = res;
              if (obj) {
                ctx.saveTemp(obj);
              }
            }
          });
        } else {
          this.$notify({
            title: "无法发布模板",
            message: "该原型页面无上架版本可以发布为模板",
            type: "warning",
          });
        }
      }
    },
    async getPageVersionsList(id) {
      let res = await getPageVersions({ id });
      if (res.success) {
        return res.obj;
      } else {
        ctx.notifyError("获取页面版本", res);
        return "";
      }
    },
    saveTemp(data) {
      console.log(data);
      const ctx = this;
      ctx.openCustomDialog({
        path: "uploadTemp",
        title: "上传模板图片",
        width: "600px",
        propsData: {
          params: {
            data,
            type: "page",
          },
        },
        component: "uploadTemp",
        confirmBtnText: "上传",
        confirmCallback: ctx.uploadTempSubmit,
      });
    },
    async uploadTempSubmit($el) {
      const ctx = this;
      await $el.upload();
    },

    async refresh(id) {
      // console.log("refresh");
      let ctx = this;
      ctx.loading = true;
      let { name, pId } = ctx.AParams;
      let params = {
        tenantId: ctx.tenantId,
        parentId: pId,
      };
      let res = await ctx.$store.dispatch("page/getAppMenus", params);
      let node = {
        name,
        codelessType: "0",
        id: pId,
      };
      // console.log(node,res,ctx.$route)
      if (Array.isArray(res) && res.length) {
        ctx.currentTree = {
          ...node,
          children: res,
        };
      } else {
        ctx.currentTree = node;
      }
      ctx.loading = false;
      this.$nextTick(() => {
        this.$refs.appMenuTree &&
          this.$refs.appMenuTree.setCurrentKey(ctx.AParams.pageId || id);
      });
    },
    async openNewPage(params) {
      let ctx = this;
      let component = await getSource("@micro-page/addPageIndex", {
        inSpaOpen: true,
      });
      this.open({
        path: "appV2/addPageIndexV2",
        layout: "appV2",
        ...component,
        // component:async()=> await getSource("@micro-page/addPageIndex"),
        params: {
          pId: ctx.AParams.pId,
          menuId:ctx.AParams.menuId,
          name: ctx.AParams.name,
          ...params,
        },
      });
    },
    //返回
    returnMenu() {
      let {menuId} = this.$route.query;
      if(menuId){
         let pMenu = this.$store.getters['user/menu'](menuId);
         console.log(pMenu)
         if(pMenu){
          this.open( 
            {
              path:pMenu.path,
              params:{
                menuId:pMenu.id
              }
            }
          )
         }
          
      }
     
    },
    openDialog(dialogType, item) {
      let ctx = this;
      let option = {};
      let params = {};
      let cb = () => {};
      let pathData = ctx.filterMenu([ctx.currentTree]);
      let codelessType = item.type || item.codelessType;
      let details = {};
      let formData = {};

      switch (dialogType) {
        case "addApp":
          cb = ctx.addAppSubmit;
          option = {
            path: "addApp",
            title: "创建" + item.name,
          };
          break;

        case "newUpdate":
          let name = item.children ? "分类" : "页面";
          formData = item;
          console.log(item);
          cb = ctx.newUpdateSubmit;
          pathData = [];
          details = {
            component: (item.info && JSON.parse(item.info).path) || "",
            pageType: item.pageType,
            name: item.name,
            scene: item.parentId,
          };
          option = {
            path: "newUpdate",
            title: `编辑${name}`,
            confirmBtnText: "保存",
          };
          params = {
            iconName: name + "图标",
          };
          break;

        case "tempCreate":
          formData = item;
          console.log(formData);
          cb = ctx.addAppSubmit;
          option = {
            path: "tempCreate",
            title: `创建模板页面`,
          };

          details = {
            component: (item.info && JSON.parse(item.info).path) || "",
            pageType: item.pageType,
            name: item.title || item.name,
          };
          break;
      }

      let dialogOption = {
        width: "600px",
        component: "addAppV2",
        propsData: {
          params: {
            name: "页面名称",
            iconName: "页面图标",
            iconEditable: true,
            data: pathData,
            isMicro: codelessType === "4",
            detail: {
              icon: item.icon,
              name: "",
              scene: ctx.AParams.pId,
              pageType: codelessType === "4" ? "js" : "",
              ...details,
            },
            ...params,
          },
        },
        confirmBtnText: "创建",
        ...option,
        beforeConfirm: async ($_dontCare, $el) => {
          return await new Promise(async (resolve, reject) => {
            $el.$refs.ruleForm.validate(async (valid) => {
              if (valid) {
                let info = {
                  path: $el.form.component || "",
                };
                let pageObj = {
                  codelessType: codelessType,
                  pageContent: "",
                  tenantId: ctx.tenantId,
                  ...formData,
                  icon: $el.form.icon,
                  pageType: $el.form.pageType,
                  parentId: $el.form.scene ? $el.form.scene : ctx.AParams.pId,
                  info: codelessType === "4" ? JSON.stringify(info) : "",
                  name: $el.form.name,
                };
                console.log(pageObj);

                await cb(pageObj);
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
        },
      };
      console.log(dialogOption);
      ctx.openCustomDialog(dialogOption);
    },

    // 菜单删除
    deleteTree(item) {
      let ctx = this;
      // this.showDelete = true;
      // ctx.deleteMessage = item;
      // console.log(item);
      let title = "页面";
      let desp =
        "该原型页面的草稿、已发布版本、上架页面都会清空，确认删除该页面？";
      if (item.codelessType === "0") {
        title = "分类";
        desp =
          "该分类下所有原型页面的草稿、已发布版本、上架页面都会清空，确认删除该分类？";
      }

      ctx.openCustomDialog({
        title: `删除${title}`,
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>${desp}</div>`,
        },
        confirmCallback() {
          ctx.sureDelete(item);
        },
      });
    },
    // 确认删除
    sureDelete(item) {
      let ctx = this;
      console.log(item);
      deletePage({ id: item.id })
        .then((res) => {
          if (res.success) {
            ctx.$notify({
              message: "删除成功",
              title: "成功",
              type: "success",
            });
            ctx.refresh();
            ctx.openNewPage();
          } else {
            throw res;
          }
        })
        .catch((e) => {
          ctx.$notify.error({
            message: e,
            title: "删除失败",
          });
        });
    },
    // 编辑菜单标题等基础信息
    newUpdate(item) {
      let ctx = this;
      ctx.openDialog("newUpdate", item);
    },
    async newUpdateSubmit(pageObj) {
      const ctx = this;

      await updatePage(pageObj)
        .then(async (res) => {
          if (res.success) {
            ctx.notifySuccess("修改");
            ctx.refresh();
            ctx.openPage({
              ...res.obj,
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          ctx.notifyError("修改", e);
        });
    },

    async addAppSubmit(pageObj) {
      const ctx = this;

      await addPage(pageObj)
        .then((res) => {
          if (res.success) {
            ctx.notifySuccess("创建");
            ctx.refresh(res.obj.id);
            ctx.openPage({
              ...res.obj,
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          ctx.notifyError("创建", e);
        });
    },

    // 添加菜单
    async addApp(target) {
      let ctx = this;
      if (target && target.type) {
        ctx.openDialog("addApp", target);
      } else {
        ctx.openNewPage({
          showTemp: true,
        });
      }
    },
    filterMenu(data) {
      let ctx = this;
      return data
        .filter((item) => {
          return item.codelessType === "0";
        })
        .map((item) => {
          item = Object.assign({}, item);
          item.title = item.name;
          if (item.children) {
            item.children = ctx.filterMenu(item.children);
          }
          return item;
        });
    },
    // 菜单详情页面
    async openPage(page) {
      const ctx = this;
      // ctx.hoverIndex = page.id;

      if (Number(page.codelessType) < 1) {
        ctx.openNewPage();
        return;
      }

      // console.log(page);
      let query = {
        name: ctx.AParams.name,
        menuId: ctx.AParams.menuId,
        title: page.name,
        pageId: page.id,
        type: page.codelessType,
        pId: ctx.AParams.pId,
        preview: true,
        page: {
          pageType: page.pageType,
          path: page.info ? JSON.parse(page.info).path : "",
        },
      };

      ctx.openRenderPage({
        path: "appV2/renderV2",
        layout: "appV2",
        params: {
          ...query,
        },
      });
    },
  },
  beforeDestroy() {
    window.msgHub.$off("openDialogInAppDetails");
    window.msgHub.$off("addAppInAppDetails");
  },
};
</script>
<style scoped lang="less">
.app-detail-title {
  cursor: pointer;
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  width: 160px;
  text-overflow: ellipsis;
  .back {
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    // margin-right: 6px;
    ::v-deep .svg-icon {
      width: 12px;
      height: 12px;
    }
  }
}
.code-less-app-menu-search {
  padding: 0 10px;
  margin: 5px 0 10px;
  display: flex;
  align-items: center;

  ::v-deep .el-input {
    flex: 1;
    .el-input__inner {
      border-radius: 222px;
    }
    .el-input__prefix {
      display: flex;
      align-items: center;
    }
  }
}

.code-less-app {
  display: flex;
  width: 100%;
  height: 100%;
  background: #f9fafc;
  border-top: 1px solid #eee;

  &-menu {
    width: 240px;
    &-title {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .margin-r {
      margin-right: 5px;
    }

    &-tree {
      height: calc(100% - 95px);
      overflow-y: overlay;
    }
  }
  &-content {
    background: #fff;
    overflow: auto;
  }
}

.code-less-app-content {
  width: calc(100% - 240px);
  height: 100%;
}

::v-deep .el-tree {
  background: transparent;
  .el-tree-node {
    border-right: 3px solid transparent;
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .is-current {
    background-color: #e3f2fc;
    border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3;
    border-color: #ffffff;
  }
  .el-tree-node__content {
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    // border-right: 3px solid transparent;
    width: 100%;
    overflow: hidden;
    .app-menu-more {
      top: -7px;
    }
    &:hover {
      background-color: #e3f2fc;
      // border-right: 3px solid transparent;
      .app-menu-more {
        display: block;
      }
    }
  }
}

// ::v-deep .el-loading-spinner {
//   left: 50%;
// }
::v-deep .app-menu-category {
  cursor: pointer;
  color: #c0c4cc;
  left: -18px;
  position: absolute;
  font-size: 12px;
}

::v-deep .app-menu-item {
  width: calc(100% - 20px);
}
</style>
