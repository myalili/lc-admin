<template>
  <div style="padding: 7px; background: #fff">
    <el-dialog width="450px" title="创建数据流" :visible.sync="dialogShow">
      <div class="dialog">
        <div class="input-field">
          <label>英文名称:</label>
          <el-input v-model.trim="form.name" size="mini"></el-input>
        </div>
        <div class="input-field">
          <label>中文名称:</label>
          <el-input v-model.trim="form.desc" size="mini"></el-input>
        </div>
        <div class="input-field">
          <label>编辑器类型:</label>
          <div class="flex">
            <el-radio v-model="type" label="sql"> SQL类型 </el-radio>
            <el-radio v-model="type" label="script">脚本类型 </el-radio>
          </div>
        </div>
      </div>
      <div class="flex-end border-top" style="padding: 10px">
        <el-button size="mini" @click="dialogShow = false">取消</el-button>
        <el-button size="mini" @click="confirm" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <section style="padding: 5px" class="top-action flex flex-between">
      <button class="add-btn" @click="dialogShow = true">
        <i class="el-icon-plus"></i> 新增
      </button>
      <div class="flex">
        <el-select
          style="margin-right: 12px"
          size="small"
          v-model="searchType"
          placeholder="请选择"
        >
          <el-option label="SQL类型" value="data_factory_sql"> </el-option>
          <el-option label="脚本类型" value="data_factory_script"> </el-option>
        </el-select>
        <el-input size="small" placeholder="关键词查询" v-model="keyword">
          <i
            slot="prefix"
            @click="keySearch"
            class="el-input__icon el-icon-search key"
          ></i>
        </el-input>
      </div>
    </section>
    <section style="margin-top: 6px">
      <el-table
        :highlight-current-row="true"
        size="medium"
        width="100%"
        height="430"
        :data="tableData"
      >
        <el-table-column sortable prop="name" label="数据流名称">
        </el-table-column>
        <el-table-column prop="desc" label="数据流中文名称"> </el-table-column>
        <el-table-column prop="createUserName" label="创建人">
        </el-table-column>
        <el-table-column prop="updateUserName" label="最后修改人">
        </el-table-column>
        <!-- <el-table-column prop="output" label="输出表" >
        </el-table-column> -->
        <!-- <el-table-column prop="status" label="数据状态" >
        </el-table-column> -->
        <el-table-column sortable prop="updateTime" label="最近数据更新时间">
          <div slot-scope="scope">
            {{ scope.row.updateTime }}
          </div>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <div slot-scope="scope" class="flex table-action">
            <!-- <span class="btn">更新规则和日志</span>
            <span class="btn">更新数据</span>
            <div class="divider"></div> -->
            <div>
              <i class="el-icon-edit" @click="edit(scope.row)"></i>
              <i class="el-icon-delete" @click="remove(scope.row)"></i>
            </div>
          </div>
        </el-table-column>
      </el-table>
    </section>
    <!-- <section style="padding: 7px"> -->
      <pagi
        :pageSize="pageSize"
        @sizeChange="sizeChange"
        @numChange="numChange"
        :page="pageNum"
        :total="total"
      ></pagi>
    <!-- </section> -->
  </div>
</template>

<script>
const {getBffTableData,removeEntity,dataFactoryApi} = window.getBffApi();
import "./index.css";
import pagi from "./views/bottom/components/list/pagi.vue";
// import { mixins } from "@v2-lib/vue.spa.plugin";
import editor from "./editor.vue";

