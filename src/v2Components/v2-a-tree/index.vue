<template>
  <div class="tree">
    <div class="tree-serach">
      <el-input
        v-model="searchText"
        size="mini"
        placeholder="搜索关键词"
        class="list-search"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="onTreeSearch"
        ></el-button>
      </el-input>
    </div>
    <el-tree
      ref="tree"
      class="tree-list"
      node-key="id"
      empty-text="暂无数据"
      :expand-on-click-node="false"
      :data="compOptions"
      :props="replaceFields"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      :render-content="renderContent"
    >
    </el-tree>
    <dialog-form :dialog-info="dialogInfo" @submit="formSubmit" />
  </div>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
import dialogForm from "./form";
export default {
  _options: pck.docs,
  mixins: [listMixin, window.codelessMixins.customDialog],
  components: {
    dialogForm
  },
  name: "v2ATree",
  props: {
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    replaceFields: {
      type: Object,
      default: () => {
        return { label: "label" };
      },
    },
    url: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: String | Object,
      default: () => {
        return "";
      },
    },
    label: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 搜索关键字
      searchText: "",

      // 菜单树数据
      dataOptions: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      pck,

      dataValue: this.value,

      entityObj: {},

      dialogInfo: {
        title: "新建",
        visible: false,
        width: "70%",
        fields: [],
        form: {},
      },
    };
  },
  created() {
    const ctx = this;
  },
  mounted() {
    const ctx = this;
  },
  watch: {
    entityId: {
      async handler(n) {
        if (n) {
          const ctx = this;
          ctx.entityObj = await pipe.entity.getEntityDetail(n);
        }
      },
      immediate: true
    }
  },
  computed: {
    compOptions() {
      const ctx = this;
      if (ctx.entityId) {
        console.log('返回了多少数据', ctx.dataOptions, ctx.transformMenu(ctx.dataOptions, ctx.parentId));
        ctx.replaceFields.label = ctx.label;
        return ctx.transformMenu(ctx.dataOptions, ctx.parentId);
      }else {
        return ctx.dataOptions;
      }
    },
    primaryField() {
      const ctx = this; 
      return ctx.entityObj?.fields?.find((i) => i.primaryKey === "1").dictionaryItem.engNameShort || "ID"
    },
  },
  methods: {
    nodeClick(data, node, ref) {
      const ctx = this;
      // console.log(data, node, ref);
      // ctx.dataValue = data;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.label].indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      const ctx = this;
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>

          <el-dropdown
              trigger="hover"
              on-command={(e) => {
                ctx.treeMoreClick(data, e);
              }}
            >
              <i class="app-menu-more el-icon-more transform rotate-90 absolute right-0 hidden"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="create">创建下级</el-dropdown-item>
                <el-dropdown-item command="update">编辑</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          
        </span>
      );
    },
    treeMoreClick(data, command) {
      const ctx = this;
      console.log(data, command);
      const clickMap = new Map([
        [ 'update', ()=> { ctx.showDialog('update', data) } ],
        [ 'create', ()=> { ctx.showDialog('create', data) } ],
        [ 'delete', ()=> { ctx.formSubmit(data, command) } ]
      ])

      clickMap.get(command).call(ctx);
    },
    /**
     * 树数据搜索
     */
    onTreeSearch() {
      const ctx = this;
      ctx.$refs.tree.filter(ctx.searchText);
    },
    showDialog(operationType, form) {
      const ctx = this;
      let dialogInfo = {
        fields: ctx.entityObj.fields.filter(i=>i.dictionaryItem.engNameShort === ctx.label || i.dictionaryItem.engNameShort === ctx.parentId),
        form: operationType === 'create'? {
          [ ctx.label ]: '',
          [ ctx.parentId ]: form[ctx.primaryField]
        }: form,
        width: "70%",
        entity: ctx.entityObj,
        operationType,
        title: operationType === 'create'? "新增": '修改',
        visible: true
      }
      ctx.$set(ctx, 'dialogInfo', dialogInfo);
    },
    // 实体操作提交
    async formSubmit(e, operationType) {
      const ctx = this;
      let form = e;
      let params = {
        entityId: ctx.entityObj.id,
        fields: [],
      };
      if (!ctx.entityObj) return;
      let idObj = ctx.entityObj?.fields?.find((i) => i.primaryKey === "1");
      console.log("主键", idObj);

      for (const key in form) {
        ctx.entityObj.fields.forEach((i) => {
          if (i.dictionaryItem.engNameShort === key) {
            params.fields.push({
              entityFieldId: i.id,
              value: form[key],
            });
          }
        });
      }
      // debugger
      if (!form[idObj.dictionaryItem.engNameShort]) {
        params.fields.push({
          entityFieldId: idObj.id,
          value: ctx.dialogInfo.form[idObj.dictionaryItem.engNameShort] || '',
        });
      }

      if (operationType === "delete") {
        ctx.openCustomDialog({
          title: "提示",
          path: "deleteConfirm",
          width: "300px",
          component: {
            template: `<div>此操作将永久删除该记录, 是否继续？</div>`,
          },
          confirmCallback() {
            params.recordId = e[idObj.dictionaryItem.engNameShort];
            ctx.entityRequest(operationType, params, ctx.entityObj);
          },
        });
      } else {
        ctx.entityRequest(operationType, params, ctx.entityObj);
      }
    },
    // 实体操作请求
    entityRequest(operationType, params, entity) {
      const ctx = this;
      const operationTypeMap = new Map([
        ["create", "添加"],
        ["update", "修改"],
        ["delete", "删除"],
      ]);
      console.log(entity.id, operationType, params);
      pipe.entity
        .getEntityData(entity.id, operationType, params)
        .then((res) => {
          ctx.$notify({
            message: operationTypeMap.get(operationType) + "成功！",
            title: "成功",
            type: "success",
          });
          ctx.dialogInfo.visible = false;
          ctx.getList();
        })
        .catch((err) => {
          // ctx.$notify.error({
          //   title: "错误",
          //   message: err.msg,
          // });
        });
    },
    transformMenu(data, parentField = 'PARENT_ID') {
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
        let parent = map[item[parentField]];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
  },
};
</script>

<style lang="less" scope>
.tree {
  width: 300px;
  .tree-list {
    height: 90%;
    margin-top: 10px;
    .tree-slot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        cursor: pointer;
      }
    }
  }
}
</style>