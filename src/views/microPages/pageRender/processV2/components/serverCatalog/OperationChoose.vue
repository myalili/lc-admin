<template>
  <el-container class="operation-choose" v-loading="listLoading">
    <el-main style="min-height:300px;max-height:400px;">
      <el-input v-model="filterText" class="aops-search-input" clearable placeholder="关键字搜索">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        v-loading="listLoading"
      >
        <span slot-scope="{ node, data }" @dragstart.prevent="handleDragStart(node)" draggable>
          <span :title="data.title">
            <template v-if="node.level === 3">
              <el-radio
                :value="operation && operation.id"
                :key="data.id"
                :label="data.id"
                @change="() => (operation = data)"
              >
                <i class="operation-protocol">{{ data.protocol }}</i>
                <span>{{ data.groupName }}</span>
                <span> | </span>
                <span class="operation-name">{{ data.cnName }}</span>
              </el-radio>
            </template>
            <template v-else-if="node.level === 2">
              <i class="icon icon-afa-service" />
              <span>{{ data.name }}</span>
              <span class="overview-version">V{{ data.version }}</span>
            </template>
            <template v-else>
              <span>{{ data.name }}</span>
            </template>
          </span>
        </span>
      </el-tree>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  data() {
    return {
      filterText: '',
      operation: null,
      confirmLoading: false
    };
  },
  created() {
    this.loadList();
  },
  computed: {
    ...mapState('onlineSummary', ['list', 'listLoading']),
    treeProps: () => ({
      children: 'children',
      label: 'name'
    }),
    treeData() {
      const treeData = [];
      this.list.forEach(item => {
        const system = {
          ...item,
          children: [],
          title: item.name
        };
        const overviewDetailDTOList = system.overviewDetailDTOList;
        system.overviewDetailDTOList = null;
        treeData.push(system);
        overviewDetailDTOList?.forEach(item => {
          const overview = {
            ...item,
            title: `${item.name} V${item.version}`,
            system
          };
          system.children.push(overview);
          const operationList = overview.operationList;
          overview.operationList = null;
          overview.children =
            operationList?.map(item => ({
              ...item,
              title: `${item.protocol} | ${item.groupName} | ${item.cnName} | ${item.name}`,
              overview
            })) ?? [];
        });
      });
      return treeData;
    },
    defaultExpandedKeys() {
      return [this.treeData[0]?.id];
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    ...mapActions('onlineSummary', ['load']),
    ...mapActions('overview', { getOverviewItem: 'getItem' }),
    ...mapActions('operation', { getOperationDetail: 'getDetail' }),
    async loadList() {
      try {
        await this.load();
      } catch (err) {
        this.$message.error(err);
      }
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      if (!data.title) {
        return data.name.indexOf(value) !== -1;
      }
      return data.name.indexOf(value) !== -1 || data.title.indexOf(value) !== -1;
    },
    async getOperationDetailByDetailId(detailId) {
      try {
        return await this.getOperationDetail({ detailId });
      } catch (err) {
        this.$message.error(err);
      }
    },
    async getOverviewItemById(id) {
      try {
        return await this.getOverviewItem({ id });
      } catch (err) {
        this.$message.error(err);
      }
    },
    async handleConfirm() {
      if (!this.operation) {
        this.$message.warning('请选择一个接口');
        return;
      }
      this.confirmLoading = true;
      try {
        // 正向接口
        const operation = { ...this.operation };
        const overview = { ...operation.overview };
        // 删除多余属性
        operation.overview = undefined;
        overview.system = undefined;
        overview.children = undefined;

        const operationDetail = await this.getOperationDetailByDetailId(operation.detailId);
        // 反向接口
        let compensate = operationDetail?.compensate;
        let compensateDetail = null;
        let compensateOverview = null;
        // 确认接口
        let confirm = operationDetail?.confirm;
        let confirmDetail = null;
        let confirmOverview = null;
        // 取消接口
        let cancel = operationDetail?.cancel;
        let cancelDetail = null;
        let cancelOverview = null;
        // 如果需要返回事务信息
        if (this.AParams.transcation) {
          if (compensate) {
            compensateDetail = await this.getOperationDetailByDetailId(compensate.detailId);
            compensateOverview = await this.getOverviewItemById(compensate.serviceId);
          }
          if (confirm) {
            confirmDetail = await this.getOperationDetailByDetailId(confirm.detailId);
            confirmOverview = await this.getOperationDetailByDetailId(confirm.serviceId);
          }
          if (cancel) {
            confirmDetail = await this.getOperationDetailByDetailId(confirm.detailId);
            confirmOverview = await this.getOperationDetailByDetailId(confirm.serviceId);
          }
        }
        // this.$store.commit('callback', {
        //   name: 'confirm',
        //   arg: {
        //     overview,
        //     operation,
        //     operationDetail,
        //     compensate,
        //     compensateDetail,
        //     compensateOverview,
        //     confirm,
        //     confirmDetail,
        //     confirmOverview,
        //     cancel,
        //     cancelDetail,
        //     cancelOverview
        //   }
        // });
         this.$root.confirm({
            overview,
            operation,
            operationDetail,
            compensate,
            compensateDetail,
            compensateOverview,
            confirm,
            confirmDetail,
            confirmOverview,
            cancel,
            cancelDetail,
            cancelOverview
          })
        // this.close();
      } catch (err) {
        this.$message.error(err);
      }
      this.confirmLoading = false;
    }
  }
};
</script>

<style lang="scss">
// @import '../../assets/styles/variables.scss';
.operation-choose {
  * {
    font-size: 12px;
  }
  .operation-protocol {
    margin-right: 5px;
    height: 16px;
    line-height: 16px;
    // background-color: $color-green;
    padding: 0 4px;
    color: white;
    border-radius: 6px;
    font-style: normal;
  }
  .operation-name {
    font-weight: bold;
  }
  .overview-version {
    margin-left: 5px;
  }
  .icon-afa-service {
    font-size: 12px;
    color:#7f8c93;
  }
  i[class*='icon icon-'] + span {
    margin-left: 5px;
  }
}
</style>
