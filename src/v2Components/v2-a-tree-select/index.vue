<template>
  <el-select
    size="mini"
    filterable
    v-model="vModel"
    :clearable="clearable"
    @clear="clearHandle"
  >
    <el-option :value="dataValue" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="dataOptions"
        :props="props"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :node-key="primaryField"
        :default-expanded-keys="[]"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ATreeSelect",
  props: {
    // 配置项
    props: {
      type: Object,
      default: () => ({
        value: "value", // ID字段名
        label: "label", // 显示名称
        children: "children", // 子级字段名
      }),
    },

    // 选项列表数据(树形结构的对象数组)
    options: { type: Array },

    // 初始值
    value: { type: [String, Number], default: null },

    // 可清空选项
    clearable: { type: Boolean, default: true },

    // 自动收起
    accordion: { type: Boolean, default: false },

    config: {},
  },
  data() {
    return {
      dataValue: this.value,
      valueTitle: "",
      defaultExpandedKey: [],
      dataOptions: [],
      primaryField: "",
    };
  },
  mounted() {
    // this.props.value = this.config.component.labelValue;
    // this.props.label = this.config.component.label;

    this.getTreeList();
    // if (this.options.length > 0) {
    //   this.options[0].children = this.options[0].children.filter(i=>!i.codelessType || i.codelessType == '0');
    //   this.dataOptions = this.options;
    //   this.initHandle();
    //   this.defaultExpandedKey = [];
    // }
  },
  updated() {
    // this.getTreeList()
    if (this.dataOptions.length > 0) {
      this.initHandle();
      this.defaultExpandedKey = [];
    } else {
      this.initHandle();
      this.defaultExpandedKey = [];
    }
  },
  methods: {
    getTreeList() {
      const ctx = this;
      const paramsMap = new Map([
        [
          "db",
          {
            entityId: ctx.config.entityId,
            orders: [],
            pageNum: 1,
            pageSize: 10,
            query: {},
            ranges: [],
            retrieveId: "list",
          },
        ],
        [
          "data_source",
          {
            entityId: ctx.config.entityId,
            fields: [],
          },
        ],
      ]);
      ctx.loading = true;
      pipe.entity
        .getEntityData(ctx.config.entityId, pck.docs.schemaType, paramsMap)
        .then((res) => {
          if (res) {
            console.log("res", res);
            ctx.primaryField = res.entity.fields.filter(
              (i) => i.primaryKey === "1"
            )[0].name;
            ctx.dataOptions = (res.response && res.response.content) || [];

            ctx.dataOptions = ctx.transformMenu1(ctx.dataOptions);
            console.log("ctx.dataOptions", ctx.dataOptions);

            ctx.initHandle();
          } else {
            ctx.loading = false;
          }
        })
        .catch((err) => {
          ctx.loading = false;
        });
    },
    // 初始化值
    initHandle() {
      // console.log(this.dataValue)
      if (this.dataValue) {
        // this.valueTitle = this.$refs.selectTree.getNode(this.dataValue).data[this.props.label]; // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.dataValue); // 设置默认选中
        this.defaultExpandedKey = []; // 设置默认展开
      } else {
        this.valueTitle = "";
        this.$refs.selectTree.setCurrentKey();
      }
      this.initScroll();
    },
    One_cd() {
      this.valueTitle = "一级菜单";
      this.$emit("getValue", "0");
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        let scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach((ele) => (ele.style.width = 0));
      });
    },

    // 切换选项
    handleNodeClick(node) {
      console.log("选中的节点", node);
      this.valueTitle = node[this.props.label];

      this.dataValue = node[this.props.value];
      this.defaultExpandedKey = [];
    },

    // 清除选中
    clearHandle() {
      this.valueTitle = "";
      this.dataValue = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("getValue", null);
    },

    // 清空选中样式
    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach((element) => element.classList.remove("is-current"));
    },
    transformMenu1(data) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach((item) => {
        delete item.children;
      });
      let map = {};
      data.forEach((item) => {
        map[item[ctx.primaryField]] = item;
      });
      data.forEach((item) => {
        let parent = map[item.PARENT_ID];
        if (parent) {
          (parent.children || (parent.children = [])).push({
            ...item,
            label: item[ctx.config.component.label],
            value: item[ctx.config.component.labelValue],
          });
        } else {
          result.push({
            ...item,
            label: item[ctx.config.component.label],
            value: item[ctx.config.component.labelValue],
          });
        }
      });
      console.log("result", result);
      return result;
    },
    // 转换
    transformMenu(list) {
      //函数内直接用ctx代替this访问vue页面的数据。
      const ctx = this;
      let menuObj = {},
        result = list || [];
      if (list && list.length) {
        result.map((i) => {
          !i.PARENT_ID && (i.PARENT_ID = "");
          let p = menuObj[i.PARENT_ID];
          if (!p) {
            p = menuObj[i.PARENT_ID] = {
              value: i.PARENT_ID,
              id: i.PARENT_ID,
              children: [],
            };
          } else {
            !p.children && (p.children = []);
          }
          let item = menuObj[i[[this.config.component.labelValue]]] || {
            id: i[this.config.component.labelValue],
            value: i[this.config.component.labelValue],
          };
          item.label = i[this.config.component.label];
          item.parentId = i.PARENT_ID || "";
          menuObj[i[this.config.component.labelValue]] = item;
          p.children.push(item);
        });
        ctx.menuTreeObj = menuObj;
        Object.keys(menuObj)
          .filter((e) => !menuObj[e].children)
          .map((e) => delete menuObj[e]);
        console.log("menuObj", menuObj[""]);
        return menuObj[""].children;
      } else {
        return [];
      }
    },
  },

  watch: {
    value() {
      this.dataValue = this.value;
      this.initHandle();
    },
    dataValue: {
      handler(n) {
        this.$emit("update:value", n);
      },
    },
    "config.component.label": {
      handler(n) {
        this.getTreeList();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}

::-webkit-scrollbar {
  display: none;
  width: 5px;
  background-color: #f3f3f3;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #f3f3f3;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: var(--color-primary);
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}

.Bg {
  background: #1aa094;
  color: white;
}
</style>
