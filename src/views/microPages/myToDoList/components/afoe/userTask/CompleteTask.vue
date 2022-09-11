<template>
  <el-container class="aops-el-common todo-step" v-loading="taskDefLoading">
    <el-header v-if="!isMicroPage && !isPage">
      <el-form label-suffix=":">
        <el-form-item label="办理操作">
          <template v-if="isSign">
            <el-button @click="handlePass" :loading="loading">通过</el-button>
            <el-button @click="handleReturn" :loading="loading">拒绝</el-button>
          </template>
          <template v-else>
            <el-button @click="handlePass" :loading="loading">完成</el-button>
            <el-button @click="toTurnTask">转办</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <component :is="subComponent" :pageRenderConfig="pageRenderConfig"></component>
      <!-- <router-view></router-view> -->
      <!-- <parser v-if="isFormPage" :form-conf="formConf" ref="parserRef" /> -->
      <!-- <iframe
        v-else-if="isMicroPage"
        :src="microPageUrl"
        frameborder="0"
        style="width:100%;height: calc(100% - 5px);"
      />
      <iframe v-else-if="isPage" :src="pageUrl" frameborder="0" style="width:100%;height: calc(100% - 5px);" /> -->
    </el-main>
  </el-container>
</template>
<script>
// import { deepClone } from '@/components/formGenerator/utils/index';
// import { inputComponents, selectComponents } from '@/components/formGenerator/components/generator/config.js';
// import Parser from '@/components/formGenerator/components/parser/Parser';
import { mapActions } from 'vuex';
// const { getPageDetails } = window.getBffApi();
import  turnTask from './TurnTask.vue';
const {getSource} = window.alcapCoreUtils;
// import { formToGenerator } from '@/utils/extranForm'


// function getFormConf(fields = []) {
//   return {
//     formRef: 'elForm',
//     formModel: 'formData',
//     size: 'medium',
//     labelPosition: 'right',
//     labelWidth: 100,
//     formRules: 'rules',
//     gutter: 15,
//     disabled: false,
//     span: 24,
//     formBtns: false,
//     __methods__: {},
//     fields
//   };
// }

// function getVariables(fields, modelData) {
//   const result1 = fields.reduce((prev, item) => {
//     prev[item.__vModel__] = item.__config__.defaultValue;
//     return prev;
//   }, {});
//   const result2 = JSON.parse(JSON.stringify(modelData));
//   return {
//     ...result1,
//     ...result2
//   };
// }

export default {
  store:window.aopsStore,
  components: {
    // Parser
  },
  mixins:[window.V8.mixins],
  data() {
    return {
      taskDef: null,
      taskDefLoading: false,
      loading: false,
      subComponent:{},
      pageRenderConfig:null,
    };
  },
  computed: {
    // formConf() {
    //   const { formDef, dynProps } = this.taskDef;
    //   const formConf = formDef ? JSON.parse(formDef) : getFormConf();
    //   // 动态表单
    //   if (dynProps) {
    //     Array.prototype.push.apply(formConf.fields, this.parseDynProps(dynProps));
    //   }
    //   return formConf;
    // },
    // isFormPage() {
    //   return this.taskDef?.type === 'FORM';
    // },
    // isPage() {
    //   return this.taskDef?.type === 'PAGE' && this.taskDef.pageUrl ? true : false;
    // },
    // isMicroPage() {
    //   return this.taskDef?.type === 'PAGE' && this.taskDef.microPageUrl ? true : false;
    // },
    isSign() {
      return this.taskDef?.sign ?? false;
    }
  },
  async created() {
    // console.log(this.AParams.id);
    await this.loadFormDef();
    this.subComponent = await getSource("@micro-page/appRender");
    
  },
  methods: {
    ...mapActions('afoeAdminLpTodoTask', ['getFormDef', 'complete']),
    async getPageContent(id){
      console.log(id);
      let ctx = this;
      ctx.pageRenderConfig = {
              id,
              prototypeId:id,
              runtime:true
            }
             
    },
    async loadFormDef() {
      this.taskDefLoading = true;
      try {
        const res = await this.getFormDef({
          clusterId: this.AParams.clusterId,
          taskId: this.AParams.id
        });
        // const { type, formDef, dynProps, pageUrl, microPageUrl } = res;
        // const { formDef } = res;
        // res.formDef = formToGenerator(formDef);
        this.taskDef = res ?? {};
        let {pageUrl} = res;
        if(pageUrl){
          await this.getPageContent(pageUrl)
        }
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
      this.taskDefLoading = false;
    },
    // parseDynProps(dynProps) {
    //   if (!dynProps || dynProps.length <= 0) {
    //     return [];
    //   }
    //   const setItem = (configType, dynItem) => {
    //     // 先不支持不可读和表达式
    //     const basicField = deepClone(configType);
    //     basicField.__config__.defaultValue = dynItem.value;
    //     basicField.__config__.required = dynItem.required;
    //     basicField.__config__.label = dynItem.name;
    //     // id作为vmodel的值
    //     basicField.__vModel__ = dynItem.id;
    //     // 可读默认为true
    //     basicField.readonly = !dynItem.writable;
    //     return basicField;
    //   };
    //   // 转化成generator的格式
    //   return dynProps.map(item => {
    //     switch (item.type) {
    //       case 'boolean': {
    //         return setItem(selectComponents[4], item);
    //       }
    //       default: {
    //         return setItem(inputComponents[0], item);
    //       }
    //     }
    //   });
    // },
    handlePass() {
      // if (this.$refs.parserRef) {
      //   this.$refs.parserRef.submitForm(() => this.handleComplete('AGREE'));
      // } else {
        this.handleComplete('AGREE');
      // }
    },
    // 处理-拒绝
    handleReturn() {
      this.handleComplete('DISAGREE');
    },
    // 处理-转办
    toTurnTask() {
      let ctx = this;
      this.open({
        title: '任务转办',
        path: '/TurnTask',
        component:turnTask,
        // page: 'microPages/myToDoList/components/afoe/userTask/TurnTask.vue',
        customClass: 'aops-el-common',
        width: '700px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          clusterId: ctx.AParams.clusterId,
          taskId: ctx.AParams.id
        },
        confirmCallback: () => {
          this.$message({ message: '转办成功, 1s后关闭该窗口', type: 'success' });
          // 办理成功，关闭tab，延时1s关闭
          setTimeout(async() => {
            let component =await getSource("@micro-page/myToDoList",{
                inSpaOpen:true
            })
            ctx.open({
              path:'/myToDoList',
              ...component
            })
           }, 1000);
        }
      });
    },
    async handleComplete(opinion) {
      this.loading = true;
      let ctx = this;
      const params = {
        type: this.taskDef.type,
        properties: {},
        opinion
      };
      // if (this.$refs.parserRef) {
      //   params.properties = getVariables(this.formConf.fields, this.$refs.parserRef[this.formConf.formModel]);
      // }
      try {
        console.log(this.AParams.id)
        await this.complete({ clusterId: this.AParams.clusterId, taskId: this.AParams.id, params });
        this.$message({ message: '办理成功, 1s后关闭该窗口', type: 'success' });
        // 办理成功，关闭tab，延时1s关闭
        setTimeout(() => {
         
            history.back(-1);
            // history.back(-1);
         
          this.loading = false;
        }, 1000);
      } catch (err) {
        this.$message({ type: 'error', message: err });
      }
    }
  }
};
</script>
<style scoped lang='scss'>
  .todo-step{
    padding:20px
  }
</style>
