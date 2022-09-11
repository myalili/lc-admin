<template>
  <div class="role-list">
    <div class="role-list-header">
      <!-- <span class="role-list-header-title">{{ title }}</span> -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        round
        size="mini"
        @click="openDialog"
      >角色</el-button>
    </div>
    <div class="role-list-wrapper">
      <role-list-item
        v-for="role in defaultRoleList"
        :key="role.id"
        :role="role"
        :isActive="value === role.id"
        @click="changeRole(role)"
        @delete="deleteRole(role)"
      />
      <div class="role-list-wrapper-filter">共享角色</div>
        <role-list-item
          v-for="role in shareRoleList"
          :key="role.id"
          :role="role"
          :isActive="value === role.id"
          @click="changeRole(role)"
          @delete="deleteRole(role)"
        />
    </div>
    <!-- <div class="role-list-footer">
      <div class="role-list-add-btn" @click="openDialog">
        <i class="iconfont iconjia"></i>
        <span class="role-list-add-btn-text">添加角色</span>
      </div>
    </div> -->
    <!-- <role-editor-dialog :visible.sync="editorVisibled" @submit="addRole" /> -->
  </div>
</template>

<script>
import roleListItem from './roleListItem.vue'
// import roleEditorDialog from './roleEditorDialog.vue'
import roleEditorConfirm from './roleEditorConfirm.vue'
const{ getRoleList, deleteRole, addRole,getDepartmentroles } = window.getAacApi()

const {baseInfoMixin} = window.aacMixins

export default {
  name: 'RoleList',
  mixins: [baseInfoMixin,window.codelessMixins.customDialog],
  components: { roleListItem },
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleList: [],
      editorVisibled: false,
    }
  },
  computed: {
    defaultRoleList() {
      return this.roleList.filter(role => role.tenantId);
    },
    shareRoleList() {
      return this.roleList.filter(role => !role.tenantId);
    },
    //是否为超级管理员
    superAdmin(){
      return this.$store.state.user.currentData.superAdmin;
    },
    // 是否为项目管理员(不属于任何部门的租户用户)
    noAdmin(){
      return this.$store.state.user.currentData.department.length == 0;
    },
    //部门id
    curDepartmentid(){
      return this.$store.state.user.curDepartment.id || null;
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    changeRole(role) {
      this.$emit('input', role.id)
      this.$emit('change', { ...role })
    },
    deleteRole(role) { 
      deleteRole(role.id)
        .then(() => {
          const index = this.roleList.findIndex(item => role.id === item.id)
          const rechangeRole = this.roleList[index].id === this.value
          this.roleList.splice(index, 1)
          if (rechangeRole) {
            if (this.roleList.length > 0) {
              this.changeRole(this.roleList[0])
            } else {
              this.changeRole({})
            }
          }
          this.$notify({
            title: '删除角色成功',
            type: 'success'
          })
        })
        .catch(error => {
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    getRoleList() {
      if(!!this.superAdmin || !!this.noAdmin){
        getRoleList(this.global)
        .then(data => {
          
          this.roleList = data || [];
          if (!this.value && this.roleList.length > 0) {
            this.changeRole(this.roleList[0])
          }
        })
        .catch(error => {
          console.error(error)
          this.$notify({
            title: error,
            type: 'error'
          })
        })
      }else{
        // 获取部门角色
        getDepartmentroles({
          id:this.curDepartmentid
        }).then((res)=>{
          if(res.success){
            this.roleList = res.content;
            if(this.roleList.length > 0){
              this.changeRole(this.roleList[0])
            }
          }else{
            this.roleList = []
          }
        });
      }
    },
    addRole(role) {
      addRole(role)
        .then(res => {
          this.closeDialog()
          this.changeRole({
            ...role,
            id: res.id
          })
          this.getRoleList()
          this.$notify({
            title: '新增角色成功',
            type: 'success'
          })
        })
        .catch(error => {
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    closeDialog() {
      this.editorVisibled = false
    },
    openDialog() {
      // this.editorVisibled = true
            let self = this;
            self.openCustomDialog({
              title:'添加角色',
              path:'roleEditorConfirm',
              width:"616px",
              component:roleEditorConfirm,
              beforeConfirm:async($_dontCare,$el)=>{
                let closeDialog = await $el.submit();
                if(closeDialog){
                  self.addRole($el.roleForm) 
                }
                  
                return closeDialog
                 
              }
       })
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ebeef5;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  &-header {
    padding: 14px 16px;
    position: relative;
    // &::v-deep .el-button{
    //    background-image: linear-gradient(135deg, #4FBFFA 0%, #5361FF 100%) !important;
      
    // }
    &-title{
      font-size: 14px;
    }
    // &-title {
    //   font-size: 13px;
    //   color: #333;
    //   padding-left: 4px;
    //   font-weight: bold;
    //   margin-right: 10px;
    // }
  }
  &-wrapper {
    // height: 100%;
    overflow: overlay;
    padding:0;
    $line-color: rgb(53, 122, 160);
    #filter-line {
      content: '';
      display: block;
      height: 1px;
      width: 10px;
      background-color: $line-color;
    }
    &-filter {
      width: 100%;
      margin: 5px 0;
      display: flex;
      align-items: center;
      color: $line-color;
       padding-left: 16px;
        padding-right: 16px;
      // font-weight: bold;
      &::before {
        @extend #filter-line;
        margin-right: 5px;
      }
      &::after {
        @extend #filter-line;
        flex-grow: 1;
        margin-left: 5px;
      }
    }
  }
  &-footer {
    border-top: 1px solid rgb(231, 236, 239);
  }
  &-add-btn {
    padding: 12px 20px;
    font-size: 14px;
    color: #009aa6;
    cursor: pointer;
    flex-grow: 1;
    border-bottom: 1px solid rgb(231, 236, 239);

    &-text {
      padding-left: 5px;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.992);
    }
  }
}
</style>
