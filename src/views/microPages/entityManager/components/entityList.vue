<template>
  <div class="entity-box">
    <div class="entity-box-search relative">
      <!-- <span
        class="
          flex
          items-center
          justify-center
          w-5
          h-5
          cursor-pointer
          rounded-full
          text-white
          bg-gradient-primary
        "
        @click="createEntity"
      >
        <el-icon class="el-icon-plus" style="font-size: 8px" ></el-icon>
      </span> -->
      <span class="text-base font-bold">实体管理</span>

      <el-input
        v-model="searchInput"
        placeholder="搜索关键词"
        @input="queryList"
        size="mini"
        style="width: 140px"
      >
        <codeless-icon
          icon="icon-sousuo"
          style="margin-top: 0px; width: 14px; height: 14px; margin-left: 4px"
          slot="prefix"
        ></codeless-icon>
      </el-input>

      <el-button
        class="w-5 h-5 p-0 flex items-center justify-center"
        type="primary"
        icon="el-icon-plus"
        circle
        size="mini"
        title="新增实体列表"
        @click="createEntity"
      ></el-button>

      <!-- <svg class="icon svg-icon absolute w-3 h-3 z-1" aria-hidden="true" style='right:88px'>
          <use xlink:href="#icon-a-shaixuanguolv"></use>
        </svg> -->
      <!-- <el-select v-model="projectId" placeholder="请选择" class='w-90px '>
          <el-option
            v-for="item in projectIds"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->

      <!-- <el-dropdown
        trigger="click"
        @command="handleCommand"
      >
        <span class="el-dropdown-link">
          <i
            class="el-icon-more el-icon--right"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            style="padding: 0"
            :style="dropdownStyle(item.value)"
            v-for="item in projectIds"
            :key="item.value"
            :command="item.value"
          >
            <div
              class="h-full w-full flex items-center px-5"
              :class="{ 'tab-active': item.value === projectId }"
            >
              {{ item.label }}
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>

    <div class="entity-box-list">
      <ul>
        <li
          v-for="(item, index) in entityList"
          :key="index"
          :class="item.id == indexId ? 'list-item selected' : 'list-item'"
          class="h-16"
          @click="clickEntityItem(item)"
        >
          <div>
            <div class="list-item-desc">{{ item.desc }}</div>
            <div class="list-item-name">{{ item.name }}</div>
          </div>

          <i class="el-icon-delete mr-3" @click="deleteEntity(item.id)"></i>
        </li>
      </ul>
    </div>
    <div class="entity-box-footer">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageNum"
        @current-change="queryList"
      >
      </el-pagination>
    </div>

    <entity-dialog :visible.sync="showDialog" v-if="showDialog"></entity-dialog>
  </div>
</template>

