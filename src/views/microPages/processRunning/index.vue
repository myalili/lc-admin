<template>
  <el-container class="aops-el-common track-list" direction="vertical">
    <el-tabs v-model="taskName" style="padding:0">
      <el-tab-pane name="LpRuInstStartedByMe" label="我发起的" style="height: 100%">
        <LpRuInstStartedByMe />
      </el-tab-pane>
      <el-tab-pane name="LpRuInstInvolvedMe" label="抄送给我的" style="height: 100%">
        <LpRuInstInvolvedMe />
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import LpRuInstStartedByMe from './components/LpRuInstStartedByMe';
import LpRuInstInvolvedMe from './components/LpRuInstInvolvedMe';

export default {
  name: 'TrackList',
  components: {
    LpRuInstInvolvedMe,
    LpRuInstStartedByMe
  },
  data() {
    return {
      taskName: 'LpRuInstStartedByMe',
      clusterList: []
    };
  }
};
</script>
<style lang="scss">
.track-list {
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
