<template>
  <div class="lp-inst-trace-table">
    <el-table :data="list" class="dialog-table" v-loading="listLoading">
      <el-table-column prop="activityId" label="节点id" sortable show-overflow-tooltip />
      <el-table-column prop="activityType" label="节点类型" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{ translateNodeName(scope.row.activityType) }}
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="节点名称" sortable show-overflow-tooltip />
      <el-table-column prop="startTime" width="140" label="开始时间" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.startTime | date }}</template>
      </el-table-column>
      <el-table-column prop="endTime" width="140" label="结束时间" sortable show-overflow-tooltip>
        <template slot-scope="scope"
          ><span v-if="scope.row.endTime">{{ scope.row.endTime | date }}</span></template
        >
      </el-table-column>
      <el-table-column prop="durationInMillis" label="总用时" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.durationInMillis | timeToSecond }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const { translateNodeName } = window.aopsUtils;
import { mapActions } from 'vuex';
export default {
  name: 'ExecutionLink',
  props: {
    lpInstId: {
      type: String,
      require: true
    },
    clusterId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      list: [],
      listLoading: false
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    ...mapActions('lpInstance1', ['getTrace']),
    async loadList() {
      this.listLoading = true;
      try {
        const res = await this.getTrace({ clusterId: this.clusterId, lpInstId: this.lpInstId });
        this.list = res;
      } catch (err) {
        this.list = [];
        this.$message({ message: err, type: 'error' });
      }
      this.listLoading = false;
    },
    translateNodeName
  },
  filters: {
    timeToSecond(val) {
      var days = Math.floor(val / (1000 * 60 * 60 * 24));
      var hours = Math.floor((val % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((val % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (val % (1000 * 60)) / 1000;
      if (days > 0) {
        return days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒';
      }
      if (hours > 0) {
        return hours + '小时' + minutes + '分钟' + seconds + '秒';
      }
      if (minutes > 0) {
        return minutes + '分钟' + seconds + '秒';
      }
      return seconds + '秒';
    }
  }
};
</script>

<style lang="scss">
.lp-inst-trace-table {
  border-bottom: none;
  overflow: auto;
}
</style>