import alcap from "./utils/mixin.js";
export default {
  //   mixins: [mixins, alcap],
  mixins: [alcap,window.V8.mixins],
  components: { pagi },
  watch: {
    searchType() {
      this.pageNum = 1;
      this.getList();
    },
    "form.name"() {
      let name = this.form.name;
      let ars = name.split("");
      let range = "qwertyuiopasdfghjklzxcvbnm1234567890"
        .toUpperCase()
        .split("");
      ars = ars
        .map((item) => item.toUpperCase())
        .filter((item) => range.includes(item));
      this.form.name = ars.join("");
    },
    dialogShow() {
      this.form = {
        name: "",
        desc: "",
      };
    },
  },
  data() {
    return {
      total: 0,
      keyword: "",
      dialogShow: false,
      pageSize: 10,
      pageNum: 1,
      type: "sql",
      searchType: "data_factory_sql",
      form: {
        name: "",
        desc: "",
      },
      tableData: [],
    };
  },
  methods: {
    keySearch() {
      this.pageNum = 1;
      this.getList();
    },
    edit(row) {
      console.log(row,editor,'row');
      // this.$router.push({
      //   name: "dataFactoryDetail",
      //   params: { row },
      // });

      this.open({
        title: row.desc,
        type: "BLANK",
        component: editor,
        path: "/dataFactoryDetail/" + row.name,
        params: {
          row: row,
        },
      });
    },
    sizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.getList();
    },
    numChange(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    getList() {
    getBffTableData({
          type: this.searchType,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name: this.keyword,
          tenantId: this.tenantId,
        })
        .then((res) => {
          res.obj.content.forEach((item) => {
            item.updateTime = new Date(
              Number(item.updateTime)
            ).toLocaleString();
          });
          console.log(res.obj);
          this.total = res.obj.totalElements;
          this.tableData = res.obj.content;
        });
    },
    remove(row) {
      console.log(row);
      this.$confirm("确定要删除该数据流吗?", "提示", {
        type: "warning",
      }).then((_) => {
        dataFactoryApi.removeEntity({ id: row.id }).then((res) => {
          if (res.success) {
            this.$notify.success("删除成功");
            this.getList();
          } else {
            this.$notify.success("删除失败");
          }
        });
      });
    },
    confirm() {
      if (this.form.name.length === 0) {
        return this.$notify.warning("请输入英文名称");
      }
      if (this.form.desc.length === 0) {
        return this.$notify.warning("请输入中文名称");
      }
      let api = "";
      if (this.type === "sql") {
        api = "saveEntity";
      } else if (this.type === "script") {
        api = "saveScriptEntity";
      }
      dataFactoryApi[api]({
        ...this.form,
        dataNodeChainJson: "",
        tenantId: this.tenantId,
        schemas: [
          {
            name: this.form.name,
            desc: this.form.desc,
            dataNodeChainJson: "",
            structrue: {
              data: {
                type: "array",
                items: [{ type: "object", properties: {} }],
              },
            },
          },
        ],
        fields: [],
        type: "",
        id: "",
      }).then((res) => {
        if (res.success) {
          this.dialogShow = false;
          this.$notify.success("添加成功");
          this.getList();
        }
      });
    },
    init() {
      console.log("init");
    },
    getDetail() {
      // this.$api.list.getEntity()
    },
  },
  created() {
     
    this.getList();
    
  },
};
</script>
<style lang="scss">
// @import "../../assets/common.scss";
</style>

<style lang="scss" scoped>
.add-btn {
  background: linear-gradient(134deg, #00e2ff 0%, #2577fa 100%);
  opacity: 1;
  border-radius: 100px;
  border: none;
  color: white;
  cursor: pointer;
  justify-content: center;
  border-radius: 222px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  background-image: linear-gradient(135deg, #4fbffa 0%, #5361ff 100%);
}
.table {
  margin-top: 16px;
}
.key {
  cursor: pointer;
  color: #374e71;
}
.table-action {
  align-items: center;
  .btn {
    color: #4769b3;
    font-size: 14px;
    margin-right: 14px;
    cursor: pointer;
  }
  .divider {
    background-color: #c8d0d4;
    width: 1px;
    height: 14px;
    margin-right: 14px;
  }
  i {
    color: #4769b3;
    margin: 0 6px;
    cursor: pointer;
  }
}
.dialog {
  padding: 20px;
  .input-field {
    padding: 5px;
    label {
      margin-bottom: 6px;
      font-size: 12px;
      display: block;
    }
  }
}
::v-deep.el-dialog__body {
  padding: 0;
}
::v-deep.el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
}
.top-action {
  ::v-deep.el-input__inner {
    border-radius: 100px;
    color: #7f8c93;
  }
}
</style>