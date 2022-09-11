<template>
  <div
    ref="nav"
    class="comp-select"
    style="display: flex; align-items: center;"
  >
    <template v-for="item in componentList">
      <div
        class='whitespace-nowrap mr-11 last:mr-0'
        style='height:50px;'
        ref = 'componentListItem'
        :key="item.type"
        v-if="item.components && item.components.length"
      >
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i
              theme="filled"
              class="el-icon-circle-plus"
              :style="{ color: item.color, 'font-size': '20px' }"
            />
            <span style="margin: 0 0 0 5px">{{ item.name }}</span>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            style="max-height: 400px; overflow: scroll"
          >
            <el-dropdown-item
              v-for="(action, key) in item.components"
              :key="key"
              :command="action"
            >
              <div>{{ action.name }}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'compSelect',
  inject: ["root"],
  data() {
    return {
      componentList: {
        base: {
          type: "base",
          name: "基础组件",
          components: [],
          color: "#FFAD2C",
        },
        work: {
          type: "work",
          name: "工作台组件",
          components: [],
          color: "#0be4c7",
        },
        form: {
          type: "form",
          name: "表单组件",
          components: [],
          color: "#FE69BE",
        },
        dashboard: {
          type: "dashboard",
          name: "仪表盘组件",
          components: [],
          color: "#F65656",
        },
        preset: {
          type: "preset",
          name: "预设组件",
          components: [],
          color: "#5361FF",
        },
        topo: {
          type: "preset",
          name: "3D/拓扑",
          components: [],
          color: "#409eff",
        },
      },

      // scroll: {},
    };
  },
  computed: {
    pages() {
      let ret = [];
      let pages = activator.getPage();
      if (pages && Object.keys(pages).length) {
        Object.keys(pages).forEach((name) => {
          pages[name] && ret.push(pages[name]);
        });
        // console.log(ret);
      }
      return ret;
    },
    curPage() {
      let page = {};
      let self = this;

      let ret = this.pages.filter((item) => {
        return item.type === self.root.type;
      });
      ret.length && (page = ret[0]);
      return page;
    },
    // filterComponentList() {
    //   const ctx = this;
    //   let list = [];
    //   debugger;
    //   for (const key in ctx.componentList) {
    //     if (
    //       ctx.componentList[key].type.includes(ctx.curPage.name) &&
    //       ctx.componentList[key].components.length > 0
    //     ) {
    //       list.push(ctx.componentList[key]);
    //     }
    //   }
    //   return list;
    // },
    // filterComponents() {
    //   return (comps) => {
    //     const ctx = this;
    //     let list = [];
    //     comps.forEach((el) => {
    //       if (el.accept.includes(ctx.curPage.name)) {
    //         list.push(el);
    //       }
    //     });
    //     return Array.from(new Set(list));
    //   };
    // },
  },
  mounted() {
    this.getComponentList();
  },
  methods: {
    handleCommand(command) {
      const ctx = this;
      console.log("添加组件", command);
      if (command) msgHub.$emit("addChild", command);
    },
    getComponentList() {
      const ctx = this;
      let components = Vue.options.components;
      for (const key in components) {
        if (
          components[key].hasOwnProperty("extendOptions") &&
          components[key].extendOptions.hasOwnProperty("_options")
        ) {
          let _options = components[key].extendOptions._options;

          if (!_options.type || !ctx.componentList[_options.type]) {
            continue;
          }
          if (_options.accept && _options.accept.includes(this.curPage.id)) {
            let props = [..._options.option.map((i) => i.name)];
            let propsData = {};
            _options.option.map((i) => {
              propsData[i.name] = i.defaultValue;
            });

            ctx.componentList[_options.type].components.push({
              name: _options.name,
              type: _options.type,
              href: _options.href,
              component: _options.href,
              props,
              // option: [..._options.option],
              ...propsData,
              __editor: [],
              schemaType: _options.schemaType || "",
              accept: _options.accept || [],
              style: _options.style || null
            });
          }

          // comObj[_options.href] = {
          //   name: _options.name,
          //   type: _options.type,
          //   href: _options.href,
          //   component: _options.href,
          //   props,
          //   ...propsData,
          //   __editor: []
          // };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-select {
  &::-webkit-scrollbar {
    display: none;
  }
  width: 100%;
  box-sizing: border-box;
  // padding: 0 1px;
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
 
  //width: 141px;
}
</style>