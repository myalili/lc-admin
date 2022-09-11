<!-- 处理人显示框 -->
<template>
  <div class="countersign-selected-panel">
    <el-button @click="openAssigneeDig()" :disabled="readonly">选择</el-button>
    <el-button
      style="margin-left: 13px"
      v-if="execType === 'sequential' && assigneeList && assigneeList.length"
      @click="sortAssigneeList()"
      :disabled="readonly"
      >排序</el-button
    >
    <ul class="assignee-ul">
      <li v-for="(item, index) in list" :key="index">
        <div>
          <span>{{ item }}</span>
          <i class="el-icon-close item-delete" @click="assigneeDelete(index)"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AssigneeListSort from "../../chore/AssigneeListSort"
export default {
  mixins:[window.V8.mixins],
  name: 'CounterSignAssigneeSelected',
  props: {
    value: String,
    assigneeList: Array,
    execType: String,
    type: {
      type: String,
      default: 'radio' // radio, checkbox
    },
    useronly: Boolean,
    readonly: Boolean,
    hideRoleTab: Boolean
  },
  computed: {
    list() {
      const list = this.value?.split(',')?.filter(item => item) ?? [];
      const codeToName = {};
      this.assigneeList?.forEach(item => {
        if (item.userCode) {
          codeToName[item.userCode] = item.userName;
        } else if (item.roleCode) {
          codeToName[item.roleCode] = item.roleName;
          codeToName[`R_${item.roleCode}`] = item.roleName;
        }
      });
      return list.map(item => `${item}${codeToName[item] ? ` -- ${codeToName[item]}` : ''}`);
    }
  },
  methods: {
    openAssigneeDig() {
      this.open({
        title: '选择处理人',
        path: '/AssigneeChoose',
        component: Vue.options.components.AssigneeChoose,
        customClass: 'aops-el-common assignee-choose-dialog lynn',
        width: '700px',
        type: 'SUB',
        params: {
          type: this.type,
          useronly: this.useronly,
          value: this.assigneeList,
          hideRoleTab: this.hideRoleTab
        },
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        confirmCallback: params => {
          const str = params
            .map(item => {
              if (item.roleCode) {
                return `R_${item.roleCode}`;
              } else if (item.userCode) {
                return item.userCode;
              } else {
                return item.expression;
              }
            })
            .join(',');
          this.$emit('input', str);
          this.$emit('update:assigneeList', params);
        }
      });
    },
    assigneeDelete(index) {
      this.assigneeList.splice(index, 1);
      const list = this.value?.split(',') ?? [];
      list.splice(index, 1);
      this.$emit('input', list.join(','));
    },
    sortAssigneeList() {
      this.open({
        title: '处理人排序',
        path: '/SortAssigneeList',
        component:AssigneeListSort,
        // page: 'microPages/process/components/chore/AssigneeListSort',
        customClass: 'aops-el-common',
        width: '700px',
        type: 'SUB',
        params: {
          usersData: this.assigneeList
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: params => {
          const str = params
            .map(item => {
              if (item.roleCode) {
                return `R_${item.roleCode}`;
              } else if (item.userCode) {
                return item.userCode;
              } else {
                return item.expression;
              }
            })
            .join(',');
          this.$emit('input', str);
          this.$emit('update:assigneeList', params);
        }
      });
      this.$emit('sortAssigneeList');
    }
  }
};
</script>

<style lang="scss" scoped>
.countersign-selected-panel {
  .assignee-ul {
    list-style: none;
    margin-top: 6px;
    padding: 2px 0 2px 0px;
    border: 1px solid #dcdfe6;
    min-height: 50px;
    li {
      padding-left: 10px;
      list-style: none;
      &:hover {
        background-color: #ecf8ff;
      }
      .item-delete {
        margin-left: 4px;
        cursor: pointer;
        transition: all 0.25s ease;
        &:hover {
          font-size: 14px;
          color: #0080ff;
          transform: translateY(1px);
        }
      }
    }
  }
}
</style>
