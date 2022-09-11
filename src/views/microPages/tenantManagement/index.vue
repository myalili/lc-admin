<template>
  <div class="tenant-manager">
    <div class="tenant-manager-aside">
      <tenant-list
        ref="list"
        :title="title"
        :icon-menu="iconMenu"
        @node-click="nodeClick"
        @add="addNode"
        @add-child="addChildNode"
        @modify="modifyInfo"
      />
    </div>
    <div class="tenant-manager-content">
      <tenant-info v-if="tenant.id" :tenant="tenant" @modify="modifyInfo" />
    </div>
    <tenant-editor-dialog
      :visible.sync="dialogVisibled"
      :data="editorData"
      :is-edit="isEdit"
      :loading="editorLoading"
      @submit="editorSubmit"
    />
  </div>
</template>

<script>
import tenantList from './components/tenantList.vue'
import tenantEditorDialog from './components/tenantEditorDialog.vue'
import tenantInfo from './components/tenantInfo/tenantInfo.vue'
const { modifyTenant, addTenant } = window.getAacApi()
export default {
  name: 'TenantManager',
  components: { tenantList, tenantInfo, tenantEditorDialog },
  // props: {
  //   title: {
  //     type: String,
  //     default: '租户管理'
  //   },
  //   iconMenu: {
  //     type: Boolean,
  //     default: false, 
  //   }
  // },
  data() {
    return {
      title:'租户管理',
      iconMenu: true,
      tenant: {},
      dialogVisibled: false,
      editorData: {},
      isEdit: false,
      editorLoading: false
    }
  },
  methods: {
    nodeClick(node) {
      this.tenant = node
    },
    addNode() {
      this.editorData = {}
      this.isEdit = false
      this.dialogVisibled = true
    },
    addChildNode(parentId) {
      this.editorData = { parentId }
      this.isEdit = false
      this.dialogVisibled = true
    },
    modifyInfo(data) {
      this.editorData = data;
      this.isEdit = true;
      this.dialogVisibled = true;
    },
    closeEditor() {
      this.dialogVisibled = false
      this.editorLoading = false
    },
    editorSubmit(data) {
      if (this.isEdit) {
        this.modifyTenant({
          name: data.name,
          desc: data.desc,
          id: this.editorData.id
        })
      } else {
        this.addTenant({
          name: data.name,
          desc: data.desc,
          parentId: this.editorData.parentId
        })
      }
    },
    modifyTenant(data) {
      this.editorLoading = true
      modifyTenant(data)
        .then(() => {
          this.$message.success('修改成功')
          this.editorData.name = data.name
          this.editorData.desc = data.desc
          this.closeEditor()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.editorLoading = false
        })
    },
    addTenant(data) {
      this.editorLoading = true
      addTenant(data)
        .then(res => {
          this.$message.success('添加成功')
          if (this.$refs.list) {
            this.$refs.list.getTenantList(res.id)
          }
          this.closeEditor()
        })
        .catch(error => {
          this.$notify.error(error)
        })
        .finally(() => {
          this.editorLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-manager {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  background-color: #ffffff !important;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &-aside {
    width: 314px;
    height: 100%;
    border-right: 1px solid #ebeef0;
  }
  &-content {
    flex: 1;
    height: 100%;
    // width: 100%;
    // flex-grow: 1;
    overflow: hidden;
  }
}
</style>
