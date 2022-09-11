<template>
  <div class="department-Management flex flex-row items-start justify-start" v-loading="loading">
    <div class="department-Management-left" >
      <div class="department-Management-left-top flex flex-row items-center justify-end">
        <div class="top-title"><span>部门</span></div>
        <div :class="{'top-seach':!showdepartmentinput,'top-seach-hidden':showdepartmentinput}">
          <input
            ref="showdepartmentinput"
            type="text"
            v-model="departmentSearch"
            @input="departmentSearchfun"
            placeholder="搜索关键字"
          />
          <i class="icon iconfont icon-sousuo1" @click="showdepartmentinputfun"></i>
        </div>
        <div class="top-add-icon" @click="adddepartmentfun()"><i class="el-icon-circle-plus"></i></div>
      </div>
      <div class="department-Management-left-tree">
        <el-tree
          ref="tree"
          :data="treedata"
          :default-expand-all="true"
          node-key="id"
          :props="{
            children: 'children',
            label: 'label',
          }"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <div class="custom-tree-node flex flex-row items-center justify-between" slot-scope="{ data }">
            <div class="node-label-content flex flex-row items-center justify-start">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-zuhu"></use>
              </svg>
              <span>{{ data.label }}</span>
            </div>
            <div class="node-operation-content flex-row items-center justify-around" @click.stop="()=>{}">
              <i class="icon iconfont icon-xinzeng" @click.stop="adddepartmentfun(data.id)"></i>
              <i class="icon iconfont icon-bianji-yonghuguanli" @click.stop="eidtDepartment(data)"></i>
              <i class="icon iconfont icon-shanchu1" @click="deleteDepartment(data)"></i>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
    <div class="department-Management-right">
      <div class="department-Management-right-top flex flex-row items-center justify-between">
        <div class="tabdiv flex flex-row items-start justify-start">
          <div
            :class="{ 'tab flex flex-row items-centerjustify-center': true, tabactive: items.key == tabdiv }"
            @click="tabclick(items.key)"
            :ref="'tab' + items.key"
            v-for="(items, index) in tabdivlist"
            :key="items.key + index"
          >
            <span>{{ items.label }}</span>
          </div>
          <div class="swpier" :style="swpierstyle"></div>
        </div>
        <div v-if="tabdiv == 'user'" class="top-serach-box flex flex-row items-center justify-end">
          <el-button 
            class="add-user"  
           @click="clickAddUser"
           :disabled="!saveTreeCheck"
           icon="el-icon-plus"
           type="primary"
           round
           size="mini"
          >
            用户
          </el-button>
          <el-button 
            class="mengenn-user" 
            @click="mengennuserfun"
            :disabled="!saveTreeCheck"
            type="primary"
            size="mini"
            round
          >
            纳管用户
          </el-button>
          <el-button 
            class="delete-user" 
            @click="deleteDepartmentUser"
            :disabled="this.userselectiondata.length == 0 || !saveTreeCheck"
            size="mini"
            round
            plain
          >
            移除
          </el-button>
          <div class="user-seach-box">
            <i class="icon iconfont icon-sousuo1"></i>
            <input
              type="text"
              v-model="userseachvale"
              @input="userseachvalefun"
              placeholder="请输入关键字"
            />
          </div>
        </div>
        <div v-if="tabdiv == 'role'" class="top-serach-box flex flex-row items-center justify-end">
          <el-button 
            class="add-user" 
            @click="addroles"
            :disabled="!saveTreeCheck"
            icon="el-icon-plus"
            type="primary"
            round
            size="mini"
          >角色
          </el-button>
          <el-button
            class="delete-user"
            :disabled="detelerolesenble || !saveTreeCheck"
            size="mini"
            round
            plain
            @click="deteleroles"
          >
            删除
          </el-button>
          <div class="user-seach-box">
            <i class="icon iconfont icon-sousuo1"></i>
            <input
              type="text"
              v-model="roleseachvale"
              placeholder="请输入关键字"
              @input="roleseachfun"
            />
          </div>
        </div>
      </div>
      <div class="department-Management-right-content">
        <div class="role-content flex flex-col items-start justify-start" v-if="tabdiv == 'role'">
          <div
            class="role-content-list flex flex-row items-center justify-start"
            v-for="(item, index) in showroletableData"
            :key="index"
          >
            <el-checkbox
              v-model="item.checked"
              class="checkbox-class"
            ></el-checkbox>
            <div class="role-content-list-msg flex flex-row items-center justify-start ">
              <roleIcon></roleIcon>
              <!-- <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-suoyouzhe"></use>
              </svg> -->
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="user-content flex flex-col items-center justify-start" v-if="tabdiv == 'user'">
          <div class="tablebox-class">
            <el-table
              :data="tableData"
              style="width: 100%"
              height="100%"
              header-cell-class-name="user-content-table-header-cell-class-name"
              cell-class-name="user-content-table-cell-class-name"
              @selection-change="userselection"
              tooltip-effect="light"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="用户名" width="180">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="nickname" label="昵称" width="180">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱"> </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="phone" label="手机号"> </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="desc" label="描述"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="user-opreation">
                    <span  @click="associationrole(scope.row)">关联角色</span>
                    &emsp;
                    <span @click="clickEditUser(scope.row)">编辑</span>
                    &emsp;
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      popper-class="user-opreation-elpopover"
                    >
                      <div class="user-opreation-icon-choose flex flex-col items-center justify-start">
                        <div @click="enableUser(scope.row)">
                          <span>{{
                            scope.row.status === "2" ? "解锁" : "锁定"
                          }}</span>
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
          <pagination
            v-if="paginationreload"
            class="user-content-pagination"
            @current-change="handleCurrentChange"
            :total="total"
            :currentPage="page"
            :pageSizes="[10, 20, 30, 40, 50, 100]"
            :pageSize="size"
            @size-change="handleSizeChange"
          >
          </pagination>
        </div>
      </div>
    </div>
    <!-- 新增部门弹窗 -->
    <el-dialog
      width="550px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="addDepartmentdialog"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset add-department"
    >
      <codeless-Dialog-Ctn
        :title="addDepartmentdialogtitle"
        @confirm="confirmaddDepartmen"
        @cancel="addDepartmentdialog = false"
        @close="addDepartmentdialog = false"
      >
        <template v-slot:dialogContent>
          <div class="add-department-content flex flex-col items-start justify-center">
            <div>
              <span><span>*</span><span>名称</span></span>
              <input type="text" v-model="addDepartmentObj.name" placeholder="输入名称">
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
      :visible.sync="deleterolesdialog"
      custom-class="no-header-and-footer-dailog project-user-dialog-reset delete-department-roles"
    >
      <codeless-Dialog-Ctn
        title="删除角色"
        @confirm="confirmdeleteroles"
        @cancel="deleterolesdialog = false"
        @close="deleterolesdialog = false"
      >
        <template v-slot:dialogContent>
          <span>是否要删除角色?</span>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
  </div>
