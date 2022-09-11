<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true" size="mini" v-if="!disabled"
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
            <el-table
              :data="syncParams"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="目标页面"
                width="180">
                <template slot-scope="scope">
                  <sync-param
                    :is-custom="true"
                    :target-params="argsArr"
                    :value.sync="scope.row.target"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="当前页面或组件"
                width="180">
                <template slot-scope="scope">
                  <sync-param
                    :is-custom="true"
                    :target-params="currentArgsArr"
                    :value.sync="scope.row.current"
                    v-if="!scope.row.isComponent"
                  />
                  <el-select
                    v-model="scope.row.current"
                    placeholder="请选择参数"
                    size="mini"
                    v-else
                  >
                    <el-option
                      v-for="item in componentParams"
                      :value="item.id"
                      :label="item.name"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="是否使用组件参数">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.isComponent"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <div
                class="
                  cursor-pointer
                  rounded-full
                  w-4
                  h-4
                  bg-primary
                  flex
                  justify-center
                  items-center
                "
                @click="addSyncParam"
                v-if="scope.$index === 0"
              >
                <i class="el-icon-plus text-white text-xs"></i>
              </div>
              <div
                class="
                  cursor-pointer
                  rounded-full
                  w-4
                  h-4
                  bg-red-500
                  flex
                  justify-center
                  items-center
                "
                @click="delSyncParam(scope.row)"
                v-else
              >
                <i class="el-icon-minus text-white text-xs"></i>
              </div>
                </template>
              </el-table-column>
            </el-table>
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      syncParams: []
    };
  },
  watch: {
    dialogVisible(n) {
      console.log('闯入的参数');
        console.log(this.value);
        console.log(this.componentParams);
        console.log(this.argsArr);
        console.log(this.currentArgsArr);
      if (JSON.stringify(this.value) !== '{}') {
        

        this.syncParams = JSON.parse(JSON.stringify(this.value));
      }else {
        this.addSyncParam()
      }
    }
  },
  methods: {
    addSyncParam() {
      const ctx = this;
      ctx.syncParams.push({
        id: new Date().getTime(),
        target: '',
        current: '',
        isComponent: false
      })
    },
    delSyncParam(item) {
      const ctx = this;
      ctx.syncParams.splice(ctx.syncParams.findIndex(i=>i.id === item.id), 1)
    },
    submit() {
      this.$emit("update:value", this.syncParams);
      this.dialogVisible = false
    }
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
</style>