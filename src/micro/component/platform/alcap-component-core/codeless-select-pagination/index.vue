<template>
  <el-select
    v-model="dataValue"
    :multiple="multiple"
    filterable
    :filter-method="search"
    :loading="loading"
    loading-text="加载中..."
    :placeholder="placeholder"
    @change="handleChange"
    size="mini"
    style="width: 100%"
  >
    <el-option
      v-for="item in dataOptions"
      :key="item[config && config.component && config.component.labelValue || labelValue]"
      :label="item[config && config.component && config.component.label|| label]"
      :value="item[config && config.component && config.component.labelValue]"
    >
      <span class="flex items-center justify-between">
        <span>{{ item[config && config.component && config.component.label || label] }}</span>
        <!-- <span class="text-sm text-gray-400">{{ item.name || "" }}</span> -->
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
</template>

<script>
export default {
  name: "codelessSelectPagination",
  props: {
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
    value: {
      type: String | Number,
      default: () => {
        return "";
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    multiple: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    entityId: {
      type: String,
      default: () => {
        return "";
      },
    },
    label: {
      type: String,
      default: () => {
        return "";
      },
    },
    labelValue: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
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

      mode: "id",

      query: {},
    };
  },
  mounted() {
    const ctx = this;
    ctx.getListPage();
  },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
  },
  methods: {
    // 搜索
    search(e) {
      const ctx = this;
      ctx.throttling(ctx.getList, 1500, 1, ctx.pageSize, e);
    },
    // 列表
    getList() {
      const ctx = this;
      ctx.loading = true;
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.entityId,
            orders: [],
            pageNum: ctx.currentPage,
            pageSize: ctx.pageSize,
            query: ctx.query,
            ranges: [],
            retrieveId: "paging",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.entityId,
            fields: [],
          },
        ],
      ]);
      pipe.entity
        .getEntityData(
          ctx.config.entityId || ctx.entityId,
          'ALCAP_PAGEING',
          paramsMap
        )
        .then((res) => {
          if (res.success) {
            ctx.dataOptions = (res && res.obj) || [];
            ctx.dataOptions = ctx.dataOptions.map((e) => {
              e.fields = e.fields.map((i) => {
                i = formatEntity(i);
                return i;
              });
              return e;
            });

            if (ctx.dataValue.id) {
              ctx.dataValue = ctx.dataOptions.filter(
                (i) => i.id === ctx.dataValue.id
              )[0];
            }
            ctx.loading = false;
          } else {
            ctx.loading = false;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    getListPage(page, size) {
      const ctx = this;
      ctx.loading = true;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 10);
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.config.entityId || ctx.entityId,
            orders: [],
            pageNum: ctx.currentPage,
            pageSize: ctx.pageSize,
            query: ctx.query,
            ranges: [],
            retrieveId: "paging",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.config.entityId || ctx.entityId,
            fields: [],
          },
        ],
      ]);
      pipe.entity
        .getEntityData(
          ctx.config.entityId || ctx.entityId,
          'ALCAP_PAGEING',
          paramsMap
        )
        .then((res) => {
          if (res) {
            ctx.dataOptions = (res.response && res.response.content) || [];
            console.log("分页数据", ctx.dataOptions);
            ctx.totalElements = (res.obj && res.obj.totalElements) || 0;
            ctx.totalPages = (res.obj && res.obj.totalPages) || 0;
            ctx.loading = false;
          } else {
            ctx.loading = false;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    handleSizeChange(val) {
      const ctx = this;
      console.log(`每页 ${val} 条`);
      ctx.getListPage(ctx.currentPage, val);
    },
    handleCurrentChange(val) {
      const ctx = this;
      ctx.getListPage(val);
    },
    // 选中
    handleChange(e) {
      const ctx = this;
      // console.log(this.dataOptions.filter(i=>i[this.config.component.valueLabel] === e)[0]);
      this.$emit(
        "change",
        this.dataOptions.filter(
          (i) => i[this.labelValue || this.config.component.labelValue] === e
        )[0]
      );
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

<style scoped>
</style>
