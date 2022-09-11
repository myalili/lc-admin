<template>
  <el-container>
    <el-main class="transactor-choose">
      <el-form :model="transactor" size="mini" ref="ruleForm" label-width="80px">
        <el-form-item label="转办人" prop="name">
          <template v-if="assignees.length">
            <el-tag
              v-for="(item, index) in assignees"
              :key="item.id"
              plain
              closable
              size="medium"
              @close="assignees.splice(index, 1)"
              style="margin-right: 10px"
            >
              <span v-if="item.hasOwnProperty('userCode')">{{ item.userName }}</span>
              <span v-else-if="item.hasOwnProperty('groupCode')">{{ item.groupName }}</span>
              <span v-else-if="item.hasOwnProperty('roleCode')">{{ item.roleName }}</span>
              <span v-else-if="item.hasOwnProperty('expression')">{{ item.expression }}</span>
            </el-tag>
          </template>
          <el-button @click="toAssigneeChoose()" :disabled="assignees.length >= 1">选择处理人</el-button>
        </el-form-item>
        <el-form-item label="转办意见" prop="description">
          <el-input
            v-model="transactor.description"
            type="textarea"
            :autosize="{ minRows: 7 }"
            maxlength="256"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleAdd" :loading="loading">确定</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  data() {
    return {
      assignees: [],
      transactor: {
        name: '',
        description: ''
      },
      loading: false
    };
  },
  methods: {
    ...mapActions('lpTodoTask', ['turn']),
    // 弹框选择处理人
    toAssigneeChoose() {
      this.open({
        title: '选择处理人',
        path: '/AssigneeChoose',
        component: Vue.options.components.AssigneeChoose,
        customClass: 'aops-el-common assignee-choose-dialog lynn',
        width: '700px',
        height:"auto",
        type: 'SUB',
        params: {
          type: 'radio',
          useronly: true,
          hideRoleTab: true,
          value: this.assignees
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: selected => {
          this.assignees = selected;
        }
      });
    },
    // 获取选择后的UmCode
    getUmCode() {
      let selectedAssignee = this.assignees.length ? this.assignees[0] : null;
      if (selectedAssignee) {
        let targetCode = '';
        if (selectedAssignee.hasOwnProperty('userCode')) {
          targetCode = selectedAssignee.userCode;
        } else if (selectedAssignee.hasOwnProperty('groupCode')) {
          targetCode = 'G_' + selectedAssignee.groupCode;
        } else if (selectedAssignee.hasOwnProperty('roleCode')) {
          targetCode = 'R_' + selectedAssignee.roleCode;
        } else if (selectedAssignee.hasOwnProperty('expression')) {
          targetCode = selectedAssignee.expression;
        }
        return targetCode;
      } else {
        return '';
      }
    },
    async handleAdd() {
      let umCode = this.getUmCode();
      if (!umCode) {
        this.$message({ type: 'warning', message: '您还未选择转办人' });
        return;
      }
      this.loading = true;
      try {
        const params = {
          assignee: umCode,
          description: this.transactor.description
        };
        await this.turn({
          clusterId: this.AParams.clusterId,
          taskId: this.AParams.taskId,
          params
        });
        // this.$store.commit('callback', { name: 'success' });
        this.$root.confirm()
        // this.close();
      } catch (err) {
        this.$message.error('转办失败:' + err);
      }
      this.loading = false;
    }
  }
};
</script>
