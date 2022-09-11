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
        <div class="w-full h-96 flex items-center">
          <div class="w-1/2 h-full box-border pl-10 pr-5 overflow-scroll">
            <div
              class="
                validation
                w-full
                h-8
                mt-0.5
                cursor-pointer
                flex
                items-center
                justify-between
                px-5
                rounded-full
              "
              v-for="(item, index) in editRow.validations"
              :key="item.id"
              :class="{ acitved: active === item.id, err: item.tips === '' }"
              @click="selectItem(item)"
            >
              <span class="text-gray-400">{{ index }}</span>
              <el-dropdown
                trigger="click"
                @command="handleCommand($event, item)"
              >
                <span class="el-dropdown-link">
                  <span
                    class="text-xs text-black"
                    :class="{ 'text-gray-300': !item.type }"
                    >{{ compType(item.type) }}</span
                  >
                  <i
                    class="
                      el-icon-arrow-down
                      el-icon--right
                      text-black text-xs
                      font-bold
                    "
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">长度检查</el-dropdown-item>
                  <el-dropdown-item command="2">精度检查</el-dropdown-item>
                  <el-dropdown-item command="3">阈值检查</el-dropdown-item>
                  <el-dropdown-item command="4">格式检查</el-dropdown-item>
                  <el-dropdown-item command="5">非空检查</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span class="w-4">
                <i
                  class="el-icon-delete cursor-pointer"
                  v-show="active === item.id"
                  @click.stop="del(index)"
                ></i>
              </span>
            </div>
          </div>
          <div class="w-px h-full bg-gray-300"></div>
          <div class="w-1/2 h-full pl-5 pr-10 overflow-scroll">
            <div v-if="active">
              <el-form
                label-position="top"
                label-width="80px"
                :rules="rules"
                ref="ruleForm"
                :model="item"
                v-for="item in editRow.validations.filter(
                  (i) => i.id === active
                )"
                :key="item.id"
              >
                <el-form-item label="错误提示" prop="tips" v-if="item.type">
                  <el-input
                    v-model="item.tips"
                    size="mini"
                    placeholder="请输入"
                  ></el-input>
                  <span
                    class="text-gray-400 -mt-1"
                    style="font-size: 12px; line-height: 1"
                    >用于校验不通过时，提醒用户定位错误源头</span
                  >
                </el-form-item>

                <el-form-item
                  label="最大长度"
                  prop="maxLength"
                  v-if="item.type === '1'"
                >
                  <el-input-number
                    v-model="item.maxLength"
                    size="mini"
                    :min="1"
                  ></el-input-number>
                  <span class="text-gray-400 text-xs -mt-1">最小长度大于0</span>
                </el-form-item>
                <el-form-item
                  label="最小长度"
                  prop="minLength"
                  v-if="item.type === '1'"
                >
                  <el-input-number
                    v-model="item.minLength"
                    size="mini"
                    :min="1"
                  ></el-input-number>
                  <span class="text-gray-400 text-xs -mt-1"
                    >最大长度不能小于最小长度</span
                  >
                </el-form-item>
                <el-form-item label="是否汉字" v-if="item.type === '1'">
                  <el-switch
                    v-model="item.chinese"
                    active-value="1"
                    inactive-value=""
                  ></el-switch>
                  <span class="text-gray-400 text-xs -mt-1"
                    >开启状态为汉字</span
                  >
                </el-form-item>

                <el-form-item
                  label="正则"
                  prop="regex"
                  v-if="item.type === '4'"
                >
                  <el-input
                    v-model="item.regex"
                    size="mini"
                    placeholder="请输入"
                  ></el-input>
                  <span class="text-gray-400 text-xs -mt-1"
                    >校验条件为正确的正则表达式</span
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </template>
      <div class="flex items-center justify-between" slot="title">
        <div class="flex items-center">
          <span class="font-bold text-sm">校验条件</span>
          <div class="h-7 flex items-center ml-3">
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
              @click="addValid"
            >
              <i class="el-icon-plus text-white text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </codeless-dialog-ctn>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button round size="mini" @click="cancel">取消</el-button>
      <el-button round size="mini" type="primary" @click="submitFields"
        >保存</el-button
      >
    </span> -->
  </el-dialog>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
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
    var validateMax = (rule, value, callback) => {
      if (value > this.activeForm.maxLength) {
        callback(new Error("最大长度不能小于最小长度！"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      active: "",
      activeForm: {},
      rules: {
        tips: [
          { required: true, message: "请输入错误提醒信息", trigger: "change" },
        ],
        maxLength: [{ required: true, trigger: "change" }],
        minLength: [
          { required: true, validator: validateMax, trigger: "change" },
        ],
        regex: [
          { required: true, message: "请输入正则表达信息", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    console.log("选中的校验", this.editRow);
    const typeMap = new Map([
      ["长度检查", "1"],
      ["精度检查", "2"],
      ["阈值检查", "3"],
      ["格式检查", "4"],
      ["非空检查", "5"],
    ]);
    this.editRow.validations.forEach((e) => {
      if (e.type.length > 1) {
        e.type = typeMap.get(e.type);
      }
    });
  },
  computed: {
    compType() {
      return (type) => {
        const typeMap = new Map([
          ["1", "长度检查"],
          ["2", "精度检查"],
          ["3", "阈值检查"],
          ["4", "格式检查"],
          ["5", "非空检查"],
          ["", "请选择类型"],
        ]);
        return typeMap.get(type);
      };
    },
  },
  methods: {
    randomChars(len) {
      const result = [];

      for (let i = 0; i < len; i++) {
        // 生成0~25的随机数字
        const ram = Math.ceil(Math.random() * 25);

        const char = String.fromCharCode(65 + ram);
        // 随机转为大小
        if (Math.random() < 0.33) {
          result.push(Math.floor(Math.random() * 10));
        } else if (Math.random() > 0.33 && Math.random() < 0.66) {
          result.push(char.toLowerCase());
        } else {
          result.push(char);
        }
      }

      return result.join("");
    },
    addValid() {
      const ctx = this;
      ctx.editRow.validations.push({
        chinese: "",
        createTime: new Date().getTime(),
        createUserName: "redmine",
        dictItemId: "",
        id: "val-" + ctx.randomChars(8),
        js: "",
        maxLength: "",
        minLength: "",
        regex: "",
        tenantId: "tenant-agree",
        tips: "",
        type: "",
        updateTime: new Date().getTime(),
        updateUserName: "redmine",
      });
    },
    del(index) {
      const ctx = this;
      ctx.editRow.validations.splice(index, 1);
      ctx.active = false;
      ctx.$forceUpdate();
    },
    handleCommand(e, item) {
      item.type = e;
    },
    selectItem(item) {
      const ctx = this;
      ctx.active = item.id;
      ctx.activeForm = item;
    },
    updateDictItem(val) {},
    submitFields() {
      const ctx = this;
      if (ctx.editRow.validations.length === 0) {
        ctx.$emit("update:visible", false);
        return;
      }
      if (ctx.editRow.validations.some((i) => i.tips === "")) {
        ctx.$notify.error({
          title: "错误",
          message: "请先正确填写校验条件内容！",
        });
      } else {
        ctx.$refs.ruleForm[0].validate((valid) => {
          if (valid) {
            ctx.$emit("update:visible", false);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
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
</style>