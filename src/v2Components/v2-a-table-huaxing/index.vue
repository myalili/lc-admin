<template>
  <div class="table-container flex flex-col justify-between">
    <el-table
      stripe
      v-loading="loading"
      :data="dataSource"
      :row-key="primaryField"
      :span-method="arraySpanMethod"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
      height="80%"
      size="mini"
      :render-header="renderHeader"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column
        align="center"
        v-for="item in columns"
        :key="item.dataIndex"
        :prop="item.dataIndex"
        :label="item.title"
        :fixed="item.isFixed || false"
        :show-overflow-tooltip="true"
        :sortable="item.sortable || false"
      >
        <template slot-scope="scope">
          <!-- 可编辑单元格 -->
          <template v-if="editRow.index === scope.$index">
            <template v-for="editField of editRow.fields">
              <component
                :is="editField.component.href"
                :key="editField.id"
                :value.sync="editField.value"
                :enumCode="editField.enumCode || editField.code"
                :entityId="editField.entityId"
                :config="editField"
                v-if="editField.dictionaryItem.engNameShort === item.dataIndex"
              />
            </template>
          </template>

          <template v-else>
            <template v-if="item.format && item.format === 'uploadImg'">
              <el-image
                style="width: 100px; height: 100px"
                :src="dataIndexFilter(scope.row[item.dataIndex], item)"
                fit="cover"
              ></el-image>
            </template>
            <template v-else-if="item.format && item.format === 'uploadDocs'">
              <el-link
                type="primary"
                @click.native="openDocsLink(scope.row[item.dataIndex])"
                >{{ dataIndexFilter(scope.row[item.dataIndex], item) }}</el-link
              >
            </template>
            <component
              :is="item.component.href"
              :params="{ row: scope.row, column: item }"
              :item="item"
              v-else-if="item.component && item.component.href"
            />
            <span v-else>{{
              dataIndexFilter(scope.row[item.dataIndex], item)
            }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        v-if="dataTable.tableOpr && dataTable.tableOpr.length > 0"
      >
        <template slot-scope="scope">
          <template v-for="item in dataTable.tableOpr">
            <div
              :key="item.value"
              v-if="
                item.opr.id === 'editTableRow' || item.createType === 'tableRow'
              "
            >
              <template v-if="scope.$index === editRow.index">
                <el-button type="text" @click="editRowSave(scope.row)"
                  >保存</el-button
                >
                <el-button type="text" @click="editRowCancel">取消</el-button>
              </template>
              <el-button
                type="text"
                @click="tableOprClick(scope.row, item, scope.$index)"
                v-else
                >{{ item.name }}</el-button
              >
            </div>
            <template v-else-if="item.opr.id === 'popconfirm'">
              <el-popconfirm
                icon="el-icon-warning"
                :title="item.popconfirm.title"
                :key="item.value"
              >
                <el-button type="text" slot="reference">{{
                  item.name
                }}</el-button>
              </el-popconfirm>
            </template>
            <el-button
              type="text"
              :key="item.value"
              @click="tableOprClick(scope.row, item)"
              v-else
              >{{ item.name }}</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import pck from "./package.json";
const { getToken } = window.alcapCoreUtils;
// const { dbRetrieveRecord, dataSourceRetrieveRecord } = window.getBffApi();

export default {
  _options: pck.docs,
  inject: ["root"],
  name: "v2ATableHuaxing",
  props: {
    dataTable: {
      type: Object,
      default: () => {
        return {};
      },
    },
    entityId: {
      type: String,
      default: "",
    },
    field: {
      type: Array,
      default: () => {
        return [];
      },
    },
    startGet: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.assignObj = {
      row: {},
      col: {},
    };
    this.isCreateRecordByTableRow = false;

    return {
      pageJson: {},
      // 创建时间
      createTime: "",
      // 表格数据
      dataSource: [
        {
          id: "1",
          name: "John Brown",
          age: 32,
        },
        {
          id: "2",
          name: "Jim Green",
          age: 42,
        },
        {
          id: "3",
          name: "Joe Black",
          age: 32,
        },
      ],
      // 当前页码
      currentPage: 1,
      // 用户总数据
      totalCount: 1,
      // 每页数量
      pageSize: 10,
      // 是否禁用
      isDisabled: true,
      // 选中的用户数据
      selectedList: [],
      // 表格加载
      loading: false,
      query: {},
      tableOpr: [],

      confirm: {},

      entityUrl: {},

      baseColumns: [],

      editRow: {
        index: -1,
        fields: [],
      },
      enumCodesObj: {},

      compParam: [],

      ranges: [],
    };
  },
  watch: {
    "dataTable.entityId.id": {
      handler(n, o) {
        if (n && n !== o) {
          this.getPageList();
        }
      },
      deep: true,
    },
    "dataTable.entityId": {
      handler(n, o) {
        if (n && n !== o) {
          this.getPageList();
        }
      },
      deep: true,
    },
    entityId: {
      handler(n, o) {
        if (n !== o) {
          this.getPageList();
        }
      },
      immediate: true,
    },
    startGet: {
      handler(n, o) {
        console.log("startGet变化了", n);
        if (n) {
          this.getPageList();
        }
      },
    },
  },
  computed: {
    /**
     * 字段主键
     */
    primaryField() {
      const ctx = this;
      if (ctx.dataTable.primaryField) {
        return ctx.dataTable.primaryField.engNameShort;
      } else {
        if (!ctx.dataTable.entityId) {
          return "ID";
        } else {
          if (!ctx.dataTable.entityId.fields) {
            return "ID";
          }
          return (
            ctx.dataTable.entityId.fields.filter((i) => i.primaryKey === "1")[0]
              .dictionaryItem.engNameShort || "ID"
          );
        }
      }
    },
    /**
     * 选中项配置
     */
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedList = selectedRows;
        },
        getCheckboxProps: (record) => ({
          props: {
            ...record,
          },
        }),
      };
    },
    columns() {
      const ctx = this;
      let columns = [
        {
          title: "ID",
          key: "id",
          dataIndex: "id",
        },
        {
          title: "名字",
          key: "name",
          dataIndex: "name",
        },
        {
          title: "年龄",
          key: "age",
          dataIndex: "age",
        },
      ];
      if (ctx.entityId) {
        columns = ctx.baseColumns;
        if (ctx.field.length > 0) {
          columns = ctx.field;
        }
      }
      return columns;
    },
    dataIndexFilter() {
      const ctx = this;
      return (value, item) => {
        if (!value || !item.format) return value;
        return activator
          .get("alcap.tableDataFilter")
          [item.format].handler(value, item, ctx);
      };
    },
  },
  methods: {
    // 表头部重新渲染
    renderHeader(h, { column, $index }) {
      let span = document.createElement("span");
      span.innerText = column.label;
      document.body.appendChild(span);
      column.minWidth = span.getBoundingClientRect().width + 100;
      document.body.removeChild(span);
      return h("span", column.label);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.$emit("selectionChange", val);
    },
    async searchEnums(enumCode, format) {
      if (activator.get("alcap.tableDataFilter")[format].beforeHandler) {
        this.enumCodesObj[enumCode] = await activator
          .get("alcap.tableDataFilter")
          [format].beforeHandler(enumCode);
      } else {
        return;
      }
    },
    handleSizeChange(val) {
      const ctx = this;
      ctx.pageSize = val;
      ctx.currentPage = 1;
      ctx.getPageList(ctx.currentPage, ctx.pageSize);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.currentPage = val;
      ctx.getPageList(ctx.currentPage, ctx.pageSize);
    },
    async getPageList(page, size) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      if (!ctx.dataTable.entityId && !ctx.entityId) return;
      ctx.loading = true;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);

      let ranges = [];
      for (const key in ctx.query) {
        if (Array.isArray(ctx.query[key]) && key.indexOf("TIME") > -1) {
          ranges.push({
            from: ctx.query[key][0],
            key: key,
            to: ctx.query[key][1],
          });
          delete ctx.query[key];
        }
        if (Array.isArray(ctx.query[key])) {
          ctx.query[key] = ctx.query[key].toString();
        }
      }
      ctx.ranges = ranges;
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.dataTable.entityId || ctx.entityId,
            orders: [],
            pageNum: ctx.currentPage,
            pageSize: ctx.dataTable.display === "tree" ? 10000 : ctx.pageSize,
            query: ctx.query,
            ranges,
            retrieveId: "paging",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.dataTable.entityId || ctx.entityId,
            fields: [],
          },
        ],
      ]);
      // pck.docs.schemaType;

      pipe.entity
        .getEntityData(
          ctx.dataTable.entityId || ctx.entityId,
          pck.docs.schemaType,
          paramsMap
        )
        .then((res) => {
          if (res) {
            console.log("最后返回", res);
            ctx.entityUrl = res.entityUrl;
            let tableData = (res.response && res.response.content) || [
              res.response,
            ];
            if (res.entity.type === "data_source") {
              tableData = JSON.parse(tableData).result;
            }

            ctx.dataSource = tableData.map(function (item) {
              return {
                ...item,
              };
            });
            this.tableAssign();
            if (ctx.dataTable.display === "tree") {
              ctx.dataSource = ctx.transformMenu(
                ctx.dataSource,
                ctx.dataTable.parentField || "PARENT_ID"
              );
            }
            ctx.totalCount = (res.response && res.response.totalElements) || 0;
            ctx.loading = false;
            if (ctx.entityId) {
              ctx.baseColumns = Object.keys(ctx.dataSource[0]).map((i) => {
                i === "title" ? "dataTitle" : i;
                return {
                  title:
                    res.entity.type === "db"
                      ? res.entity.fields.filter((e) => e.name === i)[0].desc
                      : i,
                  dataIndex: i,
                  align: "center",
                  scopedSlots: { customRender: i },
                };
              });
            }
            console.log("当前表头", ctx.baseColumns);
            msgHub.$emit("huaxingTask", ctx.baseColumns);
          }
        })
        .catch((error) => {
          console.log(error);
          ctx.loading = false;
          ctx.dataSource = [];
        });
    },

    tableAssign() {
      if (
        this.dataTable.tableAssignRow &&
        this.dataTable.tableAssignRow.fields.length
      ) {
        const assignObj = {};
        for (let field of this.dataTable.tableAssignRow.fields) {
          let span = 1;
          let prevIdx = 0;
          let prevValue = "";
          const key = field.dictionaryItem.engNameShort;
          assignObj[key] = {};
          this.dataSource.forEach((row, idx) => {
            if (idx === 0) {
              prevIdx = idx;
              prevValue = row[key];
            } else {
              if (row[key] === prevValue) {
                span++;
              } else {
                assignObj[key][prevIdx] = { span };
                span = 1;
                prevIdx = idx;
                prevValue = row[key];
              }
            }
            if (idx === this.dataSource.length - 1) {
              assignObj[key][prevIdx] = { span };
            }
          });
        }
        this.assignObj.row = assignObj;
      }
    },

    tableOprClick(record, item, rowIndex) {
      const ctx = this;
      console.log("tableOprClick -> ", record, item, rowIndex);

      if (item.opr.id === "editTableRow" || item.createType === "tableRow") {
        this.editRow.index = rowIndex;
        this.editRow.fields = item.fields.map((m) => {
          return { ...m, value: record[m.dictionaryItem.engNameShort] };
        });
      } else {
        ctx.confirm = { record, item };
        ctx.$emit("oprClick", item, { row: record }, "tableOpr");
      }
    },

    editRowCancel() {
      this.editRow.index = -1;
      this.editRow.fields = [];
      if (this.isCreateRecordByTableRow) {
        this.dataSource.shift();
        this.isCreateRecordByTableRow = false;
      }
    },

    editRowSave(record) {
      this.editRow.fields.forEach((f) => {
        record[f.dictionaryItem.engNameShort] = f.value;
      });
      this.updateRecord(record);
    },

    // 更新行数据
    async updateRecord(record) {
      const params = {
        fields: [],
        entityId: this.dataTable.entityId,
      };
      let res = await pipe.entity.getEntityDetail(this.dataTable.entityId);
      if (!res) return;
      for (const key in record) {
        res.fields.forEach((i) => {
          if (i.dictionaryItem.engNameShort === key) {
            params.fields.push({
              value: record[key],
              entityFieldId: i.id,
            });
          }
        });
      }
      pipe.entity
        .getEntityData(
          res.id,
          this.isCreateRecordByTableRow ? "create" : "update",
          params
        )
        .then((res) => {
          if (res) {
            this.$notify({
              message: "保存成功！",
              title: "成功",
              type: "success",
            });
            this.editRowCancel();
            this.$emit("refresh");
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err.msg,
          });
        });
    },

    handleTableChange(pagination, filters, sorter) {
      const ctx = this;
      ctx.getPageList(pagination.current);
    },

    parseUploadImgPath(jsonStr) {
      if (typeof jsonStr === "string") {
        try {
          const jsonObj = JSON.parse(jsonStr);
          return (
            `${axios.bff}/file/download?filePath=${
              jsonObj.path
            }&token=${getToken()}` || ""
          );
        } catch (error) {
          return "";
        }
      }
      return "";
    },

    parseUploadDocs(jsonStr) {
      return activator.get("alcap.tableDataFilter").uploadDocs.handler(jsonStr);
    },

    openDocsLink(jsonStr) {
      const obj = this.parseUploadDocs(jsonStr);
      if (obj) {
        const url = `${axios.bff}/file/download?filePath=${obj.path}`;
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", obj.name);
        document.body.appendChild(link);
        link.click();
      }
    },

    // 转换
    transformMenu(data, parentField = "PARENT_ID") {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach((item) => {
        delete item.children;
      });
      let map = {};
      data.forEach((item) => {
        map[item[ctx.primaryField]] = item;
      });
      data.forEach((item) => {
        let parent = map[item[parentField]];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },

    // 合并行或列
    arraySpanMethod({ column, rowIndex }) {
      if (
        this.dataTable.tableAssignRow &&
        this.dataTable.tableAssignRow.fields.length
      ) {
        if (this.isCreateRecordByTableRow && rowIndex === 0) {
          return [1, 1];
        } else {
          const rowIdx = this.isCreateRecordByTableRow
            ? rowIndex - 1
            : rowIndex;
          if (this.assignObj.row[column.property]) {
            if (this.assignObj.row[column.property][rowIdx]) {
              return [this.assignObj.row[column.property][rowIdx].span, 1];
            } else {
              return [0, 0];
            }
          }
        }
      }
    },

    // 通过表格行新建数据
    _createRecordByTableRow(oprInfo) {
      if (this.isCreateRecordByTableRow || this.editRow.index > -1) {
        this.$notify({
          message: "存在编辑中的表格行",
          title: "提示",
          type: "warning",
        });
      } else {
        this.isCreateRecordByTableRow = true;

        const record = {};
        this.dataTable.entityId.fields.forEach((i) => {
          record[i.dictionaryItem.engNameShort] = null;
        });
        this.dataSource.unshift(record);
        this.tableOprClick(record, oprInfo, 0);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.table-container {
  // margin-top: 10px;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  ::v-deep .el-table {
  }
}
</style>