<template>
  <div class="input-dialog flex items-center" style="height: 28px">
    <el-input v-model="vModel" :disabled="disabled" size="mini" placeholder="请选择">
      <i
        slot="append"
        class="el-icon-menu cursor-pointer"
        @click="openDialog"
      />
    </el-input>
    <!-- codelessDialogCtn -->
    <el-dialog
      top="10vh"
      height="72%"
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        title="表格弹窗"
        @confirm="submit"
        @cancel="dialogInfo.visible = false"
        @close="dialogInfo.visible = false"
      >
        <template v-slot:dialogContent>
          <el-table
            ref="table"
            v-loading="loading"
            :data="dataSource"
            style="width: 100%"
            border
            height="400"
            size="mini"
            @selection-change="handleSelectionChange"
            @select="dialogCheck"
          >
            <el-table-column
              align="center"
              type="selection"
              width="50"
            ></el-table-column>
            <el-table-column
              align="center"
              v-for="item in baseColumns"
              :key="item.dataIndex"
              :prop="item.dataIndex"
              :label="item.title"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row[item.dataIndex] }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :style="`text-align:right;padding-top:15px;`"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          >
          </el-pagination>
        </template>
        <div class="flex items-center justify-between" slot="title">
          <span>{{ dialogInfo.title }}</span>
        </div>
      </codeless-dialog-ctn>

      <!-- <div class="w-full flex items-center justify-end mt-2">
          <span
            class="
              flex
              items-center
              justify-center
              w-16
              h-7
              rounded-full
              cursor-pointer
              bg-gradient-primary
              text-white text-xs
              hover:opacity-75
              mr-4
            "
            @click="submit"
            >确定</span
          >
          <span
            class="
              flex
              items-center
              justify-center
              w-16
              h-7
              rounded-full
              cursor-pointer
              bg-white
              text-gray-500
              border border-gray-500
              text-xs
              hover:opacity-75
            "
            @click="dialogInfo.visible = false"
            >取消</span
          >
        </div> -->
    </el-dialog>
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2AInputDialog",
  mixins: [window.V8.mixins],
  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    entityId: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dataValue: this.value,

      dialogInfo: {
        title: "",
        visible: false,
        width: "70%",
      },
      dataSource: [],
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

      entity: "",
      entityUrl: {},
      baseColumns: [],
      selectioned: "",
    };
  },
  computed: {},
  watch: {
    dataValue: {
      handler(n) {
        this.$emit("update:value", n);
        this.$emit("getRecord", this.selectioned);
      },
    },
    value: {
      handler(n) {
        this.dataValue = n;
      },
    },
  },
  methods: {
    submit() {
      const ctx = this;
      // ctx.dataValue = ctx.selectioned[ctx.config.dictionaryItem.engNameShort];
      ctx.vModel = ctx.selectioned[ctx.config.component.label];
      ctx.dataValue = ctx.selectioned[ctx.config.component.label];
      ctx.dialogInfo.visible = false;
      console.log("选中的值", ctx.vModel);
    },
    dialogCheck(selection, row) {
      const ctx = this;
      ctx.$refs.table.clearSelection();
      if (selection.length === 0) {
        // 判断selection是否有值存在
        return;
      }
      if (row) {
        ctx.selectioned = row;
        ctx.$refs.table.toggleRowSelection(row, true);
      }
    },
    openDialog() {
      const ctx = this;
      ctx.entityId = ctx.config.entityId;
      ctx.getPageList();
      ctx.dialogInfo.visible = true;
      console.log(ctx.config);
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
      ctx.loading = true;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.entityId,
            orders: [],
            pageNum: ctx.currentPage,
            pageSize: ctx.pageSize,
            query: ctx.query,
            ranges: [],
            retrieveId: "paging",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.entityId,
            fields: [],
          },
        ],
      ]);
      // pck.docs.schemaType;
      if (!ctx.entityUrl.url) {
        pipe.entity
          .getEntityData(ctx.entityId, pck.docs.schemaType, paramsMap)
          .then((res) => {
            if (res) {
              console.log("最终返回的：", res);
              ctx.entityUrl = res.entityUrl;
              const tableData = (res.response && res.response.content) || [];
              ctx.dataSource = tableData.map(function (item) {
                return {
                  ...item,
                };
              });
              ctx.totalCount =
                (res.response && res.response.totalElements) || 0;
              ctx.loading = false;
              console.log("表格数据", ctx.dataSource);
              if (res.entity) {
                let keys = Object.keys(ctx.dataSource[0]);
                let baseColumns = [
                  {
                    title: res.entity.fields.find((e) => e.name === ctx.config.component.label).desc,
                    dataIndex: ctx.config.component.label,
                    align: "center",
                    scopedSlots: { customRender: ctx.config.component.label },
                  }
                ];
                for (let index = 0; index < Object.keys(ctx.dataSource[0]).length; index++) {
                  let i = keys[index];
                  if (i === 'USER_ID' || i === 'ROLE_ID' || i === 'DEPT_ID' || i === ctx.config.component.label) continue;

                  baseColumns.push({
                    title: res.entity.fields.find((e) => e.name === i).desc,
                    dataIndex: i,
                    align: "center",
                    scopedSlots: { customRender: i },
                  });
                }
                ctx.baseColumns = baseColumns;
              }
            }
          })
          .catch((error) => {
            console.log(error);
            ctx.loading = false;
            ctx.dataSource = [];
          });
      } else {
        const obj = await ctx.entityUrl.url(paramsMap.get(ctx.entityUrl.type));
        ctx.loading = false;
        const tableData = (obj && obj.content) || [obj];
        
        ctx.dataSource = tableData.map(function (item) {
          return {
            ...item,
          };
        });
        ctx.totalCount = (obj && obj.totalElements) || 0;
        ctx.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .has-gutter {
  .el-checkbox {
    display: none;
  }
}
.input-dialog {
  ::v-deep .el-dialog__wrapper {
    z-index: 9999;
  }
}
</style>