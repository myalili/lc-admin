<template>
  <el-container>
    <el-main style="min-height:300px;max-height:400px;">
      <el-link
        icon="el-icon-delete"
        type="danger"
        v-show="api"
        @click="api = null"
        class="delete-icon"
        :underline="false"
        title="删除服务"
      ></el-link>
      <template v-if="api">
        <el-form size="mini" :model="api" label-width="96px" ref="form1" label-suffix="：">
          <el-form-item label="接口名称" prop="name" required style="margin-right:50px">
            <el-input v-model="api.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" prop="method" required>
            <el-select v-model="api.httpMethod" style="width:100%">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务码" prop="appName" required>
            <el-input v-model="api.appName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="请求Path" prop="url" required>
            <el-input v-model="api.treePath" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <HttpParamTable :params="api.params" />
      </template>
      <div v-else class="MicroServiceConf">
        <span>请选择一个服务</span>
        <el-button type="text" @click="toScOperationChoose" style="margin-left:14px">选择</el-button>
      </div>
    </el-main>
    <el-footer style="text-align:right">
      <el-button size="mini" @click="close()">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import HttpParamTable from '../HttpParamTable';
const { getRequestBody,jsonParse} = window.aopsUtils;
import OperationChoose from '../serverCatalog/OperationChoose'
export default {
  mixins:[window.V8.mixins],
  name: 'MicroServiceConfig',
  components: {
    HttpParamTable
  },
  data() {
    return {
      api: null
    };
  },
  created() {
    if (this.AParams.api) {
      this.api = this.AParams.api;
    }
  },
  methods: {
    handleSave() {
      // this.$store.commit('callback', {
      //   name: 'success',
      //   arg: this.api
      // });
      this.$root.confirm(this.api)
      // this.close();
    },
    toScOperationChoose() {
      this.open({
        title: '选择服务',
        path: '/OperationChoose',
        component:OperationChoose,
        // page: 'microPages/process/components/serverCatalog/OperationChoose',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: ({ overview, operation, operationDetail }) => {
          const params = jsonParse(operationDetail?.params, []).map(item => ({ ...item, value: '' }));
          const requestBody = getRequestBody(operationDetail);
          if (requestBody?.mediaType) {
            params.push({
              name: 'Content-Type',
              in: 'header',
              value: requestBody.mediaType
            });
            params.push({
              name: 'body',
              in: 'body',
              value: requestBody.mediaValue
            });
          }
          this.api = {
            name: operation.cnName ?? operation.operationCnName,
            protocol: operation.protocol,
            httpMethod: operation.method,
            url: '',
            appName: overview.code,
            treePath: operation.url,
            timeout: 0,
            params,
            sc: { overview, operation, operationDetail }
          };
        }
      });
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
