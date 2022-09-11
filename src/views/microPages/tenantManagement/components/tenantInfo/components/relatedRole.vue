<template>
  <el-dialog
    class="related-role"
    title="关联角色"
    v-bind="$attrs"
    v-on="$listeners"
    @open="dialogOpen"
  >
    <base-table
      ref="table"
      class="dailog-content"
      :data="roleList"
      :showCustomColumns="false"
      :columns="columns"
      :selectable="row => row.type !== '1'"
      @selection-change="selectedChange"
      @row-click="changeSelected"
    />
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="relateRole"
        :disabled="selectedList.length === 0"
      >
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
const { getRoleListByTenantId,getUserReRole,userReRole} = window.getAacApi()
import dayjs from 'dayjs'
import baseTable from './baseTable.vue'

const {
  listToMap
} = window.codelessUtils

export default {
  name: 'RelatedRole',
  inheritAttrs: false,
  components: {
    baseTable
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    tenantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleList: [],
      columns: [
        {
          prop: 'name',
          label: '角色名称',
          sortable: true,
          // minWidth: '160',
          showOverflowTooltip: true
        },
        {
          prop: 'createUserName',
          label: '创建人',
          sortable: true,
          // minWidth: '120',
          showOverflowTooltip: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: true,
          // minWidth: '160',
          showOverflowTooltip: true
        },
        {
          prop: 'desc',
          label: '描述',
          // minWidth: '200',
          showOverflowTooltip: true
        }
      ],
      selectedList: [],
      loading: false
    }
  },
  watch: {
    tenantId: {
      handler(val) {
        this.roleList = []
        if (!val) {
          return
        }
        this.getRoleList()
      },
      immediate: true
    }
  },
  computed: {
    roleListMap() {
      return listToMap(this.roleList)
    }
  },
  methods: {
    getRoleList() {
      return getRoleListByTenantId(this.tenantId)
        .then(data => {
          this.roleList = data.map(item => {
            if (item.createTime) {
              item.createTime = dayjs(Number(item.createTime)).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            } else {
              item.createTime = '-'
            }
            return item
          })
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    closeDialog() {
      this.$emit('update:visible')
    },
    clearSelection() {
      if (this.$refs.table) {
        this.$refs.table.clearSelection()
      }
      this.selectedList = []
    },
    dialogOpen() {
      this.clearSelection()
      this.getRoleById()
    },
    toggleRowSelection(...args) {
      if (this.$refs.table) {
        this.$refs.table.toggleRowSelection(...args)
      }
    },
    getRoleById() {
      getUserReRole({id:this.id,tenantId:this.tenantId})
        .then(res => {
          let {content,success}=res;
          if(success){
            this.selectedList = []
            content.forEach(role => {
            this.toggleRowSelection(this.roleListMap[role.id])
            this.selectedList.push(role)
          })
          }else{
            throw(res)
          }
          
        })
        .catch(error => {
          console.error(error)
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    relateRole() {
      const roleList = this.selectedList.map(item => item.id)
      this.loading = true
      userReRole({id:this.id, ids:roleList,tenantId:this.tenantId})
        .then((res) => {
          if(res.success){
             this.$message.success('关联成功')
            this.closeDialog()
          }else{
            throw(res)
          }
         
        })
        .catch(error => {
          console.error(error)
          this.$notify({
            title: error,
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    selectedChange(selectedList) {
      this.selectedList = selectedList
    },
    changeSelected(data) {
      if (data.type === '1') {
        return
      }
      this.toggleRowSelection(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.related-role {
  ::v-deep {
    .el-dialog__body {
      padding: 0;
    }
  }
}
.dailog-content {
  height: 60vh;
}
</style>
