<template>
  <div class="auth-management-ctn w-full h-full">
    <!--分类-->
    <el-container class="common-leftAside-rightMain">
      <div
        class="common-left-aside-ctn common-el-tree-ctn"
        v-loading="treeLoading"
      >
        <div class="auth-header">
          <span class="auth-header-title">权限</span>
          <!-- <el-button
            type="primary"
            title="删除权限"
            icon="el-icon-minus"
            circle
            size="mini"
            @click="deleteAuth"
          /> -->
          <el-input
            prefix-icon="iconfont icon-inquiry"
            size="mini"
            class="auth-search-input"
            clearable
            placeholder="请输入关键字"
            v-model="filterDictionaryText"
            @input="searchCategory_name"
            @keyup.enter.native="searchCategory_name"
          >
          </el-input>
        </div>
        <el-tree
          ref="authTree"
          id="authTree"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          @node-contextmenu="handleNodeContexMenu"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :filter-node-method="filterNode"
          class="common-el-tree"
        >
          <span
            class="custom-tree-node common-tree-node"
            slot-scope="{ node, data }"
            :title="data.name"
          >
            <i
              class="common-node-icon"
              :class="{
                'iconfont icon-xiangmu-quanxianguanli': !data.isLeaf,
                'iconfont icon-zixiang-quanxianguanli':
                  !data.children && data.isLeaf,
                'iconfont icon-fenlei-quanxianguanli':
                  data.children && data.isLeaf,
              }"
            ></i>
            <span :style="!data.isLeaf ? 'font-weight: bold;' : ''">{{
              node.label
            }}</span>
            <span class="common-tree-node-btn" v-show="showTreeButton">
              <el-button
                type="text"
                @click.stop="addAuth('addParent', data)"
                class="el-icon-circle-plus-outline common-tree-node-icon"
                title="新增权限"
                size="small"
                v-show="!data.isLeaf"
              ></el-button>
              <el-button
                type="text"
                @click.stop="addAuth('addChild', data)"
                class="el-icon-circle-plus-outline"
                title="新增子权限"
                size="small"
                v-show="
                  getTreePath(treeData, data.id).indexOf(data.id) < authLevel &&
                  data.isLeaf
                "
              ></el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="addAuth('edit', data)"
                class="el-icon-edit"
                title="编辑权限"
                v-show="data.isLeaf"
              ></el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="deleteAuth(data)"
                class="el-icon-delete"
                v-show="data.isLeaf"
                title="删除权限"
              ></el-button>
            </span>
          </span>
        </el-tree>
        <custom-right-menu
          v-if="showRightMenu"
          ref="dataCustomRightMenu"
          :menuData="treeDataRightClickMenuData"
          :eventHandler="treeDataRightClickEvent"
          @handleSelect="handleCatalogRightClickMenu"
        ></custom-right-menu>
        <div class="common-operation-tips" v-if="showRightMenu">
          <i class="el-icon-info"></i>右键可执行更多操作
        </div>
      </div>

      <el-container direction="vertical" class="common-right-main-ctn">
        <div class="menu-list">
          <div class="menu-list-header">
            <div class="menu-list-header-title">关联菜单</div>
            <el-button
              class="menu-list-header-save-button"
              type="primary"
              size="mini"
              icon="iconfont icon-baocun"
              round
              @click="relateMenuSubmit"
              :disabled="!canSave"
              v-loading="relateMenuLoading"
            >
              保存
            </el-button>
          </div>
          <el-collapse
            v-model="activeNames"
            class="menu-list-body"
            id="menuTree"
          >
            <!-- <authority-tree
              v-for="item in menuTree"
              :key="item.id"
              ref="menuTree"
              :data="item"
              :baseSelectedList="authRelateMenuMap[item.name]"
            /> -->
              <el-tree
              ref="menuTree"
              :props="props"
              :data="menuTree"
              show-checkbox
              node-key="id"
              default-expand-all
            
            >
            </el-tree>
          </el-collapse>
        </div>
      </el-container>
    </el-container>
    <!-- <authDialog
      ref="authDialog"
      :type="type"
      @getAuths="getAuths"
      :platformTypeList="platformTypeList"
    ></authDialog> -->
  </div>
</template>

