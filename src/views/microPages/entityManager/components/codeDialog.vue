<template>
  <!-- codelessDialogCtn -->
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    v-model="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    custom-class="no-header-and-footer-dialog"
  >
    <codeless-dialog-ctn
      @confirm="submit"
      @cancel="cancel"
      @close="cancel"
      maxHeight="500px"
      :hideConfirmBtn="!isEdit"
      :hideCancelBtn="!isEdit"
    >
      <template v-slot:dialogContent>
        <div
          class="w-full flex items-center"
          style="height:460px"
        >
          <div
            class="w-1/3 h-full overflow-scroll border-r"
            v-if="isEdit"
          >
            <el-input
              v-model="filterText"
              size="mini"
              class="my-2"
              style="width: 95%"
              placeholder="搜索关键词"
            >
              <codeless-icon
                icon="icon-sousuo"
                style="margin-top: 0px; width: 14px; height: 14px"
                slot="prefix"
              ></codeless-icon>
            </el-input>
            <el-tree
              class="filter-tree"
              :data="codes.childs"
              :props="defaultProps"
              :current-node-key="currentLivingId"
              node-key="id"
              ref="tree"
              :render-content="renderContent"
              @node-click="nodeClick"
              :filter-node-method="filterNode"
            >
            </el-tree>
          </div>
          <div class="w-px h-full bg-gray-300" v-if="isEdit"></div>
          <div class="h-full pl-5 pr-4 overflow-scroll flex-1">
            <el-table
              :data="codeDetailData"
              style="width: 100%; height: calc(100% - 36px); overflow: scroll"
              size="mini"
            >
              <el-table-column prop="name" label="标准码值名称">
              </el-table-column>
              <el-table-column prop="value" label="标准码值编码">
              </el-table-column>
            </el-table>
            <div class="pagination pt-1 flex items-center justify-between">
              <span class="text-xs" style="color: #7f8c93"
                >共{{ total }}条</span
              >
              <div class="flex items-center">
                <el-select
                  style="max-width: 95px"
                  size="mini"
                  v-model="currPageSize"
                  @change="handleSizeChange"
                >
                  <el-option
                    v-for="item in pageSizes"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                    >{{ item.label }}</el-option
                  >
                </el-select>
                <div class="ml-3 current-page flex items-center">
                  <span
                    class="page-btn"
                    :class="{ disable: currPage === 1 }"
                    @click="handleCurrentChange(currPage, 'pre')"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </span>
                  <el-select
                    style="max-width: 76px"
                    size="mini"
                    v-model="currPage"
                    @change="handleCurrentChange"
                  >
                    <el-option
                      v-for="item in page"
                      :key="item"
                      :value="item"
                      :label="currPage + '/' + page"
                      >{{ item }}</el-option
                    >
                  </el-select>
                  <span
                    class="page-btn"
                    :class="{ disable: currPage === page }"
                    @click="handleCurrentChange(currPage, 'next')"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="flex items-center justify-between" slot="title">
        <div class="flex items-center mr-4">
          <span class="font-bold text-sm">标准码{{ !isEdit ? "值" : "" }}</span>
        </div>
        <div class="flex items-center justify-between w-64" v-if="isEdit">
          <el-input
            v-model="searchVal"
            size="mini"
            placeholder="搜索关键词"
            @change="getCodeDetail(active, 1, currPageSize)"
          >
            <codeless-icon
              icon="icon-sousuo"
              style="margin-top: 0px; width: 14px; height: 14px"
              slot="prefix"
            ></codeless-icon>
          </el-input>
        </div>
      </div>
    </codeless-dialog-ctn>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
    editRow: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {
      visible: false,
      active: "",
      activePage: "",
      currentLivingId: "",
      defaultProps: {
        children: "childs",
        label: "name",
      },
      codes: [],
      codeDetailData: [],

      currPage: 1,
      currPageSize: 10,
      total: 0,

      pageSizes: [
        {
          value: 10,
          label: "10条/页",
        },
        {
          value: 30,
          label: "30条/页",
        },
        {
          value: 50,
          label: "50条/页",
        },
        {
          value: 100,
          label: "100条/页",
        },
      ],

      filterText: "",
    };
  },
  created() {
    const ctx = this;
    console.log("选中的行", ctx.editRow);
    ctx.getCode();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    page() {
      // console.log('数量', Math.ceil(this.total / this.currPageSize));
      return Math.ceil(this.total / this.currPageSize) || 1;
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      console.log(data);
      return data.name.indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      let colorObj = {
        "background-color":
          this.active === (data.other && data.other.code)
            ? "#409eff"
            : "#ffffff",
        border: "1px solid #409eff",
      };
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span class="flex items-center">
            {
              data.isLeaf == "0" ? (
                <codeless-icon
                  icon={"icon-fenlei"}
                  style="width: 12px; height: 32px"
                ></codeless-icon>
              ) : (
                <span
                  class="w-4 h-4 rounded-sm border flex items-center justify-center"
                  style={colorObj}
                  on-click={(e) => this.checkClick(e, data)}
                >
                  <i class="el-icon-check text-white"></i>
                </span>
              )
              // <span />
            }

            <span class="ml-3" style="line-height: 32px;">
              {node.label}
              {data.other && `(${data.other.code})`}
            </span>
          </span>
        </span>
      );
    },
    nodeClick(data) {
      const ctx = this;
      if (data.isLeaf == "1") {
        ctx.activePage = data.other.code;
        ctx.getCodeDetail(ctx.activePage);
      }
    },
    checkClick(e, data) {
      const ctx = this;
      e.stopPropagation();
      ctx.active = data.other && data.other.code;
    },
    handleSizeChange(val) {
      const ctx = this;
      console.log(`每页 ${val} 条`);
      ctx.getCodeDetail(ctx.activePage, 1, val);
    },
    handleCurrentChange(val, type) {
      const ctx = this;
      console.log(`当前页: ${val}`);
      if (
        (type === "pre" && val === 1) ||
        (type === "next" && val === ctx.page)
      )
        return;
      if (type === "pre") {
        val = val - 1;
      } else if (type === "next") {
        val = val + 1;
      }
      ctx.getCodeDetail(ctx.activePage, val, ctx.currPageSize);
    },
    getCodeDetail(code, pageNum = 1, pageSize = 10) {
      const ctx = this;
      const { codeList } = window.getBffApi();
      codeList({ code, pageNum, pageSize }).then((res) => {
          if (res) {
            ctx.codeDetailData = (res && res.pageData) || [];
            // console.log('详情', ctx.codeDetailData);
            ctx.currPage = res.currPage;
            ctx.currPageSize = res.currPageSize;
            ctx.total = res.total;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    getCode() {
      const ctx = this;
      const { tree } = window.getBffApi();
      tree('code')
        .then((res) => {
          if (res) {
            ctx.codes = res || [];
            
            if (ctx.editRow.code) {
              ctx.codes.childs.map((item) => {
                let isCode = false
                if (item.childs) {
                  isCode = item.childs.some((i) => {
                    if(!i.other) return false
                    if (i.other.code === ctx.editRow.code) {
                      return true
                    }
                  })
                }
                if (isCode) {
                  let current = item.childs.filter(
                    (i) => i.other.code === ctx.editRow.code
                  )[0];
                  ctx.currentLivingId = current.id;
                  ctx.$nextTick(() => {
                    ctx.$refs.tree &&
                      ctx.$refs.tree.setCurrentKey(ctx.currentLivingId);
                  });
                  ctx.active = current.other.code;
                  ctx.activePage = current.other.code;
                  ctx.getCodeDetail(ctx.activePage);
                  console.log("设置的节点", current);
                }
              });
            }
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    cancel() {
      this.$emit("update:visible", false);
    },
    submit() {
      const ctx = this;
      ctx.editRow.code = ctx.active;
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: fit-content;
  min-width: 750px;
  .el-dialog__header {
    margin: auto;
    text-align: -webkit-center;
    background: transparent;
    border-bottom: none;
    padding-top: 10px;
  }
  .el-dialog__body {
    // height: 450px;
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
  width: 219px;
  .el-input__inner {
    border-radius: 222px;
  }
  .el-input__prefix {
    display: flex;
    align-items: center;
  }
}
::v-deep .el-form {
  .el-form-item {
    .el-form-item__label {
      padding: 0;
      line-height: inherit;
    }
  }
}
.validation:hover {
  background: #e3f2fc;
}
.acitved {
  background: #e3f2fc;
}
.err {
  border: 1px solid rgb(245, 108, 108);
}

.pagination {
  ::v-deep .el-input {
    width: auto;
    .el-input__inner {
      border-radius: 4px;
      border: 1px solid #c8d0d4;
    }
  }
}
.current-page {
  .page-btn {
    width: 24px;
    height: 28px;
    border: 1px solid #c8d0d4;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c4cc;
    cursor: pointer;
    &:nth-child(1) {
      border-radius: 4px 0px 0px 4px;
      border-right: 0px;
    }
    &:nth-last-child(1) {
      border-radius: 0px 4px 4px 0px;
      border-left: 0px;
    }
    &:hover {
      opacity: 0.7;
    }
  }
  .disable {
    background: rgba(231, 236, 239, 0.39);
    color: #bbbbbb;
    cursor: not-allowed;
  }
  ::v-deep .el-input {
    width: auto;
    .el-input__inner {
      border-radius: 0;
    }
  }
  ::v-deep .el-button {
    width: 24px;
    box-sizing: border-box;
    &:nth-child(1) {
      border-radius: 4px 0px 0px 4px;
    }
    &:nth-child(2) {
      border-radius: 0px 4px 4px 0px;
    }
  }
}
</style>