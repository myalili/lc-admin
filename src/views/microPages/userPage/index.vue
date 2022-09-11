<template>
  <el-container direction="vertical" class="user-manage-ctn w-full h-full" v-loading="loading">
    <div class="aweb-table-toolbar">
      <el-button
        class="add-user-button"
        type="primary"
        v-on:click="clickAddUser"
        icon="el-icon-plus"
        size="mini"
        :disabled="noAdmin"
        round
        >用户</el-button
      >
      <el-button
        class="delete-user-button"
        @click="batchRemove"
        size="mini"
        round
        :disabled="noAdmin || userSelectorsChangedata.length == 0 "
        plain
        >移除</el-button
      >
      <el-form>
        <el-form-item class="search-input-circle">
          <el-input
            class="search-input-value"
            v-model="filtersvalue"
            @input="filterfun"
            prefix-icon="icon iconfont icon-sousuo1"
            placeholder="输入关键字"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-main-ctn">
      <!--用户列表-->
      <el-table
        class="user-table"
        ref="multipleTable"
        :data="tabledata"
        @selection-change="userSelectorsChange"
        style="width: 100%"
        height="100%"
        header-cell-class-name="userPage-user-table-header-cell-class-name"
        cell-class-name="userPage-user-table-cell-class-name"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <template v-for="item in tableColumn">
          <el-table-column
            :label="item.columnDesc"
            :prop="item.columnName"
            :key="item.columnName"
            :min-width="item.minColumnWidth"
            :width="item.columnWidth"
          >
          </el-table-column>
        </template>

        <el-table-column label="操作" width="190" align="center">
          <template slot-scope="scope">
              <div class="userpage-user-opreation">
                <span @click="clickRelateRoles(scope.row)">关联角色</span>
                &emsp;
                <span @click="clickEditUser(scope.row)">编辑</span
                >
                &emsp;
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  popper-class="userpage-user-opreation-elpopover"
                >
                  <div class="user-opreation-icon-choose">
                    <div @click="enableUser(scope.row)">
                      <span>{{scope.row.status === "2" ? "解锁" : "锁定" }}</span>
                    </div>
                    <div @click="clickResetPassword(scope.row)">
                      <span>重置密码</span>
                    </div>
                  </div>
                  <span slot="reference" class="user-opreation-icon"
                    ><i class="el-icon-more"></i
                  ></span>
                </el-popover>
              </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页器-->
    <pagination
      v-if="reloadpagination"
      class="userPage-pagination"
      @current-change="handleCurrentChange"
      :total="total"
      :currentPage="page"
      :pageSizes="[10, 20, 30, 40, 50, 100]"
      :pageSize="size"
      @size-change="handleSizeChange"
    >
    </pagination>
  </el-container>
</template>

