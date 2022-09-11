<template>
  <div class="server-catalog-element">
    <div class="search-box">
      <el-input v-model="filterText" class="aops-search-input" clearable placeholder="关键字搜索" style="width:100%">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-tree ref="tree" :data="treeData" :props="treeProps" :filter-node-method="filterNode" v-loading="listLoading">
      <span slot-scope="{ node, data }" @dragstart.prevent="handleDragStart(node)" draggable>
        <span :title="data.title">
          <template v-if="node.level === 3">
            <i class="operation-protocol">{{ data.protocol }}</i>
            <span>{{ data.groupName }}</span>
            <span> | </span>
            <span>{{ data.cnName }}</span>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  store:window.aopsStore,
  name: 'ServerCatalogElements',
  data() {
    return {
      filterText: ''
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
        const system = { ...item, children: [], title: item.name };
        const overviewDetailDTOList = system.overviewDetailDTOList;
        system.overviewDetailDTOList = null;
        treeData.push(system);
        overviewDetailDTOList?.forEach(item => {
          const overview = { ...item, title: `${item.name} V${item.version}` };
          system.children.push(overview);
          const operationList = overview.operationList;
          overview.operationList = null;
          overview.children =
            operationList?.map(item => ({
              ...item,
              title: `${item.protocol} | ${item.groupName} | ${item.cnName} | ${item.name}`
            })) ?? [];
        });
      });
      return treeData;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    ...mapActions('onlineSummary', ['load']),
    async handleDragStart(node) {
      if (node.level !== 3) {
        return;
      }
      try {
        let schema = {
          // 抛出作为节点模板
          api: {
            name: node.data.cnName ? node.data.cnName : undefined,
            httpMethod: node.data.method ? node.data.method.toUpperCase() : undefined,
            treePath: node.data.url ? node.data.url : undefined,
            appName: node.parent.data.code ? node.parent.data.code : undefined,
            // appName: node.data.operationId ? node.data.operationId : undefined,
            id: node.data.operationId ? node.data.operationId : undefined,
            invokeType: 'SYNC',
            timeout: 0,
            params: [],
            swagger: {
              summary: node.data.cnName ? node.data.cnName : undefined,
              operationId: node.data.operationId ? node.data.operationId : undefined,
              produces: ['*/*'],
              parameters: [],
              responses: null,
              deprecated: false, // 标记接口是否弃用或删除了
              httpMethod: node.data.method
            }
          },
          joinAts: true,
          atsType: 'SAGA',
          confirmApi: null, // microService
          componsateApi: null, // microService
          cancelApi: null // microService
        };
        this.$emit('dragstart', schema, node.data.detailId, node.parent.data, node.data);
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
    },
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
    }
  }
};
</script>

<style lang="scss">
// @import '../../assets/styles/variables.scss';
.server-catalog-element {
  height: 100%;
  overflow: auto;
  .search-box {
    padding: 0 10px;
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
