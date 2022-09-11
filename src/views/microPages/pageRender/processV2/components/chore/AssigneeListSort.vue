<template>
  <el-container class="sort-assignee-list">
    <el-main>
      <div class="sort-content">
        <el-row :gutter="2" class="item" style="background-color:#f6f6f6">
          <el-col :span="12">用户编码</el-col>
          <el-col :span="12">用户名</el-col>
        </el-row>
        <draggable v-model="usersData" chosenClass="chosen" ghostClass="ghost" forceFallback="true" animation="800">
          <transition-group type="transition">
            <el-row :gutter="2" class="item" v-for="item in usersData" :key="item.userCode">
              <el-col :span="12">{{ item.userCode }}</el-col>
              <el-col :span="12">{{ item.userName }}</el-col>
            </el-row>
          </transition-group>
        </draggable>
        <div v-if="!usersData || !usersData.length">
          <p class="null-data-tip">暂无数据</p>
        </div>
      </div>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  mixins:[window.V8.mixins],
  name: 'AssigneeListSort',
  components: {
    draggable
  },
  data() {
    return {
      usersData: []
    };
  },

  created() {
    if (this.AParams.usersData && this.AParams.usersData.length) {
      this.usersData = JSON.parse(JSON.stringify(this.AParams.usersData));
    }
  },
  methods: {
    handleConfirm() {
      // this.$store.commit('callback', { name: 'confirm', arg: this.usersData });
      this.$root.confirm(this.usersData)
      // this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog .sort-assignee-list {
  min-height: 450px;
  max-height: 550px;
  padding-bottom: 0;
  .sort-content {
    padding: 10px 12px 20px 12px;
    border: 1px solid #eee;
    height: 100%;
    .item {
      padding: 6px;
      margin: 10px 10px 0 10px;
      background-color: #fff;
      border: solid 1px #eee;
      cursor: move;
    }
    .chosen {
      border: 1px solid #3089dc !important;
    }
    .ghost {
      background-color: #ecf8ff !important;
    }
    .null-data-tip {
      text-align: center;
      height: 40px;
      line-height: 60px;
      color: #909399;
    }
  }
}
</style>
