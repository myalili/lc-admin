<template>
  <el-container class="aops-el-common instancess-details" v-loading="lpInstLoading">
    <el-aside width="280px" class="schema-aside">
      <div v-if="lpInst" class="instance-schema-header">
        <div class="schema-header-item instance-status">
          <i v-if="lpInst.endTime" class="el-icon-success" />
          <i v-else class="el-icon-loading" />
        </div>
        <div class="schema-header-item instance-name">
          {{ lpInst.name }}
        </div>
        <div class="schema-header-item instance-id">
          <CopyCtn :value="lpInst.id" />
        </div>
        <div v-show="!lpInst.endTime" class="schema-header-item stop-btn-ctn">
          <el-button @click="hdStopInstance">强制停止</el-button>
        </div>
      </div>
      <div v-if="lpInst" class="instance-schema-main">
        <div class="schema-main-item">
          <span class="item-label">业务Key:</span><span class="item-content">{{ lpInst.businessKey || '--' }}</span>
        </div>
        <div class="schema-main-item">
          <span class="item-label">流程定义ID:</span>
          <span class="item-content">
            <CopyCtn :value="lpInst.processDefinitionId" />
          </span>
        </div>
        <div class="schema-main-item">
          <span class="item-label">流程定义名称:</span>
          <span class="item-content">
            <el-button type="text" @click="toDefDetails">{{ lpInst.processDefinitionName }}</el-button>
          </span>
        </div>
        <div class="schema-main-item">
          <span class="item-label">发起人:</span><span class="item-content">{{ lpInst.startUserId }}</span>
        </div>
        <div class="schema-main-item">
          <span class="item-label">发起时间:</span><span class="item-content">{{ lpInst.startTime | date }}</span>
        </div>
        <div class="schema-main-item" v-show="lpInst.endTime">
          <span class="item-label">结束时间:</span><span class="item-content">{{ lpInst.endTime | date }}</span>
        </div>
        <div class="schema-main-item">
          <span class="item-label">持续时间:</span><span class="item-content">{{ lpInst.time }}</span>
        </div>
      </div>
    </el-aside>
    <el-main>
      <el-tabs v-model="tabName" class="bottom-tab" style="width:100%;" @tab-click="loadCurrentTab">
        <el-tab-pane name="task" label="任务" style="height:100%;">
          <LpInstTaskTable ref="task" :clusterId="clusterId" :lpInstId="lpInstId" />
        </el-tab-pane>
        <el-tab-pane name="variable" label="变量" style="height:100%;">
          <LpInstVariableTable ref="variable" :clusterId="clusterId" :lpInstId="lpInstId" />
        </el-tab-pane>
        <el-tab-pane name="trace" label="执行链路" style="height:100%">
          <LpInstTraceTable ref="trace" :clusterId="clusterId" :lpInstId="lpInstId" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import { mapActions } from 'vuex';
import LpInstTaskTable from './LpInstTaskTable';
import LpInstVariableTable from './LpInstVariableTable';
import LpInstTraceTable from './LpInstTraceTable';

// import CopyCtn from '@/components/common/CopyCtn';

export default {
  store:window.aopsStore,
  name: 'InstancesDetails',
  mixins:[window.V8.mixins],
  components: {
    LpInstTaskTable,
    LpInstVariableTable,
    LpInstTraceTable,
    // CopyCtn
  },
  data() {
    return {
      tabName: 'task',
      lpInst: null,
      lpInstLoading: false
    };
  },
  async created() {
    await this.loadLpInst();
  },
  computed: {
    clusterId: vm => vm.AParams.clusterId,
    lpInstId: vm => vm.AParams.processInstanceId
  },
  methods: {
    ...mapActions('lpInstance1', ['loadItem', 'stopItem']),
    async loadLpInst() {
      this.lpInstLoading = true;
      try {
        this.lpInst = await this.loadItem({ clusterId: this.clusterId, lpInstId: this.lpInstId });
        console.log(this.lpInst);
        this.lpInst.time = this.lpInst.endTime ? this.dateDifference(this.lpInst.startTime, this.lpInst.endTime) : '--';
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
      this.lpInstLoading = false;
    },
    loadCurrentTab() {
      this.$refs[this.tabName]?.loadList();
    },
    async hdStopInstance() {
      if (!(await this.isConfirm(this.$confirm('确认终止该流程实例吗?', '提示', { type: 'warning' })))) {
        return;
      }
      try {
        await this.stopItem({ clusterId: this.clusterId, lpInstId: this.lpInstId });
        this.loadLpInst();
        this.loadCurrentTab();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
      // 终止流程实例
    },
    toDefDetails() {
      this.open({
        title: '流程定义详情',
        path: `/aops-afoe/${this.clusterId}/lp-definition/${this.lpInst.processDefinitionId}`,
        page: 'afoe/lpDefinition/LpDefDetail',
        type: 'BLANK'
      });
    },
    async isConfirm (promise) {
      try {
        return (await promise) === 'confirm';
      } catch (err) {
        return false;
      }
    },
    dateDifference(startTime, endTime) {
      const sTime = new Date(startTime).getTime();
      const eTime = new Date(endTime).getTime();
      const timeBad = eTime - sTime;
      const days = Math.floor(timeBad / (24 * 3600 * 1000));
      const h = timeBad % (24 * 3600 * 1000);
      const hours = Math.floor(h / (3600 * 1000));
      const min = timeBad % (3600 * 1000);
      const minutes = Math.floor(min / (60 * 1000));
      const s = timeBad % (60 * 1000);
      const second = Math.floor(s / 1000);
      return days ? days + '天' : '' + hours + '时' + minutes + '分' + second + '秒';
    }
  }
};
</script>
<style lang="scss">
// @import '../../../scss/variables.scss';
.instancess-details {
  height:100%;
  > .el-aside {
    position: relative;
    background-color: #e7ecef;
    padding: 24px 20px;
    .instance-schema-header {
      .schema-header-item {
        text-align: center;
      }
      .instance-status {
        font-size: 44px;
        .el-icon-success {
          color: #07b6b5;
        }
        .el-icon-loading {
          color: #7f8c93;
        }
      }
      .instance-name {
        font-size: 13px;
        font-weight: bold;
        margin-top: 16px;
      }
      .instance-id {
        margin-top: 8px;
      }
      .stop-btn-ctn {
        margin-top: 24px;
        .el-button {
          width: 100%;
        }
      }
    }
    .instance-schema-main {
      margin-top: 38px;
      .schema-main-item {
        margin-bottom: 18px;
        display: flex;
        .item-label {
          width: 90px;
          color: #7f8c93;;
        }
        .item-content {
          flex: 1;
        }
      }
    }
  }
  > .el-main {
    padding: 0px;
    .el-tabs {
      border: none;
      overflow: hidden;
      border-radius: 4px;
      height: 100%;
      width: calc(100% - 2px) !important;
      min-width: 400px;
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__content {
        height: calc(100% - 40px);
        padding: 0 20px;
        overflow: auto;
      }
    }
  }
}
</style>
