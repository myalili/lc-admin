<template>
<!-- codelessDialogCtn -->
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :modal="false"
    :append-to-body="true"
    custom-class="no-header-and-footer-dialog"
  >
    <codeless-dialog-ctn
      maxHeight="550px"
      @confirm="submitFields"
      @cancel="cancel"
      @close="cancel"
    >
      <template v-slot:dialogContent>
        <div class="data-dictionary-dialog-body">
          <div
            class="data-dictionary-dialog-body-left overflow-scroll"
            style="height: 500px"
          >
            <el-tree
              class="left-area"
              :data="treeData"
              :filterText="filterText"
              :props="props"
              @node-click="handleNodeClick"
              default-expand-all
            >
              <div class="search-input" slot="top">
                <el-input
                  v-model="filterText"
                  placeholder="输入关键词进行过滤"
                  clearable
                  size="mini"
                >
                  <codeless-icon
                    icon="icon-sousuo"
                    style="margin-top: 0px; width: 14px; height: 14px"
                    slot="prefix"
                  ></codeless-icon>
                </el-input>
              </div>
              <span slot-scope="{ node, data }" :title="data.name">
                <i
                  class="node-icon"
                  :class="{
                    'aupIconfont aupiconshujuzidian': data.isLeaf === '1',
                    'iconfont iconfolder': data.isLeaf === '0',
                  }"
                ></i>
                <span class="node-text">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
          <div
            class="
              data-dictionary-dialog-body-right
              flex flex-col
              justify-between
            "
            style="height: 500px"
          >
            <el-table
              class="base-table"
              ref="table"
              style="width: 100%"
              :data="dictionaryList"
              size="mini"
              @select="tableCheck"
            >
              <el-table-column type="selection" width="55" />
              <template v-for="item in columns">
                <el-table-column
                  v-if="item.render && typeof item.render === 'function'"
                  :key="item.prop || item.id"
                  v-bind="item"
                >
                  <template slot-scope="{ row, $index, column }">
                    <render-vnode
                      :vnode="item.render(row[item.prop], row, $index, column)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  v-else
                  :key="item.prop || item.id"
                  v-bind="item"
                />
              </template>
            </el-table>
            <el-pagination
              :style="`text-align:right;padding-top:15px;`"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="totalCount"
            >
            </el-pagination>
          </div>
        </div>
      </template>
      <div class="flex items-center justify-between" slot="title">
        <el-input
          v-model="searchInput"
          placeholder="请输入关键字进行搜索"
          class="search-header-input"
          style="width: 300px"
          size="mini"
        >
          <codeless-icon
            icon="icon-sousuo"
            style="margin-top: 0px; width: 14px; height: 14px"
            slot="prefix"
          ></codeless-icon>
        </el-input>

        <el-button type="text" style="margin-left: 10px" @click="resetCode" >恢复初始字典</el-button>
      </div>
    </codeless-dialog-ctn>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="mini" round @click="cancel">取消</el-button>
      <el-button
        size="mini"
        round
        type="primary"
        @click="submitFields"
        :disabled="!selectField || JSON.stringify(selectField) === '{}'"
        >确定</el-button
      >
    </span> -->
  </el-dialog>
</template>

<script>
const { tree, query } = window.getBffApi();

