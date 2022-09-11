<template>
  <div class="group-menu w-full h-full">
    <div class="w-full h-full border-r border-gray-300 overflow-scroll">
      <!-- <el-tree
        class="filter-tree"
        :data="listData"
        default-expand-all
        :props="defaultProps"
        node-key="ID"
        ref="tree"
        @node-click="nodeClick"
      >
      </el-tree> -->
      <component
        :is="component"
        :config="config"
        @change="change"
        @page="getPageData"
      />
    </div>
  </div>
</template>

<script>
import groupList from "./components/list";
import groupTree from "./components/tree";
import groupPage from "./components/page";
export default {
  components: {
    groupList,
    groupTree,
    groupPage,
  },
  props: {
    groupMenu: {
      type: Object,
      default: () => {
        return {
          displayType: "",
          mainProto: "",
          menuProto: "",
          secondId: {},
          secondProto: "",
          isMore: false,
        };
      },
    },
  },
  watch: {
    "groupMenu.displayType": {
      handler(n) {
        const ctx = this;
        if (ctx.groupMenu.displayType.indexOf("page") > -1) {
          ctx.component = "groupPage";
          ctx.getPageData();
        } else {
          ctx.getListData();
        }
      },
    },
    "groupMenu.secondId": {
      handler(n) {
        const ctx = this;
        if (ctx.groupMenu.displayType.indexOf("page") > -1) {
          ctx.component = "groupPage";
          ctx.getPageData();
        } else {
          ctx.getListData();
        }
      },
    },
    "groupMenu.secondProto": {
      handler(n) {
        const ctx = this;
        if (ctx.groupMenu.displayType.indexOf("page") > -1) {
          ctx.component = "groupPage";
          ctx.getPageData();
        } else {
          ctx.getListData();
        }
      },
    },
  },
  data() {
    return {
      listData: [],
      active: "",
      defaultProps: {
        children: "children",
        label: "label",
      },

      loading: false,

      component: "",

      config: {},

      entityUrl: {},
      totalCount: 0,
    };
  },
  mounted() {
    const ctx = this;
    if (ctx.groupMenu.displayType.indexOf("page") > -1) {
      ctx.component = "groupPage";
      ctx.getPageData();
    } else {
      ctx.getListData();
    }
  },
  computed: {
    dropdownStyle() {
      return (e) => {
        if (e === this.active) {
          return {
            "background-color": e === this.active ? "#ecf5ff" : "",
            color: e === this.active ? "#66b1ff" : "#303133",
            "font-weight": 500,
          };
        }
      };
    },
  },
  methods: {
    change(e) {
      this.$emit("change", e);
    },
    tabClick(data) {
      const ctx = this;
      ctx.active = data.name;
      ctx.$emit("change", ctx.active);
      console.log(data.name);
    },
    handleCommand(e) {
      const ctx = this;
      if (ctx.active === e) return;
      ctx.active = e;
      ctx.$emit("change", ctx.active);
    },
    async getListData() {
      const ctx = this;
      const dbParams = {
        entityId: ctx.groupMenu.secondId,
        orders: [],
        query: {},
        ranges: [],
        retrieveId: "list",
      };
      const dsParams = {
        entityId: ctx.groupMenu.secondId,
        fields: [],
      };
      const paramsMap = new Map([
        ["db", dbParams],
        ["data_source", dsParams],
      ]);
      if (ctx.groupMenu.displayType) {
        await pipe.entity
          .getEntityData(
            ctx.groupMenu.secondId,
            ctx.groupMenu.displayType.substring(
              0,
              ctx.groupMenu.displayType.indexOf(":")
            ),
            paramsMap
          )
          .then((res) => {
            console.log("最终返回的：", res);
            ctx.loading = false;

            ctx.listData = (res.response && res.response.content) || [];

            if (ctx.groupMenu.displayType.indexOf("tree") > -1) {
              ctx.component = "groupTree";
              ctx.defaultProps.label = "label";
              ctx.listData = ctx.transformMenu(ctx.listData);
              ctx.listData = [
                {
                  ID: "",
                  label: "全部",
                  value: "",
                  children: ctx.listData,
                },
              ];
            }

            if (ctx.groupMenu.displayType.indexOf("list") > -1) {
              ctx.component = "groupTree";
              ctx.defaultProps.label = ctx.groupMenu.secondProto;
              ctx.listData = ctx.listData.map((i) => {
                return {
                  label: i[ctx.defaultProps.label],
                  value: i[ctx.defaultProps.label],
                  ...i,
                };
              });
            }

            if (ctx.groupMenu.displayType.indexOf("tab") > -1) {
              ctx.component = "groupTab";
              ctx.defaultProps.label = ctx.groupMenu.secondProto;
              ctx.listData = ctx.listData.map((i) => {
                return {
                  label: i[ctx.defaultProps.label],
                  value: i[ctx.defaultProps.label],
                  ...i,
                };
              });
              ctx.listData.unshift({
                ID: "",
                label: "全部",
                value: "",
              });
              ctx.isMore = ctx.listData.length > 5 ? true : false;
              console.log("列表数据", ctx.listData);
            }
            ctx.config = {
              listData: ctx.listData,
              defaultProps: ctx.defaultProps,
            };
          })
          .catch((error) => {
            console.log(error);
            ctx.loading = false;
            ctx.listData = [];
          });

        ctx.config = {
          listData: ctx.listData,
          defaultProps: ctx.defaultProps,
          totalCount: ctx.totalCount,
        };
      }
    },

    getPageData(page = 1, size = 10, query = {}) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      ctx.defaultProps.label = ctx.groupMenu.secondProto;
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.groupMenu.secondId,
            orders: [],
            pageNum: page,
            pageSize: size,
            query,
            ranges: [],
            retrieveId: "paging",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.groupMenu.secondId,
            fields: [],
          },
        ],
      ]);
      // pck.docs.schemaType;
      if (!ctx.entityUrl.url) {
        pipe.entity
          .getEntityData(ctx.groupMenu.secondId, "ALCAP_PAGEING", paramsMap)
          .then((res) => {
            if (res) {
              console.log("最终返回的：", res);
              ctx.entityUrl = res.entityUrl;
              ctx.listData = (res.response && res.response.content).map((i) => {
                return {
                  ...i,
                  label: i[ctx.defaultProps.label],
                  value: i[ctx.defaultProps.label],
                };
              });
              ctx.totalCount =
                (res.response && res.response.totalElements) || 0;
            }
            ctx.config = {
              listData: ctx.listData,
              defaultProps: ctx.defaultProps,
              totalCount: ctx.totalCount,
            };
          })
          .catch((error) => {
            console.log(error);
            ctx.listData = [];
          });
      } else {
        ctx.$axios
          .post(
            `${axios.bff}${ctx.entityUrl.url}`,
            paramsMap.get(ctx.entityUrl.type)
          )
          .then((res) => {
            if (res.success) {
              ctx.listData = (res.obj && res.obj.content).map((i) => {
                return {
                  ...i,
                  label: i[ctx.defaultProps.label],
                  value: i[ctx.defaultProps.label],
                };
              });
              ctx.totalCount = (res.obj && res.obj.totalElements) || 0;
            } else {
              ctx.loading = false;
              ctx.listData = [];
            }
            ctx.config = {
              listData: ctx.listData,
              defaultProps: ctx.defaultProps,
              totalCount: ctx.totalCount,
            };
          })
          .catch((error) => {
            console.log(error);
            ctx.loading = false;
            ctx.listData = [];
          });
      }
    },

    transformMenu(list) {
      //函数内直接用ctx代替this访问vue页面的数据。
      var ctx = this;
      var menuObj = {},
        result = list || [];

      if (this.groupMenu.displayType === 'ALCAP_PAGEING:tree') {
        return this.listToTreeData(list);
      }

      if (list && list.length) {
        result
          .sort(function (a, b) {
            return parseInt(a.order, 10) - parseInt(b.order, 10);
          })
          .map(function (i) {
            !i.PARENTID && (i.PARENTID = "");
            var p = menuObj[i.PARENTID];

            if (!p) {
              p = menuObj[i.PARENTID] = {
                value: i[ctx.groupMenu.secondProto],
                ID: i.PARENTID,
                children: [],
              };
            } else {
              !p.children && (p.children = []);
            }

            var item = menuObj[i.ID] || {
              ID: i.ID,
              value: i[ctx.groupMenu.secondProto],
            };
            item.label = i[ctx.groupMenu.secondProto];
            item.PARENTID = i.PARENTID || "";
            menuObj[i.ID] = item;
            p.children.push(item);
          });
        ctx.menuTreeObj = menuObj;
        Object.keys(menuObj)
          .filter(function (e) {
            return !menuObj[e].children;
          })
          .map(function (e) {
            return delete menuObj[e];
          });
        return menuObj[""].children;
      } else {
        return [];
      }
    },

    listToTreeData(list) {
        const pKey = this.groupMenu.parentRelField;
        const cKey = this.groupMenu.childRelField;
        const map = {};
        for (const item of list) {
            if (map[item[pKey]]) {
                map[item[pKey]].children[item[cKey]] = {
                    key: item[this.groupMenu.secondProto],
                    value: item[this.groupMenu.secondProto],
                    label: item[this.groupMenu.secondProto],
                };
            } else {
                map[item[pKey]] = {
                    key: item[this.groupMenu.secondProto],
                    value: item[this.groupMenu.secondProto],
                    label: item[this.groupMenu.secondProto],
                    children: {
                        [item[cKey]]: {
                            key: item[this.groupMenu.secondProto],
                            value: item[this.groupMenu.secondProto],
                            label: item[this.groupMenu.secondProto],
                        },
                    },
                };
            }
        }
        for (const key in map) {
            map[key].children = Object.values(map[key].children);
        }
        return Object.values(map);
    }
  },
};
</script>

<style lang="less" scoped>
.group-menu {
  ::v-deep .el-dropdown {
    display: flex;
    align-items: center;
  }
  .more {
    color: #303133;
    font-size: 14px;
    font-weight: 500;
    .tab-active {
      background-color: #ecf5ff;
      color: #66b1ff;
      color: rgba(229, 231, 235, 1);
    }
  }
}
</style>