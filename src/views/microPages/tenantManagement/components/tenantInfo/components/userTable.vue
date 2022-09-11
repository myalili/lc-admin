<template>
  <base-table
    class="user-table"
    ref="table"
    :data="data"
    :columns="userColumns"
    v-on="$listeners"
  >
    <el-table-column slot="after-selection" width="15">
      <template slot-scope="{ row }">
        <el-tooltip
          v-if="row.status === '2'"
          effect="dark"
          content="用户已锁定"
          placement="top"
        >
          <i class="el-icon-lock" />
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="70">
      <div class="user-table-tools-box" slot-scope="{ $index, row }">
        <el-popover
          placement="bottom-end"
          :visible-arrow="false"
          trigger="hover"
        >
          <div class="user-table-popover">
            <div class="user-table-popover-item" @click="edit($index)">
              编辑
            </div>
            <div
              class="user-table-popover-item"
              @click="enableUser(row, $index)"
            >
              {{ row.status === '2' ? '解锁' : '锁定' }}
            </div>
            <div
              class="user-table-popover-item"
              @click="relateRole(row)"
            >
              关联角色
            </div>
            <div class="user-table-popover-item" @click="resetPasswd(row)">
              重置密码
            </div>
          </div>

          <div slot="reference">
            <i class="el-icon-more user-table-more-icon" @click.stop></i>
          </div>
        </el-popover>
      </div>
    </el-table-column>
    <related-role
      :visible.sync="relateDialogVisible"
      :tenantId="tenantId"
      :id="user.id"
      append-to-body
    />
  </base-table>
</template>

<script>
const {
  enableUser,
  resetPassword
} = window.getAacApi();
import userColumns from '../../../js/utils/userColumns'
import relatedRole from './relatedRole.vue'
import baseTable from './baseTable.vue'
export default {
  name: 'UserTable',
  inheritAttrs: false,
  components: {
    relatedRole,
    baseTable
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    tenantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userColumns: userColumns(),
      relateDialogVisible: false,
      user: {},
    }
  },
  methods: {
    edit(index) {
      this.$emit('edit-user', this.data[index])
    },
    resetPasswd(data) {
      this.$confirm('是否重置密码？', '提示', {
        type: 'warning'
      }).then(() => {
        resetPassword(data)
          .then(res => {
            this.$message.success(`重置成功，密码为：${res.password}`)
          })
          .catch(error => {
            this.$notify({
              title: error,
              type: 'error'
            })
          })
      })
    },
    enableUser(data, index) {
      const text = data.status === '2' ? '解锁' : '锁定'
      this.$confirm(`是否 ${text} 该用户`, '提示', {
        type: 'warning'
      }).then(() => {
        enableUser(data.id, data.status === '2')
          .then(() => {
            this.$message.success(text + '成功')
            this.data[index].status = data.status === '2' ? '1' : '2'
          })
          .catch(error => {
            this.$notify({
              title: error,
              type: 'error'
            })
          })
      })
    },
    relateRole(data) {
      this.user = data
      this.relateDialogVisible = true
    },
    clearSelection() {
      if (this.$refs.table) {
        this.$refs.table.clearSelection()
      }
    },
    toggleRowSelection(...agrs) {
      if (this.$refs.table) {
        this.$refs.table.toggleRowSelection(...agrs)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-table {
  &-tools-box {
    display: flex;
    align-items: center;
  }
  &-more-icon {
    font-size: 12px;
    margin-left: 10px;
  }
  &-popover {
    display: flex;
    flex-direction: column;
    &-item {
      padding: 10px 16px;
      cursor: pointer;
      color: #333333;
      user-select: none;
      &:hover {
        background-color: #eff7fb;
      }
      &:active {
        background-color: #e2ebf0;
      }
    }
  }
}
</style>
