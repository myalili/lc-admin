<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <tree-select
      style="width: 180px"
      :options="categoriesTree"
      :value.sync="obj.model[item.name]"
      :props="props"
    />
  </div>
</template>

<script>
import { require } from "./mixins";
// import treeSelect from "@/views/codeLess/components/treeSelect";
export default {
  mixins: [require],
  components: {
    // treeSelect,
  },
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      categoriesTree: [],
      props: {
        value: "code", // ID字段名
        label: "name", // 显示名称
        children: "childs", // 子级字段名
      },
    };
  },
  computed: {},
  async mounted() {
    const ctx = this;
    console.log(ctx.obj);
    console.log(ctx.item);
    await this.getCategoriesTree();
  },
  methods: {
    async getCategoriesTree() {
      const { tree } = window.getBffApi();
      const res = await tree('code');
      if (res.childs) {
        const forTree = (e) => {
          e.childs = e.childs.map((e) => {
            if (e.isLeaf !== "1") {
              forTree(e);
            }
            return {
              ...e,
              code: e && e.other ? e.other.code : e.id,
            };
          });
        };
        this.categoriesTree = res.childs.map((i) => {
          if (i.childs && i.isLeaf !== "1") {
            forTree(i);
          }
          return {
            ...i,
            code: i && i.other ? i.other.code : i.id,
          };
        });
        console.log("this.categoriesTree", this.categoriesTree);
      } else {
        this.categoriesTree = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
}
</style>