export const listMixin = {
  props: {
    enumCode: {
      type: String,
      default: () => {
        return "";
      },
    },
    dataSource: {
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
    entityId: {
      type: String,
      default: () => {
        return "";
      },
    },
    value: {
      type: String,
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
  },
  watch: {
    'config.enumCode': {
      handler(n) {
        this.searchEnums()
      },
      immediate: true
    },
    'config.entityId': {
      handler(n) {
        this.getList()
      },
      immediate: true
    },
    'entityId': {
      handler(n, o) {
        // console.log('hi实体实体', n);
        if (n && n !== o) {
          this.getList();
        }
      },
      immediate: true
    },
    'enumCode': {
      handler(n) {
        this.searchEnums()
      },
      immediate: true
    },
    // "dataValue": {
    //   handler(n) {
    //     if (this.$parent.config) {
    //       this.$parent.config.value = n;
    //     } else {
    //       this.$emit('update:value', n);
    //     }
    //   }
    // },
    // "value": {
    //   handler(n) {
    //     this.dataValue = n;
    //   }
    // },
  },
  created() {
    const ctx = this;
    if (ctx.dataSource) {
      ctx.dataSource === 'entityId' ? this.getList() : this.searchEnums()
    } else {
      if (JSON.stringify(ctx.config) !== '{}' && ctx.config.component.dataSource === 'entityId') {
      this.getList()
      }else if(JSON.stringify(ctx.config) !== '{}' && ctx.config.component.dataSource === 'enum') {
        this.searchEnums()
      }
    }
  },
  computed: {
    computedOption() {
      const ctx = this;
      return(item)=> {
        if ((JSON.stringify(ctx.config) !== '{}' && ctx.config.component.dataSource === 'enum') || ctx.dataSource === 'enum') {
          return {
            label: item.label || item.name,
            value: item.value
          }
        }else if((JSON.stringify(ctx.config) !== '{}' && ctx.config.component.dataSource === 'entityId') || ctx.dataSource === 'entityId') {
          return {
            label: item[ctx.label || ctx.config.component.label],
            value: item[ctx.labelValue || ctx.config.component.labelValue]
          }
        }else {
          return {
            label: item.label || item.name,
            value: item.value
          }
        }
      }
    }
  },
  methods: {
    async searchEnums() {
      const ctx = this;
      try {
        const { codeList } = window.getBffApi();
        const res = await codeList({ code: ctx.config?.enumCode || ctx.enumCode, pageNum: 1, pageSize: 100000 });
        if (res) {
          ctx.dataOptions = res.pageData || [];
        } else {
          ctx.dataOptions = [];
        }
      } catch (error) {
        ctx.dataOptions = [];
        console.error(error);
      }
    },
    getList() {
      const ctx = this;
      // console.log("ctx.entityId", ctx.entityId);
      const dbParams = {
        entityId: ctx.entityId,
        orders: [],
        query: {},
        ranges: [],
        retrieveId: "list",
      };
      const dsParams = {
        entityId: ctx.entityId,
        fields: [],
      };
      const dfParams = {
        entityId: ctx.entityId,
        deptId: ctx.$store.state.user.curDepartment?.id || ''
      };
      const paramsMap = new Map([
        ["db", dbParams],
        ["data_source", dsParams],
        ["data_factory_sql", dfParams],
        ["data_factory_script", dfParams],
      ]);
      if (ctx.entityId) {
        pipe.entity
          .getEntityData(ctx.entityId, ctx.pck.docs.schemaType, paramsMap)
          .then((res) => {
            // console.log("最终返回的：", res);
            ctx.loading = false;
            if (res.entityUrl.type === 'data_factory') {
              ctx.dataOptions =(res && res.response) || [];
            }else {
              ctx.dataOptions =(res.response && res.response.content) || [];
            }
            
            // console.log("列表数据", ctx.dataOptions);
          })
          .catch((error) => {
            console.log(error);
            ctx.loading = false;
            ctx.dataOptions = [];
          });
      } else {
        ctx.dataOptions = ctx.options;
      }
    },
  }
};

export const vModel = {
  inject: ['root'],
  props: {
    syncParam: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
  },
  computed: {
    vModel: {
      get() {
        // console.log(JSON.stringify(this.syncParam ) !== '{}' && this.syncParam.value, this.value);
        if (JSON.stringify(this.syncParam ) !== '{}' && this.syncParam.value) {
          return this.getRootKey('value')
        }else {
          return this.value
        }
      },
      set(n) {
        // console.log('设定的值',n);
        if (JSON.stringify(this.syncParam) !== '{}') {
          this.getRootKey('value', n)
          this.$emit('update:value', n);
        }else {
          let val = n;
          if(this.valueSet) val = this.valueSet(n);
          this.$emit('update:value', val);
        } 
      }
    },

    vModelFormat: {
      get() {
        return this.valueGet(this.value);
      },
      set(val) {
        this.vModel = val
      }
    }
  },
  methods: {
    getRootKey(e, val) {
      const param = this.syncParam[e]
      if (!param) return
      let p = param.substring(0,param.indexOf('.'));
      let c = param.substring(param.indexOf('.') + 1);
      if (val !== undefined) {
        this.root.args[p][c] = val
      }
      return this.root.args[p][c]
    }
  }
}

const { getSource } = window.alcapCoreUtils;
export const vRegister = {
  data: {
    needRegisterArr: []
  },
  methods: {
    componentRegister(action, res) {
      if (!action || !res) return;
      if (!res.mixins) {
        res.mixins = [];
      }
      if (res._options.type === 'form' || res._options.option.some(i=>i.name === 'syncParam')) {
        res.mixins?.push(vModel);
      }
      Vue.component(action, res);
      // console.log(action + '组件注册了');
      this.$forceUpdate();
    },


    getHrefList(arr) {
      let newArr = [];
      arr.forEach(item => {
        let name = '';
        // console.log('什么组件', item.href);
        if (item.href.startsWith('@alcap-component/')) {
          name = item.href.substring(e.indexOf('@alcap-component/') + 17);
        }else {
          name = item.href;
        }
        if (!Vue.options.components[name]) {
          newArr.push(name);
        }

        if (!item.echoHref) return

        if (item.echoHref.startsWith('@alcap-component/')) {
          name = item.echoHref.substring(e.indexOf('@alcap-component/') + 17);
        }else {
          name = item.echoHref;
        }
        if (!Vue.options.components[name]) {
          newArr.push(name);
        }
      });
      return newArr
    },
    getNeedRegisterList(arr) {
      const ctx = this;
      let copyArr = this.getHrefList(arr);
      arr.forEach(e=> {
        if (e.children?.length > 0) {
          copyArr = [ ...copyArr, ...this.getHrefList(e.children) ];
        }
      })
      return [ ...new Set(copyArr) ];
    },
    async getSourceForArr(arr) {
      let needRegisterArr =  this.getNeedRegisterList(arr);
      if (needRegisterArr.length === 0) { needRegister: needRegisterArr };
      // console.log('添加了多少组件', needRegisterArr);
      let registerComps = await Promise.all(needRegisterArr.map(item=> getSource('@alcap-component/' + item)));
      // console.log('getSources数组返回的结果', registerComps);
      for (let index = 0; index < registerComps.length; index++) {
        if (!registerComps[index]) {
          this.$notify({
            title: "加载失败",
            message: needRegisterArr[index] + "组件内容缺失",
            type: "error",
          });
          continue;
        }
        // if (!needRegister[index] || !registerComps[index]) return;
        this.componentRegister(needRegisterArr[index], registerComps[index]);
      }
      return { needRegister: needRegisterArr, registerComps };
    },
    async componentChildrenUpdate(arr, pWid) {
      const ctx = this;
      if(!pWid) return;
      let pChild = [];
      let p = null
        if (!ctx.root.pageContent?.structure || JSON.stringify(ctx.root.pageContent) === '{}') {
          if (!ctx.root.$refs.componentsRef) {
            p = ctx.root.content
          }else {
            p = pChild = ctx.root.$refs.componentsRef.pageDef.structure.children.find(i=>i.wid === pWid);
          }
        }else {
          p = ctx.root.pageContent.structure.children.find(i=>i.wid === pWid);
        }
        if (!p.children) {
          if (p.href === 'v2-a-form-search') {
            ctx.$set(p, 'children', [ { href: "v2-a-input", wid: 1 }, { href: "v2-a-table", wid: 2 }, ]);
          }
          if (p.href === 'v2-a-form-config') {
            ctx.$set(p, 'children', [ { href: "v2-a-input", wid: 3 } ]);
          }
        }
        if (p.href === 'v2-a-form-search') {
          if (p.children.every(i=>i.href !== "v2-a-input")) {
            p.children.push({ href: "v2-a-input", wid: 1 })
          }else if (p.children.every(i=>i.href !== "v2-a-table")) {
            p.children.push({ href: "v2-a-table", wid: 2 })
          }
        }
        pChild = p.children;

      
      // this.getSourceForArr(arr, true);
      
      for (let index = 0; index < arr.length; index++) {
       
        let item = arr[index];
        if(!item.component.href) continue;
        if (pChild.findIndex(i=>i.wid === item.wid && i.href === item.component.href && i.echoHref === item.echoComponent?.href) > -1 && item.wid) continue;
        if (pChild.findIndex(i=>i.wid === item.wid) > -1) {
          pChild[pChild.findIndex(i=>i.wid === item.wid)].href = item.component.href;
          pChild[pChild.findIndex(i=>i.wid === item.wid)].name = item.dictionaryItem && item.dictionaryItem.name;
          console.log('item.echoComponent?.href', item);
          if (item.echoComponent?.href) {
            pChild[pChild.findIndex(i=>i.wid === item.wid)].echoHref = item.echoComponent?.href;
          }
        }else {
          pChild.push(
            {
              wid: item.wid || new Date().valueOf() + ((Math.random() * 100000) | 0),
              href: item.component.href,
              name: item.dictionaryItem && item.dictionaryItem.name
            }
          )
        }
        
      } 
    },

    // 添加组件的检测
    async addChildJudge(item) {
      if(!item.href) return false
      const isInCludes = Vue.options.components[ item.href ];
      if (isInCludes) return true
      
      let name = ''
      if (item.href.startsWith('@alcap-component/')) {
        name = item.href
      }else {
        name = '@alcap-component/' + item.href
      }
      let res = await this.getSourceForArr([ item ]);
      if (!res.registerComps[0] || !res) return false;
      return true;
    },
    delChildrenComp(arr, pWid) {
      const ctx = this;
      let pChild = [];
      if (!ctx.root.pageContent?.structure || JSON.stringify(ctx.root.pageContent) === '{}') {
        if (!ctx.root.$refs.componentsRef) {
          pChild = ctx.root.content.children
        }else {
          pChild = ctx.root.$refs.componentsRef.pageDef.structure.children.find(i=>i.wid === pWid).children;
        }
      }else {
        pChild = ctx.root.pageContent.structure.children.find(i=>i.wid === pWid).children;
      }
      for (let index = 0; index < arr.length; index++) {
        console.log(arr[index].component);
        if (!arr[index].wid) continue;
        ctx.deleteNode(pChild, arr[index].wid);
      }
    },
    deleteNode(arr, targetId) {
      for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        if (node.wid === targetId) {
            arr.splice(arr.findIndex(a=>a.wid === node.wid), 1);
            console.log('删掉了谁', node.wid);
            return;
        }
        // 判断children存在并且有数据
        if (Array.isArray(node.children) && node.children.length) {
            return deleteNode(node.children, targetId);
        }
      }
    }
  }
}
  