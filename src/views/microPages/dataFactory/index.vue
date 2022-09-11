<template>
  <div class="h-full">
    <div
      class="top-action flex ml-4 absolute top-3 right-5 z-10"
      style="width: 304px"
    >
      <!-- <button size="mini" type="primary" class="add-btn" @click="addData">
        <i class="el-icon-plus"></i> 创建
      </button> -->
      <el-button
        size="mini"
        style="height: 30px; padding: 7px 24.5px"
        round
        type="primary"
        icon="el-icon-plus"
        @click="addData"
        >创建</el-button
      >
      <el-input
        size="small"
        placeholder="关键词查询"
        v-model="keyword"
        class="ml-4"
        style="height: 30px"
        @keydown.enter.native="getList"
        clearable
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search key"
          @click="keySearch"
          @change="keySearch"
        ></i>
        <!-- @click="keySearch" -->
      </el-input>
    </div>

    <el-tabs class="h-full" v-model="searchType" @tab-click="handleClick">
      <el-tab-pane label="SQL" name="data_factory_sql">
        <div
          class="
            sqlCardContent
            grid grid-cols-3
            gap-4
            box-border
            px-5
            overflow-scroll
          "
        >
          <sqlCard
            v-for="(item, index) in sqlDataList"
            :key="index"
            :desc="item.desc"
            :name="item.name"
            :updateTime="item.updateTime"
            :updateUserName="item.updateUserName"
            @edit="edit(item)"
            @remove="remove(item)"
            @editBaseInfo="editBaseInfo(item)"
          ></sqlCard>
        </div>
      </el-tab-pane>
      <el-tab-pane label="脚本" name="data_factory_script">
        <div v-for="(item, index) in scriptDataList" :key="index">
          <scriptCard
            :descList="item.schemas"
            :scriptCnName="item.desc"
            :scriptEnName="item.name"
            :scriptCreateTime="`${item.updateUserName}更新于${item.updateTime}`"
            @editBaseInfo="editBaseInfo(item)"
            @scriptDelete="remove(item)"
            @scriptEdit="scriptEdit(item)"
          ></scriptCard>
        </div>
      </el-tab-pane>
      <section class="mt-5">
        <pagi
          :pageSize="pageSize"
          @sizeChange="sizeChange"
          @numChange="numChange"
          :page="pageNum"
          :total="total"
        />
      </section>
    </el-tabs>
  </div>
</template>

<script>
const { getBffTableData, removeEntity, dataFactoryApi } = window.getBffApi();
import sqlCard from "./components/dataFactoryComponents/sqlCard.vue";
import scriptCard from "./components/dataFactoryComponents/scriptCard.vue";
import pagi from "./views/bottom/components/list/pagi.vue";
import alcap from "./utils/mixin.js";
import editor from "./editor.vue";
import addData from "./components/dataFactoryComponents/addData.vue";
import editData from "./components/dataFactoryComponents/editData.vue";
import scriptEditor from "./scriptEditor.vue";

window.Vue && window.Vue.component('dfScriptEditor',scriptEditor)
window.Vue && window.Vue.component('dfSqlEditor',editor)

