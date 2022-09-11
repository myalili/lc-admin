<template>
  <div class="my-app px-3.5 bg-system">
    <div class="flex items-center justify-between w-full" style="height: 60px">
      <span class="text-base font-bold">我的页面</span>
      <el-button
        icon="el-icon-plus"
        @click="openDialog('createApp')"
        type="primary"
        round
        size="mini"
        >空白创建</el-button
      >
    </div>
    <div>
      <div
        class="
          app-content
          grid
          md:grid-cols-6
          lg:grid-cols-7
          sm:grid-cols-5
          gap-5
          overflow-y-scroll
        "
        v-show="treeData.length > 0"
      >
        <div
          class="
            bg-white
            rounded-lg
            h-40
            flex
            items-center
            justify-center
            hover:shadow-lg
            cursor-pointer
            relative
            app-item
          "
          v-for="(item, index) in treeData"
          :key="index"
          @click.stop="checkDetails(item)"
        >
          <div class="w-full h-full flex flex-col cursor-pointer pt-6">
            <div class="flex justify-center items-center">
              <codeless-icon
                :icon="item.icon"
                style="width: 46px; height: 46px; margin-top: 0px"
                slot="prefix"
              ></codeless-icon>
            </div>
            <div class="mt-4 font-bold text-center p-3" :title="item.name">
              {{ item.name }}
            </div>
          </div>
          <div
            class="absolute h-6 top-2 right-3 items-center hidden app-item-info"
          >
            <!-- <i class="el-icon-info mr-2 text-gray-400" @click.stop="preview(item)"></i> -->
            <div @click.stop>
              <el-dropdown trigger="hover" @command="moreClick(item, $event)">
                <i class="el-icon-more text-gray-400"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">
                    <span class="flex items-center">
                      <i class="el-icon-edit"></i>
                      编辑信息
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item command="del">
                    <span class="flex items-center">
                      <i class="el-icon-delete"></i>
                      删除分类
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item command="temp">
                    <span class="flex items-center">
                      <i class="el-icon-shopping-bag-1"></i>
                      发布模板
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { addPage, deletePage, updatePage } = window.getBffApi();
const { getSource } = window.alcapCoreUtils;

export default {
  name: "myApp",
  mixins: [window.codelessMixins.customDialog],

  data() {
    return {
      spinning: false,
      menus: [],
      createTempData: {},
    };
  },
  computed: {
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
    treeData() {
      return this.menus.filter((i) => i.codelessType) || [];
    },
  },
  mounted() {
    
    this.getApplicationData();
  },
  methods: {
    getApplicationData() {
      let ctx = this;
      ctx.spinning = true;
      let params = {
        tenantId: ctx.tenantId,
        parentId: "root",
      };
      ctx.$store.dispatch("page/getAppMenus", params).then((res) => {
        ctx.menus = res;
      });

      ctx.spinning = false;
    },
    sureDelete(item) {
      let ctx = this;
      console.log(item);
      deletePage({ id: item.id })
        .then(async (res) => {
          if (res.success) {
            ctx.$notify({
              message: "删除成功",
              title: "成功",
              type: "success",
            });
            await this.getApplicationData();
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

    moreClick(item, e) {
      const ctx = this;
      if (e === "edit") {
        ctx.openDialog("updateApp", item);
      } else if (e === "del") {
        ctx.deleteApp(item);
      } else if (e === "temp") {
        console.log(item);
        ctx.saveTemp(item);
      }
    },
    createAppSubmit($el) {
      const ctx = this;
      let obj = {
        codelessType: "0",
        icon: $el.form.icon,
        id: "",
        name: $el.form.name,
        pageContent: "",
        pageType: "",
        parentId: "",
        tenantId: ctx.tenantId,
        version: "",
      };
      addPage(obj)
        .then(async (res) => {
          if (res.success) {
            ctx.notifySuccess("创建分类");
            await ctx.getApplicationData();
          } else {
            throw res;
          }
        })
        .catch((e) => {
          ctx.notifyError("创建分类", e);
        });
    },
    saveTemp(data) {
      const ctx = this;
      ctx.openCustomDialog({
        title: "上传模板图片",
        path: "saveTemp",
        width: "600px",
        propsData: {
          params: {
            id: data.id,
            type: "app",
            data,
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
      await this.getTemplateData();
    },
    openDialog(dialogType, item) {
      let ctx = this;
      let option = {};
      let params = {};
      let cb = () => {};
      switch (dialogType) {
        case "createApp":
          cb = ctx.createAppSubmit;
          option = {
            path: "createApp",
            title: `创建分类`,
          };
          break;

        case "updateApp":
          cb = ctx.updateAppSubmit;
          params = {
            detail: item,
          };
          option = {
            path: "updateApp",
            title: `编辑分类`,
            confirmBtnText: "保存",
          };
          break;

        case "addModule":
          cb = ctx.addModuleSubmit;
          ctx.createTempData = item;
          console.log(ctx.createTempData);
          params = {
            detail: {
              icon: "icon-yemianmingcheng1",
              name: item.description,
            },
          };
          option = {
            path: "addModule",
            title: `以模板创建页面`,
          };
          break;
      }

      let dialogOption = {
        width: "600px",
        component: "addAppV2",
        propsData: {
          params: {
            name: "分类名称",
            iconName: "分类图标",
            iconEditable: true,
            ...params,
          },
        },
        confirmBtnText: "创建",
        ...option,
        beforeConfirm: ($_dontCare, $el) => {
          let result = true;
          $el.$refs.ruleForm.validate(async (valid) => {
            if (valid) {
              await cb($el);
            } else {
              result = false;
            }
          });
          return result;
        },
      };

      ctx.openCustomDialog(dialogOption);
    },

    updateAppSubmit($el) {
      const ctx = this;
      let form = JSON.parse(JSON.stringify($el.form));
      updatePage(form)
        .then(async (res) => {
          //下一步的行为
          if (res.success) {
            ctx.notifySuccess("编辑页面分类");
            await ctx.getApplicationData();
          } else {
            throw res;
          }
        })
        .catch(function (error) {
          ctx.notifyError("编辑页面分类", error);
        });
    },
    async deleteApp(item) {
      let ctx = this;
      ctx
        .$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          ctx.sureDelete(item);
        });
    },
    async checkDetails(item) {
      console.log(item);
      let ctx = this;
      let component = await getSource("@micro-page/addPageIndex", {
        inSpaOpen: true,
      });
      this.open({
        path: "appV2/addPageIndexV2",
        layout: "appV2",
        // component:async()=> await getSource("@micro-page/addPageIndex"),
        ...component,
        params: {
          pId: item.id,
          name: item.name,
          menuId:ctx.AParams.menuId
          // node:item,
          // preview: true,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-app {
  height: 100%;
  ::v-deep .el-loading-spinner {
    left: 50%;
  }
  .app-item {
    &:hover {
      .app-item-info {
        display: flex;
      }
    }
  }
}
</style>