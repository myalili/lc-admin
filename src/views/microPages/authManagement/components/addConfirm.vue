<template>
    <div>
        <div class="add-dictionary-params-ctn common-dialog-ctn">
        <div class="common-dialog-body add-dictionary-params-body">
        <el-form
          label-position="left"
          class="params-prop-form"
          ref="authForm"
          :model="currentAuthData"
          label-width="60px"
          :rules="formRules"
          style="width: 100%"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              placeholder="名称长度限制为 1 到 20 个字符"
              v-model="currentAuthData.name"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    </div>
</template>

<script>

const {
  addAuth,
  editAuth
} = window.getAacApi()
export default {
  mixins: [ window.V8.mixins ],
  props: {
    currentAuthData: {},
    platformTypeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: () => {
        return "";
      },
    }
  },
  data() {
    return {
      authDialogVisible: false,
      // projectId: "",
      submitLoading: false,

      typeOptions: [{
        label:"低代码平台",
        value:window.platform

      }],
      //表单校验规则
      formRules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度限制为 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择平台类型",
            trigger: "blur",
          },
        ],
      }
    };
  },
  methods: {
  async  showAuthDialog(type, rowInfo) {
    let result = false
        this.type = type
      if(rowInfo){
        this.currentAuthData.name = rowInfo.name;
        this.currentAuthData.type = rowInfo.type;
        if(type === "addChild"){
          this.currentAuthData.parentId = rowInfo.id;
          
        }
        else if(type === "addParent"){
          this.currentAuthData.parentId = "";
        }
        else if(type === "edit"){
          this.currentAuthData = rowInfo;
        }
       result= await this.submitSave()
      }
    return result
    },
    closeAuthDialog() {
      this.authDialogVisible = false;
      this.currentAuthData = {
        name: "",
        type: "",
        parentId: [],
      };
    },
    //确认保存数据字典
    async submitSave() {
      let ret = false;
      this.$refs.authForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          
            ret = true
        }
        // } else {
        //   this.$message.error("校验不通过，请检查填写格式是否正确！");
        
        // }
      });
      if(ret){
        //如果是修改
          if (this.type === "edit") {
            await this.editAuth();
          }
          //如果是新增
          else {
           await this.addAuth();
          }
      }
      return ret
    },
    async addAuth() {
      let self = this;
      let authPO = JSON.parse(JSON.stringify(this.currentAuthData));
      if (authPO.parentId.length === 0) {
        delete authPO.parentId;
      }
      let params = {
        authPO: authPO,

      };
      this.submitLoading = true;
      let res = await addAuth(params);
      console.log(1,res)
      if (res.success) {
        self.$notify({
          title: "权限添加成功",
          type: "success",
        });
         console.log(2,res)
        // self.$emit("getAuths");
      } else {
        self.$notify({
          title: res.msg || "权限添加失败",
          type: "error",
        });
      }
      self.submitLoading = false;
    },
    async editAuth() {
      let self = this;
      let authPO = JSON.parse(JSON.stringify(this.currentAuthData));
      let params = {
        id: this.currentAuthData.id,
        authPO: authPO,
      };
      this.submitLoading = true;
      let res = await editAuth(params);
      if (res.success) {
        self.$notify({
          title: "菜单修改成功",
          type: "success",
        });
        // self.$emit("getAuths");
      } else {
        self.$notify({
          title: res.msg || "菜单修改失败",
          type: "error",
        });
      }
      self.submitLoading = false;
    },
    getParentData(data, id) {
      let cloneData = JSON.parse(JSON.stringify(data));
      let parentData = [];
      for (let parent of cloneData) {
        if (parent.parentId === null || parent.parentId === "") {
          parent.label = parent.name;
          parent.value = parent.id;
          if (parent.id === id) {
            parent.disabled = true;
          } else {
            parent.disabled = false;
          }
          let childrenCopy = this.getChildren(
            parent.id,
            cloneData,
            id,
            parent.disabled
          );
          if (childrenCopy.length > 0) {
            parent.children = childrenCopy;
          }
          parentData.push(parent);
        }
      }
      return parentData;
    },
    getChildren(parentId, data, id, isDisable) {
      let children = [];
      for (let child of data) {
        if (child.parentId === parentId) {
          child.label = child.name;
          child.value = child.id;
          if (isDisable) {
            child.disabled = true;
          } else {
            if (child.id === id) {
              child.disabled = true;
            } else {
              child.disabled = false;
            }
          }
          children.push(child);
        }
      }
      for (let child of children) {
        let childrenCopy = this.getChildren(
          child.id,
          data,
          id,
          child.isDisable
        );
        if (childrenCopy.length > 0) {
          child.children = childrenCopy;
        }
      }
      return children;
    },
  },
  mounted() {
    // let options = JSON.parse(window.localStorage.getItem("authEnums")).PlatformType;
    // if (this.platformTypeList.length > 0) {
    //   this.typeOptions = this.platformTypeList.map((item) => {
    //     let index = options.findIndex((option) => item === option.code);
    //     if (index > -1) {
    //       return {
    //         label: options[index].name,
    //         value: options[index].code,
    //       };
    //     }
    //   });
    // } else {
    //   let typeOptions = [];
    //   options.forEach((item) => {
    //     typeOptions.push({
    //       label: item.name,
    //       value: item.code,
    //     });
    //   });
    //   this.typeOptions = typeOptions;
    // }
  },
};
</script>

<style lang="scss">
.add-dictionary-params-ctn {
  .add-dictionary-params-body {
    display: flex;
    > .el-tabs {
      padding-left: 30px;
      flex: 1;
    }
    > .el-tabs > .el-tabs__content {
      height: 100%;
      overflow: auto;
      padding-top: 20px;
      padding-right: 10px;
      box-sizing: border-box;
    }
  }
  .el-collapse {
    border-color: transparent;
    .el-collapse-item + .el-collapse-item {
      margin-top: 10px;
    }
    .el-collapse-item__header {
      border-radius: 8px;
      padding-left: 20px;
      background-color: #f6f8f9;
      border: 1px solid #ebeef5;
      cursor: pointer;
      transition: border-radius linear 0.3s;
      transition-delay: 0.2s;
      &.is-active {
        transition: border-radius linear 0s;
        border-radius: 8px 8px 0 0;
      }
    }
    .el-collapse-item__wrap {
      padding: 14px;
      border: 1px solid #ebeef5;
      border-top: none;
      border-radius: 0 0 8px 8px;
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
  }
  .code-input {
    margin-left: 10px;
    width: calc(100% - 140px);
    .el-input__inner {
      padding-right: 12px;
      padding-left: 12px;
    }
  }
  .view-code-value-btn {
    width: 50px;
    padding: 8px 0;
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .params-prop-form {
    .el-form-item {
      margin: 0 10px 14px 10px;
    }
    .el-form-item__label {
      padding: 0;
      line-height: 36px;
    }
    .el-form-item__content {
      line-height: 36px;
    }
  }
}
</style>