export default {
  components: {
    renderVnode: {
      name: "RenderVnode",
      props: {
        vnode: [Array, Object, String, Number, Boolean],
      },
      render() {
        return this.vnode;
      },
    },
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default() {
        return {
          name: "",
          id: "",
          schemas: [],
          fields: [],
          type: "db",
        };
      },
    },
    entityField: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      searchInput: "",
      selectField: null,
      visible: false,

      props: {
        children: "childs",
        label: "name",
        isLeaf: "isLeaf",
      },

      treeData: [],

      dictionaryList: [],
      currentPage: 1,
      pageSize: 10,
      dictId: "",
      filterText: "",
      totalCount: 0,

      columns: [
        {
          prop: "name",
          minWidth: "160",
          label: "中文名称",
          sortable: true,
          showOverflowTooltip: true,
          render: (name, row) => {
            return (
              <span>
                <span
                  class={[
                    "dict-type-ctn",
                    row.projectId ? "" : "is-public",
                  ].join(" ")}
                >
                  {row.projectId ? "私有" : "公有"}
                </span>
                <span>{row.desc}</span>
              </span>
            );
          },
        },
        {
          prop: "engNameShort",
          minWidth: "110",
          label: "英文名称",
          sortable: true,
          showOverflowTooltip: true,
          render: (name, row) => {
            return (
              <span>
                <span>{row.name}</span>
              </span>
            );
          },
        },
        // {
        //   prop: 'validationRuleType',
        //   minWidth: '130',
        //   label: '校验规则类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'displayType',
        //   minWidth: '110',
        //   label: '展示类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
      ],
    };
  },
  mounted() {
    this.getDicts();
  },
  methods: {
    getDicts() {
      const ctx = this;
      tree("dict").then((data) => {
        this.treeData = data ? [data] : [];
      });
    },
    getDictionaryList(page, size) {
      const ctx = this;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      query({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dictId: this.dictId,
        name: this.filterText,
      })
        .then((res) => {
          const { pageData = [], total } = res;
          this.dictionaryList = pageData;
          this.totalCount = total;
        })
        .catch((err) => {
          this.$notify.error(err);
        });
    },
    handleSizeChange(val) {
      const ctx = this;
      ctx.pageSize = val;
      ctx.currentPage = 1;
      ctx.getDictionaryList(ctx.currentPage, ctx.pageSize);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.currentPage = val;
      ctx.getDictionaryList(ctx.currentPage, ctx.pageSize);
    },
    handleNodeClick(data, node) {
      const ctx = this;
      console.log(node, data);
      ctx.dictId = data.id;
      ctx.getDictionaryList();
    },
    handleSelectionChange(e) {
      const ctx = this;
      ctx.selectFields = e;
    },
    tableCheck(selection, row) {
      const ctx = this;
      ctx.$refs.table.clearSelection();
      if (selection.length === 0) {
        // 判断selection是否有值存在
        return;
      }
      if (row) {
        ctx.selectField = row;
        ctx.$refs.table.toggleRowSelection(row, true);
      }
    },
    updateDictItem(val) {
      this.selectFields = [].concat(val);
    },
    resetCode() {
      this.selectField = {
        validations: this.entityField.dictionaryItem.validationRuleType.validations,
        code: this.entityField.code
      }
    },
    submitFields() {
      const typeMap = new Map([
        ["长度检查", "1"],
        ["精度检查", "2"],
        ["阈值检查", "3"],
        ["格式检查", "4"],
        ["非空检查", "5"],
      ]);
      if (!this.selectField) {
        return
      }
      if (this.selectField.validations.length > 0) {
        this.selectField.validations.forEach((i) => {
          if (i.type.length > 1) {
            i.type = typeMap.get(i.type);
          }
        });
      }

      
      this.$emit("selectField", this.selectField);
      this.$emit("update:visible", false);
    },
    cancel() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-dialog {
  width: fit-content;
  .el-dialog__header {
    margin: auto;
    text-align: -webkit-center;
    background: transparent;
    border-bottom: none;
  }
  .el-dialog__body {
    max-height: 550px;
    padding: 0px 15px;
  }
  .el-dialog__footer {
    border-top: none;
  }
  .dialog-footer {
    .first-step {
      text-align: center;
    }
    .second-step {
      padding: 0;
      display: flex;
      justify-content: space-between;
    }
  }
}
::v-deep .el-input {
  .el-input__inner {
    border-radius: 222px;
  }
  .el-input__prefix {
    display: flex;
    align-items: center;
  }
}

.data-dictionary-dialog {
  &-body {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &-left {
      width: 300px;
      height: 100%;
      border-right: 1px solid #ebeef5;
    }
    &-right {
      height: 100%;
      width: 100%;
      flex-grow: 1;
      overflow: hidden;
      // padding: 16px;
    }
  }
}
.dict-type-ctn {
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 38px;
  color: #fff;
  background: #384e72;
  border-radius: 20px;
  margin-right: 10px;
  zoom: 0.8;
  font-weight: bold;
  border: 1px solid #384e72;
  &.is-public {
    color: #384e72;
    background: #fff;
  }
}
</style>