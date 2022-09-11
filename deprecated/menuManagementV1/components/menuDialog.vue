<template>
  <div class="add-dictionary-params-ctn common-dialog-ctn">
    <div class="common-dialog-body add-dictionary-params-body">
      <el-form
        label-position="top"
        class="params-prop-form"
        ref="menuForm"
        :model="currentMenuData"
        label-width="160px"
        :rules="formRules"
      >
        <el-col :span="12">
          <el-form-item label="中文名" prop="title">
            <el-input
              placeholder="菜单中文名长度限制为 1 到 20 个字符"
              v-model="currentMenuData.title"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名" prop="name">
            <el-input
              placeholder="菜单英文名由英文字母跟下划线组成，长度限制为 1 到 20 个字符"
              v-model="currentMenuData.name"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序号" prop="order">
            <el-input
              placeholder="请输入序号"
              v-model="currentMenuData.order"
              type="number"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标编码" prop="icon">
            <!-- <div class="flex items-center">
              <codeless-icon
                :icon="currentMenuData.icon"
                style="height: 20px; width: 20px; margin-right: 5px"
              ></codeless-icon>
              <el-button type="primary" @click="IconDialogvisible = true" size="">更改图标</el-button>
            </div> -->
            <el-input
              placeholder="请输入图标编码"
              v-model="currentMenuData.icon"
              clearable
            >
              <el-button slot="append" type="primary" @click="openIconDialog">{{currentMenuData.icon?'更改':'选择'}}图标</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="平台类型" prop="type">
            <el-select
              v-model="currentMenuData.type"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              @change="typeSelectedChange"
              clearable
              :disabled="isSelectedParentId"
            >
              <el-option
                v-for="(item, key) in typeOptions"
                :key="key"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父菜单页" prop="parentId">
            <el-cascader
              v-model="currentMenuData.parentId"
              :options="parentOption"
              :props="{ checkStrictly: true, expandTrigger: 'hover' }"
              placeholder="请选择父菜单页"
              :show-all-levels="false"
              clearable
              @change="authSelectedChange"
              style="width: 100%; height: 32.75px;"
            >
            </el-cascader>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="页面路径" prop="path">
            <el-input
              placeholder="请输入页面路径"
              v-model="currentMenuData.path"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="menuExtraSetting.indexOf('url') > -1">
          <el-form-item label="AFA URL" prop="url">
            <el-input
              placeholder="请输入url"
              v-model="currentMenuData.url"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="menuExtraSetting.indexOf('codelessType') > -1">
          <el-form-item label="低代码平台页面类型" prop="codelessType">
            <el-input
              placeholder="请输入低代码平台页面类型"
              v-model="currentMenuData.codelessType"
              clearable
            ></el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12" v-if="menuExtraSetting.indexOf('pageContent') > -1">
          <el-form-item label="场景页面描述" prop="pageContent">
            <el-input
              placeholder="请输入场景页面描述"
              v-model="currentMenuData.pageContent"
              clearable
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="页面类型" prop="pageType">
            <el-select v-model="currentMenuData.pageType" placeholder="请选择页面类型" class='w-full'>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            <!-- <el-input
              placeholder="请输入页面类型"
              v-model="currentMenuData.pageType"
              clearable
            ></el-input> -->
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <!-- <div slot="footer" class="common-bottom-btn-ctn bottom-btn-ctn">
            <el-button class="common-cancel-btn cancel-btn" @click="cancelSave"
                >取消</el-button
            >
            <el-button class="common-confirm-btn" type="primary" @click="submitSave" :loading="submitLoading"
                >确定</el-button
            >
        </div> -->
    <!-- <el-dialog
      :append-to-body="true"
      title="更改图标"
      :visible.sync="IconDialogvisible"
      custom-class="icon-select-dialog"
      width="50%"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      @opened='showIcon'
      @closed='hideIcon'
    >   
        <div v-if='!iconVisible' class='text-center'>加载图标中...</div>
        <div class='flex border-t border-b border-gray-F0F5F7 border-solid h-400px' v-else>
          <div class="w-200 bg-gray-F0F5F7 py-3" style='overflow:overlay'>
              <div class='h-8 hover:bg-white flex justify-between px-3.5 cursor-pointer items-center active'>
                <span>默认图标</span>
              </div>
          </div>
          <div class='flex-1'>
              <dialog-input-icon :icon.sync="currentMenuData.icon" :searchText="searchText"/>
          </div>
        </div>
        
      
        
      <div class="flex items-center justify-between px-6" slot="title">
        <span>{{ '更改图标' }}</span>
        <div class='flex items-center'>
          <el-input prefix-icon='iconfont icon-inquiry' size='mini' class='mr-5' v-model='searchText' clearable></el-input>
          <div 
            class="flex items-center justify-center w-18px h-18px cursor-pointer rounded-full text-white"
            style="background: linear-gradient(316deg, #15C0FF 0%, #00DDAA 100%);"
            @click="IconDialogvisible = false"
          >
            <i class="iconfont icon-guanbi-danchuang text-lg transform scale-48"></i>
          </div>
        </div>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="IconDialogvisible = false">取消</el-button>
        <el-button type="primary" @click="IconDialogvisible = false">确定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// 
