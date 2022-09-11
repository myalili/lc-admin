<template>
  <div>
    <el-select
      v-model="vModel"
      :multiple="multiple"
      filterable
      :filter-method="search"
      :loading="loading"
      loading-text="加载中..."
      @change="handleChange"
      size="mini"
      style="width: 100%"
    >
      <el-option
        v-for="item in dataOptions"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
        <span class="flex items-center justify-between">
          <span>{{ item.name }}</span>
        </span>
      </el-option>
      <div class="w-full flex justify-center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout=" prev, pager, next"
          :total="totalElements"
        >
        </el-pagination>
      </div>
    </el-select>
  </div>
</template>

<script>
// const { getAllUser }  = window.getAacApi()
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2ASelectUser",
  props: {
    value: {
      type: String | Number,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      dataValue: this.value,
      dataOptions: [],

      // 当前页码
      currentPage: 1,
      // 总数据
      totalElements: 1,
      // 总页数
      totalPages: null,
      // 每页数量
      pageSize: 5,
      // 是否禁用
      isDisabled: true,

      loading: false,

      timer: null,

      mode: 'id',

      query: {},
      searchText: ''
    };
  },
  watch: {
    dataValue: {
      handler(n) {
        this.$emit("update:value", n);
      },
    },
    value: {
      handler(n) {
        this.dataValue = n;
      },
    },
  },
  mounted() {
    const ctx = this;
    ctx.getUserList();
  },
  methods: {
    // 搜索
    search(e) {
      const ctx = this;
      ctx.throttling(ctx.getList, 1500, 1, ctx.pageSize, e);
    },
    // 列表
    getUserList(page, size) {
      const ctx = this
      ctx.loading = true;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchText || undefined,
      }
      const { getAllUser } = window.getAacApi();
      getAllUser(params).then(res => {
          let { success, content} = res;
          if(success){
            const { total, pageData } = content
            this.dataOptions = pageData
            this.totalElements = total
            this.loading = false;
          }else{
            this.loading = false;
            throw(res)
          }
          
        })
        .catch(error => {
          this.loading = false;
          this.$notify.error(error)
        })
    },
    handleSizeChange(val) {
      const ctx = this;
      console.log(`每页 ${val} 条`);
      ctx.getUserList(ctx.currentPage, val);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.getUserList(val);
    },
    // 选中
    handleChange(e) {
      const ctx = this;
      this.$emit("change", e);
    },
    // 搜索节流
    throttling(fn, wait, ...args) {
      const ctx = this;
      let run = () => {
        if (!ctx.timer) {
          ctx.timer = setTimeout(() => {
            fn.apply(ctx, args);
            clearTimeout(ctx.timer);
            ctx.timer = null;
          }, wait);
        } else {
          clearTimeout(ctx.timer);
          ctx.timer = null;
          run();
        }
      };

      run();
    },
  },
};
</script>

<style></style>
