<template>
  <el-container class="user-and-role-choose">
    <el-main style="padding:0 20px;max-height:420px">
      <el-tabs type="card" v-model="tabName">
        <el-tab-pane label="用户列表" name="user">
          <UserTable v-model="user" :type="type" />
        </el-tab-pane>
        <el-tab-pane v-if="!hideRoleTab" label="角色列表" name="role">
          <RoleTable v-model="role" :type="type" />
        </el-tab-pane>
        <el-tab-pane label="表达式" name="expression">
          <el-input v-model="expression" placeholder="请输入表达式" style="margin-bottom:20px" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer style="text-align: center;height:50px">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleAdd" :loading="confirming">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import UserTable from './UserTable';
import RoleTable from './RoleTable';
// import { queryRoleUsers } from '@/api/authApi';

// import { getAuthResponse } from '@/utils/response';
const {queryRoleUsers} = window.getAacApi();
export default {
  mixins:[window.V8.mixins],
  name: 'UserAndRoleChoose',
  components: {
    UserTable,
    RoleTable
  },
  props: {
    type: String,
    useronly: Boolean,
    hideRoleTab: Boolean,
    value: [Object, Array]
  },
  data() {
    return {
      tabName: 'user',
      user: null,
      role: null,
      expression: '',
      confirming: false
    };
  },
  methods: {
    async handleAdd() {
      if (!this[this.tabName]) {
        this.$message({ type: 'warning', message: '请选择' });
        return;
      }
      this.confirming = true;
      const temp = [];
      if (this.type === 'radio') {
        if (this.tabName === 'expression') {
          if (this.expression) {
            temp.push({ expression: this.expression });
          }
        } else if (this.tabName === 'user') {
          temp.push({
            userCode: this.user.id,
            userName: this.user.nickname,
            tenant: this.user.tenant
          });
        } else {
          if (this.useronly) {
            try {
              // const res = await getAuthResponse(queryRoleUsers(this.role.id));
              const res = await queryRoleUsers(this.role.id);
              const users =
                res?.map(item => ({
                  userCode: item.id,
                  userName: item.nickname,
                  tenant: this.role.tenant
                })) ?? [];
              temp.push(...users);
            } catch (err) {
              console.error(err);
            }
          } else {
            temp.push({
              roleCode: this.role.id,
              roleName: this.role.name,
              tenant: this.role.tenant
            });
          }
        }
      } else {
        if (this.tabName === 'expression') {
          if (this.expression) {
            temp.push({ expression: this.expression });
          }
        } else {
          temp.push(
            ...(this.user?.map(item => ({
              userCode: item.id,
              userName: item.nickname,
              tenant: item.tenant
            })) ?? [])
          );
          if (this.useronly) {
            for (let i = 0; i < this.role?.length; i++) {
              try {
                // const res = await getAuthResponse(queryRoleUsers(this.role[i].id));
                const res = await queryRoleUsers(this.role[i].id);
                const users =
                  res?.map(item => ({
                    userCode: item.id,
                    userName: item.nickname,
                    tenant: this.role[i].tenant
                  })) ?? [];
                temp.push(...users);
              } catch (err) {
                console.error(err);
              }
            }
          } else {
            temp.push(
              ...(this.role?.map(item => ({
                roleCode: item.id,
                roleName: item.name,
                tenant: item.tenant
              })) ?? [])
            );
          }
        }
      }
      // this.$store.commit('callback', { name: 'confirm', arg: temp });
      this.$root.confirm(temp)
      // this.close();
      this.confirming = false;
    }
  }
};
</script>

<style lang="less">
.user-and-role-choose {
  .el-tabs__item {
    height: 32px !important;
    line-height: 32px !important;
  }
  .el-tabs__item:last-child {
    border-right: none !important;
  }
  .el-tabs__header {
    margin-bottom: 0 !important;
  }
  .el-tabs__content {
    padding-top: 10px !important;
    .el-form-item {
      margin: 0 10px 10px 0;
    }
  }
}
</style>
