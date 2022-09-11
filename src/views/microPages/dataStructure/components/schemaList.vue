<template>
  <div class="nav h-full relative">
    <div class="nav-head flex items-center">
      <div
        class="nav-head-add text-center leading-5 bg-primary"
        @click="addLeftlist"
        :class="[
          isPlatform ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        ]"
      >
        <!-- <i class="iconfont icon-jiahao inline-block"></i> -->
        <i class="el-icon-plus inline-block font-bold" title="新增数据结构"></i>
      </div>
      <div class="search mr-2.5">
        <el-input ref="userNameInput" placeholder="搜索关键词" v-model="search">
          <svg
            style="margin-top: 6px; width: 12px; height: 12px; margin-left: 4px"
            aria-hidden="true"
            slot="prefix"
          >
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <!-- <codeless-icon
            icon="icon-sousuo"
            style="margin-top: 6px; width: 12px; height: 12px; margin-left: 4px"
            slot="prefix"
          ></codeless-icon> -->
        </el-input>
      </div>
      <svg
        class="icon svg-icon absolute w-3 h-3 z-1"
        aria-hidden="true"
        style="right: 88px"
      >
        <use xlink:href="#icon-a-shaixuanguolv"></use>
      </svg>
      <el-select v-model="projectId" placeholder="请选择" class="w-90px">
        <el-option
          v-for="item in projectIds"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div
      class="nav-double flex justify-center items-center overflow-hidden h-7"
    >
      <div
        class="h-full text-center leading-7"
        v-for="(item, index) in doubleList"
        :key="index"
        @click="chooseItem(item)"
        :class="{ active: currentItem.label === item.label }"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="nav-list w-full">
      <div class="w-full nav-list-content">
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
            v-if="!isPlatform && listId === item.id"
          >
            <i
              class="el-icon-delete text-primary"
              title="删除数据结构"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="entity-box-footer text-center p-2 flex-auto1">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageNum"
        @current-change="getList"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="是否确认删除列表项"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleOk" :disabled="btnDisbled"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
const { deleteSchema, getSchemaList } = window.getBffApi();

export default {
  mixins: [window.V8.mixins,window.codelessMixins.customDialog],
  mounted() {
    this.currentItem = this.doubleList[0];
    this.getList();
    let self = this;
    window.msgHub.$off("ds_refresh").$on("ds_refresh", (val) => {
      self.pageNum = 1;
      self.getList(val);
    });
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      total: 0,
      pageNum: 1,
      projectIds: [
        {
          label: "平台级",
          value: "public",
        },
        {
          label: "项目级",
          value: this.$store.getters["user/tenantId"],
        },
      ],
      projectId: this.$store.getters["user/tenantId"],
      doubleList: [
        { label: "查询", value: "retrieve" },
        { label: "新增", value: "create" },
        { label: "修改", value: "update" },
        { label: "删除", value: "delete" },
      ],
      currentItem: "",
      search: "",
      listId: "",
      navlistId: "",
      leftList: [],
      btnDisbled: false,
    };
  },
  computed: {
    isPlatform() {
      return this.projectId === "public" ? true : false;
    },
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      // this.btnDisbled = true;
      deleteSchema(this.navlistId).then((res) => {
        this.$notify({
          title: "删除成功",
          message: "删除成功",
          type: "success",
        });
        this.visible = false;
        window.msgHub.$emit("ds_showEmpty", true);
        this.getList();
        this.btnDisbled = false;
      });
    },
    delList(item) {
      // this.visible = true;
      this.navlistId = item.id;
      let self = this
         self.openCustomDialog({
                title:`提示`,
                path:'deleteConfirm',
                width:"300px",
                component:{
                  template:`<div>是否确认删除列表项?</div>`,
                },
                confirmCallback(){
                   self.handleOk()
                }
              })
    },
    selectItem(item) {
      this.listId = item.id;
      window.msgHub.$emit("ds_currentSchema", item);
      window.msgHub.$emit("ds_showEmpty", false);
    },
    //选择列表类型
    chooseItem(item) {
      this.currentItem = item;
      (this.listId = ""), this.getList();
      window.msgHub.$emit("ds_showEmpty", true);
    },
    getList(name) {
      let params = {
        operationType: this.currentItem.value,
        type: "db,data_source",
        tenantId: this.projectId,
        pageNum: this.pageNum,
        pageSize: 10,
        name: this.search,
      };
      getSchemaList(params).then((res) => {
        let arr = res.obj.content;
        let arr1 = arr.filter((item) => item.type === "db");
        let arr2 = arr.filter((item) => item.type === "data_source");
        this.leftList = arr1.concat(arr2);
        this.total = res.obj.totalElements;

        console.log(res);
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
      if (this.isPlatform) {
        return;
      }
      this.listId = "";
      let schema = {
        id: "",
        desc: "",
        name: "",
        operationType: this.currentItem.value,
        structure: JSON.stringify({}),
        tenantId: this.projectId,
      };
      window.msgHub.$emit("ds_currentSchema", schema);
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
    projectId(val) {
      window.msgHub.$emit("ds_showEmpty", true);
      this.currentItem = this.doubleList[0];
      this.listId = "";
      this.pageNum = 1;
      this.getList();
    },
  },
};
</script>

<style lang='less' scoped>
.nav {
  width: 300px;
  border-right: 1px solid #ebeef0;
  &-head {
    margin-top: 16px;
    margin-left: 20px;
    &::v-deep .el-input__inner {
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
      i {
        font-size: 12px;
      }
    }

    .search {
      // min-width: 50px !important;
      width: 128px;
    }
    &::v-deep .el-select {
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


      color: #fff;
    }
  }
  &-double div:last-child {
    border: none !important;
  }
  &-list {
    overflow-y: overlay;
    height: calc(100% - 138px);

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
      // border-right: 3px solid #ffffff;
      width: 100%;
      height: 60px;
      // border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3;

      &:hover {
        background-color: #e3f2fc !important;
      }

      // background: #e3f2fc;
      // border-right: 5px solid #22d5e6;
    }
  }
}
</style>