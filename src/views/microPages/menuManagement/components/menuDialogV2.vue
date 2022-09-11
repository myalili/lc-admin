<template>
  <div class="menu-management-dialog">
    <el-form
     :rules="rules"
      class="menu-management-dialog-form codeless-font-color-primary"
      ref="menuForm"
      :model="currentMenuData"
      label-width="110px"
      size="small"
    >

      <el-form-item label="页面来源" prop="pageType">
        <el-select
          v-model="currentMenuData.pageType"
          placeholder="请选择页面来源"
          class="w-full"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
            class="select-page"
            prop="path"  
            v-if="currentMenuData.pageType === 'release' && type === 'add'"    
        >
        <template v-slot:label>
        <span>选择页面</span>
        </template>
        <template v-slot:default>
        <codeless-release-page-select-panel
            @select="selectPath"
            ref = "codelessReleasePageSelectPanel"
            class="border codeless-border-color-gray"
        ></codeless-release-page-select-panel>
        </template>
    </el-form-item>
      
      <el-form-item
        label="选择页面"
        v-if="
          currentMenuData.pageType === 'arm' ||
          (currentMenuData.pageType === 'release' && type === 'edit')
        "
      >
        <el-popover
          popper-class="el-popover-no-padding codeless-border-radius arm-page-selected-popover codeless-box-shadow"
          :visible-arrow="false"
          trigger="manual"
          @hide="removeNode"
          v-model="visible"
        >
          <armPageSelectPanel
            @select="selectPath"
            v-if="currentMenuData.pageType === 'arm'"
          ></armPageSelectPanel>
          <codeless-release-page-select-panel
            :selectedItem="currentMenuData.path"
            @select="selectPath"
            :exclusiveChoice="true"
            v-if="currentMenuData.pageType === 'release'"
          ></codeless-release-page-select-panel>
          <el-input
            @focus="focusHandler"
            v-model="currentMenuData.path"
            placeholder="请输入内容"
            slot="reference"
          >
            <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item
        label="页面路径"
        v-if="
          currentMenuData.pageType !== 'arm' &&
          currentMenuData.pageType !== 'release'
        "
      >
        <el-input
          v-model="currentMenuData.path"
          placeholder="请输入页面路径"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        v-if="currentMenuData.pageType !== 'release' || type !== 'add'"
        prop="title"
      >
        <el-input
          v-model="currentMenuData.title"
          placeholder="请输入菜单名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="菜单图标"
        v-if="currentMenuData.pageType !== 'release' || type !== 'add'"
      >
        <codeless-dialog-icon
          :value.sync="currentMenuData.icon"
          :operationEnable="true"
          height="32px"
          width="32px"
        />
      </el-form-item>
      <el-form-item label="序号" prop="order"  v-if="type !== 'add'">
        <el-input
          v-model="currentMenuData.order"
          placeholder="请输入序号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="菜单英文名"
        prop="name"
        v-if="currentMenuData.pageType !== 'release' || type !== 'add'"
      >
        <el-input
          v-model="currentMenuData.name"
          placeholder="请输入菜单英文名"
        ></el-input>
      </el-form-item>
      <el-form-item label="开发管理菜单" prop="codelessType" v-if="isShow">
        <el-select v-model="currentMenuData.codelessType" placeholder="请选择">
          <el-option
            v-for="item in codelessTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const {addBatchMenus,addMenus,editMenu} = window.getAacApi();
