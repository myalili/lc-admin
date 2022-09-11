<template>
  <div>
    <el-button
      type="primary"
      @click="dialogVisible = true"
      size="mini"
      v-if="!disabled"
      >参数设置</el-button
    >
    <!-- codelessDialogCtn -->
    <el-dialog
      top="10vh"
      :visible.sync="dialogVisible"
      width="70%"
      height="500px"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        title="参数设置"
        maxHeight="550px"
        @confirm="submit"
        @close="dialogVisible = false"
        @cancel="dialogVisible = false"
      >
        <template v-slot:dialogContent>
          <div class="w-full h-full">
            <el-collapse v-model="activeName" style="border-top: 1px solid transparent;" v-if="argsArr.length > 0">
              <el-collapse-item
                :title="item.desc"
                :name="item.name"
                v-for="item in argsArr"
                :key="item.id"
              >
                <el-table :data="item.children" :show-header="false" style="width: 100%">
                  <el-table-column prop="date"  width="180">
                    <template slot-scope="scope">
                      <span :title="scope.row.id">{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="date"
                 
                    v-if="isShow"
                  >
                    <template slot-scope="scope">
                      <sync-param
                        :is-custom="true"
                        :target-params="currentArgsArr"
                        :value.sync="
                          syncParams.find((i) => i.target === item.name + '.' + scope.row.id).current
                        "
                        :is-component.sync="
                          syncParams.find((i) => i.target === item.name + '.' + scope.row.id).isComponent
                        "
                        :componentParams="componentParamsComp"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
            <el-empty description="该页面无参数" v-else></el-empty>
          </div>
        </template>
      </codeless-dialog-ctn>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "codelessPageDataBinding",
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currentArgsArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    argsArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    componentParams: {
      type: Array,
      default: () => {
        return [];
      },
    },
    componentName: {
      type: String,
      default: () => {
        return '组件参数';
      },
    }
  },
  data() {
    return {
      dialogVisible: false,
      syncParams: [],
      isShow: false,

      activeName: [],
    };
  },
  mounted() {
    const ctx = this;
  },
  computed: {
    componentParamsComp() {
      console.log('组件的名字', this.componentName);
      return [
        {
          children: this.componentParams || [],
          desc: this.componentName,
          id: "component",
          name: "",
        },
      ];
    },
    itemDetail() {
      return (item, name) => {
        if (this.syncParams.length > 0) {
          console.log('返回匹配的对象' + name + '.' + item.id,  this.syncParams.find((i) => i.target === name + '.' + item.id));
          return this.syncParams.find((i) => i.id === name + '.' + item.id);
        }
      };
    },
  },
  watch: {
    dialogVisible(n) {
      console.log("传入的参数");
      console.log('绑定值：', this.value);
      console.log('组件参数：', this.componentParams);
      console.log('目标页面参数：', this.argsArr);
      console.log('当前页面参数：',this.currentArgsArr);
      const ctx = this;

      if (n) {
        ctx.syncParams = [];
        ctx.activeName = [];
        ctx.argsArr.forEach((arg) => {
          ctx.activeName.push(arg.name);
          if (arg.children) {
            for (let index = 0; index < arg.children.length; index++) {
              ctx.addSyncParam(arg.children[index], arg);
            }
          }
        });
        if (JSON.stringify(ctx.value) !== "{}") {
          ctx.value.forEach(v=> {
            
            let findObj = ctx.syncParams.find(i=>i.target === v.target)
            if (findObj) {
              ctx.$set(ctx.syncParams, ctx.syncParams.findIndex(i=>i.target === v.target), v);
            }
          })
        }
        console.log("最后获取的数据", ctx.syncParams, ctx.activeName);
        ctx.isShow = true;
      }

    },
  },
  methods: {
    addSyncParam(e, arg) {
      const ctx = this;
      ctx.syncParams.push({
        id: e.id,
        target: arg.name + '.' + e.id,
        current: "",
        isComponent: false,
      });
    },
    submit() {
      this.$emit("update:value", this.syncParams);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
  overflow: hidden;
  .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
      max-height: 500px !important;
      overflow: scroll;
    }
  }
}
::v-deep .el-table {
  td.el-table__cell {
    border-bottom: 1px solid transparent
  }
  &::before {
    height: 0;
  }
}

::v-deep .el-collapse-item__wrap  {
  border-bottom: 1px solid transparent;
}


</style>