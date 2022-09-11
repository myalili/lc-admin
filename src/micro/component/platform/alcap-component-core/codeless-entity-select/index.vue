<template>
  <div  class=" h-7 flex items-end" style="width:100%">
    <el-select
      filterable
      size="mini"
      style="width: 100%"
      v-model="shema"
      placeholder="请选择schema"
      @change="shemaChange"
      v-if="!schemaType && !noShema"
    >
      <el-option
        v-for="itemi in shemas.filter(i=>i.operationType === 'retrieve')"
        :key="itemi.name"
        :value="itemi.name"
        :label="itemi.desc"
      ></el-option>
    </el-select>
    <el-select
      v-model="dataValue"
      filterable
      :loading="loading"
      loading-text="加载中..."
      :placeholder="placeholder"
      @change="handleChange"
      size="mini"
      style="width: 100%"
      v-if="schemaType || (!schemaType && shema) || noShema"
      value-key="id"
    >
      <el-option
        v-for="item in computedOptions"
        :key="item.id"
        :label="item.desc || item.label"
        :value="mode === 'id' ? item.id : item"
      >
        <span class="flex items-center justify-between">
          <span>{{ item.desc || item.name }}</span>
          <span class="text-sm text-gray-400">{{ item.name || "" }}</span>
        </span>
      </el-option>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout=" prev, pager, next, jumper"
        :total="totalElements"
        v-if="noShema"
      >
      </el-pagination>
    </el-select>
  </div>
</template>

<script>
const { formatEntity } =window.alcapCoreUtils;

const { getEntityListBySchema, getSchemaListNoPage, getEntityList } = window.getBffApi();

export default {
  name: "entitySelect",
  mixins: [ window.codelessMixins.entityAuthorities ],
  props: {
    schemaType: {
      type: String,
      default: () => {
        return "";
      },
    },
    mode: {
      type: String,
      default: () => {
        return "object";
      },
    },
    noShema: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    hasTenantId: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    url: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      },
    },
    options: {
      type: Array,
      default: () => {
        return [
          {
            label: "选项一",
            value: "1",
          },
          {
            label: "选项二",
            value: "2",
          },
          {
            label: "选项三",
            value: "3",
          },
          {
            label: "选项四",
            value: "4",
          },
        ];
      },
    },
    value: {
      type: String | Number,
      default: () => {
        return "";
      },
    },
    immedHandle: {
      type: Boolean,
      default: false
    },
    exclude: {
      type: Array,
      default: ()=> {
        return []
      }
    }
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
      pageSize: 6,
      // 是否禁用
      isDisabled: true,

      loading: false,

      timer: null,

      shema: "",
      shemas: [],
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
    schemaType: {
      handler(n, o) {
        if (n !== o) {
          const ctx = this;
          ctx.getList();
        }
      },
    },
    hasTenantId: {
      handler(n, o) {
        if (n !== o) {
          const ctx = this;
          if (!ctx.schemaType && !ctx.noShema) {
            ctx.getShemaList();
          } else if (ctx.noShema) {
            ctx.getListPage();
          } else {
            ctx.getList();
          }
        }
      },
    }
  },
  computed: {
    tenantId(){
      if (this.hasTenantId) {
        return this.$store.getters["user/tenantId"]
      }else {
        return ''
      }
      
    },
    computedOptions() {
      const ctx = this;
      if (ctx.exclude?.length > 0) {
        let exEntityList = [];
        ctx.exclude.forEach(ex => {
          if (ex === 'data_factory') {
            exEntityList = [ ...exEntityList, ...ctx.dataOptions.filter(i=>i.type.indexOf(ex) === -1) ];
          }else {
            exEntityList = [ ...exEntityList, ...ctx.dataOptions.filter(i=>i.type !== ex) ];
          }
        });
        return exEntityList;
      }else {
        return ctx.dataOptions;
      }
    }
  },
  created() {
    const ctx = this;
    if (!ctx.schemaType && !ctx.noShema) {
      ctx.getShemaList();
    } else if (ctx.noShema) {
      ctx.getListPage();
    } else {
      ctx.getList();
    }
  },
  methods: {
    // 搜索
    search(e) {
      const ctx = this;
      ctx.throttling(ctx.getList, 1500, 1, ctx.pageSize, e);
    },
    // 列表.
    getList(name) {
      const ctx = this;
      ctx.loading = true;
      
      getEntityListBySchema(name || ctx.schemaType, ctx.tenantId).then((res) => {
          if (res.success) {
            ctx.dataOptions = (res && res.obj) || [];
            ctx.dataOptions = ctx.dataOptions.map(e=> {
              e.fields = e.fields.map(i=> {
                i = formatEntity(i);
                return i
              })
              return e
            })

            if (ctx.dataValue.id) {
              ctx.dataValue = ctx.dataOptions.find(i=>i.id === ctx.dataValue.id)
            }
            ctx.loading = false;
            if (this.immedHandle) {
              this.handleChange(this.value);
            }
          } else {
            ctx.loading = false;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    getListPage(page, size, name = "") {
      const ctx = this;
      ctx.loading = true;
      page && (ctx.currentPage = page);
      !page && (ctx.currentPage = 1);
      size && (ctx.pageSize = size);
      !size && (ctx.pageSize = 6);
      const params = {
        name,
        pageNum: ctx.currentPage,
        pageSize: ctx.pageSize,
        tenantId: ctx.tenantId
      }
      getEntityList(params).then((res) => {
          if (res) {
            ctx.dataOptions = (res && res.content) || [];
            ctx.dataOptions = ctx.dataOptions.map(e=> {
              e.fields = e.fields.map(i=> {
                i = formatEntity(i);
                return i
              })
              return e
            })
            ctx.totalElements = (res && res.totalElements) || 0;
            ctx.totalPages = (res && res.totalPages) || 0;
            ctx.loading = false;
          } else {
            ctx.loading = false;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },

    async getShemaList() {
      const ctx = this;
      let shemas = await getSchemaListNoPage({tenantId:ctx.tenantId})

      ctx.shemas = shemas.obj || [];

      if (ctx.value) {
        let entity = await pipe.entity.getEntityDetail(ctx.value);
        this.shema = entity.schemas.find(i=>i.operationType === "retrieve").name;
        this.getList(this.shema);
      }
          
    },
    shemaChange(e) {
      const ctx = this;
      ctx.getList(e);
    },
    comOptions(options) {
      const ctx = this;
      options =
        options &&
        options.map((i) => {
          return {
            label: i.label || i.name || i.desc,
            value: i.value || i.id,
            ...i,
          };
        });
      return options;
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
      if (this.mode === 'id') {
        const target = this.dataOptions.find(i=>i.id === e);
        this.$emit("handleChange", target);
        console.log('选中的实体', e, target);
      }else {
        this.$emit("handleChange", e);
        console.log('选中的实体', e);
      }
      // 实体保存到pageContent
      this.saveEntityToPageContent();
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
    entitySearch(e) {
      const ctx = this;
      console.log(e);
      if (ctx.noShema) {
        return []
      }else {
        
        return 
      }
      
    },
  },
};
</script>

<style></style>
