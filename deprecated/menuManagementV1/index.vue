<template>
  <div>
    <!-- <el-tabs v-model="activeName" @tab-click="getMenus">
      <el-tab-pane
        v-for="(item, key) in platformObj"
        :key="key"
        :label="item.name"
        :name="item.code"
      > -->
        <div class="menu-management-ctn"  v-for="(item, key) in platformObj"  :key="key">
          <div class="common-table-top-btn-ctn">
            <el-button type="primary" round @click="addMenu('add')" size='mini'
              >新增一级菜单</el-button
            >
            <el-button
              plain
              round
              size='mini'
              @click="deleteMenu(item.selectedMenus)"
              :disabled="item.selectedMenus.length === 0"
              >删除</el-button
            >
            <search
              ref="search"
              class="common-search-input-ctn"
              @update-search="searchMenus"
              style="width: 400px; float: right;"
            ></search>
          </div>
          <div class="common-table-ctn">
            <el-table
              height="calc(100% - 36px)"
              class="common-value-table"
              size='medium'
              :data="item.menuPageData"
              ref="menuTable"
              style="width: 100%"
              v-loading="pageListLoading"
              highlight-current-row
              row-key="id"
              :tree-props="{ children: 'children' }"
              default-expand-all
              @select="select"
              @select-all="selectAll($event, item)"
              @selection-change="handleSelectionChange($event, key)"
            >
              <el-table-column type="selection" width="45" align="center">
              </el-table-column>
              <el-table-column
                prop="title"
                min-width="30%"
                label="中文名"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('title') !== -1"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                min-width="10%"
                label="英文名"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('name') !== -1"
              >
              </el-table-column>
              <el-table-column
                prop="order"
                label="序号"
                min-width="10%"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('order') !== -1"
              ></el-table-column>
              <el-table-column
                prop="icon"
                label="图标编码"
                min-width="20%"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('icon') !== -1"
              >
              </el-table-column>
              <el-table-column
                prop="path"
                min-width="20%"
                label="页面路径"
                sortable
                show-overflow-tooltip
                v-if="checkdColumn.indexOf('path') !== -1"
              >
              </el-table-column>
              <el-table-column label="操作" min-width="10%">
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
                      <svg
                        class="common-column-tool-icon"
                        :class="{ 'actived-icon': isShowColumnGroup }"
                        aria-hidden="true"
                      >
                        <use xlink:href="#icon-biaogeliepeizhi" />
                      </svg>
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
            <el-footer class="footer-pagination" style="height: 36px">
              <pagination
                :total="item.total"
                :currentPage="item.currentPage"
                :pageSizes="[10, 20, 50, 100]"
                :pageSize="item.pageSize"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                v-loading="pageListLoading"
              ></pagination>
            </el-footer>
          </div>
        </div>
      <!-- </el-tab-pane>
    </el-tabs> -->
    <el-dialog
      width="1000px"
      :show-close ='false'
      :visible="true"
      @close="closeMenuDialog"
      :append-to-body="true"
      v-if="menuDialogVisible"
      custom-class="no-header-and-footer-dialog"
    >
    <codeless-dialog-ctn  
      :title="menuDialogTitle"
      @close='closeMenuDialog'
      @cancel="closeMenuDialog"
      :loading="submitLoading" 
      @confirm='menuSubmit'>
      <template v-slot:dialogContent>
          <menuForm
          ref="menuForm"
          :parentOptions="parentOptions"
          :rowInfo="rowInfo"
          :type="type"
          @getMenus="getMenus"
          @toggleLoading="toggleLoading"
          :menuExtraSetting="menuExtraSetting"
          :platformTypeList="platformTypeList"
          :platformType="activeName"
        ></menuForm>
      </template>
      
    </codeless-dialog-ctn>
      
      <!-- <div slot="footer" class="dialog-footer"> -->
        <!-- <el-button class="common-cancel-btn" @click.native="closeMenuDialog"
          >取消</el-button
        >
        <el-button
          class="common-confirm-btn"
          type="primary"
          @click.native="menuSubmit"
          :loading="submitLoading"
          >确定</el-button
        > -->
      <!-- </div> -->
    </el-dialog>
  </div>
</template>
<script>

