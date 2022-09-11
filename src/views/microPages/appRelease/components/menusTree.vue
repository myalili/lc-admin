<template>
  <tree-component title="菜单" :data="data" :checkedNodes="checkedNodes" :defaultProps="defaultProps" />
</template>

<script>
  import treeComponent from './treeComponent.vue';

export default {
  components: {
    treeComponent
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      checkedNodes: [],

      platformTypeList:[ window.platform ],
    };
  },
  watch: {

  },
  created() {
    this.getMenus()
  },
  methods: {
    async getMenus() {
      const ctx = this;
      const { requestMenus } = window.getAacApi()
      let params = {};
      if (this.platformTypeList.length > 0) {
        params.type = this.platformTypeList.join(",");
      }
      let res = await requestMenus(params);
      if (res.success) {
        let content = res.content.filter(item=>{
          return item.codelessType==="runtimeMenu"||item.codelessType==="devMenu"
        })
        // console.log(this.transformMenu(content).filter(i=>i.children));
        console.log('this.platformObj', content);
        ctx.data = ctx.getParentData(content, '').ALCAP
        console.log('data', ctx.data);
      }
    },

    getParentData(data, keyword) {
      let self = this;
      let cloneData = JSON.parse(JSON.stringify(data));
      let parentData = {};
      for (let parent of cloneData) {
        if(keyword !== "" && parent.type === self.activeName){
          if (!parentData[parent.type]) {
            parentData[parent.type] = [];
          }
          parentData[parent.type].push(parent);
        }
        else{
            if (parent.parentId === null || parent.parentId === "") {
            parent.label = parent.title;
            parent.value = parent.id;
            let childrenCopy = this.getChildren(parent.id, cloneData);
            if (childrenCopy.length > 0) {
              parent.children = childrenCopy;
            }
            if (!parentData[parent.type]) {
              parentData[parent.type] = [];
            }
            parentData[parent.type].push(parent);
          }
        }
        
      }
      return parentData;
    },
    getChildren(parentId, data) {
      let children = [];
      for (let child of data) {
        if (child.parentId === parentId) {
          child.label = child.title;
          child.value = child.id;
          children.push(child);
        }
      }
      for (let child of children) {
        let childrenCopy = this.getChildren(child.id, data);
        if (childrenCopy.length > 0) {
          child.children = childrenCopy;
        }
      }
      return children;
    },

    transformMenu(data, parentField = "parentId") {
      //函数内直接用ctx代替this访问vue页面的数据。
      console.log("parentField", parentField);
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
        map[item.id] = item;
      });
      data.forEach((item, index) => {
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

<style lang="scss" scoped>

</style>