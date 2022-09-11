<template>
  <el-collapse-item name="executionListener">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-message-solid"></i> 执行监听器</div>
    <div>
      <el-table :data="listeners">
        <el-table-column label="事件类型" prop="event" />
        <el-table-column label="监听器类型">
          <template slot-scope="{ row }">
            {{ row | lisenterType }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button @click="toEditListener(row, $index)" type="text" :disabled="readonly">编辑</el-button>
            <el-button @click="removeListener($index)" type="text" style="color: red" :disabled="readonly"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="opr_bottom_button">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddListener" :disabled="readonly"
          >添加监听器</el-button
        >
      </div>
    </div>
  </el-collapse-item>
</template>

<script>
import ExecutionListener from '@uae/uae-bpmn-editor/definitions/processElements/common/executionListener.js';
const { executionListenerClass,jsonParse } = window.aopsUtils;
import ListenerAdd from '../../chore/ListenerAdd'
export default {
  mixins:[window.V8.mixins],
  name: 'ExecutionListener',
  props: {
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (!this.listeners) {
      this.listeners = [];
    }
  },
  computed: {
    listeners: {
      get() {
        return this.node.executionListeners;
      },
      set(val) {
        this.node.executionListeners = val;
      }
    }
  },
  filters: {
    lisenterType(row) {
      if (row.class === executionListenerClass.amq) {
        return 'AMQ';
      }
      if (row.class === executionListenerClass.http) {
        return 'HTTP';
      }
      if (row.class === executionListenerClass.micro) {
        const string = row.fields.filter(item => item.name === 'microService')[0]?.string;
        const object = jsonParse(string);
        if (object?.api?.url) {
          return 'HTTP';
        }
        return '微服务';
      }
      if (row.class) {
        return 'Java类';
      }
      if (row.expression) {
        return '表达式';
      }
      if (row.delegateExpression) {
        return '委托表达式';
      }
      return '未知类型';
    }
  },
  methods: {
    toEditListener(listener, index) {
      this.open({
        title: '编辑执行监听器',
        path: '/ListenerAdd',
        component:ListenerAdd,
        // page: 'microPages/process/components/chore/ListenerAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          listener: listener
        },
        confirmCallback: data => {
          this.$set(this.listeners, index, data);
        }
      });
    },
    removeListener(index) {
      this.listeners.splice(index, 1);
    },
    toAddListener() {
      this.open({
        title: '添加执行监听器',
        path: '/ListenerAdd',
        component:ListenerAdd,
        // page: 'microPages/process/components/chore/ListenerAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.listeners.push(new ExecutionListener(data));
        }
      });
    }
  }
};
</script>