<script>
const {
  requestUser,
  addUser,
  deleteUser,
  getAllUser,
  addTenantUser,
  deleteTenantUser,
  getUserReRole,
  userReRole,
  getRoleList,
  resetPassword,
  updateUser,
  enableUser,
  getDepartmentUser,
  modifyDepartmentUser
} = window.getAacApi();
import increaseUser from "./components/addUser.vue";
import relativeUser from "./components/relativeUser.vue";
export default {
  name: "user",
  filters: {
    formatDate: window.pipe.vfilter.formatDate,
  },
  mixins: [window.V8.mixins, window.codelessMixins.customDialog],
  props: {
  },
  data() {
    return {
      // 搜索名
      filtersvalue:'',
      filterskey:null,
      // loading加载
      loading:true,
      //选中的表格数据
      userSelectorsChangedata:[],
      // 所有表格书数据
      alltable:[],
      filtertable:[],
      tabledata:[],
      total:10,
      page:1,
      size:10,
      reloadpagination:true,
      // 表头数据
      tableColumn: [
        {
          columnName: "name",
          columnDesc: "用户名",
          columnWidth: "",
          minColumnWidth: "",
        },
        {
          columnName: "nickname",
          columnDesc: "昵称",
          columnWidth: "",
          minColumnWidth: "",
        },

        {
          columnName: "email",
          columnDesc: "邮箱",
          columnWidth: "",
          minColumnWidth: "",
        },
        {
          columnName: "phone",
          columnDesc: "手机号",
          columnWidth: "",
          minColumnWidth: "",
        },
        {
          columnName: "desc",
          columnDesc: "描述",
          columnWidth: "",
          minColumnWidth: "",
        },
      ],
      // 全量角色列表
      roleOptions:[],
    };
  },
  computed: {
    //是否超级管理
    superAdmin() {
       return this.$store.state.user.currentData.superAdmin;
    },
    // 是否为项目管理员(不属于任何部门的租户用户)
    projectAdmin(){
      return this.$store.state.user.currentData.department.length == 0;
    },
    //部门
    curDepartmentid(){
      return this.$store.state.user.curDepartment.id || null
    }
  },
methods:{
    // 获取用户
    getuserList(){
      let api = getAllUser;
      if(!!this.superAdmin){
        api = getAllUser;
      }else if(!!this.projectAdmin) {
        api = requestUser;
      }else{
        getDepartmentUser({
          id:this.curDepartmentid,
          data:{
            id:this.curDepartmentid,
            keyword: '',
            pageNum:1,
            pageSize:10000
          }
        }).then((res)=>{
          if(!!res.success){
              this.alltable = JSON.parse(JSON.stringify(res.content));
              this.filtertable = JSON.parse(JSON.stringify(this.alltable));
              this.total = this.filtertable.length;
              this.page =  1;
              this.size = 10;
              this.tabledata =  this.filtertable.slice((this.page - 1)*this.size,this.page*this.size);
              this.loading =  false;
              this.$nextTick(()=>{
                this.loading =  false;
                this.reloadpagination =  true;
              });
          }else{
            this.$message.error(res.msg);
            this.loading =  false;
          }
      })
      return;
    }
      this.reloadpagination =  false;
      this.filtersvalue  = '';
      api({
          params: {
            start: 0,
            size: 100000,
          },
        }).then((res)=>{
          if(!!res.success){
              this.alltable = JSON.parse(JSON.stringify(res.content));
              this.filtertable = JSON.parse(JSON.stringify(this.alltable));
              this.total = this.filtertable.length;
              this.page =  1;
              this.size = 10;
              this.tabledata =  this.filtertable.slice((this.page - 1)*this.size,this.page*this.size);
              this.loading =  false;
              this.$nextTick(()=>{
                this.loading =  false;
                this.reloadpagination =  true;
              });
          }else{
            this.$message.error(res.msg);
            this.loading =  false;
          }
      })
    },
    //添加用户
    clickAddUser(){
      let obj = {
        email: "test@agree.com.cn",
        name: "",
        nickname: "",
        desc: "",
        phone: "",
      };
      this.openCustomDialog({
        title: "新增用户",
        path: "addUser",
        width: "500px",
        component: increaseUser,
        propsData: {
          user: obj,
        },
        confirmCallback: async ($_dontCare, $el) => {
          let valid = await $el.$refs.user.validate();
          if (!valid) return;
          let obj = JSON.parse(JSON.stringify($el.user));
          this.loading =  true;
          if(!!this.superAdmin){
            addUser(obj)
              .then((res) => {
                console.log('res',res);
                if (res.success === true) {
                  this.$message.success("新增用户成功,默认密码12345678");
                  this.getuserList();
                } else {
                  this.$message.error(res.msg);
                  this.loading =  false;
                }
              }).catch(err=> {
                this.$message.error(err.msg);
                this.loading = false;
              })
          }else if(!!this.projectAdmin){
            addTenantUser(this.$store.getters["user/tenantId"], obj)
              .then((res) => {
                if (res.id) {
                  this.$message.success("新增用户成功,默认密码12345678");
                  this.getuserList();
                } else {
                  this.$message.error(res.msg);
                  this.loading =  false;
                }
              }).catch(err=> {
                this.$message.error(err);
                this.loading = false;
              })
          }else {
            obj.department= [this.curDepartmentid],
            addTenantUser(this.$store.getters["user/tenantId"], obj)
            .then((res) => {
             
                this.$message.success("新增用户成功,默认密码12345678");
                this.getuserList();
             
            }).catch(err=> {
                this.$message.error('新增用户失败');
                this.loading =  false;
                console.log(err)
              })
          }
        },
      });
    },
    //移除用户
    batchRemove(){
      this.openCustomDialog({
        title: `提示`,
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确认删除选中记录吗?</div>`,
        },
        confirmCallback:()=>{
          console.log(this.userSelectorsChangedata);
          let ids = this.userSelectorsChangedata.map((item) => item.id);
          this.loading = true;
          let api = deleteTenantUser;
          if (!!this.superAdmin) {
            api = deleteUser;
          }else if(!!this.projectAdmin){
            api = deleteTenantUser;
          }else{
          let allarr = this.alltable.map(v => v.id);
          let setarr = allarr.filter(v => !ids.includes(v));
            modifyDepartmentUser({
            id:this.curDepartmentid,
            data:setarr
          }).then(()=>{
              this.getuserList();
              this.$message.success('移除成功');
          }).catch((error) => {
              this.$notify.error(error);
             this.loading = false;
          }) 
            return;
          }
          api({
            ids,
            id: this.$store.getters["user/tenantId"],
          }).then((res) => {
            if (!!res.success) {
              this.$message.success("批量删除用户成功");
              this.getuserList();
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          });
        },
      });
    },
    //检索用户
    filterfun(value){
      clearTimeout(this.filterskey);
      this.filterskey = setTimeout(()=>{
        if(!!value){
          this.filtertable = JSON.parse(JSON.stringify(this.alltable.filter((v) =>{
            if(!!v.name && !!v.nickname){
              return  v.name.includes(value) || v.nickname.includes(value)
            }else{
              return false;
            }

          })));
        }else{
          this.filtertable = JSON.parse(JSON.stringify(this.alltable));
        }
        this.total = this.filtertable.length;
        this.page =  1;
        this.size = 10;
        this.tabledata =  this.filtertable.slice((this.page - 1)*this.size,this.page*this.size);
      },200)
    },
    //表格选中
    userSelectorsChange(data){
      this.userSelectorsChangedata =  data;
    },
    //关联角色
    clickRelateRoles(row){
      let obj = JSON.parse(JSON.stringify(row));
      getUserReRole({ id: obj.id })
        .then((res) => {
          if(!!res.success){
              obj.roleIds = res.content.map((item) => item.id);
              this.openCustomDialog({
              title: "关联角色",
              path: "relativeUser",
              width: "1060px",
              component: relativeUser,
              propsData: {
                roleOptions: this.roleOptions,
                roleIds: obj.roleIds,
              },
              confirmCallback: async ($_dontCare, $el) => {
                let roleIds = $el.roleSelectors.map((item) => item.id);
                let para = {
                  id: obj.id,
                  ids: roleIds,
                };

                userReRole(para)
                  .then((res) => {
                    if (res.success === true) {
                      this.$message.success("关联角色成功");
                    } else {
                      this.$message.error("关联角色失败");
                    }
                  })
                },
            });
          }
        })
    },
    //编辑角色
    clickEditUser(row){
      console.log(row);
      let copy =JSON.parse(JSON.stringify(row));
      copy.disabled =true;
        this.openCustomDialog({
        title: "编辑用户",
        path: "editUser",
        width: "500px",
        component: increaseUser,
        propsData: {
          user: copy,
        },
        confirmCallback: async ($_dontCare, $el) => {
          let para = {
            id:row.id,
            desc:$el.user.desc,
            email:$el.user.email,
            nickname:$el.user.nickname,
            phone:$el.user.phone,
            type:$el.user.type,
          }
          updateUser(para)
            .then((res) => {
              if (!!res.success) {
                this.$message.success("编辑用户成功");
                let tindex = this.alltable.findIndex(v => v.id ==  row.id);
                this.alltable[tindex].desc = para.desc;
                this.alltable[tindex].email = para.email;
                this.alltable[tindex].nickname = para.nickname;
                this.alltable[tindex].phone = para.phone;
                let findex = this.filtertable.findIndex(v => v.id ==  row.id);
                this.filtertable[findex].desc = para.desc;
                this.filtertable[findex].email = para.email;
                this.filtertable[findex].nickname = para.nickname;
                this.filtertable[findex].phone = para.phone;
                let index = this.tabledata.findIndex(v => v.id ==  row.id);
                this.tabledata[index].desc = para.desc;
                this.tabledata[index].email = para.email;
                this.tabledata[index].nickname = para.nickname;
                this.tabledata[index].phone = para.phone;

                
              } else {
                this.$message.error(res.msg);
              }
          })
        },
      });
    },
    //锁定和解锁
    enableUser(row){
      let title = row.status === '2' ? '解锁' : '锁定'
      this.openCustomDialog({
        title: title,
        path: "resetPassword",
        width: "300px",
        component: {
          template: `<div>是否${title}用户？</div>`,
        },
        confirmCallback:()=> {
          enableUser(row.id, row.status === '2')
            .then(() => {
              this.$message.success(title + '成功');
              let obj = JSON.parse(JSON.stringify(row))
              let tindex = this.alltable.findIndex(v => v.id ==  obj.id);
              this.alltable[tindex].status = obj.status == '2' ? '1' : '2';
              console.log(this.alltable[tindex]);

              let findex = this.filtertable.findIndex(v => v.id ==  obj.id);
              this.filtertable[findex].status = obj.status == '2' ? '1' : '2';
              console.log(this.filtertable[findex]);

              let index = this.tabledata.findIndex(v => v.id ==  obj.id);
              this.tabledata[index].status = obj.status == '2' ? '1' : '2';
              console.log(this.tabledata[index]);
            })
            .catch(error => {
              this.$notify({title: error, type: 'error'});
            })
        }
      });
    },
    // 重置密码
    clickResetPassword(row){
        this.openCustomDialog({
        title: `提示`,
        path: "resetPassword",
        width: "300px",
        component: {
          template: `<div>确认重置密码吗?</div>`,
        },
        confirmCallback() {
          resetPassword(row)
          .then((res) => {
            if (!!res.success) {
              this.$message.success("重置用户密码成功");
            }else{
              this.$message.error("重置用户密码失败");
            }
          })
        },
      });
    },
    // 翻页
    handleCurrentChange(page){
      this.page = page;
      this.tabledata =  this.filtertable.slice((this.page - 1)*this.size,this.page*this.size);
    },
    //页数改变
    handleSizeChange(size){
      this.size = size;
      this.page = 1;
      this.tabledata =  this.filtertable.slice((this.page - 1)*this.size,this.page*this.size);
    },
    //获取角色列表
    getRoles: function () {
      getRoleList()
        .then((res) => {
          if (res && (res.pageable || res.totalElements)) {
            this.roleOptions = res.content;
          } else {
            this.roleOptions = res;
          }
          //获取用户数据
          this.$nextTick(()=>{
            this.getuserList();
          })
        })
    },
},
  mounted() {
    //获取用户角色
    this.getRoles();
  },
};
</script>
<style scoped lang="scss">
.user-manage-ctn {
  background-color: var(--color-base) !important;
  display:flex;
  flex-direction: column;
  .el-table__body-wrapper {
    ::v-deep .user-table {
      border-top: 1px solid #ebeef0;

      // max-height: calc(100vh - 244px);
      overflow-y: auto;
    }
  }
  ::v-deep .opr-icon {
    .iconfont {
      font-size: 12px;
      margin-right: 12px;
      color: var(--color-primary-dark-1);
    }
  }

  ::v-deep .custom-pagination-wrap {
    padding: 0 20px;
    position: absolute;
    bottom: 10px;
    right: 20px;
    width: calc(100% - 40px);

    .total-count {
      margin-right: 10px;
      line-height: 24px;
    }
  }

  .aweb-table-toolbar {
    height: 56px;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .add-user-button {
      width: 92px;
      height: 30px;
      font-size: 14px;
      font-weight: 400;
    }

    .delete-user-button {
      width: 76px;
      height: 30px;
      border: 1px solid #A9BDC7;
      font-size: 14px;
      font-weight: 400;
      color: #374E71;
    }

    ::v-deep .el-form-item {
      margin: 0;
      &.search-input-circle {
        // .el-form-item__content {
        //   margin-top: 10px;
        // }
        .search-input-value {
          margin-left:12px;
          .el-input__inner {
            width: 200px;
            height: 30px;
            border: 1px solid #A9BDC7;
          }
          > .el-input__prefix{
            left:10px;
          }
        }
      }
      .el-input__inner {
        border-radius: 100px;
        height: 28px;
        line-height: 28px;
      }
    }
  }

  .user-main-ctn {
    width: calc(100% - 40px);
    height: calc(100% - 128px) !important;
    padding: 0px !important;
    margin-left:20px;
    border-top:1px solid #EBEEF0;
    flex-shrink: 0;
  }
  .userPage-pagination {
    padding:0px !important;
    position:relative;
    right:20px;
    margin-left:40px;
    margin-top:32px;
    
  }
}

#container {
  height: 100%;
  text-align: left;
}

.userpage-user-opreation {
  color: var(--color-primary-dark-1);
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;

  .usersuper {
    color: #bebebe !important;
  }

  .user-opreation-icon {
    > .el-icon-more {
      transform-origin: 50% 50%;
      transform: rotate(90deg);
    }
  }
}
</style>
<style lang="scss">
  // 修改el-table 表头样式
  .userPage-user-table-header-cell-class-name {
    > div {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-gray);
    }
  }
  .userPage-user-table-cell-class-name {
    > div {
      font-size: 14px;
      font-weight: 400;
      color: var(--codeless-font-color-primary);
    }
}
.userpage-user-opreation-elpopover {
  min-width: 84px !important;
  width: 84px !important;
  padding: 0px;

  .user-opreation-icon-choose {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    > div {
      width: 100%;
      height: 30px;
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: var(--color-primary-dark-1);
      font-weight: 400;
      font-size: 14px;
      cursor: pointer;
      padding: 0px 14px 0px 14px;
      white-space: nowrap;

      span {
        letter-spacing: 1px;
      }

      &:hover {
        background: #eff7fb;
      }
    }
  }
}
</style>