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
      @confirm="submitFields"
      @cancel="cancel"
      @close="cancel"
    >
      <template v-slot:dialogContent>
        <dictItem-select
          @update-dictItem="updateDictItem"
          :selectedList="form.fields"
          :searchInput="searchInput"
        ></dictItem-select>
      </template>
      <div class="flex items-center justify-between" slot="title">
        <el-input
          v-model="searchInput"
          placeholder="请输入关键字进行搜索"
          class="search-header-input"
          style="width: 500px"
          size="mini"
        >
          <codeless-icon
            icon="icon-sousuo"
            style="margin-top: 0px; width: 14px; height: 14px"
            slot="prefix"
          ></codeless-icon>
        </el-input>
      </div>
    </codeless-dialog-ctn>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="mini" round @click="cancel">取消</el-button>
      <el-button
      size="mini" round
        type="primary"
        @click="submitFields"
        :disabled="selectFields.length == 0"
        >确定</el-button
      >
    </span> -->
  </el-dialog>
</template>

<script>
import dictItemSelect from "./dictItemSelect.vue";
export default {
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
  },
  components: {
    dictItemSelect,
  },
  data() {
    return {
      searchInput: "",
      selectFields: [],
      visible: false,
    };
  },
  methods: {
    updateDictItem(val) {
      this.selectFields = [].concat(val);
    },
    submitFields() {
      const typeMap = new Map([
        ["长度检查", "1"],
        ["精度检查", "2"],
        ["阈值检查", "3"],
        ["格式检查", "4"],
        ["非空检查", "5"],
      ]);
      this.selectFields.forEach((e) => {
        if (e.validations.length > 0) {
          e.validations.forEach((i) => {
            if (i.type.length > 1) {
              i.type = typeMap.get(i.type);
            }
          });
        }
      });
      this.$emit("selectFields", this.selectFields);
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
  min-width: 750px;
  .el-dialog__header {
    margin: auto;
    text-align: -webkit-center;
    background: transparent;
    border-bottom: none;
  }
  .el-dialog__body {
    min-height: 550px;
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
</style>