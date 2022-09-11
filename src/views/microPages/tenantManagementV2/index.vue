<template>
  <el-container
    direction="vertical"
    class="user-manage-ctn w-full h-full"
    v-loading="Loading"
  >
    <div class="left-content-box">
      <leftaside
        @change="asideChange"
        :projectList="projectList"
        ref="leftaside"
      ></leftaside>
    </div>
    <div class="right-content-box">
      <el-row
        :span="24"
        class="aweb-table-toolbar"
        type="flex"
        justify="space-between"
      >
        <div>
          <span>{{ checkedProject.name }}</span>
        </div>
        <div>
          <el-button
            type="primary"
            class="codeless-font-size-14"
            v-on:click="clickAddUser"
            icon="el-icon-plus"
            size="mini"
            round
            style="width: 92px; height: 30px"
            >用户</el-button
          >
          <el-button
            @click="batchRemove"
            :disabled="selections.length === 0"
            size="mini"
            round
            plain
            style="
              width: 76px;
              height: 30px;
              border: 1px solid #a9bdc7;
              color: #374e71;
            "
            >删除</el-button
          >
          <el-form>
            <el-form-item class="search-input-circle">
              <el-input
                v-model="searchValue"
                prefix-icon="icon iconfont icon-sousuo1"
                clearable
                placeholder="搜索关键字"
                @input="serachkey"
                class="right-content-box-input-keyword"
                style="width: 200px; height: 31px"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
      <el-main class="user-main-ctn">
        <!--用户列表-->
        <el-table
          class="user-table"
          ref="multipleTable"
          :data="tableData"
          @selection-change="userSelectorsChange"
          style="width: 100%"
          height="100%"
          header-cell-class-name="user-table-header-cell-class-name"
          cell-class-name="user-table-cell-class-name"
        >
          <el-table-column
            type="selection"
            width="55"
            align="left"
          ></el-table-column>
          <el-table-column prop="name" label="用户名" align="left">
            <template slot-scope="scope">
              <div class="user-name-box">
                <span>{{ scope.row.name }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="项目管理员"
                  placement="top-start"
                >
                  <svg
                    class="icon svg-icon"
                    v-if="scope.row.id == checkedProject.ownerId"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icon-xiangmuguanliyuan"></use>
                  </svg>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickname"
            label="昵称"
            align="left"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            align="left"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            align="left"
          ></el-table-column>
          <el-table-column
            prop="desc"
            label="描述"
            align="left"
          ></el-table-column>
          <el-table-column label="操作" width="250" align="left">
            <template slot-scope="scope">
              <div class="user-opreation">
                <span @click="edituser(scope.row)">编辑</span>
                &emsp;
                <span
                  :class="{ usersuper: scope.row.id == checkedProject.ownerId }"
                  @click="
                    setusersuper(
                      scope.row,
                      scope.row.id == checkedProject.ownerId
                    )
                  "
                  >设为项目管理员</span
                >
                &emsp;
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  popper-class="user-opreation-elpopover"
                >
                  <div class="user-opreation-icon-choose">
                    <div @click="lockuser(scope.row)">
                      <span>{{
                        scope.row.status === "2" ? "解锁" : "锁定"
                      }}</span>
                    </div>
                    <div @click="resetpassword(scope.row)">
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
      </el-main>
      <!--分页器-->
      <pagination
        v-if="paginationreload"
        class="paginationclass"
        @current-change="handleCurrentChange"
        :total="total"
        :currentPage="page"
        :pageSizes="[10, 20, 30, 40, 50, 100]"
        :pageSize="size"
        @size-change="handleSizeChange"
      >
      </pagination>
    </div>
    <el-dialog
      width="570px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="adduseradialog"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset left-aside-add-preject-dialog"
    >
      <codeless-Dialog-Ctn
        :title="adduseradialogtitle"
        @confirm="confirmadduser"
        @cancel="adduseradialog = false"
        @close="adduseradialog = false"
      >
        <template v-slot:dialogContent>
          <div class="adduser-content">
            <div>
              <div class="title"><span>*</span>用户名</div>
              <el-input
                :disabled="!!adduserObj.id"
                size="small"
                class="adduser-content-msg"
                v-model="adduserObj.name"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>
              <div class="title"><span>*</span>昵称</div>
              <el-input
                size="small"
                class="adduser-content-msg"
                v-model="adduserObj.nickname"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>
              <div class="title"><span>*</span>邮箱</div>
              <el-input
                size="small"
                class="adduser-content-msg"
                v-model="adduserObj.email"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>
              <div class="title"><span>&ensp;</span>手机号</div>
              <el-input
                size="small"
                class="adduser-content-msg"
                v-model="adduserObj.phone"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>
              <div class="title"><span>&ensp;</span>描述</div>
              <el-input
                class="adduser-content-msg"
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="adduserObj.desc"
              ></el-input>
            </div>
            <div>
              <div class="title"><span>&ensp;</span></div>
              <el-checkbox
                class="adduser-content-msg"
                v-model="adduserObj.checked"
                >设为管理员</el-checkbox
              >
            </div>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
    <el-dialog
      width="400px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="deletesuerdialog"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset left-aside-delete-preject-dialog"
    >
      <codeless-Dialog-Ctn
        title="删除用户"
        @confirm="confirmdeleteuser"
        @cancel="deletesuerdialog = false"
        @close="deletesuerdialog = false"
      >
        <template v-slot:dialogContent>
          <div class="deleteproject-content">
            <span>是否删除用户？</span>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
    <el-dialog
      width="400px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="unlockaddailog"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset left-aside-delete-preject-dialog"
    >
      <codeless-Dialog-Ctn
        :title="unlockTitle"
        @confirm="confirmunlock"
        @cancel="unlockaddailog = false"
        @close="unlockaddailog = false"
      >
        <template v-slot:dialogContent>
          <div class="deleteproject-content">
            <span>是否{{ unlockTitle }}用户？</span>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
    <el-dialog
      width="400px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="resetpassworddailg"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset left-aside-delete-preject-dialog"
    >
      <codeless-Dialog-Ctn
        title="重置密码"
        @confirm="resetpasswordcomfirm"
        @cancel="resetpassworddailg = false"
        @close="resetpassworddailg = false"
      >
        <template v-slot:dialogContent>
          <div class="deleteproject-content">
            <span>是否重置用户密码？</span>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
  </el-container>
</template>

<script>
const {
  getTenantList,
  getRelatedUser,
  addTenantUser,
  relateUser,
  updateUser,
  enableUser,
  resetPassword,
  relateOwner,
  deleteOwner,
  createOwner,
} = window.getAacApi();
import leftaside from "./components/leftaside.vue";
export default {
  name: "user",
  filters: {
    formatDate: window.pipe.vfilter.formatDate,
  },
  props: {},
  components: {
    leftaside,
  },
  data() {
    return {
      //分页组件强制刷新
      paginationreload: true,
      //项目列表
      projectList: [],
      // 加载loading
      Loading: false,
      //所有表格数据
      allTableData: [],
      //表格数据
      tableData: [],
      //表格数据筛选
      tableDatafilter: [],
      //总的数据条数
      total: 100,
      //当前第几页
      page: 1,
      //每页的条数
      size: 10,
      //表格选中的数据
      selections: [],
      //搜索的内容
      searchValue: "",
      //搜索setTime
      searchTimeout: null,
      //新增用户弹窗
      adduseradialogtitle: "新增用户",
      adduseradialog: false,
      // 新增用户数据字段
      adduserObj: {
        name: "",
        nickname: "",
        eamil: "",
        phone: "",
        desc: "",
        checked: false,
      },
      //确认新增编辑方法
      confirmadduser: null,
      //删除弹窗
      deletesuerdialog: false,
      //删除确认
      confirmdeleteuser: null,
      //选中的项目
      checkedProject: {
        name: "",
      },
      //解锁弹窗
      unlockaddailog: false,
      unlockTitle: "锁定",
      confirmunlock: null,
      // 重置密码
      resetpassworddailg: false,
      resetpasswordcomfirm: null,
    };
  },
  computed: {},
  methods: {
    //获取对应项目的用户
    getUserList() {
      this.paginationreload = false;
      getRelatedUser(this.checkedProject.id)
        .then((result) => {
          this.allTableData = result;
          this.total = this.allTableData.length || 10;
          this.page = 1;
          this.size = 10;
          this.tableDatafilter = this.allTableData;
          this.tableData = this.tableDatafilter.slice(
            (this.page - 1) * this.size,
            (this.page - 1) * this.size + this.size
          );
          //重新渲染分页组件
          this.paginationreload = true;
          this.Loading = false;
        })
        .catch((error) => {
          this.$notify.error(error);
          this.Loading = false;
        });
    },
    // 关键字过滤选择
    serachkey(event) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.paginationreload = false;
        this.tableDatafilter = this.allTableData.filter(
          (v) =>
            v.name.includes(event) ||
            v.nickname.includes(event) ||
            v.email.includes(event) ||
            v.phone.includes(event)
        );
        this.total = this.tableDatafilter.length || 10;
        this.page = 1;
        this.size = 10;
        this.tableData = this.tableDatafilter.slice(
          (this.page - 1) * this.size,
          (this.page - 1) * this.size + this.size
        );
        this.$nextTick(() => {
          this.paginationreload = true;
        });
      }, 100);
    },
    // 获取项目
    thatgetTenantList() {
      this.Loading = true;
      getTenantList()
        .then((result) => {
          let filerresult = result.filter((v) => !v.parentId);
          this.projectList = filerresult;
        })
        .catch((error) => {
          this.$notify.error(error);
        });
    },
    //分页方法
    handleCurrentChange(pageNum) {
      this.page = pageNum;
      this.tableData = this.tableDatafilter.slice(
        (this.page - 1) * this.size,
        (this.page - 1) * this.size + this.size
      );
    },
    //pageSizes 改变
    handleSizeChange(size) {
      this.size = size;
      this.page = 1;
      this.tableData = this.tableDatafilter.slice(
        (this.page - 1) * this.size,
        (this.page - 1) * this.size + this.size
      );
    },
    // 表格选中的数据
    userSelectorsChange(selections) {
      this.selections = selections;
    },
    // 添加用户方法
    clickAddUser() {
      this.adduseradialogtitle = "新增用户";
      this.adduserObj = {
        name: "",
        nickname: "",
        email: "",
        phone: "",
        desc: "",
        checked: false,
      };
      this.confirmadduser = () => {
        if (!/^[a-zA-Z]+\w+$/.test(this.adduserObj.name)) {
          this.$message.error(
            "请输入正确用户名，用户名以字母开头，只能包含字母、数字和下划线"
          );
          return;
        }
        if (!this.adduserObj.nickname.replace(/\s/g, "")) {
          this.$message.error("请填写昵称");
          return;
        }
        if (!/^[\w.-]+@[a-zA-Z0-9]+(\.[a-z]+)+$/.test(this.adduserObj.email)) {
          this.$message.error("请输入正确的邮箱");
          return;
        }
        if (
          !!this.adduserObj.phone.replace(/\s/g, "") &&
          !/^1[0-9]{10}$/.test(this.adduserObj.phone)
        ) {
          this.$message.error("请输入正确的手机号");
          return;
        }
        this.adduseradialog = false;
        this.Loading = true;
        let data = {
          desc: this.adduserObj.desc,
          email: this.adduserObj.email,
          name: this.adduserObj.name,
          nickname: this.adduserObj.nickname,
          phone: this.adduserObj.phone,
        };
        if (!!this.adduserObj.checked) {
          createOwner(this.checkedProject.id, data)
            .then((res) => {
              this.$refs.leftaside.savecheckedKey = this.checkedProject.id;
              this.$refs.leftaside.checkedKey = null;
              let i = this.projectList.findIndex((v) => v.id == this.checkedProject.id);
              this.projectList[i].ownerId = res.id;
              this.projectList[i].ownerName = data.name;
              this.projectList[i].ownerNickname = data.nickname;
              this.projectList = JSON.parse(JSON.stringify(this.projectList));
              this.$message.success("添加成功");
            })
            .catch((error) => {
              this.$notify.error(error);
              this.Loading = false;
            });
        } else {
          addTenantUser(this.checkedProject.id, data)
            .then((res) => {
              this.getUserList();
              this.$message.success("添加成功");
            })
            .catch((error) => {
              console.log(error)
              this.$notify.error('添加失败');
              this.Loading = false;
            });
        }
      };
      this.adduseradialog = true;
    },
    //编辑用户
    edituser(data) {
      let copyobj = JSON.parse(JSON.stringify(data));
      copyobj.checked = data.id == this.checkedProject.ownerId;
      this.adduserObj = JSON.parse(JSON.stringify(copyobj));
      console.log(this.adduserObj);
      // this.adduserObj.checked = this.adduserObj.id == this.checkedProject.ownerId;
      this.adduseradialogtitle = "编辑用户";
      this.confirmadduser = () => {
        if (!/^[a-zA-Z]+\w+$/.test(this.adduserObj.name)) {
          this.$message.error(
            "请输入正确用户名，用户名以字母开头，只能包含字母、数字和下划线"
          );
          return;
        }
        if (!this.adduserObj.nickname.replace(/\s/g, "")) {
          this.$message.error("请填写昵称");
          return;
        }
        if (!/^[\w.-]+@[a-zA-Z0-9]+(\.[a-z]+)+$/.test(this.adduserObj.email)) {
          this.$message.error("请输入正确的邮箱");
          return;
        }
        if (!!this.adduserObj.phone.replace(/\s/g, "") &&!/^1[0-9]{10}$/.test(this.adduserObj.phone)) {
          this.$message.error("请输入正确的手机号");
          return;
        }
          
        this.Loading = true;
        this.adduseradialog = false;
        updateUser({
          id: this.adduserObj.id,
          name: this.adduserObj.name,
          desc: this.adduserObj.desc,
          email: this.adduserObj.email,
          nickname: this.adduserObj.nickname,
          phone: this.adduserObj.phone,
        })
          .then(() => {
            // 不刷新用户列表更新数据
            let i = this.tableData.findIndex((v) => v.id == this.adduserObj.id);
            this.tableData[i].desc = this.adduserObj.desc;
            this.tableData[i].email = this.adduserObj.email;
            this.tableData[i].nickname = this.adduserObj.nickname;
            this.tableData[i].phone = this.adduserObj.phone;
            if (this.adduserObj.id != this.checkedProject.ownerId &&!!this.adduserObj.checked) {
              this.setusersuper(this.adduserObj, false, "修改成功");
            } else if (this.adduserObj.id == this.checkedProject.ownerId &&!this.adduserObj.checked) {
              deleteOwner(this.checkedProject.id)
                .then(() => {
                  //不刷新项目列表更新项目数据
                  this.$refs.leftaside.savecheckedKey =this.checkedProject.id;
                  this.$refs.leftaside.checkedKey = null;
                  let i = this.projectList.findIndex((v) => v.id == this.checkedProject.id);
                  this.projectList[i].ownerId = null;
                  this.projectList[i].ownerName = null;
                  this.projectList[i].ownerNickname = null;
                  this.projectList = JSON.parse(JSON.stringify(this.projectList));
                  this.$message.success("修改成功");
                })
                .catch((error) => {
                  this.$notify.error(error);
                });
            } else {
              this.$message.success("修改成功");
              this.Loading = false;
            }
          })
          .catch((error) => {
            this.$notify.error(error);
            this.Loading = false;
          });
      };
      this.adduseradialog = true;
    },
    // 设置管理员
    setusersuper(data, flag, msg) {
      if (!!flag) {
        return;
      }
      this.loading = true;
      relateOwner(this.checkedProject.id, data.id)
        .then(() => {
          this.$message.success(msg || "设置为项目管理员成功");
          //不刷新项目列表更新项目数据
          this.$refs.leftaside.savecheckedKey = this.checkedProject.id;
          this.$refs.leftaside.checkedKey = null;
          let i = this.projectList.findIndex((v) => v.id == this.checkedProject.id);
          this.projectList[i].ownerId = data.id;
          this.projectList[i].ownerName = data.name;
          this.projectList[i].ownerNickname = data.nickname;
          this.projectList = JSON.parse(JSON.stringify(this.projectList));
        })
        .catch((error) => {
          this.$notify.error(error);
        });
    },
    //锁定用户
    lockuser(data) {
      this.unlockTitle = data.status == "2" ? "解锁" : "锁定";
      this.confirmunlock = () => {
        this.loading = true;
        this.unlockaddailog = false;
        enableUser(data.id, data.status === "2")
          .then(() => {
            this.$message.success(this.unlockTitle + "成功");
            //不刷新用户列表更新数据
            let i = this.tableData.findIndex((v) => v.id == data.id);
            this.tableData[i].status = data.status === "2" ? "1" : "2";
            this.loading = false;
          })
          .catch((error) => {
            this.$notify({
              title: error,
              type: "error",
            });
            this.loading = false;
          });
      };
      this.unlockaddailog = true;
    },
    //重置密码
    resetpassword(data) {
      this.resetpasswordcomfirm = () => {
        this.loading = true;
        (this.resetpassworddailg = false),
          resetPassword(data)
            .then((res) => {
              this.$message.success(
                `重置成功，密码为：${res.content.password}`
              );
              this.loading = false;
            })
            .catch((error) => {
              this.$notify({
                title: error,
                type: "error",
              });
              this.loading = false;
            });
      };
      this.resetpassworddailg = true;
    },
    //删除用户方法
    batchRemove() {
      this.confirmdeleteuser = () => {
        this.Loading = true;
        this.deletesuerdialog = false;

        let allTableDataMap = this.allTableData.map((v) => v.id);
        let selectionsMap = this.selections.map((v) => v.id);
        let arr = allTableDataMap.filter((v) => !selectionsMap.includes(v));
        relateUser(this.checkedProject.id, arr)
          .then(() => {
            this.$message.success("操作成功");
            this.getUserList();
          })
          .catch((error) => {
            this.$notify.error(error);
            this.Loading = false;
          });
      };
      this.deletesuerdialog = true;
    },
    //侧边栏选中效果(选中项目)
    asideChange(data) {
      this.Loading = true;
      this.checkedProject = data;
      this.getUserList();
    },
  },
  mounted() {
    this.thatgetTenantList();
  },
};
</script>
<style scoped lang="scss">
.user-manage-ctn {
  display: flex;
  flex-direction: row !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;

  .left-content-box {
    width: 332px;
    border-right: 1px solid #ebeef0;
    height: 100%;
  }

  .right-content-box {
    width: calc(100% - 333px);
    height: 100%;
    .paginationclass {
      width: 100%;
      height: 80px;
      padding: 0px 20px 0px 17px;
      position: relative;
      right: 0px;
      bottom: 0px;
      box-sizing: border-box;
    }
  }

  background-color:var(--color-base) !important;
  .el-table__body-wrapper {
    ::v-deep .user-table {
      height: 100%;
      border-top: 1px solid #ebeef0;

      max-height: calc(100vh - 244px);
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
    line-height: 60px;
    box-sizing: border-box;
    padding: 0 20px;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    div:first-child {
      span {
        font-weight: bold;
        font-size: 16px;
        color: var(--codeless-font-color-primary);
      }
    }
    ::v-deep .el-form-item {
      margin: 0px;
      margin-left: 10px;
      margin-right: 2px;
      width: 200px !important;
      &.search-input-circle {
        .el-form-item__content {
          // margin-top: 10px;
        }
      }
      .el-input__inner {
        border-radius: 100px;
        height: 30px;
      }
      .el-input__prefix {
        .el-icon-search {
          line-height: 30px;
        }
      }
      .el-input__suffix {
        .el-icon-circle-close {
          line-height: 30px;
        }
      }
    }
  }

  .user-main-ctn {
    width: calc(100% - 40px);
    height: calc(100% - 56px);
    padding: 0px;
    margin-bottom: 20px;
    flex: none;
    margin-left: 17px;
    border-top: 1px solid #ebeef0;
    // max-height: calc(100% - 90px);

    .el-table__header {
      table-layout: auto !important;
    }

    .user-name-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      svg {
        margin-left: 4px;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }

    .user-opreation {
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
  }
}

#container {
  height: 100%;
  text-align: left;
}

.custom-tree-node span:first-child {
  text-align: left;
  min-width: 80px;
  display: inline;
}

.el-aside .title {
  display: block;
  width: 30px;
  padding: 3px 10px;
  color: var(--color-base);
  background-color: #07b6b5;
  border-radius: 0 15px 15px 0;
}

.custom-tree-node span:last-child {
  display: none;
}

.custom-tree-node:hover span:last-child {
  display: inline;
}

.searchbar,
.toolbar {
  float: right;
}

.toolbar:after {
  content: none;
  display: block;
  clear: both;
}

.searchbar {
  text-align: right;
  padding: 0;
}

.searchbar .el-form-item:first-child {
  width: 100%;
}

.el-dialog {
  width: 30%;
}
.selectTheServer {
  width: 100%;
}

.coloum-setting-icon {
  position: relative;
  width: 28px;
  height: 31px;
  .el-icon-setting {
    position: absolute;
    top: 4px;
    left: 2px;
    padding: 6px;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: #07b6b5;
      background: #eff3f5;
    }
  }
}
.el-dialog__body {
  height: calc(100% - 40px);
  overflow: auto;
}
//表格字段定制菜单的样式
.common-column-setting-popover {
  $-fs-12: 12px;
  width: 150px;
  padding: 9px 16px;
  box-shadow: 0px 0px 5px 0px rgba(55, 78, 113, 0.25);
  border-radius: 6px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
  .check-column-ctn {
    line-height: 26px;
    .check-title {
      color: #7f8b93;
      font-size: $-fs-12;
    }
    .column-check-group {
      label.el-checkbox {
        display: block;
      }
      .el-checkbox__label {
        color: #5b5b5b;
        font-size: $-fs-12;
      }
    }
  }
}
.common-column-tool-icon {
  position: relative;
  width: 17px;
  height: 17px;
  padding: 6px;
  line-height: 16px;
  vertical-align: middle;
  box-sizing: content-box;
  display: inline-block;
  margin-left: 4px;
  margin-top: -2px;
  &:hover,
  &.actived-icon {
    cursor: pointer;
    // background: #EFF3F5;
    // border-radius: 50%;
  }
  z-index: 2;
}
</style>
<style lang="scss">
.project-user-dialog-reset {
  border-radius: 8px;

  > .el-dialog__header {
    display: none !important;
  }

  > .el-dialog__body {
    padding: 0px !important;
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
.user-opreation-elpopover {
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
// 删除新增项目弹窗垂直居中
// 删除新增项目弹窗垂直居中
.left-aside-add-preject-dialog {
  margin-top: calc(50vh - 225px) !important;
}
.left-aside-delete-preject-dialog {
  margin-top: calc(50vh - 110px) !important;
}
.right-content-box-input-keyword {
  > .el-input__inner {
    border: 1px solid #a9bdc7;
  }
  > .el-input__prefix{
    left:10px;
  }
}
// 修改el-table 表头样式
.user-table-header-cell-class-name {
  > div {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray);
  }
}
.user-table-cell-class-name {
  > div {
    font-size: 14px;
    font-weight: 400;
    color: var(--codeless-font-color-primary);
  }
}
</style>