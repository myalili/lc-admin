<template>
  <div @click="closePopover" class="h-full" v-loading="pageListLoading">
    <!-- <el-tabs v-model="activeName" @tab-click="getMenus">
      <el-tab-pane
        v-for="(item, key) in platformObj"
        :key="key"
        :label="item.name"
        :name="item.code"
      > -->
        <div class="menu-management-ctn"  v-for="(item, key) in platformObj"  :key="key">
          <div class="common-table-top-btn-ctn">
            <span class="pageTiltle">菜单</span>
            <div>
              <el-button type="primary"  
              icon="el-icon-plus" 
              round 
              @click="addMenu('add')" 
              style="width: 92px;height: 30px;"
              size='mini'
                >菜单</el-button>
              
                <el-button
                plain
                round
                size='mini'
                style="width: 76px;height: 30px;"
                class="sort-menu-btn"
                @click="sortMenu"
                >排序</el-button
              >
              <el-button
                plain
                round
                size='mini'
                style="width: 76px;height: 30px;"
                class="delete-menu-btn"
                @click="deleteMenu(item.selectedMenus)"
                :disabled="item.selectedMenus.length === 0"
                >删除</el-button
              >
              <!-- <el-button
                plain
                round
                size='mini'
                style="width: 76px;height: 30px;"
                color
                @click="deleteMenu(item.selectedMenus)"
                :disabled="item.selectedMenus.length === 0"
                >删除</el-button
              > -->

                <el-input
                prefix-icon="el-icon-search"
                v-model="menusseachvalue"
                clearable
                placeholder="搜索关键字"
                @change="searchMenus"
                class="meun-right-content-box-input-keyword"
                style="width: 200px;height: 31px;"
                 size='mini'
              ></el-input>
              <!-- <search
                ref="search"
                @update-search="searchMenus"
                style="width: 400px;margin:0;margin-left:12px;"
              ></search> -->
            </div>
          </div>
          <div class="common-table-ctn">
            <el-table
              height="100%"
              class="common-value-table"
              size='medium'
              :data="item.menuPageData"
              ref="menuTable"
              style="width: 100%"
              highlight-current-row
              row-key="id"
              :tree-props="{ children: 'children' }"
              default-expand-all
              @select="select"
              @select-all="selectAll($event, item)"
              @selection-change="handleSelectionChange($event, key)"
              header-cell-class-name="meuns-table-header-cell-class-name"
              cell-class-name="meuns-table-cell-class-name"
            >
              <el-table-column type="selection" width="45" align="center">
              </el-table-column>
              <el-table-column
                prop="title"
                min-width="20%"
                label="菜单名称"
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('title') !== -1"
              >
                <template slot-scope="scope">
                  <div class="meuns-cnname-icon">
                    <svg class="icon svg-icon" aria-hidden="true">
                      <use :xlink:href="`#${scope.row.icon || 'icon-gongzuotai1'}`"></use>
                    </svg>
                    <span>{{ scope.row.title }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                min-width="30%"
                label="url路径英文名称"
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('name') !== -1"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="order"
                label="序号"
                min-width="10%"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('order') !== -1"
              ></el-table-column> -->
              <!-- <el-table-column
                prop="icon"
                label="图标编码"
                min-width="20%"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('icon') !== -1"
              >
              </el-table-column> -->
              <el-table-column
                prop="path"
                min-width="30%"
                label="页面路径"
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('path') !== -1"
              >
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot="header">
                  <el-popover
                    trigger="click"
                    placement="bottom-start"
                    :visible-arrow="false"
                    @hide="showColumnGroup"
                    @show="showColumnGroup"
                    popper-class="common-column-setting-popover"
                  >
                    <div class="check-column-ctn">
                      <p class="check-title">表格字段定制</p>
                      <el-checkbox-group
                        v-model="checkdColumn"
                        class="column-check-group"
                      >
                        <el-checkbox
                          v-for="(value, key) in tableColumn"
                          :label="key"
                          :key="key"
                          >{{ value }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </div>

                    <div
                      slot="reference"
                      class="coloum-setting-icon"
                      style="display: inherit"
                    >
                      操作
                      <!-- <svg
                        class="common-column-tool-icon"
                        :class="{ 'actived-icon': isShowColumnGroup }"
                        aria-hidden="true"
                      >
                        <use xlink:href="#icon-biaogeliepeizhi" />
                      </svg> -->
                    </div>
                  </el-popover>
                </template>
                <template slot-scope="scope">
                  <el-button
                    class="el-icon-circle-plus-outline"
                    type="text"
                    title="新增子菜单"
                    style="font-size: 14px"
                    @click.stop="addMenu('add', scope.row)"
                  ></el-button>
                  <el-button
                    class="el-icon-edit-outline"
                    type="text"
                    title="编辑菜单"
                    style="font-size: 14px"
                    @click.stop="addMenu('edit', scope.row)"
                  ></el-button>
                  <el-button
                    class="el-icon-delete"
                    type="text"
                    title="删除菜单"
                    style="font-size: 14px"
                    @click.stop="deleteMenu([scope.row])"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-footer class="footer-pagination" style="height: 36px">
              <pagination
                ref = "pagination"
                :total="total"
                :currentPage="currentPage"
                :pageSizes="[10, 20, 50, 100]"
                :pageSize="pageSize"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              ></pagination>
            </el-footer> -->
          </div>
        </div>
      <el-dialog
      width="459px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="sortMenudalog"
      custom-class="no-header-and-footer-dailog menu-left-aside-add-preject-dialog"
    >
      <codeless-Dialog-Ctn
        title="排序"
        confirmBtnText="保存"
        @confirm="confirmdsortMeun"
        @cancel="sortMenudalog =  false"
        @close="sortMenudalog =  false"
      >
        <template v-slot:dialogContent>
          <div class="sortMenuclass">
            <el-tree
            :props="sortMenuprops"
            :data="sortMenuData"
            node-key="id"
            :draggable="true">
              <div class="meuns-custom-tree-node" slot-scope="{data }">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use :xlink:href="`#${data.icon || 'icon-gongzuotai1'}`"></use>
                </svg>
                <span>{{data.title}}</span>
              </div>
          </el-tree>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
  </div>
</template>
<script>

import menuForm from "./components/menuDialogV2.vue";
const {
  requestMenus,
  deleteMenus,
  editMenus
} = window.getAacApi()
export default {
  name: "menuManagement",
  mixins: [window.codelessMixins.customDialog],
  data() {
    return {
      menuExtraSetting:["url", "codelessType", "pageContent"],
      platformTypeList:[window.platform],
      activeName: "",
      platformObj: {},
      menuData: [],
      parentOptions: [],
      originData: [],
      rowInfo: {},
      // menuDialogTitle: "",
      // menuDialogVisible: false,
      type: "",
      // submitLoading: false,
      menuPageData: [],
       checkdColumn: ["title", "name", "path", "icon"],
      // checkdColumn: ["title", "name", "path", "order", "icon"],
      tableColumn: {
        title: "名称",
        name: "编码",
        path: "路径",
        // order: "序号",
        icon: "图标编码",
      },
      selectedMenus: [],
      isShowColumnGroup: false,
      // total: 0,
      // currentPage: 1,
      // pageSize: 10,
      dialogLoading:false,
      pageListLoading: false,
      typeToLabel: {
        [window.platform]:'低代码平台'
      },

      // searchItemNameOptions: [
      //   {
      //     key: "log",
      //     value: "菜单名称",
      //     type: "input",
      //     notNeedSearchType: true
      //   }
      // ]
      sortMenudalog:false,
      confirmdsortMeun:null,
      sortMenuData:[],
      sortMenuprops:{
        label:"label",
        children:"children"
      },

      //菜单输入
      menusseachvalue:'',
      menusseachkey:null,
    };
  },
  methods: {
    //排序
    sortMenu(){
      this.sortMenuData =  JSON.parse(JSON.stringify(this.platformObj.ALCAP.menuPageData))
      this.confirmdsortMeun = ()=>{
        //更改排序后parentId
        let arr = this.resetparentId(this.sortMenuData);
        //将新旧菜单数组扁平
        let sortMenuDataMap = this.mapArr(arr);
        let menuPageData =  this.mapArr(this.platformObj.ALCAP.menuPageData);
        //对比新旧菜单
        let filterdiff =  sortMenuDataMap.filter((v) =>{
          return  menuPageData.filter(val => val.id == v.id && (v.parentId != val.parentId || v.order != val.order)).length >0;
        });
        let params = filterdiff.map((v)=>{
          return  {
            codelessType: v.codelessType,
            icon: v.icon,
            id: v.id,
            name: v.name,
            order: v.order,
            pageContent:v.pageContent,
            pageType: v.pageType,
            parentId: v.parentId,
            path: v.path,
            status: v.status,
            title: v.title,
            type: v.type,
            url: v.url,
            }
        });
        this.sortMenudalog = false;
        if(params.length > 0){
          editMenus(params).then((res)=>{
            this.getMenus()
          })
        }
        this.sortMenudalog = false;
        
      }
      this.sortMenudalog = true;
    },
    mapArr(arr){
      let maparr =[];
      let flatarr = (a) =>{
        a.forEach((v)=>{
          let children =  v.children || null;
          delete v.children;
          maparr.push(v);
          if(!!children){
            flatarr(children);
          }
        })
      }
     flatarr(JSON.parse(JSON.stringify(arr)));
     return maparr;
    },
    resetparentId(arr){
      let copyarr = JSON.parse(JSON.stringify(arr));
      let mapcopyarr = (arr,parentId) =>{
        arr.forEach((v,i) =>{
          v.parentId = parentId;
          v.order = i;
          if(!!v.children){
            mapcopyarr(v.children,v.id);
          }
        })
      }
      mapcopyarr(copyarr,'');
      return  copyarr;
    },
    // closeMenuDialog() {
    //   this.menuDialogVisible = false;
    // },
    // menuSubmit() {
    //   this.$refs.menuForm.submitSave();
    // },
    // toggleLoading() {
    //   this.submitLoading = !this.submitLoading;
    //   if (!this.submitLoading) {
    //     this.closeMenuDialog();
    //   }
    // },
    closePopover(){

        window.msgHub.$emit('menu-hide-popover')
    },
    showColumnGroup() {
      this.isShowColumnGroup = !this.isShowColumnGroup;
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
    randCode(size=5){
      let str ="";
      for(let i=0;i<size;i++){
        str += String.fromCharCode(Math.floor(Math.random()*26)+"a".charCodeAt(0))
      }
      return str.toLocaleUpperCase()
    },
    addMenu(type, row) {
      let ctx = this;
      ctx.type = type;
      let title = "";
      let parentId = "";
      if (type === "edit") {
        title = "修改菜单项";
        let rowInfo = JSON.parse(JSON.stringify(row));
        ctx.rowInfo = rowInfo;
        
      } else {
        if (row) {
          title = "新增子菜单";
          let rowInfo = JSON.parse(JSON.stringify(row));
          ctx.rowInfo = rowInfo;
          parentId = ctx.rowInfo.id;
           ctx.rowInfo = {
            pageType:"release",
            name:ctx.randCode(),
            order:1,
            title:'',
            codelessType:'runtimeMenu',
            path:'',
            icon:'',
            type:window.platform
          }
        } else {
          title = "新增一级菜单";
          ctx.rowInfo = {
            pageType:"release",
            order:1,
            name:ctx.randCode(),
            title:'',
            codelessType:'runtimeMenu',
            path:'',
            icon:'',
            type:window.platform
          }
        }
      }
      ctx.openCustomDialog({
        title,
        path:"menuOperation",
        component:menuForm,
        width:"700px",
        loading:ctx.dialogLoading,
        propsData:{
          currentMenuData:ctx.rowInfo,
          type,
          parentId,
       
        },
        beforeConfirm:async($_dontCare,$el)=>{
            ctx.dialogLoading = true;
            let result =await $el.submit();
            ctx.dialogLoading = false;
            
            return result
        },
        cancelCallback(){
          ctx.closePopover();
        },
        confirmCallback(){
          // ctx.menuDataObj[ctx.activeName] = null
          //  console.log(5)
          // ctx.currentPage = 1;
          // console.log(ctx.$refs);
          // ctx.$refs['pagination'][0].resetCurrentPage();

          ctx.getMenus()
        }
      })
      // this.menuDialogVisible = true;
    },
    deleteMenu(selectedArray) {
      let self = this;
      self.openCustomDialog({
        title:`提示`,
        path:'deleteConfirm',
        width:"300px",
        component:{
          template:`<div>确认删除所选菜单吗?</div>`,
        },
        confirmCallback(){
         let ids = selectedArray.map((item) => {
            return item.id;
          });
          deleteMenus(ids).then((res) => {
            if (res.success) {
              self.$notify({
                title: "删除菜单成功",
                type: "success",
              });
              self.getMenus();
            } else {
              self.$notify({
                title: res.msg || "删除菜单失败",
                type: "error",
              });
            }
          })
        }
      })
    },
    setChildren(children, type) {
      // 编辑多个子层级
      children.map((j) => {
        this.toggleSelection(j, type);
        if (j.children) {
          this.setChildren(j.children, type);
        }
      });
    },
    // 选中父节点时，子节点一起选中取消
    select(selection, row) {
      if (
        selection.some((el) => {
          return row.id === el.id;
        })
      ) {
        if (row.children) {
          // 解决子组件没有被勾选到
          this.setChildren(row.children, true);
        }
      } else {
        if (row.children) {
          this.setChildren(row.children, false);
        }
      }
    },
    toggleSelection(row, select) {
      if (row) {
        let index = Object.keys(this.platformObj).indexOf(this.activeName);
        this.$nextTick(() => {
          this.$refs.menuTable[index] &&
            this.$refs.menuTable[index].toggleRowSelection(row, select);
        });
      }
    },
    // 选择全部
    selectAll(selection, item) {
      let self = this;
      // tabledata第一层只要有在selection里面就是全选
      let isSelect = selection.some((el) => {
      let tableDataIds = item.menuPageData.map((j) => j.id);
        return tableDataIds.includes(el.id);
      });
      // tableDate第一层只要有不在selection里面就是全不选
      let isCancel = !item.menuPageData.every((el) => {
        let selectIds = selection.map((j) => j.id);
        return selectIds.includes(el.id);
      });
      if (isSelect) {
        selection.map((el) => {
          if (el.children) {
            // 解决子组件没有被勾选到
            self.setChildren(el.children, true);
          }
        });
      }
      if (isCancel) {
        item.menuPageData.map((el) => {
          if (el.children) {
            // 解决子组件没有被勾选到
            self.setChildren(el.children, false);
          }
        });
      }
    },
    handleSelectionChange(selectedMenus, key) {
      this.$set(this.platformObj[key], "selectedMenus", selectedMenus);
    },
    //分页栏改变事件
    // handleSizeChange(val) {
    //   this.pageSize = val > 0 ? val : 0;
    //   this.handleCurrentChange(1);
    //    this.$set(this.platformObj[this.activeName], "pageSize", this.pageSize);
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val > 0 ? val : 0;
    //   this.currentChangePage(this.menuData);
    // },
    // currentChangePage(list) {
    //   let from = (this.currentPage - 1) * this.pageSize;
    //   let to = this.currentPage * this.pageSize;
    //   this.menuPageData = [];
    //   for (; from < to; from++) {
    //     if (list[from]) {
    //       this.menuPageData.push(list[from]);
    //     }
    //   }
    //   this.$set(this.platformObj[this.activeName],"menuPageData",this.menuPageData)
    // },
    searchMenus(value){
      clearTimeout(this.menusseachkey);
      setTimeout(()=>{
        this.platformObj[this.activeName].keyword = this.menusseachvalue;
        this.getMenus();
      },200)
              // this.platformObj[this.activeName].keyword = key.searchValue || "";
              // this.getMenus();
      // if (searchList && searchList.length) {
      //   for (let i = 0; i < searchList.length; i++) {
      //     const key = searchList[i];
      //     switch (key.searchKey) {
      //       case "log":
      //         this.platformObj[this.activeName].keyword = key.searchValue || "";
      //         this.getMenus();
      //         break;

      //       default:
      //         break;
      //     }
      //   }
      // }
      // else{
      //   this.platformObj[this.activeName].keyword = "";
      //   this.getMenus();
      // }
    },
    async getMenus() {
      let params = {};
      if (this.platformTypeList.length > 0) {
        params.type = this.platformTypeList.join(",");
      }
      let self = this;
      this.pageListLoading = true;
      let res = await requestMenus(params);
      if (res.success) {
        let keyword = self.platformObj[self.activeName].keyword;
        //过滤应用页面
        let content = res.content.filter(item=>{
          return item.codelessType==="runtimeMenu"||item.codelessType==="devMenu"
        })
        // let content  = res.content;
        let menuData = [];
        if(keyword !== ""){
          for( let item of content){
            if(item.type === self.activeName){
              if(item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
                menuData.push(item);
              }
            }
            else{
              menuData.push(item);
            }
          }
        }else{
          menuData = content;
          
        }
        console.log('this.platformObj', content);

       
        // self.originData = menuData;
        // self.menuData = self.getParentData(menuData);
        console.log('keyword', keyword);
        let menuDataObj = self.getParentData(menuData, keyword);
        console.log('menuDataObj', menuDataObj);
        for (let key in menuDataObj) {
          let obj = {
            code: key,
            name: self.typeToLabel[key],
            menuData: menuDataObj[key],
            // total: menuDataObj[key].length,
            // pageSize: self.pageSize,
            // currentPage: self.currentPage,
            selectedMenus: [],
            keyword: self.platformObj[key].keyword
          };
          self.total = menuDataObj[key].length;
          // self.currentPage = 1;
          // console.log(self.currentPage,self.pageSize)
          // if (self.total > self.pageSize) {
          //   obj.menuPageData = [];
          //   obj.menuPageData=[].concat(obj.menuData.slice((self.currentPage-1)*self.pageSize,self.pageSize*self.currentPage))
          //   // for (let index = 0;; index++) {
          //   //   if((self.currentPage*self.pageSize) < index)&& (index< self.pageSize*(self.currentPage+1)){

          //   //   }
          //   //   obj.menuPageData.push(obj.menuData[index]);
          //   // }
          // } else {
            obj.menuPageData = obj.menuData;
          // }
          
          self.$set(self.platformObj, key, obj);
          self.menuData = obj.menuData;
        }
        if(!menuDataObj[self.activeName]){
          // console.log(111)
          self.$set(self.platformObj, self.activeName, {
            code: self.activeName,
            name: self.typeToLabel[self.activeName],
            menuPageData: [],
            menuData: [],
            // total: 0,
            // currentPage: self.currentPage,
            // pageSize: self.pageSize,
            selectedMenus: [],
            keyword: ""
          });
        }
        //给菜单做排序
        let sortmeuns = (arr) =>{
          arr.sort((v1,v2)=>v1.order - v2.order);
          arr.forEach(v => {
            if(!!v.children && v.children.length >0){
              sortmeuns(v.children);
            }
          })
        }
        sortmeuns(this.platformObj.ALCAP.menuData);
        sortmeuns(this.platformObj.ALCAP.menuPageData);
        // this.$forceUpdate();
      } else {
        self.$notify({
          title: res.msg || "接口异常",
          type: "error",
        });
      }
      self.pageListLoading = false;
    },
    getParentData(data, keyword) {
      let self = this;
      let cloneData = JSON.parse(JSON.stringify(data));
      let parentData = {};
      for (let parent of cloneData) {
        if(keyword !== "" && parent.type === self.activeName){
          if (!parentData[parent.type]) {
            parentData[parent.type] = [];
          }
          parentData[parent.type].push(parent);
        }
        else{
            if (parent.parentId === null || parent.parentId === "") {
            parent.label = parent.title;
            parent.value = parent.id;
            let childrenCopy = this.getChildren(parent.id, cloneData);
            if (childrenCopy.length > 0) {
              parent.children = childrenCopy;
            }
            if (!parentData[parent.type]) {
              parentData[parent.type] = [];
            }
            parentData[parent.type].push(parent);
          }
        }
        
      }
      return parentData;
    },
    getChildren(parentId, data) {
      let children = [];
      for (let child of data) {
        if (child.parentId === parentId) {
          child.label = child.title;
          child.value = child.id;
          children.push(child);
        }
      }
      for (let child of children) {
        let childrenCopy = this.getChildren(child.id, data);
        if (childrenCopy.length > 0) {
          child.children = childrenCopy;
        }
      }
      return children;
    }
  },
  beforeMount() {
    let self = this;
    this.getMenus();
    this.platformTypeList.forEach(item => {
      self.$set(self.platformObj, item, {
        code: item,
        name: self.typeToLabel[item],
        menuPageData: [],
        menuData: [],
        total: 0,
        currentPage: self.currentPage,
        pageSize: self.pageSize,
        selectedMenus: [],
        keyword: ""
      });
    });
    this.activeName = this.platformObj[Object.keys(this.platformObj)[0]].code;
  },
};
</script>

<style lang="scss" scoped>
.menu-management-ctn {
  background: #fff;
  padding: 0 16px 16px;
  border-radius: 6px;
  height:100%;
  // height: calc(100vh - 164px) !important;
  // width: calc(100% - 48px);
  // margin-bottom: 16px;
}

.common-table-top-btn-ctn{
  width: 100%;
  height:60px;
  padding:0px  0px 0px 20px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;

  > div {
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    align-items:center;

    .sort-menu-btn {
      font-size: 14px;
      font-weight: 400;
      color: #374E71;
      border: 1px solid #A9BDC7;
    }

    .delete-menu-btn {
      font-size: 14px;
      font-weight: 400;
      color: #374E71;
      border: 1px solid #A9BDC7;
      margin-right: 12px;
    }
  }
  .pageTiltle {
    font-size: 16px;
    font-weight: bold;
    color: var(--codeless-font-color-primary);
  }
}
.common-value-table{
  ::v-deep .el-button--text{
    color:#4769B3;
  }
}

.common-column-tool-icon{
  display: inline-block;
  margin-left: 4px;
  margin-top: -2px;
  height: 14px;
  width: 14px;
}


.common-table-ctn {
  position: relative;
  // padding: 12px 16px;
  // margin-left: 14px;
  background: #fff;
  border-radius: 6px;
  height:calc(100% - 60px);
  box-sizing: border-box;
  border-top: 1px solid #e7ecef;

  .meuns-cnname-icon {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:flex-start;

    svg{
      width:12px;
      height:12px;
    }
    span {
      margin-left:8px;
    }
  } 
}
.footer-pagination {
  margin-top: 15px;
  padding: 0 10px;
}
.el-footer
  ::v-deep.custom-pagination-wrap
  .custom-pager-right-ctn
  .custom-pager-ctn
  .custom-next-btn {
  vertical-align: initial;
}
.el-footer
  ::v-deep.custom-pagination-wrap
  .custom-pager-right-ctn
  .custom-pager-ctn
  .custom-prev-btn {
  vertical-align: initial;
}
.el-tabs {
  ::v-deep .el-tabs__item {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    margin-bottom: 8px;
    color: #303133 !important;
  }
  ::v-deep .el-tabs__item.is-active {
    font-weight: bold;
    color: #303133 !important;
  }
  ::v-deep .el-tabs__item:hover {
    font-weight: bold;
    color: #303133 !important;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent !important;
  }
}
$i: 7;
.el-table {
  // max-height: calc(100% - 36px);
  ::v-deep .has-gutter tr th {
    border-bottom: none;
  }
  ::v-deep .el-table__row--level-0 td {
    border-top: 1px solid #e7ecef;
  }
  @while $i >= 0 {
    ::v-deep .el-table__row--level-#{$i} td {
      border-bottom: none;
    }
    $i: $i - 1;
  }
}

.sortMenuclass {
  width: 100%;
  height: 529px;
  overflow-x:hidden;
  overflow-y:auto;
}

.meuns-custom-tree-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  svg {
    width:12px;
    height:12px;
  }
  span{
    margin-left:8px;
    font-size: 14px;
    font-weight: 400;
    color: var(--codeless-font-color-primary);
  }
}
</style>
<style lang="scss">
.menu-left-aside-add-preject-dialog {
    border-radius: 8px;
    margin-top:calc(50vh - 333px) !important;

  > .el-dialog__header {
    display: none !important;
  }

  > .el-dialog__body {
    padding: 0px !important;

    .codeless-custom-dialog-body-ctn {
      padding: 0px;
      
    }
  }
  .adduser-content {
    width: 100%;
    height: 313px !important;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin-top: 16px;

      > .title {
        font-size: 14px;
        font-weight: 400;
        color: var(--codeless-font-color-primary);
        margin-left: 30px;
        display: flex;
        width: 60px;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        > span {
          color: #f65656;
        }
      }

      .adduser-content-msg {
        width: 370px;
        margin-left: 16px;
      }

      .adduser-content-msg:first-child {
        margin-top: 0px;
      }
    }

    > div:first-child {
      margin-top: 0px;
    }
  }
}

//el-table 样式修改
.meuns-table-header-cell-class-name {
  >div{
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray);
  }
}
.meuns-table-cell-class-name {
  >div{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    font-weight: 400;
    color: var(--codeless-font-color-primary);
    
    >.el-table__expand-icon{
      cursor: pointer;
    }
  }
}
.meun-right-content-box-input-keyword{
  > .el-input__inner {
      border: 1px solid #A9BDC7;
      height:30px;
      border-radius: 222px;
  }
  // >.el-input__prefix {
  //   .el-icon-search{
  //     margin-top:2px;
  //   }
  // }
}
.menu-left-aside-add-preject-dialog {
  margin-top:calc(50vh - 333px) !important;
}

.sortMenuclass {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;

  .el-tree {
    width: 359px;
    flex-shrink: 0;
    margin-top:16px;
    margin-bottom: 16px;
  }
  .el-tree-node__content {
    height:32px;
    &:hover{
      background: #E3F2FC !important;
    }
  }
}
</style>
