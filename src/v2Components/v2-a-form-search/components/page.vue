<template>
  <div class="group-page w-full h-full flex flex-col justify-between">
    <div class="">
      <el-input
        style="margin-bottom: 8px;"
        size="mini"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-tree
        class="filter-tree"
        :data="config.listData"
        default-expand-all
        :props="config.defaultProps"
        node-key="ID"
        ref="tree"
        @node-click="nodeClick"
        :render-content="renderContent"
      >
      </el-tree>
    </div>
    <el-pagination
      :style="`text-align:right;padding-top:15px;`"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="config.totalCount || 0"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      active: "",

      currentPage: 1,
      pageSize: 10,

      filterText: ''
    };
  },
  watch: {
    filterText(val) {
      this.getPageData(1, 10, val);
    }
  },
  mounted() {
    console.log(this.config);
  },

  methods: {
    nodeClick(data) {
      const ctx = this;
      ctx.active = data[this.config.defaultProps.label];
      ctx.$emit("change", ctx.active);
    },
    handleSizeChange(val) {
      const ctx = this;
      ctx.pageSize = val;
      ctx.currentPage = 1;
      ctx.getPageData(ctx.currentPage, ctx.pageSize);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.currentPage = val;
      ctx.getPageData(ctx.currentPage, ctx.pageSize);
    },
    getPageData(page, size, val) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);

      ctx.$emit('page', ctx.currentPage, ctx.pageSize, { [this.config.defaultProps.label]: val })
    },

    renderContent(h, { node, data, store }) {
      console.log('this.config',this.config);
        return (
          <span class="custom-tree-node">
            <span>{data[this.config.defaultProps.label]}</span>
          </span>);
      }
  },
};
</script>

<style>
</style>