<script>
const { getEntityList, deleteEntity } = window.getBffApi();
import entityDialog from "./entityDialog.vue";
export default {
  mixins: [window.codelessMixins.customDialog],
  components: {
    entityDialog,
  },
  data() {
    return {
      showDialog: false,
      indexId: "",
      searchInput: "",
      entityObj: {},
      entityList: [],
      pageSize: 11,
      pageNum: 1,
      total: 0,

      projectId: this.$store.getters["user/tenantId"],
      // projectIds: [
      //   {
      //     label: '平台级',
      //     value: ''
      //   },
      //   {
      //     label: '项目级',
      //     value: this.$store.getters["user/tenantId"]
      //   }
      // ]
    };
  },
  computed: {
    // dropdownStyle() {
    //   const ctx = this;
    //   return (e) => {
    //     if (e === ctx.projectId) {
    //       return {
    //         "background-color": e === ctx.projectId ? "#ecf5ff" : "",
    //         color: e === ctx.projectId ? "#66b1ff" : "#303133",
    //         "font-weight": 500,
    //       };
    //     }
    //   };
    // },
    // tenantId() {
    //   return this.$store.getters['user/tenantId']
    // }
  },
  watch: {
    projectId() {
      const ctx = this;
      ctx.queryList();
    },
  },
  methods: {
    // handleCommand(e) {
    //   const ctx = this;
    //   ctx.projectId = e;
    //   ctx.queryList();
    // },
    resetIndex(id, order) {
      this.pageNum = 1;
      var params = {
        name: "",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        order: order,
        tenantId: this.projectId,
      };
      getEntityList(params)
        .then((res) => {
          this.entityList = res.content;
          this.total = res.totalElements;
          if (this.entityList.length !== 0) {
            this.entityList.forEach((element) => {
              if (element.id == id) {
                this.clickEntityItem(element);
              }
            });
          } else {
            this.$emit("showEntityDetail", {}, "view");
          }
        })
        .catch((error) => {
          this.$notify({
            title: error,
            type: "error",
          });
        });
    },
    createEntity() {
      //this.showDialog=true
      var entityObj = {
        name: "",
        id: "",
        schemas: [],
        fields: [],
        type: "db",
      };
      this.$emit("showEntityDetail", entityObj, this.indexId, "create");
    },
    deleteEntity(id) {
      const ctx = this;
      ctx.openCustomDialog({
        title: "提示",
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确认删除该实体吗?</div>`,
        },
        confirmCallback() {
          let params = {
            id: id,
          };
          deleteEntity(params)
            .then(() => {
              ctx.$notify({
                title: "删除成功",
                type: "success",
              });
              ctx.queryList();
            })
            .catch((error) => {
              ctx.$notify({
                title: error,
                type: "error",
              });
            });
        },
      });
    },
    clickEntityItem(val) {
      this.indexId = val.id;
      this.$emit("showEntityDetail", val, this.indexId, "view");
    },
    queryList() {
      var params = {
        name: this.searchInput,
        pageNum: this.pageNum,
        pageSize: 11,
        tenantId: this.projectId,
      };
      getEntityList(params)
        .then((res) => {
          this.entityList = res.content;
          this.total = res.totalElements;
          if (this.entityList.length !== 0) {
            this.clickEntityItem(this.entityList[0]);
          } else {
            this.$emit("showEntityDetail", {}, "view");
          }
        })
        .catch((error) => {
          this.$notify({
            title: error,
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.queryList();
  },
};
</script>

<style lang="scss" scoped>
.entity-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  &-search {
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    padding: 14px 20px 14px 20px;
    flex: 0 0 auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    ::v-deep .el-select {
      .el-input {
        font-size: 12px;

        .el-input__inner {
          padding-left: 26px;
          padding-right: 26px;
        }
        .el-input__icon {
          font-size: 12px;
          line-height: 26px;
        }
      }
    }
    .el-icon-circle-plus {
      cursor: pointer;
      font-size: 20px;
      margin-right: 10px;
    }
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
  &-list {
    flex: 1 0 auto;
    height: 69%;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    ul {
      height: 100%;
    }
    .list-item {
      height: 60px;
      cursor: pointer;
      position: relative;
      padding: 0 0 0 20px;
      border-right: 3px transparent solid;
      display: flex;
      align-items: center;
      &-name {
        color: #7f8c93;
      }
      &-desc {
        font-weight: Bold;
        height: 18px;
        font-size: 14px;
        line-height: 24px;
        margin-bottom: 4px;
      }
      &-id {
        display: none;
      }
      .el-icon-delete {
        display: none;
      }
    }
    .list-item:hover {
      background-color: #e3f2fc;
    }
    .selected {
      background-color: #e3f2fc;
      // border-image: linear-gradient(180deg, #22D5E6 0%, #3B8BF5 100%) 1 10;

      display: flex;
      .list-item-name {
        color: #7f8c93;
        display: block;
      }

      justify-content: space-between;
      .el-icon-delete {
        align-self: center;
        display: block;
      }
    }
  }
  &-footer {
    text-align: center;
    padding: 8px;
    flex: 0 0 auto;
  }
}
</style>