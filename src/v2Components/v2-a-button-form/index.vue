<template>
  <div class="v2-a-button-form w-full h-full flex justify-center items-center">
    <template v-for="item in formData.opr.filter((i) => i.opr.name !== 'upload')">
      <div
        class="btn"
        :style="{ background: !item.isThematic && (item.color || '#3698f2') }"
        :class="{
          btn_w: item.color === '#FFFFFF',
          'bg-primary': item.isThematic,
        }"
        :key="item.name"
        v-if="oprCascaderShow(item)"
        @click.stop="oprClick(item)"
      >
        <codeless-icon
          class="btn-icon"
          :icon="item.icon"
          v-if="item.icon"
        ></codeless-icon>
        <span>{{ item.name }}</span>
      </div>
    </template> 
  </div>
</template>

<script>
import pck from "./package.json";
// import PageDrawer from '@/views/codeLess/components/pageDrawer';
export default {
  mixins: [ window.codelessMixins.customDialog ],
  inject: ["root"],
  name: "v2AButtonForm",
  _options: pck.docs,
  components: {
    // PageDrawer
  },
  props: {
    formData: {
      type: Object,
      default: ()=> {
        return {
          opr: [
            {
              name: "提交",
              icon: "",
              color: "",
              isThematic: true,
              type: {
                label: "通用方法",
                value: "publicMethod",
              },
              entityId: "",
              opr: {
                id: "confirm",
                name: "提交内容",
              },
              wid: 1
            },
            {
              name: "重置",
              icon: "",
              color: "",
              isThematic: true,
              type: {
                label: "通用方法",
                value: "publicMethod",
              },
              entityId: "",
              opr: {
                id: "reset",
                name: "重置表单",
              },
              wid: 2
            },
          ],
        }
      }
    }
  },
  data() {
    return {

      dialogInfo: {
        title: "选择页面",
        visible: false,
        width: "50%",
        params: {},
        component: "",
      },
      emitParams: {},

      config: {
        page: {}
      },
      drawer: false
    };
  },
  computed: {
     // 操作按钮显隐
    oprCascaderShow() { 
      return (item)=> {
        if(!item.cascader || !item.cascader.some(i=>i.config === '2')) return true;
        const ctx = this;
        const hideCascaders = item.cascader.filter(i=>i.config === '2');
        let hideArr = [];
        hideCascaders.forEach(hideCascader=> {
          let isHide = false;
          let p = hideCascader.arg.substring(0, hideCascader.arg.indexOf("."));
          let c = hideCascader.arg.substring(hideCascader.arg.indexOf(".") + 1);
          if (hideCascader.editType !== '==' && !isNaN(ctx.root.args[p][c])) {
            isHide = eval(`Number(ctx.root.args[p][c]) ${hideCascader.hideType} Number(hideCascader.hideValue)`);
            // console.log(eval(`Number(ctx.root.args[p][c]) ${hideCascader.hideType} Number(hideCascader.hideValue)`));
          }else {
            isHide = eval(`ctx.root.args[p][c] ${hideCascader.hideType} hideCascader.hideValue`)
            // console.log(eval(`ctx.root.args[p][c] ${hideCascader.hideType} hideCascader.hideValue`));
          }
          hideArr.push(isHide);
        })
        console.log(hideArr.some(i=>i));
        
        return !hideArr.some(i=>i)
        
      }
    }
  },
  methods: {
    openPage(item) {
      const ctx = this;
      console.log("要跳转的页面", item);

      let syncParamsObj = {}
      if (item.syncParams) {
        
        item.syncParams.forEach(i=> {
          if (i.current) {
            if (i.isComponent) {
              ctx.$set(syncParamsObj, i.target, eval('ctx.params.' + i.current))
            }else {
              ctx.$set(syncParamsObj, i.target, eval('ctx.root.args.' + i.current))
            }
          }
        })
      }
      console.log('参数', syncParamsObj);

      let params = {
        title: item.title,
        pageId: item.path.prototypeId,
        prototypeId: item.path.prototypeId,
        runtime: true,
        syncParamsObj
      };
      let option = {
        title: item.title,
        path: item.type === "WINDOW" ? item.path : (item.path.path || ''),
        params,
        dialogInfo: item.dialogInfo
      }
      if (item.type === "drawer") {
        ctx.$set(ctx.config, "page", item.path);
        console.log("ctx.config", ctx.config);
        ctx.drawer = true;
        return
      }

      ctx.v2ComponentOpen(option, item.type);

      ctx.dialogInfo.visible = false;
      
    },
    async oprClick(item) {
      const ctx = this;

      msgHub.$emit('buttomFormClick', item);
    }
  },
  created() {
    const ctx = this;
    // AUAE.msgHub.$on("click", (item) => {
      
    //   console.log("拓扑emit", item);
    //   ctx.emitParams = item;
    //   //函数内直接用ctx代替this访问vue页面的数据。
    //   ctx.dialogInfo = {
    //     title: `页面列表`,
    //     visible: false,
    //     width: "50%",
    //     params: "",
    //   };
    //   ctx.dialogInfo.visible = true;
      
    // });
    // AUAE.msgHub.$on("contextmenu", (item) => {
    //   console.log("拓扑emit", item);
    // });
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.v2-a-button-form {
  width: 100%;
  text-align: center;
  display: flex;
  // justify-content: center;
  // padding: 16px 0;
  .btn {
    width: fit-content;
    height: 28px;
    padding: 0 20px;
    opacity: 1;
    border-radius: 4px;
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    border: 1px solid #ffffff;
    &:hover {
      opacity: 0.7;
    }
    .btn-icon {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
  .btn:nth-child(n+2) {
    margin-left: 22px;
  }
  .btn_w {
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  .btn_disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

</style>