<template>
  <div class="nav h-full relative">
    <div class="nav-head flex items-center justify-between">
      <!-- <div
        class="nav-head-add text-center leading-5"
        @click="addLeftlist"
        :class="[
           'cursor-pointer',
        ]"
      >
        <i class='el-icon-plus inline-block font-bold' title='新增数据结构'></i>
      </div> -->
      <span class="text-base font-bold">数据源管理</span>
      <div class="search mr-2.5">
        <el-input
        v-model="search"
        placeholder="搜索关键词"
        size="mini"
        style="width: 140px"
      >
        <codeless-icon
          icon="icon-sousuo"
          style="margin-top: 0px; width: 14px; height: 14px; margin-left: 4px"
          slot="prefix"
        ></codeless-icon>
      </el-input>
      </div>
      <el-button
        class="w-5 h-5 p-0 flex items-center justify-center"
        type="primary"
        icon="el-icon-plus"
        circle
        size="mini"
        title="新增数据结构"
        @click="addLeftlist"
      ></el-button>
    </div>
    <div class="nav-list w-full flex items-center justify-center">
      <div class="w-full h-full nav-list-content" v-if="leftList.length > 0">
        <div
          v-for="item in leftList"
          :key="item.id"
          id="item"
          @click="selectItem(item)"
          :class="{
            active: listId === item.id,
          }"
          class="cursor-pointer"
        >
          <div style="float: left">
            <div style="font-weight: bold; font-size: 14px">
              {{ item.desc }}
            </div>
            <div style="color: #7f8c93">{{ item.name }}</div>
          </div>
          <div
            style="float: right; margin-right: 10px; line-height: 35px"
            @click="delList(item)"
            v-if="listId === item.id"
          >
            <i
              class="el-icon-delete text-primary"
              title="删除数据源"
            ></i>
          </div>
        </div>
      </div>
      <el-empty description="数据源空" v-else></el-empty>
    </div>
  </div>
</template>

<script>
const { domainDel, domainList } = window.getBffApi();

export default {
  mixins: [window.codelessMixins.customDialog],
  mounted() {
    this.getList();
    let self = this;
    window.msgHub.$off("ds_refresh").$on("ds_refresh", () => {
      self.getList();
    });
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      total: 0,
      pageNum: 1,

      search: "",
      listId: "",
      leftList: [],
      btnDisable: false,
    };
  },
  computed: {},
  methods: {
    delList(item) {
      const ctx = this;
      ctx.openCustomDialog({
        title: "提示",
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确认删除该数据源吗?</div>`,
        },
        confirmCallback() {
          domainDel(item.id).then((res) => {
            ctx.$notify({
              title: "删除成功",
              message: "删除成功",
              type: "success",
            });
            window.msgHub.$emit("ds_showEmpty", true);
            ctx.getList();
            ctx.btnDisable = false;
          });
        },
      });
    },
    selectItem(item) {
      this.listId = item.id;
      window.msgHub.$emit("ds_currentDataSource", item);
      window.msgHub.$emit("ds_showEmpty", false);
    },
    //选择列表类型
    chooseItem(item) {
      this.currentItem = item;
      (this.listId = ""), this.getList();
      window.msgHub.$emit("ds_showEmpty", true);
    },
    getList(name) {
      domainList().then((res) => {
        let arr = res;
        this.leftList = arr.sort((a, b) => { return b.updateTime - a.updateTime});
        console.log('leftList', this.leftList[0].desc);
        // this.total = res.obj.totalElements;
        //新增数据结构保存后自动高亮
        if (name) {
          for (let i = 0; i < this.leftList.length; i++) {
            if (this.leftList[i].name === name) {
              this.selectItem(this.leftList[i]);
              break;
            }
          }
        } else if (this.leftList.length) {
          this.selectItem(this.leftList[0]);
        }
      });
    },
    addLeftlist() {
      this.listId = "";
      let dataSource = {
        name: "",
        desc: "",
        domain: "",
        port: "",
        https: true,
        interfaces: [
          {
            id: "1",
            if: "",
            name: "",
            method: 'post'
          },
        ],
      };
      window.msgHub.$emit("ds_currentDataSource", dataSource);
      window.msgHub.$emit("ds_showEmpty", false);
    },
  },
  watch: {
    search() {
      window.msgHub.$emit("ds_showEmpty", true);
      this.listId = "";
      this.pageNum = 1;
      this.getList();
    },
  },
};
</script>

<style lang='scss' scoped>
.nav {
  width: 300px;
  border-right: 1px solid #ebeef0;
  &-head {
    margin-top: 16px;
    // margin-left: 20px;
    padding: 0 20px;
    ::v-deep.el-input__inner {
      border-radius: 50px;
      height: 26px;
      font-size: 12px;
    }
    // ::v-deep .el-input {
    //   .el-input__inner {
    //     border-radius: 222px;
    //     height: 26px;
    //   }
    //   .el-input__prefix {
    //     display: flex;
    //     align-items: center;
    //   }
    //  }

    ::v-deep .el-input__icon {
      line-height: 26px;
    }
    &-add {
      // opacity: 1;
      border-radius: 50%;
      margin-right: 12px;
      color: #fff;
      width: 20px;
      height: 20px;
      background: linear-gradient(134deg, #00e2ff 0%, #2577fa 100%);
      i {
        font-size: 12px;
      }
    }

    .search {
      // min-width: 50px !important;
      width: 140px;
      ::v-deep .el-input {
        .el-input__inner {
          border-radius: 222px;
          height: 26px;
        }
        .el-input__prefix {
          display: flex;
          align-items: center;
        }
      }
    }
    ::v-deep .el-select {
      .el-input {
        font-size: 12px;
        .el-input__inner {
          padding-left: 26px;
          padding-right: 26px;
        }
        .el-select__caret {
          font-size: 12px;
        }
      }
    }
  }
  &-double {
    width: 274px;
    margin: 12px auto;
    border-radius: 50px;
    background: #ccc;
    div {
      flex: 1;
      border-right: 1px solid #fff;
      cursor: pointer;
      color: #7f8c93;
      background: #e6ecef;
    }

    .active {
      background: #3698f2;
      color: #fff;
    }
  }
  &-double div:last-child {
    border: none !important;
  }
  &-list {
    overflow-y: overlay;
    height: calc(100% - 45px);
    margin-top: 16px;

    // &-content{
    //   overflow-y: overlay;
    // }
    ::-webkit-scrollbar {
      width: 1px;
    }
    ::-webkit-scrollbar-track {
      background: #f2f2f2;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #f2f2f2;
    }
    ::-webkit-scrollbar-thumb:active {
      background: rgba(0, 0, 0, 0.2);
    }
    #item {
      width: 100%;
      height: 60px;
      padding-left: 20px;
      padding-top: 10px;
      color: #333333;
      margin-bottom: 3px;

      &:hover {
        background-color: #f0f4f7;
      }
    }
    .active {
      background-color: #e3f2fc;
      width: 100%;
      height: 60px;
      border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3;

      &:hover {
        background-color: #e3f2fc !important;
      }

      // background: #e3f2fc;
      // border-right: 5px solid #22d5e6;
    }
  }
}
</style>