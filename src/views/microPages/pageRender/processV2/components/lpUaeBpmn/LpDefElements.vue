<template>
  <div class="lp-def-elements" v-loading="listLoading">
    <div class="search-box">
      <el-input v-model="filterText" class="aops-search-input" clearable placeholder="关键字搜索" style="width:100%">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      ref="tree"
      default-expand-all
      :filter-node-method="filterNode"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span @dragstart.prevent="$emit('dragstart', data, $event)" draggable :title="data.title">
          <i :class="data.icon" style="font-size:14px;"></i>
          {{ data.name }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
const moduleName = 'longProcessForTree';
import { mapState, mapActions, mapMutations } from 'vuex';
import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
  getterType: `${moduleName}/getField`,
  mutationType: `${moduleName}/updateField`
});

export default {
  store:window.aopsStore,
  name: 'LpDefElements',
  data() {
    return {
      filterText: ''
    };
  },
  computed: {
    ...mapState(moduleName, ['list', 'listLoading']),
    ...mapFields(['page.start', 'page.size', 'page.total']),
    defaultProps: () => ({
      children: 'children',
      label: 'name',
      icon: 'icon'
    }),
    treeData() {
      return [
        {
          id: 'longProcess',
          name: '长流程列表',
          children: this.list.map(item => ({
            title: `名称:${item.name} Key:${item.id} 版本:${item.version}`,
            id: item.id,
            name: `${item.name}`,
            model: 'callActivity',
            icon: 'bpmn-icon-call-activity',
            props: {
              name: item.name,
              calledElement: item.id,
              calledElementType: 'key'
            }
          }))
        }
      ];
    }
  },
  created() {
    this.resetPage();
    this.resetQuery();
    this.size = 10000;
    this.loadList();
  },
  methods: {
    ...mapMutations(moduleName, ['resetQuery', 'resetPage']),
    ...mapActions(moduleName, ['load']),
    async loadList() {
      try {
        await this.load();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
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
  },
  watch: {
    filterText(val, old) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="less">
.lp-def-elements {
  height: 100%;
  overflow: auto;
  .search-box {
    padding: 0 10px;
    .el-icon-search {
      text-align: center;
      line-height: 32px;
    }
  }
  .el-tree {
    width: 100%;
    .custom-tree-node {
      width: 100%;
      display: block;
      height: 100%;
      line-height: 30px;
      > span {
        display: block;
        .icon-jiaoben-copy,
        .icon-danfuwu {
          font-size: 12px;
          color: #457ce2;
        }
      }
    }
  }
}
</style>
