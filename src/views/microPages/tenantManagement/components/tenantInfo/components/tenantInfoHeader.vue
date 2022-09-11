<template>
  <div class="tenant-info-header" style='border-color:#EBEEF0'>
    <div class="tenant-info-header-item">
      <div class="tenant-info-header-item-icon">
        <folder-icon />
      </div>
      <div class="grow-1">
        <div class="tenant-info-header-item-title">{{ tenant.name }}</div>
        <div class="tenant-info-header-item-text light">{{ tenant.desc }}</div>
      </div>
      <el-button type="primary" @click="modify" round size='mini' icon='iconfont icon-bianji' class='self-start'>编辑</el-button>
    </div>
    <div class="tenant-info-header-item">
      <!-- <user-icon style="margin-right: 5px;width:14px;height:14px" /> -->
      <svg aria-hidden="true" class="icon svg-icon avatar">
        <use xlink:href="#icon-suoyouzhe"></use>
      </svg>
      <template v-if="tenant.ownerName">
        <div class="tenant-info-header-item-text bold">所有者:</div>
        <el-tooltip placement="top">
          <div slot="content">
            <div>用户名：{{ tenant.ownerName }}</div>
            <div>昵称：{{ tenant.ownerNickname }}</div>
          </div>
          <div
            class="tenant-info-header-item-text hover-border"
            style="margin-right: 16px; cursor: pointer"
          >
            {{ tenant.ownerNickname }}
          </div>
        </el-tooltip>
        <el-button type="text" icon="iconfont icon-biangeng" @click="relateOwner"
          >变更</el-button
        >
        <el-button
          type="text"
          icon="el-icon-delete"
          @click="cancelRelatedOwner"
        >删除
        </el-button>
        
      </template>
      <template v-else>
        <div
          class="tenant-info-header-item-text"
          style="margin-right: 22px"
        >
          未配置所有者
        </div>
        <el-button type="text" icon="iconfont icon-guanlianyonghu" @click="relateOwner"
          >关联</el-button
        >
        <el-button type="text" icon="el-icon-plus" @click="addUser"
          >添加</el-button
        >
      </template>
    </div>
  </div>
</template>

<script>
import folderIcon from '../../icon/folderIcon.vue'
import userIcon from '../../icon/userIcon.vue'
const { deleteOwner } = window.getAacApi()
export default {
  name: 'TenantInfoHeader',
  components: { folderIcon, userIcon },
  props: {
    tenant: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    addUser() {
      this.$emit('add-user')
    },
    cancelRelatedOwner() {
      this.$confirm('是否取关该所有者？','警告', {
        type: 'warning',
      }).then(() => {
        deleteOwner(this.tenant.id)
          .then(() => {
            this.$message.success('取关成功')
            this.tenant.ownerId = null
            this.tenant.ownerName = null
          })
          .catch(error => {
            this.$notify.error(error)
          })
      })
    },
    modify() {
      this.$emit('modify')
    },
    relateOwner() {
      this.$emit('relate-owner')
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-info-header {
  border-bottom: 1px solid #dddfe5;
  margin-bottom: 3px;
  &-item {
    display: flex;
    align-items: center;
    padding-bottom: 4px;

    ::v-deep .icon-bianji {
      font-size: 12px;
      margin-right: 4px;
    }

    ::v-deep .el-button--text{
     
      &.el-button+.el-button{
        margin-left:16px;
      }
      color:#4769B3;
      i{
        font-size: 14px;
      }
      span{
        margin-left:6px;
      }
    }

    .avatar{
      width:14px;
      height: 14px;
      margin-right:4px;
    }

    & > *.grow-1 {
      flex-grow: 1;
    }
    &-title {
      font-size: 14px;
      font-weight: bold;
      line-height:14px;
      margin-bottom:12px;
    }
    &-icon {
      margin-right: 14px;

     
        ::v-deep .icon {
          width: 24px;
          height: 24px;
        }
      
      // zoom: 2;
    }
    &-text {
      // padding-right: 5px;
      color:#333333;
      &.bold {
        font-weight: bold;
      }
      &.light {
        color: #7f8c93;
        line-height: 14px;
      }
      &.hover-border {
        border: 1px solid transparent;
        padding: 2px 5px;
        border-radius: 4px;
        &:hover {
          border: 1px solid #7f8c93;
        }
      }
    }
  }
}
</style>