</template>
<script>
const {getDepartment,
  addDepartment,
  deleteDepartment,
  eidtDepartment,
  getDepartmentroles,
  getAllRoles,
  DepartmentdeteleRoles,
  getDepartmentUser,
  modifyDepartmentUser,
  getUserReRole,
  userReRole,
  updateUser,
  resetPassword,
  enableUser,
  DeAddRoles,
  addUser,
  addTenantUser
} = window.getAacApi();
const {baseInfoMixin} = window.aacMixins;
import increaseUser from './components/addUser.vue';
import mengnnuser from './components/mengnnuser.vue';
import relativeUser from './components/relativeUser.vue';
import addroles from './components/addroles.vue';
import addicon from './components/addicon.vue';
import roleIcon from './components/roleIcon.vue';
export default {
  mixins: [baseInfoMixin,window.codelessMixins.customDialog],
  components:{
    addicon,
    roleIcon,
  },
  data() {
    return {
      // 是否展开部门搜索框
      showdepartmentinput: true,
      //搜索框输入值
      departmentSearch: "",
      //showinput 事件防抖
      showinputvaluekey: null,
      //树组件全部数据
      alltreedata:[],
      //组件数据
      treedata: [],
      // 存储选中的树节点
      saveTreeCheck:null,
      //组件加载loding
      loading:true,
      // 右边栏tab 选中的值
      tabdiv: "user",
      // 右边栏tab选项
      tabdivlist: [
        {
          label: "用户",
          key: "user",
        },
        {
          label: "角色",
          key: "role",
        },
      ],
      //滑块样式
      swpierstyle: {
        left: "0px",
        width: "0px",
      },

      // 用户搜索框值
      // userseachvale: "",
      //角色搜索框值
      roleseachvale: "",
      roleseachvalekey:null,
      //需要展示角色数据
      showroletableData:[],
      //角色数据
      roletableData: [],
      // 全量角色数据
      allRoletableData:[],
      //用户表格
      tableData: [],
      // 选中的用户数据
      userselectiondata:[],
      // 过滤后的表格数据
      filtertableData:[],
      //全部用户表格
      allTableDate:[],
      total: 100,
      page: 1,
      size: 10,

      //新增部门弹出
      addDepartmentdialog:false,
      confirmaddDepartmen:null,
      addDepartmentObj:{},
      addDepartmentdialogtitle:'添加部门',
      //分页器重新加载
      paginationreload: true,


      // 删除角色
      deleterolesdialog:false,
      confirmdeleteroles: null
    };
  },
  computed:{
    detelerolesenble(){
      return  !this.showroletableData.some(v => v.checked);
    },
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
  created(){
    this.getRoleList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tabclick(this.tabdiv);
      this.getDepartment();
    });
  },
  methods: {
    //展开和收起部门搜索框
    showdepartmentinputfun(){
      this.showdepartmentinput = !this.showdepartmentinput;
      if(!this.showdepartmentinput){
        this.$nextTick(()=>{
          this.$refs.showdepartmentinput.focus();
        })
      }else{
        this.departmentSearch = '';
        let event = {
          target:{
            value:""
          }
        }
        this.departmentSearchfun(event);
      }
    },
    //用户表格的翻页变化
    handleCurrentChange(page) {
      this.page = page;
      this.tableData = this.filtertableData.slice((this.page-1)*this.size,this.page*this.size);
    },
    //用户表格pagesize变化
    handleSizeChange(szie) {
      this.size = szie;
      this.page = 1;
      this.tableData = this.filtertableData.slice((this.page-1)*this.size,this.page*this.size);
    },
    // 获取用户
    getuser(){
      this.userseachvale = '';
      this.paginationreload = false;
      getDepartmentUser({
        id:this.saveTreeCheck.id,
        data:{
          id:this.saveTreeCheck.id,
          keyword: '',
          pageNum:1,
          pageSize:10000
        }
      }).then((res)=>{
        this.allTableDate = res.content;
        this.filtertableData =  JSON.parse(JSON.stringify(this.allTableDate));
        this.total = this.filtertableData.length;
        this.page = 1;
        this.size = 10;
        this.tableData = this.filtertableData.slice((this.page-1)*this.size,this.page*this.size);
        this.paginationreload = true;
        this.loading =false;
      })
    },
    // 添加用户
    clickAddUser() {
      let self = this;
      let user = {
        name:'',
        nickname:'',
        phone:'',
        email:'test@agree.com.cn',
        desc:''
      }
      self.openCustomDialog({
        title: "新增用户",
        path: "addUser",
        width: "500px",
        component: increaseUser,
        propsData: {
          user: user,
        },
        confirmCallback: async ($_dontCare, $el) => {
          this.loading = true;
          let obj ={
              department: [this.saveTreeCheck.id],
              desc: $el.user.desc,
              email: $el.user.email,
              name: $el.user.name,
              nickname: $el.user.nickname,
              phone: $el.user.phone,
            }
            if(!!this.superAdmin){
              addUser(obj).then((res)=>{
                if(!!res.success){
                  self.getuser();
                  self.$message.success('添加成功');
                }else{
                  self.loading = false;
                  self.$message.error(res.msg);
                }
              }) 
            }else{
              addTenantUser(this.$store.getters["user/tenantId"], obj)
              .then((res) => {
               
                  self.getuser();
                  self.$message.success('添加成功');
                  self.loading = false;
              }).catch(e=>{

                  self.loading = false;
                  self.$message.error('添加失败');
                  console.log(e)
              })
            }
        },
      });
    },
    //编辑用户
    clickEditUser: function (row) {
      this.openCustomDialog({
        title: "编辑用户",
        path: "editUser",
        width: "500px",
        component: increaseUser,
        propsData: {
          user: JSON.parse(JSON.stringify(row)),
        },
        confirmCallback: async ($_dontCare, $el) => {
          updateUser($el.user)
            .then((res) => {
              let index =  this.tableData.findIndex(v => v.id == row.id);
              this.tableData[index].name = $el.user.name;
              this.tableData[index].nickname = $el.user.nickname;
              this.tableData[index].phone = $el.user.phone;
              this.tableData[index].email = $el.user.email;
              this.tableData[index].desc = $el.user.desc;
              this.$message({
                message: "编辑用户成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: "error",
              });
            });
        },
      });
    },
    // 用户重置密码
    clickResetPassword(row) {
      this.openCustomDialog({
        title: `提示`,
        path: "resetPassword",
        width: "300px",
        component: {
          template: `<div>确认重置密码吗?</div>`,
        },
        confirmCallback() {
          let obj = {id:row.id}
          resetPassword(obj)
          .then((res) => {  
            this.$message.success("重置用户密码成功");
          })
          .catch((e) => {
              this.$message.error("重置用户密码失败");
          });
        },
      });
      // this.userFormDisable = false;
    },
    // 解锁/锁定
    enableUser(row) {
      let title = row.status === '2' ? '解锁' : '锁定'
      let seft =  this;
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
              let index = seft.tableData.findIndex(v => v.id == row.id);
              this.tableData[index].status = row.status == '2' ? '1' : '2';
              console.log(this.tableData[index].status);
            })
            .catch(error => {
              this.$notify({title: error, type: 'error'});
            })
        }
      });
    },
    //纳管用户
    mengennuserfun(){
      this.openCustomDialog({
        title: "纳管用户",
        path: "addUser",
        width: "1060px",
        component: mengnnuser,
        propsData: {
          departmentuser: this.allTableDate,
        },
        confirmCallback: async ($_dontCare, $el) => {
          let arr = $el.alluser.filter(v => !!v.check).map(v => v.id);
          this.loading = true;
          modifyDepartmentUser({
            id:this.saveTreeCheck.id,
            data:arr
          }).then(()=>{
            this.getuser();
            this.$message.success('修改完成');
          }).catch((error) => {
            this.$notify.error(error);
            this.loading = false;
          }) 
        },
      });
    },
    // 用户关联角色
    associationrole(row){
      getUserReRole({ id: row.id })
        .then((res) => {
            let roleIds = res.content.map((item) => item.id);
            this.openCustomDialog({
              title: "关联角色",
              path: "relativeUser",
              width: "1060px",
              component: relativeUser,
              propsData: {
                roleOptions: this.allRoletableData,
                roleIds: roleIds,
              },
              confirmCallback: async ($_dontCare, $el) => {
                let ids = $el.roleSelectors.map(v => v.id);
                let obj = {
                  id:row.id,
                  ids: ids,
                }
                console.log(obj);
                userReRole(obj).then((res) => {
                    this.$message({
                      message: "关联角色成功",
                      type: "success",
                    });
                })
                .catch((error) => {
                  this.$message({
                    message: error,
                    type: "error",
                  });
                });
              },
            });
        })
        .catch((res) => {
          this.$message({
            message: "获取用户关联角色失败:" + res.msg,
            type: "error",
          });
        });
    },
    // 删除部门的用户
    deleteDepartmentUser(){
      this.openCustomDialog({
        title:"移除用户",
        path: "resetPassword",
        width: "300px",
        component: {
          template: `<div>是否移除用户？</div>`,
        },
        confirmCallback: async ($_dontCare, $el) => {
          this.loading =  true;
          let arr = this.userselectiondata.map(v => v.id);
          let allarr = this.allTableDate.map(v => v.id);
          let setarr = allarr.filter(v => !arr.includes(v));
          modifyDepartmentUser({
            id:this.saveTreeCheck.id,
            data:setarr
          }).then(()=>{
              this.userselectiondata = [];
              this.getuser();
              this.$message.success('移除成功');
          }).catch((error) => {
            this.$notify.error(error);
             this.loading = false;
          }) 
        },
      });
    },
    // 选中用户
    userselection(data){
      this.userselectiondata = data;
    },
    //检索用户
    userseachvalefun(event){
      this.paginationreload = false;
      let key =  event.target.value;
        this.filtertableData =  this.allTableDate.filter((v) =>{
          if( !!v.name && !!v.id){
             return v.name.includes(key) || v.id.includes(key);
          }else{
            return false;
          }
        });
        this.total = this.filtertableData.length  == 0 ? 10 :this.filtertableData.length;
        this.page = 1;
        this.size = 10;
        this.tableData = this.filtertableData.slice((this.page-1)*this.size,(this.page+1)*this.size);
        this.$nextTick(()=>{
          this.paginationreload = true;
        });
      
    },
    // 获取部门下角色
    getDepartmentroles(){
      //情况输入框
      this.roleseachvale = '';
      getDepartmentroles({
        id:this.saveTreeCheck.id
      }).then((res)=>{
        this.roletableData = res.content.map(v =>{
          v.checked = false;
          return v;
        });
        this.showroletableData = JSON.parse(JSON.stringify(this.roletableData))
        this.loading = false;
      }).catch((error) => {
        this.$notify.error(error);
      }) 
    },
    // 获取全量角色列表
    getRoleList(){
      getAllRoles({
        Name:"",
        pageNum:1,
        pageSize:10000,
      })
        .then((res) => {
          this.allRoletableData = res.content || [];
        })
        .catch(error => {
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    // 获取打开添加角色弹窗
    addroles(){
      this.openCustomDialog({
        title:'添加角色',
        path: "resetPassword",
        width: "550px",
        component: addroles,
        confirmCallback: async ($_dontCare, $el) => {
          let {name, desc} = $el.roles;
          if(!name.replace(/\s/g,'')){
            this.$message.error('请输入名称');
            return;
          }
          this.loading =  true;
          DeAddRoles({
            department:[this.saveTreeCheck.id],
            desc:desc,
            name:name,
          }).then((res)=>{
            if(!!res.success){
              this.$message.success('添加角色成功');
              this.getDepartmentroles();
              this.getRoleList();
            }else{
              this.loading =  false;
              this.$message.error(res.msg);
            }
          })
          console.log($el.roles)  
        },
      });
      
    },
    //打开删除角色弹窗
    deteleroles(){
        this.confirmdeleteroles = ()=>{
          this.loading = true;
          let arrid = this.showroletableData.filter( v => v.checked).map(v => v.id);
          DepartmentdeteleRoles(arrid).then((res)=>{
            if(!!res.success){
              this.$message.success('删除角色成功');
              this.getDepartmentroles();
            }else{
              this.loading =  false;
              this.$message.error(res.msg);
            }
          })
          this.deleterolesdialog = false;
        }
        this.deleterolesdialog = true;

    },
    // 添加角色选中的数据
    addrolesselect(data){
      this.addrolesselectlist =  data;
    },
    //检索角色数据
    roleseachfun(event){
      let value =  event.target.value;
      clearTimeout(this.roleseachvalekey);
      this.roleseachvalekey = setTimeout(()=>{
        if(!!value){
          this.showroletableData = this.roletableData.filter(v => v.name.includes(value) || v.id.includes(value))
        }else{
          this.showroletableData = this.roletableData;
        }
      },200)
    },
    //搜索树组件
    departmentSearchfun(event){
      if(!!event.target.value){
        let filter = this.alltreedata.filter(v => v.name.includes(event.target.value));
        let filterkey = filter.map(v => v.id);
        this.$refs.tree.filter(filterkey);
      }else{
        let filterkey = this.alltreedata.map(v => v.id);
        this.$refs.tree.filter(filterkey);
      }
    },
    filterNode(value, data){
      return value.includes(data.id);
    },
    //树组件点击事件
    handleNodeClick(data) {
      this.loading = true;
      this.saveTreeCheck = JSON.parse(JSON.stringify(data));
      // 初始化用户查询条件
      this.getDepartmentroles();
      this.getuser();

    },
    //tab 选中事件
    tabclick(key) {
      this.swpierstyle = {
        left: this.$refs[`tab${key}`][0].offsetLeft + "px",
        width: this.$refs[`tab${key}`][0].offsetWidth + "px",
      };
      this.tabdiv = key;
    },
    // 获取部门数据
    getDepartment(){
      getDepartment({
        pageNum:1,
        pageSize:10000,
      }).then( async (res)=>{
        // this.$message.success("操作成功");
        this.alltreedata =  await JSON.parse(JSON.stringify(res.content));
        let copy =  await JSON.parse(JSON.stringify(res.content));
        let firstParent =  res.content.filter(v => !v.parentId);
        await this.getDepartmentchildren(firstParent,copy);
        this.treedata = JSON.parse(JSON.stringify(firstParent));
        console.log('这里treedata',this.treedata);
        this.$nextTick(()=>{
          if(this.treedata.length > 0){
            // 默认选中第一个数据
            if(!!this.saveTreeCheck){
              this.$refs.tree.setCurrentKey(this.saveTreeCheck.id);
              this.getDepartmentroles();
              this.getuser();
            }else{
              this.$refs.tree.setCurrentKey(this.treedata[0].id);
              this.saveTreeCheck = JSON.parse(JSON.stringify(this.treedata[0]));
              // 获取用户列表
              this.getDepartmentroles();
              this.getuser();
            }
          }else{
            //没有部门数据清空展示的数据
            console.log('这里1111');
            this.loading = false;
            this.saveTreeCheck = null;
            this.tableData = [];
            this.roleseachvale = '';
            this.userseachvale = '';
            this.showroletableData = [];
            this.roletableData = [];
            this.allTableDate = [];
            this.filtertableData = [];
            this.userselectiondata = [];
          }
        })
      }) 
    },
    // 获取部门chilren
    getDepartmentchildren(arr,alldata){
      arr.forEach(v =>{
        v.label = v.name;
        let children = alldata.filter(val => val.parentId == v.id);
        if(children.length >0){
          this.getDepartmentchildren(children,alldata);
           v.children = children;
        }else{
          v.children = [];
        }
        
      })
    },
    // 添加部门
    addDepartment(params){
      addDepartment({
        name: params.name,
        parentId: params.parentId,
      }).then((res)=>{
        if(!!res.success){
          this.$message.success("添加部门成功");
          this.getDepartment();
        }else{
          this.loading = false;
          this.$message.error("添加部门成功");
        }
      }) 
    },

    //编辑部门
    eidtDepartment(data){
      this.addDepartmentdialogtitle = '编辑部门';
      this.addDepartmentObj = JSON.parse(JSON.stringify(data));
      this.confirmaddDepartmen = ()=>{
        if(!this.addDepartmentObj.name.replace(/\s/g,'')){
          this.$message.error('请输入名称');
          return;
        }
        eidtDepartment({
          id:this.addDepartmentObj.id,
          name:this.addDepartmentObj.name,
          parentId:this.addDepartmentObj.parentId,
        }).then((res)=>{
          this.$message.success("编辑成功");
          this.loading = true;
          this.getDepartment();
        }).catch((error) => {
          this.loading = false;
          this.$notify.error(error);
        })
        this.addDepartmentdialog = false;
      }
      this.addDepartmentdialog = true;
    },
    //添加部门弹窗
    adddepartmentfun(parentId){
      this.addDepartmentdialogtitle = '添加部门';
      this.addDepartmentObj = {
          name: '',
          parentId: parentId,
      };
      this.confirmaddDepartmen = ()=>{
        if(!this.addDepartmentObj.name.replace(/\s/g,'')){
          this.$message.error('请输入名称');
          return;
        }
        this.loading = true;
        this.addDepartment(this.addDepartmentObj);
        this.addDepartmentdialog = false;
      };
      this.addDepartmentdialog = true;
    },
    // 删除部门
    deleteDepartment(data){
      this.openCustomDialog({
        title:'删除部门',
        path: "resetPassword",
        width: "300px",
        component: {
          template: `<div>删除部门会把该部门所关联的角色删除，如果该部门下有子部门，会把子部门下所关联的角色也一并删除，确定要删除吗?</div>`,
        },
        confirmCallback: async ($_dontCare, $el) => {
           this.loading = true;
          this.getchildren(data).then((res)=>{
            let depathmentids = res.map(v => v.id);
            let funs  = res.map(v => {
              return new Promise((resolve,reject)=>{
                  getDepartmentroles({
                        id:v.id
                  }).then((res)=>{
                    if(res.success){
                       let rolesid = res.content.map(v => v.id);
                       resolve(rolesid);
                    }else{
                      resolve([]);
                    }
                  })
              })
            });
            Promise.all(funs).then((res)=>{
              let arr =  res.flat(1);
              if(arr.length >0){
                DepartmentdeteleRoles(res.flat(1)).then((res)=>{
                    if(!!res.success){
                      deleteDepartment(depathmentids).then((res)=>{
                        if(!!res.success){
                          this.$message.success("删除成功");
                          // 判断是否是删除选中部门
                          if(depathmentids.includes(this.saveTreeCheck.id)){
                            this.saveTreeCheck = null;
                          }
                          this.getDepartment();
                        }else{
                          this.loading = false;
                          this.$message.error(res.msg);
                        }
                      })
                    }else{
                      this.loading =  false;
                      this.$message.error(res.msg);
                    }
                });
              }else{
                deleteDepartment(depathmentids).then((res)=>{
                  if(!!res.success){
                    this.$message.success("删除成功");
                    // 判断是否是删除选中部门
                    if(depathmentids.includes(this.saveTreeCheck.id)){
                      this.saveTreeCheck = null;
                    }
                    this.getDepartment();
                  }else{
                    this.loading = false;
                    this.$message.error(res.msg);
                  }
                })
              }
            })
          })
        },
      });
    },

    // 获取部门下的子孙元素
   async getchildren(obj){
     let copyObj = JSON.parse(JSON.stringify(obj));
     let children =  copyObj.children;
     delete copyObj.children;
      let arrmap = [copyObj];
      let eachobj = (arr) => {
        arr.forEach((v)=>{
          let children =  v.children;
          delete v.children;
          arrmap.push(v);
          if(!!children && children.length >0){
            eachobj(children);
          }
        })
      };
      await eachobj(children);
      return arrmap;
    }
  },
};
</script>
<style lang="scss" scoped>
.department-Management {
  width: 100%;
  height: 100%;


  .department-Management-left {
    width: 272px;
    height: 100%;
    border-right: 1px solid #d5e0ed;

    .department-Management-left-top {
      width: 100%;
      height: 56px;
      position:relative;

      .top-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--codeless-font-color-primary);
        flex-shrink:0;
        position:absolute;
        left:20px;
        z-index:0;
      }

      .top-seach {
        width: 204px;
        height: 30px;
        position: relative;
        margin-right: 12px;
        text-align: left; 
        transition: width 0.4s ease-in-out 0.2s;
        z-index:9;

        input {
          width: 100%;
          height: 30px;
          outline: none;
          border: 1px solid #a9bdc7;
          box-sizing: border-box;
          border-radius: 222px;
          padding: 0px 15px 0px 28px;
          transition: transform 0.2s ease-in-out 0s, padding 0.4s ease-in-out 0.2s;
          transform-origin: 50% 50%;
          transform:scale(1);

          &:focus{
            border: 1px solid var(--color-primary);
          }

          &::placeholder {
            font-size: 12px;
            font-weight: 400;
            color: #c0c4cc;
            transition: opacity 0.2s ease-in-out 0.6s;
            opacity: 1;
          }
        }

        .icon-sousuo1 {
          cursor: pointer;
          position: absolute;
          top: 5px;
          left: 8px;
          font-size: 14px;
          color: var(--color-gray);
        }
      }

      .top-seach-hidden {
        width: 30px;
        height: 30px;
        position: relative;
        margin-right: 12px;
        text-align: left;
        transition: width 0.4s ease-in-out 0.2s;

        input {
          width: 100%;
          height: 30px;
          outline: none;
          border: 1px solid #a9bdc7;
          box-sizing: border-box;
          border-radius: 222px;
          transition: transform 0.2s ease-in-out 0.6s,padding 0.4s ease-in-out 0.3s;
          transform-origin: 50% 50%;
          transform:scale(0);

          &:focus{
            border: 1px solid var(--color-primary);
          }

          &::placeholder {
            font-size: 12px;
            font-weight: 400;
            color: #c0c4cc;
            transition: opacity 0.2s ease-in 0s;
            opacity: 0;
          }
        }

        .icon-sousuo1 {
          cursor: pointer;
          position: absolute;
          top: 5px;
          left: 8px;
          font-size: 14px;
          color: var(--color-gray);
        }
      }

      .top-add-icon {
        cursor: pointer;
        margin-right: 20px;
        .el-icon-circle-plus {
          font-size: 20px;
          color: var(--color-primary);
        }
      }
    }

    .department-Management-left-tree {
      width: 100%;
      height: calc(100% - 56px);
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;

      .custom-tree-node {
        width: 100%;

        &:hover > .node-operation-content {
          display: flex;
        }

        .node-label-content {
          // display: flex;
          // flex-direction: row;
          // align-items: center;
          // justify-content: flex-start;
          svg {
            width: 12px;
            height: 14px;
          }

          span {
            margin-left: 8px;
            font-size: 14px;
            font-weight: 400;
            color: var(--codeless-font-color-primary);
          }
        }
        .node-operation-content {
          display: none;
          // flex-direction: row;
          // align-items: center;
          // justify-content: space-around;
          width: 30%;
          svg {
            width: 12px;
            height: 12px;
          }
          i{
            font-size:12px;
            color:var(--color-primary-dark-1)
          }
          .el-icon-plus{
            font-size: 14px;
            font-weight: 400;
            color:var(--color-primary-dark-1);
          }
        }
      }
    }
  }

  .department-Management-right {
    width: calc(100% - 272px);
    height: 100%;
    box-sizing: border-box;
    padding: 0px 20px 0px 20px;

    .department-Management-right-top {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid #ebeef0;

      .tabdiv {
        width: auto;
        height: 100%;
        position: relative;

        .tab {
          width: auto;
          height: auto;
          font-size: 16px;
          font-weight: 400;
          color: var(--codeless-font-color-primary);
          cursor: pointer;
          margin-left: 30px;
          margin-top: 15px;
          cursor: pointer;
        }
        .tabactive {
          font-weight: bold;
        }
        .tab:first-child {
          margin-left: 0px;
        }
        .swpier {
          border: 1px solid var(--color-primary);
          position: absolute;
          bottom: 10px;
          transition: all 0.3s ease-in-out 0s;
        }
      }

      .top-serach-box {
        width: auto;
        height: 100%;
        // display: flex;
        // flex-direction: row;
        // align-items: center;
        // justify-content: flex-end;

        > div {
          border-radius: 222px;
          height: 30px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .add-user {
          width: 92px;
          height:30px;
          background: var(--color-primary);
          font-size: 14px;
          font-weight: 400;
          color: var(--color-base);
        }

        .mengenn-user {
          width: 104px;
          height:30px;
          background: var(--color-primary);
          font-size: 14px;
          font-weight: 400;
          color: var(--color-base);
        }

        .delete-user {
          width: 76px;
          height:30px;
          border: 1px solid #a9bdc7;
          margin-right: 12px;
          font-size: 14px;
          font-weight: 400;
          color: #374e71;
        }

        .user-seach-box {
          width: 200px;
          position: relative;
          border: 1px solid #a9bdc7;

          input {
            width: 170px;
            height: 28px;
            box-sizing: border-box;
            padding-left: 18px;
            outline: none;

            &::placeholder {
              font-size: 12px;
              font-weight: 400;
              color: #c0c4cc;
            }
          }

          .icon-sousuo1 {
            position: absolute;
            left: 9px;
            top: 4px;
            font-size: 14px;
            color: var(--color-gray);
          }
        }
      }
    }

    .department-Management-right-content {
      width: 100%;
      height: calc(100% - 57px);

      .role-content {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        .role-content-list {
          width: 100%;
          height: 56px;
          border-bottom: 1px solid #ebeef0;
          flex-shrink: 0;

          .checkbox-class {
            margin-left: 20px;
          }

          .role-content-list-msg {
            width: calc(100% - 53px);
            margin-left: 20px;
            span {
              margin-left: 10px;
              font-size: 14px;
              font-weight: 400;
              color: var(--codeless-font-color-primary);
            }
          }
        }
      }

      .user-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .tablebox-class {
          width: 100%;
          height: calc(100% - 50px);
        }

        .user-content-pagination {
          width: 100%;
          margin-top: 16px;
        }
      }
    }
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

// 添加用户弹窗样式
.add-department-content {
  width: 100%;
  height: 80px;
  >div{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    >span {
      display: flex;
      width: 80px;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      span:first-child{
        color: #f65656;
      }
      span:last-child{
        font-size: 14px;
        font-weight: 400;
        color: var(--codeless-font-color-primary);
      }
    }
    
    >input {
      width: 350px;
      height: 30px;
      outline: none;
      border: 1px solid #A9BDC7;
      border-radius: 4px;
      margin-left:16px;
      padding:0px 12px 0px 12px;

      &::placeholder {
        font-size: 12px;
        font-weight: 400;
        color: #c0c4cc;
      }
      &:focus{
        border: 1px solid var(--color-primary);
      }
      
    }
  }
  
}
</style>
<style lang="scss">
.department-Management-left-tree {
  .el-tree {
    .is-current {
      > .el-tree-node__content {
        background: var(--color-hover-primary) !important;
      }
    }
    .el-tree-node {
      .el-tree-node__content {
        height: 32px;

        .el-tree-node__expand-icon {
          margin-left: 10px;
        }
        &:focus {
          background: var(--color-hover-primary);
        }
        &:hover {
          background: var(--color-hover-primary);
        }
      }
    }
  }
}
</style>
<style lang="scss">
// 修改el-table 表头样式
.user-content-table-header-cell-class-name {
  > div {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-gray);
  }
}
.user-content-table-cell-class-name {
  > div {
    font-size: 14px;
    font-weight: 400;
    color: var(--codeless-font-color-primary);
  }
}
.user-opreation-elpopover {
  min-width: 84px !important;
  width: 84px !important;
  padding: 0px;

  .user-opreation-icon-choose {
    width: 100%;
    height: auto;

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
// 重置弹窗样式
.project-user-dialog-reset {
  border-radius: 8px;

  > .el-dialog__header {
    display: none !important;
  }

  > .el-dialog__body {
    padding: 0px !important;
  }
}
.add-department-roles {
   margin-top: calc(50vh - 393px) !important;
}

.delete-department-roles {
   margin-top: calc(50vh - 79px) !important;
}
.add-department {
   margin-top: calc(50vh - 108px) !important;
}
</style>