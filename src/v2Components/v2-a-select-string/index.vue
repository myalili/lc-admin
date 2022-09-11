<template>
  <el-select
    v-model="vModel"
    multiple
    filterable
    :placeholder="placeholder"
    size="mini"
  >
    <el-option
      :value="item.value"
      :label="item.label"
      v-for="(item, index) in dataOptions"
      :key="index"
    >
      {{ item.label }}
    </el-option>
  </el-select>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: "v2ASelectString",
  props: {
    // 配置项
    props: {
      type: Object,
      default: () => ({
        value: "value", // ID字段名
        label: "nodeName", // 显示名称
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

    AParams: {},

    entityId: ''
  },
  data() {
    return {
      dataValue: this.value,
      valueTitle: "",
      defaultExpandedKey: [],
      dataOptions: [],
    };
  },
  watch: {
    entityId: {
      handler(n, o) {
        if (n !== o) {
          this.getTreeList();
        }
      },
    },
  },
  mounted() {
    this.getTreeList();
  },
  // updated() {
  //   // this.getTreeList()
  //   if (this.dataOptions.length > 0) {
  //     this.initHandle();
  //     this.defaultExpandedKey = [];
  //   } else {
  //     this.initHandle();
  //     this.defaultExpandedKey = [];
  //   }
  // },
  methods: {
    async getTreeList() {
      const ctx = this;
      
      const entityId = ctx.entityId || ctx.config?.entityId || '';
      console.log('实体', ctx.entityId);
      if (!entityId) return;
      let res = await pipe.entity.getEntityDetail(entityId);
      const params = {
        entityId,
        fields: [],
      };
      // console.log('AParams', this.config);
      // if (this.AParams.node) {
      //   console.log(this.AParams.node.data.modelId);
      // }
      ctx.loading = true;

      const { dataSourceRetrieveRecord } = window.getBffApi();
      dataSourceRetrieveRecord(params)
        .then((res) => {
          if (res.success) {
            ctx.dataOptions = res.obj.content[0].children.map((i) => {
              return {
                ...i,
                label: i.nodeName,
                value: i.nodeName,
              };
            });
            console.log("v2ASelectString", ctx.dataOptions);
          }
        });
    },
    // 初始化值
    initHandle() {
      // console.log(this.dataValue)
      if (this.dataValue) {
        this.valueTitle = this.$refs.selectTree.getNode(this.dataValue).data[
          this.props.label
        ]; // 初始化显示
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
  },

  watch: {
    value() {
      this.dataValue = this.value;
      // this.initHandle();
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
</style>