// import dialogInputIcon from '@/views/codeLess/components/base/type/dialog_input_icon'
const {
  addMenus,
  editMenu
  } = window.getAacApi();
export default {
  mixins: [ window.V8.mixins],
  components: {
    // dialogInputIcon
  },
  props: {
    menuExtraSetting: {
      type: Array,
      default: () => {
        return [];
      },
    },
    parentOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
    platformTypeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    platformType: {
      type: String,
      default: () => {
        return "";
      },
    },
    type: {
      type: String,
      default: () => {
        return "";
      },
    },
    rowInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      searchText:'',
      // iconVisible:false,
      // projectId: "",
      submitLoading: false,
      options:[{
         value: 'vue',
         label: 'vue模式引入（默认模式）'
      },{
         value: 'js',
         label: 'js模式引入'
      },
      {
         value: 'external',
         label: '外部链接'
      },
      {
         value: 'iframe',
         label: 'iframe模式引入'
      },],
      currentMenuData: {
        name: "",
        title: "",
        order: "",
        parentId: "",
        path: "",
        icon: "",
        type: "",
        url: "",
        codelessType: "",
        pageContent: "",
        pageType: "vue"
      },
      //表单校验规则
      formRules: {
        title: [
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
        name: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度限制为 1 到 20 个字符",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (/^[a-zA-Z][a-zA-Z_]*$/.test(value) == false) {
                callback(new Error("英文名称由字母和下划线组成"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        order: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
        ],
        icon: [
          {
            required: true,
            message: "请输入图标编码",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: false,
            message: "请输入url",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: false,
            message: "请输入页面路径",
            trigger: "blur",
          },
        ],
        parentId: [
          {
            required: false,
            message: "请选择父菜单页",
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
      },
      typeOptions: [{
        label:"低代码平台",
        value:window.platform

      }],
      isSelectedParentId: false,
      parentOption: [],

      // IconDialogvisible: false
    };
  },
  methods: {
    // showIcon(){
    //   this.iconVisible=true;
    // },
    // hideIcon(){
    //   this.iconVisible=false
    // },
    openIconDialog() {
      const ctx = this;
      ctx.open({
        path: 'iconSelect',
        component:Vue.options.components.codelessIconSelectCtn,
        width:'60%',
        type: "SUB",
        params:{
          title:'更改图标',
          icon:ctx.currentMenuData.icon,
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog',
        confirmCallback: (icon) => {
          ctx.currentMenuData.icon =icon;
        },
      })
      // ctx.open({
      //   title: '更改图标',
      //   path: `/base/type/dialog_input_icon`,
      //   component: ()=>import(`@/views/codeLess/components/base/type/dialog_input_icon`),
      //   type: "SUB",
      //   width: "60%",
      //   height: "60%",
      //   body:true,
      //   params: { obj: { model: {icon: ctx.currentMenuData.icon} }, item: { name: 'icon' }},
      //   beforeConfirm: $el=>{  //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
      //     return true;
      //   },
      //   confirmCallback: $el => {
      //     ctx.currentMenuData.icon = $el.active;
      //   },
      //   cancelCallback: e => {
      //     console.log("点击取消");
      //   }
      // });
    },
    authSelectedChange(value){
      if(value.length === 0){
        this.currentMenuData.type = "";
        this.isSelectedParentId = false;
      }
      else{
        this.currentMenuData.type = value[0].split("*")[1];
        this.isSelectedParentId = true;
      }
    },
    typeSelectedChange(value){
      if(!value){
        this.currentMenuData.parentId = "";
        this.parentOption = this.parentOptions;
      }
      else{
        let parentOption = [];
        for(let i = 0; i < this.parentOptions.length; i++){
          if(this.parentOptions[i].value.split("*")[1] === value){
            parentOption.push(this.parentOptions[i]);
          }
        }
        this.parentOption = parentOption;
        // this.parentOption = this.parentOptions.map(item => {
        //   if(item.value.split("*")[1] === value){
        //     return item;
        //   }
        // });
      }
    },
    cancelSave() {
      this.$root.cancel();
    },
    //确认保存数据字典
    async submitSave() {
      await this.$refs.menuForm.validate((valid) => {
        if (valid) {
          //如果是修改
          if (this.type === "edit") {
            this.editMenu();
          }
          //如果是新增
          else {
            this.addMenu();
          }
        } else {
          this.$message.error("校验不通过，请检查填写格式是否正确！");
          return false;
        }
      });
    },
    async addMenu() {
      let self = this;
      let menuPO = JSON.parse(JSON.stringify(this.currentMenuData));
      if(JSON.stringify(this.rowInfo) !== "{}"){
        menuPO.parentId = this.rowInfo.id;
      }
      // menuPO.parentId = menuPO.parentId[menuPO.parentId.length - 1];
      menuPO.type = this.platformType;
      // let params = {
      //   menuPO: menuPO,
      // };
      this.$emit("toggleLoading");
      let res = await addMenus(menuPO);
      if (res.success) {
        self.submitLoading = false;
        self.$notify({
          title: "菜单添加成功",
          type: "success",
        });
        this.$emit("getMenus");
      } else {
        self.$notify({
          title: res.msg || "菜单添加失败",
          type: "error",
        });
      }
      this.$emit("toggleLoading");
    },
    async editMenu() {
      let self = this;
      let menuPO = JSON.parse(JSON.stringify(this.currentMenuData));
      // menuPO.order = parseInt(menuPO.order);
      // menuPO.parentId = menuPO.parentId[menuPO.parentId.length - 1];
      menuPO.parentId = this.rowInfo.parentId;
      let params = {
        id: menuPO.id,
        menuPO: menuPO,
      };
      this.$emit("toggleLoading");
      let res = await editMenu(params);
      if (res.success) {
        self.submitLoading = false;
        self.$notify({
          title: "菜单修改成功",
          type: "success",
        });
        this.$emit("getMenus");
      } else {
        self.$notify({
          title: res.msg || "菜单修改失败",
          type: "error",
        });
      }
      this.$emit("toggleLoading");
    },
   
    getParentData(data, id) {
      let cloneData = JSON.parse(JSON.stringify(data));
      let parentData = [];
      for (let parent of cloneData) {
        if (parent.parentId === null || parent.parentId === "") {
          parent.label = parent.title;
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
          child.label = child.title;
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
    let self = this;
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
    if (this.type === "edit") {
      this.currentMenuData = this.rowInfo;
    } else {
      this.menuExtraSetting.forEach((item) => {
        self.currentMenuData[item] = "";
      });
    }
    this.parentOption = JSON.parse(JSON.stringify(this.parentOptions));
  }
};
</script>

<style lang="scss" scoped>
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
      line-height: 24px;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
}
</style>

