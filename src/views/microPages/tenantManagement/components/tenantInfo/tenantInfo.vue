<template>
  <div class="tenant-info">
    <tenant-info-header
      :key="headerKey"
      :tenant="tenant"
      @add-user="handleHeaderAddUser"
      @modify="modifyInfo"
      @relate-owner="handleRelateOwner"
    />
    <div class="tenant-info-content">
      <tenant-user-list
        :key="userListKey"
        :tenant-id="tenant.id"
        @add-user="handleUserListAddUser"
        @relate-user="handleRelateUser"
        @edit-user="toEditUser"
      />
    </div>
    <user-editor-dialog
      :visible.sync="userEditorVisibled"
      :loading="editorLoading"
      :type="relateType"
      :isEdit="isEdit"
      :data="editData"
      @submit="handleUserEditorSubmit"
    />
    <users-dialog
      :visible.sync="usersDialogVisibled"
      :type="relateType"
      :defaultSelectedList="defaultSelectedList"
      :loading="selectedLoading"
      @submit="relateUsers"
    />
  </div>
</template>

<script>
import tenantInfoHeader from './components/tenantInfoHeader.vue'
import tenantUserList from './components/tenantUserList.vue'
import userEditorDialog from './components/userEditorDialog.vue'

const {
  addTenantUser,
  createOwner,
  relateUser,
  relateOwner,
  updateUser
} = window.getAacApi()
import UsersDialog from './components/usersDialog.vue'
export default {
  name: 'TenantInfo',
  components: {
    tenantInfoHeader,
    tenantUserList,
    userEditorDialog,
    UsersDialog
  },
  props: {
    tenant: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      userEditorVisibled: false,
      editorLoading: false,
      userListKey: new Date().getTime(),
      headerKey: new Date().getTime(),
      usersDialogVisibled: false,
      relateType: 'user',
      defaultSelectedList: [],
      selectedLoading: false,
      isEdit: false,
      editData: {}
    }
  },
  methods: {
    refreshUserList() {
      this.userListKey = new Date().getTime()
    },
    refreshHeader() {
      this.headerKey = new Date().getTime()
    },
    openUserEditor() {
      this.userEditorVisibled = true
      this.editorLoading = false
    },
    closeUserEditor() {
      this.userEditorVisibled = false
      this.editorLoading = false
    },
    addUser(data) {
      this.editorLoading = true
      addTenantUser(this.tenant.id, data)
        .then(() => {
          this.$message.success('添加成功')
          this.closeUserEditor()
          this.refreshUserList()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.editorLoading = false
        })
    },
    createOwner(data) {
      this.editorLoading = true
      console.log('这里',data);
      createOwner(this.tenant.id, data)
        .then(() => {
          this.$message.success('添加成功')
          this.tenant.ownerName = data.name
          this.tenant.ownerNickname = data.nickname
          this.closeUserEditor()
          this.refreshUserList()
          this.refreshHeader()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.editorLoading = false
        })
    },

    modifyUser(data) {
      this.editorLoading = true
      const { nickname, phone, desc, email } = data
      updateUser({
        id: this.editData.id,
        name: this.editData.name,
        nickname,
        phone,
        desc,
        email
      })
        .then(() => {
          this.$message.success('修改成功')
          this.closeUserEditor()
          this.editData.nickname = nickname
          this.editData.phone = phone
          this.editData.email = email
          this.editData.desc = desc
          if (this.tenant.ownerName === data.name) {
            this.tenant.ownerNickname = data.nickname
          }
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.editorLoading = false
        })
    },
    toEditUser(data) {
      this.relateType = 'user'
      this.editData = data
      this.isEdit = true
      this.openUserEditor()
    },
    handleUserListAddUser() {
      this.relateType = 'user'
      this.editData = {}
      this.isEdit = false
      this.openUserEditor()
    },
    handleHeaderAddUser() {
      this.relateType = 'owner'
      this.editData = {}
      this.isEdit = false
      this.openUserEditor()
    },
    handleUserEditorSubmit(data) {
      switch (this.relateType) {
        case 'user':
          if (this.isEdit) {
            return this.modifyUser(data)
          }
          return this.addUser(data)
        case 'owner':
          return this.createOwner(data)
      }
    },
    modifyInfo() {
      this.$emit('modify', this.tenant)
    },
    openUsersDialog() {
      this.usersDialogVisibled = true
    },
    closeUsersDialog() {
      this.usersDialogVisibled = false
    },
    handleRelateOwner() {
      this.relateType = 'owner'
      if (this.tenant.ownerName) {
        this.defaultSelectedList = [
          {
            name: this.tenant.ownerName,
            nickname: this.tenant.ownerNickname
          }
        ]
      } else {
        this.defaultSelectedList = []
      }
      this.openUsersDialog()
    },
    handleRelateUser(userList) {
      this.relateType = 'user'
      this.defaultSelectedList = userList
      this.openUsersDialog()
    },
    relateUsers(selectedList) {
      if (this.relateType == 'user') {
        this.relateUser(selectedList)
      } else {
        this.relateOwner(selectedList[0])
      }
    },
    relateOwner(owner) {
      if (!owner) {
        this.closeUsersDialog()
        return
      }
      if (owner.name === this.tenant.ownerName) {
        return this.$message.success('关联成功')
      }
      this.selectedLoading = true
      relateOwner(this.tenant.id, owner.id)
        .then(() => {
          this.$message.success('关联成功')
          this.tenant.ownerName = owner.name
          this.tenant.ownerNickname = owner.nickname
          this.tenant.ownerId = owner.id
          this.closeUsersDialog()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.selectedLoading = false
        })
    },
    relateUser(selectedList) {
      if (!selectedList) {
        this.closeUsersDialog()
        return
      }
      this.selectedLoading = true
      relateUser(
        this.tenant.id,
        selectedList.map(item => item.id)
      )
        .then(() => {
          this.$message.success('关联成功')
          this.refreshUserList()
          this.closeUsersDialog()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.selectedLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-info {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 100%;
  width: 100%;
  &-content {
   height: 100%;
    // width: 100%;
    // flex-grow: 1;
    overflow: hidden;
  }
}
</style>
