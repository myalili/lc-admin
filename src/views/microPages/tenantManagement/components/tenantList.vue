<template>
  <div class="tenant-list">
    <div class="tenant-list-header">
      <!-- <span class="tenant-list-header-text">{{ title }}</span> -->
      <button class="tenant-list-header-add-button bg-primary" @click="addNode" >
        <i class="el-icon-plus" />租户
      </button>
    </div>
    <div class="tenant-list-content">
      <resource-tree-base
        ref="tree"
        :data="tenantList"
        v-bind="$attrs"
        v-on="$listeners"
        @node-click="nodeClick"
        @node-contextmenu="openRightMenu"
      >
        <div class="tenant-list-content-node" slot-scope="{ data }">
          <folder-icon class="node-icon" />
          <span class="node-text">{{ data.name }}</span>
          <div v-if="iconMenu" class="tenant-list-content-node-menu">
            <el-button
              class="tenant-list-content-node-menu-button"
              type="text"
              icon="el-icon-plus"
              title="添加子租户"
              @click.stop="addChildNodeByIcon(data)"
            />
            <el-button
              class="tenant-list-content-node-menu-button"
              type="text"
              icon="el-icon-delete"
              title="删除租户"
              @click.stop="deleteNodeByIcon(data)"
            />
            <el-button
              class="tenant-list-content-node-menu-button"
              type="text"
              icon="el-icon-edit"
              title="编辑租户"
              @click.stop="modifyNodeByIcon(data)"
            />
          </div>
        </div>
      </resource-tree-base>
    </div>
    <div v-if="!iconMenu" class="tenant-list-footer">
      <i class="el-icon-info" />
      右键单击菜单，可执行更多
    </div>
    <contextmenu-pannel ref="contextmenu">
      <p v-if="menuList.length === 0" class="empty-contextmenu">无操作选项</p>
      <template v-else>
        <p v-for="item in menuList" :key="item">
          <el-button type="text" @click="menuListMap[item].handler">{{
            menuListMap[item].label
          }}</el-button>
        </p>
      </template>
    </contextmenu-pannel>
  </div>
</template>

<script>
const { getTenantList, deleteTenant } = window.getAacApi();
import resourceTreeBase from './resourceTreeBase.vue'
import folderIcon from './icon/folderIcon.vue'
import contextmenuPannel from './contextmenuPannel.vue'
const {
   listToTree, 
   treeFindNode
} = window.aacUtils
export default {
  name: 'TenantList',
  inheritAttrs: false,
  components: { resourceTreeBase, folderIcon, contextmenuPannel },
  props: {
    title: {
      type: String,
      default: ''
    },
    iconMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tenantList: [],
      selectedNode: {},
      contextNodeData: {},
      menuListMap: {
        delete: {
          label: '删除租户',
          handler: this.deleteNode
        },
        modify: {
          label: '编辑租户',
          handler: this.modifyNode
        },
        add: {
          label: '添加租户',
          handler: this.addNode
        },
        addChild: {
          label: '添加子租户',
          handler: this.addChildNode
        }
      },
      menuList: []
    }
  },
  mounted() {
    this.getTenantList()
  },
  methods: {
    getTenantList(defaultSelecetId) {
      getTenantList()
        .then(list => {
          this.tenantList = listToTree(list)
          if (this.tenantList.length > 0) {
            if (defaultSelecetId) {
              // 查出这个id对应的节点
              const node = treeFindNode(
                this.tenantList,
                item => item.id === defaultSelecetId
              )
              if (node) {
                this.selectedNode = node
              }
            }
            if (!this.selectedNode.id || !list.some(item => item.id === this.selectedNode.id)) {
              this.selectedNode = this.tenantList[0]
            }
          }
          if (this.selectedNode.id) {
            this.nodeClick(this.selectedNode)
            this.$nextTick(() => {
              if (this.$refs.tree) {
                this.$refs.tree.setCurrentKey(this.selectedNode.id)
              }
            })
          }
        })
        .catch(error => {
          console.error(error)
          this.$notify.error(error)
        })
    },
    nodeClick(node) {
      this.selectedNode = node
      this.$emit('node-click', node)
    },
    openRightMenu(event, data) {
      if (this.iconMenu) {
        return false
      }
      this.contextNodeData = data
      this.menuList = ['addChild', 'delete', 'modify']
      this.$refs.contextmenu.showByMouseEvent(event)
    },
    contextmenu(event) {
      this.menuList = ['add']
      this.$refs.contextmenu.showByMouseEvent(event)
    },
    deleteTenant(id) {
      deleteTenant(id)
        .then(() => {
          this.$message.success('删除成功')
          if (id === this.selectedNode.id) {
            this.selectedNode = {}
          }
          this.getTenantList()
        })
        .catch(error => {
          this.$notify.error(error)
        })
    },
    deleteNode() {
      this.$confirm('是否删除该租户', '提示', {
        type: 'warning'
      }).then(() => {
        this.deleteTenant(this.contextNodeData.id)
      })
    },
    modifyNode() {
      this.$emit('modify', this.contextNodeData)
    },
    addNode() {
      this.$emit('add')
    },
    addChildNode() {
      this.$emit('add-child', this.contextNodeData.id)
    },
    addChildNodeByIcon(data) {
      this.contextNodeData = data
      this.addChildNode()
    },
    deleteNodeByIcon(data) {
      this.contextNodeData = data
      this.deleteNode()
    },
    modifyNodeByIcon(data) {
      this.contextNodeData = data
      this.modifyNode()
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  .node-text {
    padding-left: 5px;
  }
  &-header {
    display: flex;
    align-items: center;
    padding: 16px;
    &-text {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
      margin-right: 10px;
    }
    &-add-button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 222px;
      padding:8px 12px;
      font-size:12px;
      line-height: 14px;
      font-weight: 500;
      height: 28px;
      color: #ffffff;
      // background-image: linear-gradient(135deg, #4fbffa 0%, #5361ff 100%);
      // width: 25px;
      // height: 25px;
      // border-radius: 100%;
      border: none;
      cursor: pointer;
      //background-color: #07b6b5;
      // &:hover {
      //   background-color: #39c5c4;
      // }
      i {
        margin-right: 4px;
        font-size: 12px;
      }
    }
  }
  &-content {
    position: relative;
    flex-grow: 1;
    height: 100%;
    width: 100%;
    overflow: auto;
    overflow-y: overlay;
    // padding: 14px 0;
    &-node {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      ::v-deep .icon {
        display: inline-block;
        width: 14px;
        height: 14px;
      }
      &-menu {
        position: absolute;
        padding-right: 10px;
        right: 0;
        top: 0;
        // display: flex;
        display: none;
        height: 100%;
        align-items: center;
        &-button {
          padding: 2px;
          &:hover {
            background-color: #b5e9e9;
          }
          &:active {
            background-color: #ccf3f3;
          }
        }
        &-button + &-button {
          margin-left: 2px;
        }
      }
    }
    ::v-deep {
      .el-tree-node__content:hover {
        .tenant-list-content-node-menu {
          display: flex;
        }
      }
    }
  }
  &-footer {
    // background: #E6F4FF;
    background: #eff7fb;
    text-align: center;
    // color: rgb(102, 179, 255);
    color: #07b5b5;
    padding: 10px;
  }
}
</style>
