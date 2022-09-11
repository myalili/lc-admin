<template>
  <el-container>
    <el-main style="min-height:350px;max-height:500px;">
      <el-form size="mini" :model="api" label-width="96px" ref="form1" label-suffix="：">
        <el-form-item label="接口名称" prop="name" required>
          <el-input v-model="api.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="httpMethod" required>
          <el-select v-model="api.httpMethod" style="width:100%">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求URL" prop="url" required>
          <el-input v-model="api.url" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="超时时间" prop="timeout" required>
          <el-tooltip placement="top" effect="dark" content="单位：秒, 0 表示不使用超时时间">
            <el-input-number v-model="api.timeout" :min="0" size="mini"></el-input-number>
          </el-tooltip>
        </el-form-item> -->
      </el-form>
      <HttpParamTable :params="api.params" />
    </el-main>
    <el-footer style="text-align:right">
      <el-button size="mini" @click="close()">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import HttpParamTable from '../HttpParamTable';
export default {
  mixins:[window.V8.mixins],
  name: 'MicroServiceConfig',
  components: {
    HttpParamTable
  },
  data() {
    return {
      api: {
        name: 'HTTP请求',
        httpMethod: 'GET',
        url: '',
        appName: '',
        treePath: '',
        params: []
      }
    };
  },
  created() {
    if (this.AParams.api) {
      this.api = {
        ...this.api,
        ...this.AParams.api
      };
      this.api.name = this.api.name || 'HTTP请求';
      this.api.url = this.api.url || 'http://xxx.xxx';
    }
  },
  methods: {
    handleSave() {
      // this.$store.commit('callback', {
      //   name: 'success',
      //   arg: this.api
      // });
      this.$root.confirm(this.api);
      // this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.delete-icon {
  font-size: 18px;
  float: right;
  position: relative;
  z-index: 99;
}
</style>
