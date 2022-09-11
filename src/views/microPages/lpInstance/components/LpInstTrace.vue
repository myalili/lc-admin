<template>
  <div class="lp-execution-link">
    <LpInstTraceTable :lpInstId="this.AParams.id" :clusterId="AParams.clusterId" />
  </div>
</template>

<script>
import LpInstTraceTable from './LpInstTraceTable';
export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  name: 'ExecutionLink',
  components: {
    LpInstTraceTable
  },
  created() {
    if (!this.AParams.id) {
      this.$message({ message: '流程实例ID缺失, 1秒后返回', type: 'error' });
      setTimeout(() => {
        this.$root.close();
      }, 1000);
      return;
    }
  }
};
</script>

<style lang="scss">
.lp-execution-link {
  border-bottom: none;
  overflow: auto;
  .lp-inst-trace-table {
    padding: 16px 30px 0 30px;
    max-height: 400px;
    overflow: auto;
  }
}
</style>