import armPageSelectPanel from "./armPageSelectPanel.vue";
export default {
  props: {
    currentMenuData: {
      type: Object,
      default() {
        return {
            pageType:'',
            title:'',
            codelessType:'',
            name:'',
            path:'',
            icon:'',
            order:'',

        };
      },
    },
    type: {
      type: String,
      default: "add",
    },
    parentId:{
      type: String,
      default: "",
    },
  },
  components: {
    armPageSelectPanel,
  },
  data() {
    return {
      menus:[],
      codelessTypes: [
        {
          label: "是",
          value: "devMenu",
        },
        {
          label: "否",
          value: "runtimeMenu",
        },
      ],
      flag:false,
      visible:false,
      rules: 
        {
          pageType:[
              {
              required: true,
              message: "请选择页面来源",
              trigger: "change",
            },
          ],
          title: [
            {
              required: true,
              message: "请输入名称",
              trigger: "change",
            },
            {
              min: 1,
              max: 20,
              message: "长度限制为 1 到 20 个字符",
              trigger: "change",
            },
          ],
          name: [
            {
              required: true,
              message: "请输入编码",
              trigger: "change",
            },
            {
              min: 1,
              max: 20,
              message: "长度限制为 1 到 20 个字符",
              trigger: "change",
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
              trigger: "change",
            },
          ],
          icon: [
            {
              required: true,
              message: "请输入图标编码",
              trigger: "change",
            },
          ],
          path: [
            {
              required: true,
              message: "请输入页面路径",
              trigger: "change",
            },
          ],
        },
      options: [
        {
          value: "release",
          label: "本平台页面",
        },
        {
          value: "arm",
          label: "资源市场页面",
        },
        {
          value: "external",
          label: "外部链接",
        },
        {
          value: "iframe",
          label: "iframe模式引入",
        },
        {
          value: "vue",
          label: "vue模式引入",
        },
        {
          value: "js",
          label: "js模式引入",
        },
      ],
    };
  },
  computed: {
    isShow() {
      return process.env.NODE_ENV === "development";
    },
  },
  methods: {
    clickHandler(){
      // console.log(222)
      if(!this.flag){
        this.visible = false
      }else{
         this.flag = false
      }
    },
    focusHandler(){
      // console.log(111);
      this.flag = true;
      this.visible = true;
    },
    randomString(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    },
    generateBatchMenus(list,parentId){
        let menuObj = {},
            ctx = this,
            result = list || [];
        // let newResult = result.sort((a, b) => {
        //     return a.order - b.order;
        // });
        result.forEach((i,index) => {
            menuObj[i.id] = {
                id:i.id,
                newId:`menu-${ctx.randomString(8)}`,
                path:i.prototypeId==="prototype"?"":i.prototypeId,
                order:index,
                title:i.name,
                name:this.randomString(5,'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                codelessType:this.currentMenuData.codelessType,
                icon:i.icon,
                parentId:i.parentId,
                pageType:this.currentMenuData.pageType,
                type:window.platform,
            };
        });

        for (let i = -1, item; (item = result[++i]);) {
            if (!menuObj[item.parentId]) {
                menuObj[item.id].parentId = parentId;
            }else{
                menuObj[item.id].newPid = menuObj[item.parentId].newId
            }
        }
        let data = Object.values(menuObj);
        return data
    },
    async submit() {
      let ret = true;
      if(this.type==="add" && this.currentMenuData.pageType==="release"){
        this.menus = this.$refs['codelessReleasePageSelectPanel'].getPath();
        //   console.log(JSON.parse(JSON.stringify(this.menus)));
        this.currentMenuData.path = this.menus = this.generateBatchMenus(this.menus,this.parentId);
        //  console.log(JSON.parse(JSON.stringify(this.menus)));
        if(this.menus.length===1){
            this.menus = this.menus[0];
            delete this.menus.id;
            delete this.menus.newId;
        }else{
            this.menus = this.menus.map(item=>{
                item.id = item.newId;
                delete item.newId;
                if(item.newPid){
                     item.parentId = item.newPid;
                     delete item.newPid
                }
                return item
            })
        }
        //   console.log(JSON.parse(JSON.stringify(this.menus)));
      }else{
         this.menus = this.currentMenuData;
         if(this.type==="add"){
          this.menus.parentId = this.parentId;
         }
         
      }
      this.$refs.menuForm.validate((valid) => {
        if (!valid) {
           ret = false;
        } 
      });
      if(ret){
          //如果是修改
          if (this.type === "edit") {
            await this.editMenu();
          }
          //如果是新增
          else {
            await this.addMenu();
             console.log(3)
          }
      }
       console.log(4)
      return ret;
    },
    async editMenu() {
        let res = '';
        let ctx =this;
        let params = {
            id: this.menus.id,
            menuPO: this.menus,
        };
        res = await editMenu(params);
         if (res.success) {
            ctx.$notify({
                title: "菜单修改成功",
                type: "success",
            });
        } else {
            ctx.$notify({
                title: res && res.msg || "菜单修改失败",
                type: "error",
            });
        }
    },
    async addMenu() {
        let res = '';
        let ctx =this;
        if(Array.isArray(this.menus) && this.menus.length){
            console.log(this.menus);
           res= await addBatchMenus(this.menus)
        }else{
           console.log(this.menus)
           res= await addMenus(this.menus)
        }
        if (res.success) {
            ctx.$notify({
                title: "菜单添加成功",
                type: "success"
            });
             console.log(1)
        } else {
            ctx.$notify({
                title: res && res.msg || "菜单添加失败",
                type: "error"
            });
        }
        console.log(2)
    },
    selectPath(path) {
      console.log(path);
      // this.visible = true;
      this.$set(this.currentMenuData, "path", path);
      if(this.currentMenuData.pageType === 'arm'){
        this.visible = false;
        this.flag = false;
      }
      
      // this.currentMenuData.path = path
    },
    removeNode($el) {
      // console.log($el)
      let re = document.getElementsByClassName("arm-page-selected-popover");
      for (let i = re.length - 1; i >= 0; i--) {
        if (re[i]) {
          // console.log(ctx.$refs['arm-page-selected-popove'])
          re[i].remove();
        }
      }
    },
  },
  mounted(){
    window.msgHub.$off('menu-hide-popover');
    window.msgHub.$on('menu-hide-popover',this.clickHandler)
  },
  beforeDestroy(){
    window.msgHub.$off('menu-hide-popover')
  }
  
};
</script>

<style lang="less">
.arm-page-selected-popover {
  .release-page-select-ctn-header {
    line-height: 38px;
  }
}
</style>
<style lang="less" scoped>
.menu-management-dialog-form {
  padding-right: 30px;
  ::v-deep .select-page {
    .el-form-item__label {
      position: absolute;
      left: 44px;
      height: 38px;
      line-height: 38px;
    }
    .el-form-item__content {
      margin-left: 30px !important;
    }
  }
}
</style>