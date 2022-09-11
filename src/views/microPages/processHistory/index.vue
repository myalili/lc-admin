<template>
  <el-container class="aops-el-common record-list" direction="vertical">
    <el-tabs v-model="tabName" style="padding:0">
      <el-tab-pane name="DoneTask" label="已办" style="height:100%">
        <LpDoneTask />
      </el-tab-pane>
      <el-tab-pane name="LpHiInstStartedByMe" label="我发起的" style="height:100%">
        <LpHiInstStartedByMe />
      </el-tab-pane>
      <el-tab-pane name="LpHiInstInvolvedMe" label="抄送给我的" style="height:100%">
        <LpHiInstInvolvedMe />
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import LpDoneTask from './components/LpDoneTask';
import LpHiInstStartedByMe from './components/LpHiInstStartedByMe';
import LpHiInstInvolvedMe from './components/LpHiInstInvolvedMe';
export default {
  name: 'Record',
  components: {
    LpDoneTask,
    LpHiInstStartedByMe,
    LpHiInstInvolvedMe
  },
  data() {
    return {
      tabName: 'DoneTask'
    };
  }
};
</script>
<style lang="scss">
.record-list {
  .el-tabs__header {
    margin-bottom: 0px;
  }
  .el-tabs {
    height: 100%;
    & > .el-tabs__content {
      padding: 0;
      height: calc(100% - 42px);
      > .el-tab-pane > .el-container > .el-header {
        .el-form .el-form-item {
          margin: 10px;
        }
      }
    }
  }
}
</style>