<script>
// import authDialog from "./components/authDialog.vue";
import authorityTree from "./components/authorityTree.vue";
import customRightMenu from "./components/customRightMenu";
import addConfirm from './components/addConfirm.vue'
const { intoAuthoritiesTree, classifyList } = window.aacUtils;
const { requestMenus, requestAuths, deleteAuths, relateMenu } =
  window.getAacApi();
export default {
  name: "authManagement",
  mixins: [window.codelessMixins.customDialog],
  components: {
    // authDialog,
    authorityTree,
    customRightMenu,

  },
  provide() {
    return {
      baseInfo: this.baseInfo,
    };
  },
  props: {
    // platformTypeList: {
    //   type: Array,
    //   default: () => {
    //     let options = JSON.parse(
    //       window.localStorage.getItem("authEnums")
    //     ).PlatformType;
    //     let typeArray = [];
    //     options.forEach((item) => {
    //       typeArray.push(item.code);
    //     });
    //     return typeArray;
    //   },
    //   validator: function(platformTypeList){
    //       let options = JSON.parse(
    //         window.localStorage.getItem("authEnums")
    //       ).PlatformType;
    //       let typeArray = [];
    //       let isTrue = true;
    //       options.forEach((item) => {
    //         typeArray.push(item.code);
    //       });
    //       for(let item  of platformTypeList){
    //         if(typeArray.findIndex(type => type === item) === -1){
    //           isTrue = false;
    //           break;
    //         }
    //       }
    //       return isTrue;
    //   }
    // },
    // authLevel: {
    //   type: Number,
    //   default: () => {
    //     return 2;
    //   },
    // },
    // showRightMenu: {
    //   type: Boolean,
    //   default: () => {
    //     return true;
    //   },
    // },
    // showTreeButton: {
    //   type: Boolean,
    //   default: () => {
    //     return false;
    //   },
    // },
  },
  computed: {
    superAdmin() {
      return this.$store.state.user.currentData.superAdmin;
    },
    cnPlatformType() {
      let self = this;
      return this.platformTypeList.map((item) => {
        return self.typeToLabel[item];
      });
    },
    baseInfo() {
      return {
        platform: this.cnPlatformType,
      };
    },
    typeToLabel() {
      // let options = JSON.parse(
      //   window.localStorage.getItem("authEnums")
      // ).PlatformType;
      // let typeToLabel = {};
      // options.forEach((item) => {
      //   typeToLabel[item.code] = item.name;
      // });
      let typeToLabel = {
        [window.platform]: "低代码平台",
      };
      return typeToLabel;
    },
    labelToType() {
      // let options = JSON.parse(
      //   window.localStorage.getItem("authEnums")
      // ).PlatformType;
      // let labelToType = {};
      // options.forEach((item) => {
      //   labelToType[item.name] = item.code;
      // });
      let labelToType = {
        低代码平台: window.platform,
      };
      return labelToType;
    },
  },
  data() {
    return {
      props: {
        label: "name",
        children: "children",
      },
      platformTypeList: [window.platform],
      showTreeButton: true,
      showRightMenu: false,
      authLevel: 2,
      type: "",
      canSave: false,
      activeNames: ["低代码平台"],
      filterDictionaryText: "", //搜索树菜单
      //树状图参数  1是分类 0是目录
      treeData: [],
      treeDataRightClickEvent: null,
      treeDataRightClickMenuData: [],
      treeDataRightClickMenuDataMeta: [
        {
          name: "新增权限",
          key: "addParent",
        },
        {
          name: "新增子权限",
          key: "addChild",
        },
        {
          name: "编辑权限",
          key: "modify",
        },
        {
          name: "删除权限",
          key: "delete",
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeLoading: false,
      relateMenuLoading: false,
      menuTree: [],
      authRelateMenuMap: {},
      treeDateRightClickAuthData: {},
      defaultTreeData:[]
    };
  },
  methods: {
    async relateMenuSubmit() {
      let menuIds = [];
      let self = this;
      // this.$refs.menuTree.forEach((tree) => {
      //   menuIds.push(...tree.getCheckedIdList());
      // });
      let halfKey = this.$refs.menuTree.getHalfCheckedKeys();
      halfKey = halfKey.filter((item) => {
        return item !== "--低代码平台--";
      });
      menuIds = this.$refs.menuTree.getCheckedKeys();
      menuIds = menuIds.concat(halfKey);
      menuIds= menuIds.filter((item) => {
        return item !== "--低代码平台--";
      })
      let param = {
        id: this.treeDateRightClickAuthData.id,
        menuIds: menuIds,
      };
      this.relateMenuLoading = true;
      let res = await relateMenu(param);
      if (res.success) {
        self.$notify({
          title: "关联菜单成功",
          type: "success",
        });
      } else {
        self.$notify({
          title: res.msg || "关联菜单失败",
          type: "error",
        });
      }
      self.relateMenuLoading = false;
    },
    getTreePath(tree, id) {
      let path = [];
      function dfs(tree) {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].value === id) {
            path.unshift(tree[i].value);
            return true;
          } else if (tree[i].children) {
            if (dfs(tree[i].children)) {
              path.unshift(tree[i].value);
              return true;
            }
          }
        }
      }
      dfs(tree);
      return path;
    },
    async searchCategory_name() {
      console.log(this.defaultTreeData,'this.defaultTreeData');
      this.treeData = this.deepClone(this.defaultTreeData)
      this.treeData = await this.searchData(this.treeData, this.filterDictionaryText);
    },
    searchData(data, val) {
      return data.filter(function f(o) {
        if (o.name.includes(val)) return true
        if (o.children) {
          return (o.children = o.children.filter(f)).length
        }
      })
    },
    deepClone(obj) { 
       let newObj=Array.isArray(obj)?[]:{}
        if(obj&&typeof obj ==="object"){
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    newObj[key]=(obj && typeof obj[key]==='object')?this.deepClone(obj[key]):obj[key];
                }
            }
    }
    return newObj
    },
    async getAuths() {
      let param = {
        params: {},
      };
      if (this.platformTypeList.length > 0) {
        param.params.type = this.platformTypeList.join(",");
        param.params.verbose = true;
      }
      let self = this;
      this.treeLoading = true;
      let res = await requestAuths(param);
      if (res.success) {
        let treeData = [];
        res.content = res.content.filter(auth=>{
          let {menus} = auth;
          if(self.superAdmin){
            if(menus && menus.length){
              return menus.some(menu=>{
                return (
                  menu.codelessType === "devMenu" ||
                  menu.codelessType === "runtimeMenu"
                );
              })
            }else{
              return true
            }
            
          }else{
            if(!auth.tenantId && menus && menus.length){
              return menus.some(menu=>{
                return (
                  menu.codelessType === "devMenu" ||
                  menu.codelessType === "runtimeMenu"
                );
              })
            }else{
              return auth.tenantId
            }
          }
          
        })
        let authData = res.content.map((item) => {
          return {
            ...item,
            type: self.typeToLabel[item.type],
          };
        });
        self.platformTypeList.forEach((item) => {
          let node = {
            value: item,
            label: self.typeToLabel[item],
            name: self.typeToLabel[item],
            id: item,
          };
          let children = self.getParentData(authData, self.typeToLabel[item]);

          if (children.length > 0) {
            node.children = children;
          }
          treeData.push(node);
        });
        self.treeData = treeData;
        self.defaultTreeData = this.deepClone(treeData)
        if (JSON.stringify(this.treeDateRightClickAuthData) !== "{}") {
          this.$nextTick(() => {
            this.$refs.authTree.setCurrentKey(
              this.treeDateRightClickAuthData.id
            );
          });
          setTimeout(() => {
            let nodeOffsetTop = document.querySelector(
              ".common-el-tree .is-current"
            ).offsetTop;
            let parentNodeClientHeight =
              document.querySelector("#authTree").clientHeight;
            if (nodeOffsetTop > parentNodeClientHeight) {
              document.querySelector("#authTree").scrollTop =
                nodeOffsetTop - parentNodeClientHeight / 2;
            }
            let node = this.$refs.authTree.getNode(
              this.treeDateRightClickAuthData.id
            );
            this.handleNodeClick(this.treeDateRightClickAuthData, node);
          }, 500);
        }
      } else {
        self.$notify({
          title: res.msg || "接口异常",
          type: "error",
        });
      }
      self.treeLoading = false;
    },
    getParentData(data, type) {
      let cloneData = JSON.parse(JSON.stringify(data));
      let parentData = [];
      for (let parent of cloneData) {
        if (parent.type !== type) {
          continue;
        }
        if (parent.parentId === null || parent.parentId === "") {
          parent.label = parent.name;
          parent.value = parent.id;
          let childrenCopy = this.getChildren(parent.id, cloneData, type);
          if (childrenCopy.length > 0) {
            parent.children = childrenCopy;
            parent.isLeaf = "0";
          } else {
            parent.isLeaf = "1";
          }
          parentData.push(parent);
        }
      }
      return parentData;
    },
    getChildren(parentId, data, type) {
      let children = [];
      for (let child of data) {
        if (child.type !== type) {
          continue;
        }
        if (child.parentId === parentId) {
          child.label = child.name;
          child.value = child.id;
          children.push(child);
        }
      }
      for (let child of children) {
        let childrenCopy = this.getChildren(child.id, data, type);
        if (childrenCopy.length > 0) {
          child.children = childrenCopy;
          child.isLeaf = "0";
        } else {
          child.isLeaf = "1";
        }
      }
      return children;
    },
    handleNodeContexMenu(event, data) {
      if (!this.showRightMenu) {
        return;
      }
      this.treeDateRightClickAuthData = data;
      let path = this.getTreePath(this.treeData, data.id);
      if (path.indexOf(data.id) === 0) {
        //系统根目录与数据字典不允许有右键操作
        this.treeDataRightClickMenuData = [
          this.treeDataRightClickMenuDataMeta[0],
        ];
      } else if (path.indexOf(data.id) < this.authLevel) {
        //自定义分类头结点和系统（不是系统下的分类）只有新增选项
        this.treeDataRightClickMenuData = [
          this.treeDataRightClickMenuDataMeta[1],
          this.treeDataRightClickMenuDataMeta[2],
          this.treeDataRightClickMenuDataMeta[3],
        ];
      } else if (path.indexOf(data.id) >= this.authLevel) {
        this.treeDataRightClickMenuData = this.treeDataRightClickMenuData = [
          this.treeDataRightClickMenuDataMeta[2],
          this.treeDataRightClickMenuDataMeta[3],
        ];
      }
      this.treeDataRightClickEvent = event;
    },
    handleNodeClick(data, node, tree) {
      let self = this;
      let selectedKey = [];
      if (node.isLeaf) {
        this.treeDateRightClickAuthData = data;
        this.authRelateMenuMap = classifyList(
          data.menus
            .map((item) => {
              return {
                ...item,
                type: self.typeToLabel[item.type],
              };
            })
            .filter((item) => self.cnPlatformType.includes(item.type))
        );
        // this.activeNames = this.menuTree.map((item) => item.name);

        let authRelateMenu = this.authRelateMenuMap[this.activeNames];
        // console.log(authRelateMenu);

        if (Array.isArray(authRelateMenu)) {
          //去除掉parentId
          let idMap = {};
          authRelateMenu.forEach((item) => {
            idMap[item.id] = true;
          });
          authRelateMenu.forEach((item) => {
            if (idMap[item.parentId]) {
              delete idMap[item.parentId];
            }
          });
          // console.log(idMap)
          selectedKey = Object.keys(idMap);
        }
        // console.log(selectedKey);
      }
      if (data.id === this.treeDateRightClickAuthData.id) {
        this.canSave = true;
      } else {
        this.canSave = false;
        this.authRelateMenuMap = {};
        // this.activeNames = [];
      }
      this.$refs.menuTree.setCheckedKeys(selectedKey);
      document.querySelector("#menuTree").scrollTop = 0;
      console.log(this.authRelateMenuMap);
    },
    handleCatalogRightClickMenu(key) {
      switch (key) {
        case "addParent": {
          this.addAuth("addParent", this.treeDateRightClickAuthData);
          break;
        }
        case "addChild": {
          this.addAuth("addChild", this.treeDateRightClickAuthData);
          break;
        }
        case "delete": {
          this.deleteAuth(this.treeDateRightClickAuthData);
          break;
        }
        case "modify": {
          this.addAuth("edit", this.treeDateRightClickAuthData);
          break;
        }
      }
    },
    submit(type,rowInfo){
         let title = ''
         if(type=='edit'){
            title='编辑权限'
         }else if(type=='addChild'){
            title = '添加子权限'
         }else{
            title = '添加权限'
         }
         console.log(title,'title');
         let self = this;
         self.openCustomDialog({
            title:title,
            path:'addConfirm',
            width:"500px",
            component:addConfirm,
            propsData:{
              currentAuthData:rowInfo,
              type
            },
        beforeConfirm:async($_dontCare,$el)=>{
            let result =await $el.showAuthDialog(type, rowInfo);
            console.log(result);
            if(result){
               self.getAuths();
               self.$forceUpdate();
            }
           
            return result
        }, 
        cancelCallback(){},
        // confirmCallback(){
        //    self.getAuths();
        //    self.$forceUpdate();
        // }
        })
    },
    addAuth(type, row) {
      console.log(type);
      this.type = type;
      if (type === "edit") {
        let rowInfo = JSON.parse(JSON.stringify(row));
        rowInfo.parentId = row.parentId || "";
       // this.$refs.authDialog.showAuthDialog(type, rowInfo);
        this.submit(type,rowInfo)
      } else {
        if (type !== "addParent" && row.menus.length > 0) {
          this.$notify({
            title: "该权限已关联菜单，不可以再新增子权限",
            type: "error",
          });
          return;
        }
        let rowInfo = {
          name: "",
          id: row.id,
          type: this.labelToType[row.type] || this.labelToType[row.name],
        };
        this.submit(type,rowInfo)
        // this.$refs.authDialog.showAuthDialog(type, rowInfo);
      }
    },
    getSelectedNodeId(selectedNode) {
      let ids = [selectedNode.id];
      if (selectedNode.children) {
        getSelectedChildrenNodeId(selectedNode.children);
      }
      function getSelectedChildrenNodeId(childNodes) {
        childNodes.forEach((item) => {
          ids.push(item.id);
          if (item.children) {
            getSelectedChildrenNodeId(item.children);
          }
        });
      }
      return ids;
    },
    deleteAuth(selectedNode) {
      let nodes = this.$refs.authTree.getCheckedNodes();
      let self = this;
           self.openCustomDialog({
        title:`提示`,
        path:'deleteConfirm',
        width:"300px",
        component:{
          template:`<div>确认删除此所选权限吗?</div>`,
        },
        confirmCallback(){
            let ids = [];
            if (selectedNode) {
              ids = self.getSelectedNodeId(selectedNode);
            } else {
              ids = nodes.map((item) => {
                return item.id;
              });
            }
            let param = {
              ids: ids,
            };
            deleteAuths(param).then((res) => {
              if (res.success) {
                self.$notify({
                  title: "删除权限成功",
                  type: "success",
                });
                self.getAuths();
              } else {
                self.$notify({
                  title: res.msg || "删除权限失败",
                  type: "error",
                });
              }
        });
        }
      })
      // this.$confirm("确认删除所选权限吗？", "提示", {
      //   type: "warning",
      // }).then(async () => {
      //   let ids = [];
      //   if (selectedNode) {
      //     ids = self.getSelectedNodeId(selectedNode);
      //   } else {
      //     ids = nodes.map((item) => {
      //       return item.id;
      //     });
      //   }
      //   let param = {
      //     ids: ids,
      //   };
      //   deleteAuths(param).then((res) => {
      //     if (res.success) {
      //       self.$notify({
      //         title: "删除权限成功",
      //         type: "success",
      //       });
      //       self.getAuths();
      //     } else {
      //       self.$notify({
      //         title: res.msg || "删除权限失败",
      //         type: "error",
      //       });
      //     }
      //   });
      // });
    },
    //搜索过滤树菜单
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    async getMenus() {
      let params = {};
      if (this.platformTypeList.length > 0) {
        params.type = this.platformTypeList.join(",");
      }
      let self = this;
      let res = await requestMenus(params);
      if (res.success) {
        let content = res.content
          .filter((item) => {
            return (
              item.codelessType === "devMenu" ||
              item.codelessType === "runtimeMenu"
            );
          })
          .map((item) => {
            return {
              ...item,
              name: item.title,
              title: item.name,
              type: self.typeToLabel[item.type],
            };
          });
        self.menuTree = intoAuthoritiesTree(content);
        console.log(self.menuTree);
      } else {
        self.$notify({
          title: res.msg || "接口异常",
          type: "error",
        });
      }
    },
  },
  watch: {
    filterDictionaryText(val) {
      this.$refs.dictionaryTree.filter(val);
    },
  },
  mounted() {
    this.getAuths();
    this.getMenus();
  },
};
</script>

