<template>
  <div class="tenant-user-list">
    <div class="tenant-user-list-header">
      <el-button type="text" icon="el-icon-plus" @click="addUser">
        添加用户
      </el-button>
      <el-button
        type="text"
        icon="iconfont icon-guanlianyonghu"
        @click="emitRelateUserEvent"
        >关联用户</el-button
      >
      <el-button
        v-show="selectedList.length > 0"
        type="text"
        icon="el-icon-close"
        @click="cancelRelatedUser"
      >
        取消关联
      </el-button>
    </div>
    <div class="tenant-user-list-content">
      <user-table
        ref="table"
        :tenantId="tenantId"
        :data="userList"
        @edit-user="editUser"
        @selection-change="selectionChange"
        @row-click="changeSelected"
      />
    </div>
  </div>
</template>

<script>
const { getRelatedUser, relateUser } = window.getAacApi()
import userTable from './userTable.vue'
const {
  listToMap
} = window.codelessUtils;
export default {
  name: 'TenantUserList',
  components: { userTable },
  props: {
    tenantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedList: [],
      userList: []
    }
  },
  watch: {
    tenantId: {
      handler(val) {
        if (!val) {
          return
        }
        this.getUserList()
      },
      immediate: true
    }
  },
  methods: {
    getUserList() {
      getRelatedUser(this.tenantId)
        .then(data => {
          this.selectedList = []
          this.userList = data
          if (this.$refs.table) {
            this.$refs.table.clearSelection()
          }
        })
        .catch(error => {
          this.$notify.error(error)
        })
    },
    selectionChange(list) {
      this.selectedList = list
    },
    editUser(data) {
      this.$emit('edit-user', data)
    },
    addUser() {
      this.$emit('add-user')
    },
    emitRelateUserEvent() {
      this.$emit('relate-user', this.userList)
    },
    cancelRelatedUser() {
      this.$confirm('是否取关选中用户', '提示', {
        type: 'warning'
      }).then(() => {
        const listMap = listToMap(this.selectedList)
        const relateList = this.userList
          .filter(item => !listMap[item.id])
          .map(item => item.id)
        this.relateUser(relateList)
      })
    },
    relateUser(list) {
      relateUser(this.tenantId, list)
        .then(() => {
          this.$message.success('操作成功')
          this.getUserList()
        })
        .catch(error => {
          this.$notify.error(error)
        })
    },
    changeSelected(row) {
      this.$refs.table.toggleRowSelection(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-user-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  &-header{
    padding-bottom:3px;
    border-bottom:1px solid #EBEEF0;

    ::v-deep .el-button+.el-button{
      margin-left:30px;
    }

    ::v-deep .icon-guanlianyonghu{
      font-size:14px;
      margin-right:6px;
    }

  }
  &-content {
    height: 100%;
    // width: 100%;
    // flex-grow: 1;
    overflow: hidden;
  }
}
</style>
