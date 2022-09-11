<!-- 用户、角色单选弹框 -->
<template>
  <el-container class="user-and-role-choose">
    <el-main style="padding-top:0;max-height:420px">
      <el-tabs type="card" v-model="tabActiveName">
        <template v-for="(item, index) in list">
          <el-tab-pane v-if="item.type === 'USER'" :key="item.id" :name="'' + index" :label="item.name">
            <SystemApiUserTable v-model="item.selected" :systemApiId="item.id" :type="type" />
          </el-tab-pane>
          <el-tab-pane
            v-if="item.type === 'ROLE' && !useronly && !hideRoleTab"
            :key="item.id"
            :name="'' + index"
            :label="item.name"
          >
            <SystemApiRoleTable v-model="item.selected" :systemApiId="item.id" :type="type" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-main>
    <el-footer style="text-align: right;height:50px">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleAdd">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import SystemApiUserTable from './SystemApiUserTable';
import SystemApiRoleTable from './SystemApiRoleTable';

import { mapState, mapActions } from 'vuex';
const moduleName = 'systemApi';

export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  components: {
    SystemApiUserTable,
    SystemApiRoleTable
  },
  props: {
    type: String,
    useronly: {
      type: Boolean,
      default: false
    },
    hideRoleTab: {
      type: Boolean,
      default: false
    },
    value: {}
  },
  data() {
    return {
      tabActiveName: '0'
    };
  },
  computed: {
    ...mapState(moduleName, ['list', 'listLoading'])
  },
  created() {
    this.loadList();
  },
  methods: {
    ...mapActions(moduleName, ['load']),
    async loadList() {
      try {
        await this.load();
        this.list.forEach((item, index) => {
          this.$set(item, 'selected', null);
          if (item.type === 'USER' || (item.type === 'ROLE' && !this.useronly && !this.hideRoleTab)) {
            this.tabActiveName = `${index}`;
          }
        });
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
    handleAdd() {
      const userAndRoles = [];
      if (this.type === 'radio') {
        const type = this.list[parseInt(this.tabActiveName)].type;
        const selected = this.list[parseInt(this.tabActiveName)].selected;
        if (type === 'USER' && selected) {
          userAndRoles.push({
            userCode: selected.id,
            userName: selected.nickname ?? selected.name
          });
        }
        if (type === 'ROLE' && selected) {
          userAndRoles.push({
            roleCode: selected.id,
            roleName: selected.name
          });
        }
      }
      if (this.type === 'checkbox') {
        this.list.forEach(item => {
          const type = item.type;
          item.selected?.forEach?.(temp => {
            if (type === 'USER') {
              userAndRoles.push({
                userCode: temp.id,
                userName: temp.nickname ?? temp.name
              });
            }
            if (type === 'ROLE') {
              userAndRoles.push({
                roleCode: temp.id,
                roleName: temp.name
              });
            }
          });
        });
      }
      // this.$store.commit('callback', { name: 'confirm', arg: userAndRoles });
      this.$root.confirm(userAndRoles);
      // this.close();
    }
  }
};
</script>

<style lang="less">
.user-and-role-choose {
  .el-tabs__header {
    margin: 10px 0;
  }
  .el-tabs__item {
    height: 32px !important;
    line-height: 32px !important;
  }
  .el-tabs__item:last-child {
    border-right: none !important;
  }
  .el-tabs__content {
    padding-top: 10px !important;
  }
  .el-form-item {
    margin: 10px 10px 10px 0;
  }
}
</style>