<style lang="scss" scoped>
.common-leftAside-rightMain {
  height: 100%;
  .common-left-aside-ctn {
    position: relative;
    width: 314px;
    border-radius: 0;
    background: #ffffff;
    border-right: 1px solid #ebeef0;
    // padding-bottom: 28px;
    .auth-header {
      margin: 13px 16px 0px 16px;
      .auth-header-title {
        font-size: 14px;
        color: #333;
        padding-left: 4px;
        font-weight: 700;
        margin-right: 10px;
      }
      .auth-search-input {
        width: calc(100% - 54px);
        margin-left: 10px;
        display: inline-block;
        ::v-deep .el-input__inner {
          border-radius: 30px;
          background-color: #ffffff;
          i {
            font-size: 14px;
            position: absolute;
          }
          // &:hover {
          //   border-color: #07b5b5;
          // }
        }
      }
    }
  }
  .common-right-main-ctn {
    border-radius: 0;
    margin-left: 0px;
    margin-left: 1px;
    background-color: #ffffff;
    width: calc(100% - 314px);
  }
}
.common-el-tree-ctn {
  .common-el-tree {
    height: calc(100% - 54px);
    padding: 0px;
    margin-top: 14px;
    overflow-y: overlay;
    // margin: 14px 14px 0px;
    // padding:14px 14px 0;
    ::v-deep .el-tree-node__content {
      // height:unset;
      // line-height:unset;
      // margin-bottom:unset;
      height: 32px;
      line-height: 32px;
      margin-bottom: 2px;

      &:hover {
        background: #f0f4f7;
        .common-tree-node {
          .common-tree-node-btn {
            display: inline-block;
          }
        }
      }
      .common-tree-node {
        flex: 1;
        .common-node-icon {
          margin-right: 6px;
          color: #a4aeb4;
          font-size: 12px;
        }
        .common-tree-node-btn {
          display: none;
          margin-left: 10px;
          float: right;
          margin-right: 10px;
        }
      }
    }
    ::v-deep.el-tree-node.is-current {
      > .el-tree-node__content {
        // background: #07b6b5;
        // color: #ffffff;
      }
    }
  }
  .common-operation-tips {
    position: absolute;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: #eff7fb;
    line-height: 28px;
    text-align: center;
    color: #07b5b5;
    overflow: hidden;
    border-radius: 0;
    min-width: 200px;
  }
}
.auth-management-ctn {
  .menu-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 0 20px 20px;
    &-header {
      display: flex;
      align-items: center;
      height: 60px;
      line-height: 60px;
      &-title {
        display: flex;
        font-size: 14px;
        color: #333;
        flex-grow: 1;
        font-weight: bold;
      }
      &-text {
        font-size: 14px;
        padding-left: 5px;
      }
      &-second-text {
        padding-left: 5px;
        color: rgb(153, 153, 153);
      }
      &-save-button {
        // background-color: #357aa0;
        // border-color: #357aa0;

        ::v-deep .icon-baocun {
          font-size: 12px;
        }
        // &:hover {
        //   background-color: rgb(87, 161, 201);
        // }
        // &:active {
        //   background-color: #357aa0;
        // }
      }
    }
    &-body {
      height: 100%;
      flex-grow: 1;
      overflow: auto;
      border: none;

      ::v-deep .el-collapse-item__header {
        height: unset;
        line-height: unset;
        margin-bottom: 10px;
      }

      ::v-deep .el-collapse-item__arrow {
        display: none;
      }

      ::v-deep .el-collapse-item__wrap {
        border: none;
      }
    }
  }
}
#menuTree{
  ::v-deep .el-tree-node__expand-icon{
   display: none !important;
}
.el-tree ::v-deep {
    .el-tree-node__content {
      position: relative;
    }

    .el-tree-node:last-child > .el-tree-node__content::before {
      content: "";
      width: 1px;
      height: 10000px;
      background-color: #E7ECEF;
      position: absolute;
      margin-left: -9px;
      bottom: 13px;
    }

    .el-tree-node__children .el-tree-node__content::after {
      content: "";
      width: 9px;
      height: 1px;
      // background-color: #E7ECEF;
      position: absolute;
      margin-left: -9px;
    }

    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 6px 3px;
    }
  }
}

</style>