export default {
  mixins: [alcap,window.codelessMixins.customDialog],
  data() {
    return {
      scriptDataList: [],

      searchType: "data_factory_sql",
      total: 0,
      pageSize: 10,
      pageNum: 1,
      keyword: "",
      sqlDataList: [],
    };
  },
  components: {
    scriptCard,
    sqlCard,
    pagi,
    addData,
    editData,
  },

  created() {
    this.searchType = sessionStorage.getItem('dataFactoryTab') || 'data_factory_sql';
    // 获取列表
    this.getList();
  },
  methods: {
    /**
     * tabs 点击事件
     */
    handleClick(tab, event) {
      this.getList();
      console.log('tab', this.searchType);
      // console.log(tab,'tab');
      // console.log(event,'event');
    },
    /**
     * 获取数据列表
     */
    getList() {
      getBffTableData({
        type: this.searchType,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.keyword,
        tenantId: this.tenantId,
      }).then((res) => {
        res.obj.content.forEach((item) => {
          item.updateTime = new Date(Number(item.updateTime)).toLocaleString();
        });
        this.total = res.obj.totalElements;
        if (this.searchType === "data_factory_sql") {
          this.sqlDataList = res.obj.content;
        }
        if (this.searchType === "data_factory_script") {
          this.scriptDataList = res.obj.content;
        }
      });
    },
    /**
     * 关键词搜索
     */
    keySearch() {
      this.pageNum = 1;
      this.getList();
    },
    /**
     * 编辑
     */
    edit(row) {
      console.log(row, editor, "sql编辑");
      this.open({
        title: row.desc,
        type: "BLANK",
        component: 'dfSqlEditor',
        pageType:"component",
        path: "/dataFactoryDetail/" + row.createTime,
        params: {
          row: row,
        },
      });
      sessionStorage.setItem('dataFactoryTab', this.searchType);
    },
    /**
     * 编辑基本信息
     */
    editBaseInfo(item) {
      this.openCustomDialog({
        path: "/dataFactoryDetail/editData",
        title: "编辑基本信息",
        width: "650px",
        propsData: {
          params: {
            type: this.searchType,
            data: item,
          },
        },
        component: addData,

        confirmBtnText: "保存",
        beforeConfirm: async ($_dontCare, $el)=> {
          let valid = await $el.$refs.ruleForm.validate();
          if(valid) {
            this.uploadSubmit($_dontCare, $el.form)
            return true
          }
        }
      });
    },
    /**
     * 新增数据
     */
    addData() {
      this.openCustomDialog({
        path: "/dataFactoryDetail/addData",
        title: "新增数据流",
        width: "650px",
        component: addData,
        propsData: {
          params: {
            type: this.searchType,
          },
        },
        confirmBtnText: "创建",
        beforeConfirm: async ($_dontCare, $el)=> {
          let valid = await $el.$refs.ruleForm.validate();
          if(valid) {
            this.uploadSubmit($_dontCare, $el.form)
            return true
          }
        }
      });
    },
    uploadSubmit($_dontCare, $el) {
      const ctx = this;
      const id = $el.id;
      const name = $el.name;
      const desc = $el.desc;
      const type = $el.type;
      let schemas;

      if (name.length === 0) {
        this.$notify.error({
          title: '错误',
          message: "请输入英文名称"
        });
        return false;
      }
      if (desc.length === 0) {
        this.$notify.error({
          title: '错误',
          message: "请输入中文名称"
        });
        return false;
      }
      // console.log($el,'数据')
      let api = "";
      if (type === "SQL" || type === 'data_factory_sql') {
        api = "saveEntity";
        schemas = [
          {
            name: name,
            desc: desc,
            dataNodeChainJson: "",
            structrue: {
              data: {
                type: "array",
                items: [{ type: "object", properties: {} }],
              },
            },
          },
        ];
      } else if (type === "脚本" || type === "data_factory_script") {
        api = "saveScriptEntity";
        schemas = $el.schemas;
      }
      return dataFactoryApi[api]({
        name,
        desc,
        dataNodeChainJson: "",
        tenantId: this.tenantId,
        schemas,
        fields: [],
        type: "",
        id,
        updateUserName: window.store.state.user.currentData.username,
        updateTime: new Date().getTime()
      }).then((res) => {
        if (res.success) {
          this.dialogShow = false;
          this.$notify({
            title: "成功",
            message: id ? '保存成功': '添加成功',
            type: "success"
          });
          this.getList();
          return true;
        }else {
          this.$notify({
            title: "错误",
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    /**
     * 删除
     */
    remove(row) {
      const ctx = this;
      ctx.openCustomDialog({
        title: "提示",
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确定要删除该数据流吗?</div>`,
        },
        confirmCallback() {
          dataFactoryApi.removeEntity({ id: row.id }).then((res) => {
            if (res.success) {
              ctx.$notify.success({
                title: '错误',
                message: "删除成功"
              });
              ctx.getList();
            } else {
              ctx.$notify.error({
                title: '错误',
                message: "删除失败"
              });
            }
          });
        },
      });
    },
    /**
     * 打开脚本编辑器
     */

    scriptEdit(row) {
      this.open({
        title: row.desc,
        type: "BLANK",
        path: "/dataFactoryDetail/" + row.name,
        pageType:"component",
        component: 'dfScriptEditor',
        params: {
          row: row,
          menuId: this.$route.query.menuId
        },
      });
      sessionStorage.setItem('dataFactoryTab', this.searchType);
    },
  },
};
</script>

<style lang="scss" scoped>
.key {
  cursor: pointer;
  color: #374e71;
}
.top-action {
  ::v-deep .el-input__inner {
    border-radius: 100px;
    color: #7f8c93;
  }
}
.add-btn {
  width: 92px;
  height: 30px;
  background: linear-gradient(134deg, #00e2ff 0%, #2577fa 100%);
  opacity: 1;
  border-radius: 100px;
  border: none;
  color: white;
  cursor: pointer;
  justify-content: center;
  border-radius: 222px;
  padding: 4px 12px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  background-image: linear-gradient(135deg, #4fbffa 0%, #5361ff 100%);
}
.sqlCardContent {
  // max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

::v-deep .el-tabs {
  .el-tabs__header {
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        .el-tabs__nav {
          .el-tabs__item {
            height: 45px;
            line-height: 45px;
          }
          .el-tabs__item.is-active {
            font-weight: bold;
            padding: 0 10px;
          }
        }
      }
    }
  }
  .el-tabs__content {
    height: calc(100% - 55px);
    .el-tab-pane {
      height: calc(100% - 60px);
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>