import menuForm from "./components/menuDialog.vue";
const {
  requestMenus,
  deleteMenus
} = window.getAacApi()
export default {
  name: "menuManagement",
  mixins: [ window.V8.mixins ],
  components: {
    menuForm
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
    // menuExtraSetting: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    //   validator: function(menuExtraSetting){
    //     let isTrue = true;
    //       let array = ["url", "codelessType", "pageContent", "pageType"]
    //       for(let item  of menuExtraSetting){
    //         if(array.findIndex(type => type === item) === -1){
    //           isTrue = false;
    //           break;
    //         }
    //       }
    //       return isTrue;
    //   }
    // },
  },
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
      menuDialogTitle: "",
      menuDialogVisible: false,
      type: "",
      submitLoading: false,
      menuPageData: [],
      checkdColumn: ["title", "name", "path", "order", "icon"],
      tableColumn: {
        title: "名称",
        name: "编码",
        path: "路径",
        order: "序号",
        icon: "图标编码",
      },
      selectedMenus: [],
      isShowColumnGroup: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageListLoading: false,
      typeToLabel: {
        [window.platform]:'低代码平台'
      }
      // searchItemNameOptions: [
      //   {
      //     key: "log",
      //     value: "菜单名称",
      //     type: "input",
      //     notNeedSearchType: true
      //   }
      // ]
    };
  },
  methods: {
    closeMenuDialog() {
      this.menuDialogVisible = false;
    },
    menuSubmit() {
      this.$refs.menuForm.submitSave();
    },
    toggleLoading() {
      this.submitLoading = !this.submitLoading;
      if (!this.submitLoading) {
        this.closeMenuDialog();
      }
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
    addMenu(type, row) {
      this.type = type;
      if (type === "edit") {
        this.menuDialogTitle = "修改菜单项";
        let rowInfo = JSON.parse(JSON.stringify(row));
        this.rowInfo = rowInfo;
      } else {
        if (row) {
          this.menuDialogTitle = "新增子菜单";
          let rowInfo = JSON.parse(JSON.stringify(row));
          this.rowInfo = rowInfo;
        } else {
          this.menuDialogTitle = "新增一级菜单";
        }
      }
      this.menuDialogVisible = true;
    },
    deleteMenu(selectedArray) {
      let self = this;
      this.$confirm("确认删除所选菜单吗？", "提示", {
        type: "warning",
      }).then(async () => {
        let ids = selectedArray.map((item) => {
          return item.id;
        });
        // let param = {
        //   ids: ids,
        // };
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
        });
      });
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
    handleSizeChange(val) {
      this.pageSize = val > 0 ? val : 0;
      this.handleCurrentChange(1);
       this.$set(this.platformObj[this.activeName], "pageSize", this.pageSize);
    },
    handleCurrentChange(val) {
      this.currentPage = val > 0 ? val : 0;
      this.currentChangePage(this.menuData);
    },
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.menuPageData = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.menuPageData.push(list[from]);
        }
      }
      this.$set(this.platformObj[this.activeName],"menuPageData",this.menuPageData)
    },
    searchMenus(searchList){
      if (searchList && searchList.length) {
        for (let i = 0; i < searchList.length; i++) {
          const key = searchList[i];
          switch (key.searchKey) {
            case "log":
              this.platformObj[this.activeName].keyword = key.searchValue || "";
              this.getMenus();
              break;

            default:
              break;
          }
        }
      }
      else{
        this.platformObj[this.activeName].keyword = "";
        this.getMenus();
      }
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
          return !item.codelessType
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
        }
        else{
          menuData = content;
        }
        // self.originData = menuData;
        // self.menuData = self.getParentData(menuData);
        let menuDataObj = self.getParentData(menuData, keyword);
        for (let key in menuDataObj) {
          let obj = {
            code: key,
            name: self.typeToLabel[key],
            menuData: menuDataObj[key],
            total: menuDataObj[key].length,
            pageSize: self.pageSize,
            currentPage: self.currentPage,
            selectedMenus: [],
            keyword: self.platformObj[key].keyword
          };
          if (obj.total > obj.pageSize) {
            obj.menuPageData = [];
            for (let index = 0; index < obj.pageSize; index++) {
              obj.menuPageData.push(obj.menuData[index]);
            }
          } else {
            obj.menuPageData = obj.menuData;
          }
          self.$set(self.platformObj, key, obj);
           self.menuData = obj.menuData;
        }
        if(!menuDataObj[self.activeName]){
          self.$set(self.platformObj, self.activeName, {
            code: self.activeName,
            name: self.typeToLabel[self.activeName],
            menuPageData: [],
            menuData: [],
            total: 0,
            currentPage: self.currentPage,
            pageSize: self.pageSize,
            selectedMenus: [],
            keyword: ""
          });
        }
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
    // let options = JSON.parse(
    //   window.localStorage.getItem("authEnums")
    // ).PlatformType;
    // options.forEach((item) => {
    //   self.typeToLabel[item.code] = item.name;
    // });
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
  height:60px;
  padding-top:20px;
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
</style>
