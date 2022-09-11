<template>
  <div class="d-bottom">
    <section
      style="height: 40px; align-items: center"
      class="border-bottom flex-between"
    >
      <div v-if="isEnd && !isCustom" class="end-title">
        <span class="icon iconfont" :class="iconMap[selectNode.nodeType]"></span>
        {{ typeMap[selectNode.nodeType]  }} 
        <button
          @click="mode = 'config'"
          :class="{ 'item-active': mode === 'config' }"
          class="d-tab-item"
        >
          节点配置
        </button>
        <button
          @click="getPreview"
          :class="{ 'item-active': mode === 'preview' }"
          class="d-tab-item" 
        >
          数据预览
        </button>
      </div>
      <div v-if="!isEnd && !isCustom" class="end-title">
        <span class="icon iconfont icon-shuru"></span>
        {{ selectNode.nodeType === "dcom" ? "输入" : "输出" }}
      </div>
      <div v-if="isCustom">
         <button
          @click="scriptMode = 'normal'"
          :class="{ 'item-active': scriptMode === 'normal' }"
          class="d-tab-item"
        >
          代码配置
        </button>
        <button
          :class="{ 'item-active': scriptMode === 'log' }"
          class="d-tab-item"
          @click="getScriptPreview"
        >
          运行结果
        </button>
      </div>
      <div class="flex flex-center" style="padding: 6px">
        <label style="width: 140px; font-size: 14px" for=""> 节点名称 ：</label>
        <el-input
          :disabled="selectNode.nodeType === 'dcom'"
          v-model="nodeName"
          size="mini"
        ></el-input>
      </div>
    </section>
    <div style="flex: 1; overflow-y: auto" v-show="mode === 'config'">
      <section class="flex" v-if="selectNode.nodeType === 'dcom'">
        <dcom
          :selectNode="selectNode"
          :table="preTable"
          @showDialog="showDialogFn"
        >
        </dcom>
      </section>
      <section v-if="selectNode.nodeType === 'djoin'">
        <djoin :selectNode="selectNode"></djoin>
      </section>
      <section v-if="selectNode.nodeType === 'dcustom'">
          <dcustom :mode="scriptMode" :selectNode="selectNode" :scriptResult="scriptResult" :getPreview="getScriptPreview"></dcustom>
      </section>
      <section v-if="selectNode.nodeType === 'output'">
        <d-table v-if="preTable" :table="preTable" />
      </section>
      <section v-if="selectNode.nodeType === 'dfilter'">
        <dfilter :selectNode="selectNode"></dfilter>
      </section>
      <section v-if="selectNode.nodeType === 'dmerge'">
        <dmerge :selectNode="selectNode"></dmerge>
      </section>
      <section v-if="selectNode.nodeType === 'dpro'">
        <dpro :selectNode="selectNode"></dpro>
      </section>
      <section v-if="selectNode.nodeType === 'dgroup'">
        <dgroup :selectNode="selectNode"></dgroup>
      </section>
    </div>
    <div style="flex: 1; overflow-y: auto" v-show="mode === 'preview'">
      <d-table v-if="preTable" :table="preTable" />
    </div>
  </div>
</template>

<script>
const {getPreviewData,getScriptPreData} = window.getBffApi();
import { studentData, peopleData, consumerData } from "../mock";
import { getJsonInfo, getJsonScriptInfo, mergeTable } from "../utils";
import { join } from "../tools/join";
import Dcom from "./bottom/dcom.vue";
import Dfilter from "./bottom/dfilter.vue";
import Dgroup from "./bottom/dgroup.vue";
import Djoin from "./bottom/djoin.vue";
import Dmerge from "./bottom/dmerge.vue";
import Dpro from "./bottom/dpro.vue";
import dTable from "./dTable.vue";
import Dcustom from "./bottom/dcustom.vue";
export default {
  components: { dTable, Dcom, Dfilter, Dmerge, Dpro, Dgroup, Djoin, Dcustom },
  props: ["selectNode", "showDialog", "getFlowContent", "setNodeName"],
  data() {
    return {
      studentData,
      dataSources: [studentData, peopleData, consumerData],
      joinMode: "config",
      leftKey: "",
      rightKey: "",
      joinTable: null,
      mode: "config",
      previewInfo: "",
      preTable: null,
      nodeName: "",
      scriptMode:'normal',
      scriptResult:null,    
        iconMap:{
        'dfilter':'icon-shujushaixuan',
        'dmerge':'icon-zhuijiahebing',
        'dgroup':'icon-fenzuhuizong',
        'djoin':'icon-hengxianglianjie',
      },
      typeMap: {
        dfilter: "数据筛选",
        dmerge: "追加合并",
        dgroup: "分组汇总",
        djoin: "横向连接",
      },
    };
  },
  computed: {
    isEnd() {
      return !["dcom", "output"].includes(this.selectNode.nodeType);
    },
    isCustom() {
      return this.selectNode.nodeType === "dcustom";
    },
  },
  watch: {
    selectNode() {
      this.mode = "config";
      this.nodeName = this.selectNode.nodeName;
      if (["dcom", "output"].includes(this.selectNode.nodeType)) {
        this.getInputData();
      }
    },
    nodeName() {
      this.setNodeName(this.nodeName, this.selectNode?.nodeId);
    },
  },
  methods: {
    showDialogFn() {
      this.$emit("showDialog");
    },
    unique(arr, u_key) {
      let map = new Map();
      arr.forEach((item, index) => {
        if (!map.has(item[u_key])) {
          map.set(item[u_key], item);
        }
      });
      return [...map.values()];
    },
    async getScriptPreview(){
      const edges = this.getFlowContent().edges;
      const nodes = this.getFlowContent().nodes;
      const jsonInfo = getJsonScriptInfo({
        edges,
        nodes,
        nodeId: this.selectNode.nodeId,
      });
     this.scriptResult = null 
     try{
     this.scriptMode = 'log'
     const res = await  getScriptPreData({ json: JSON.stringify(jsonInfo) })
      if(res.success){
         const table = mergeTable({
            selectItems: jsonInfo.selectItems,
            data: res.obj,
          });
         this.scriptResult = {success:true,table:table};
      }else{
        this.scriptResult = {success:false,log:res.msg}
      }

     }catch(e){
       console.log(e);
     }
    },
    async getPreview() {
      //计算节点信息
      const edges = this.getFlowContent().edges;
      const nodes = this.getFlowContent().nodes;
      const jsonInfo = getJsonInfo({
        edges,
        nodes,
        nodeId: this.selectNode.nodeId,
      });
      let data;
      console.log(jsonInfo);
      this.mode = "preview";
      if (jsonInfo.name === "追加合并") {
        let selectItems = this.unique(jsonInfo.selectItems, "name");
        jsonInfo.selectItems = selectItems;
        data = {
          name: jsonInfo.name,
          selectItems: jsonInfo.selectItems,
          unionNodes: jsonInfo.unionNodes,
          type: jsonInfo.type,
        };
      } else {
        data = jsonInfo;
      }
      this.previewInfo = jsonInfo;
      let res = await  getPreviewData({ json: JSON.stringify(data) });

      console.log("finish");
        const table = mergeTable({
          selectItems: jsonInfo.selectItems,
          data: res.obj,
        });
        console.log(table);
        this.preTable = table;


      // getPreviewData({ json: JSON.stringify(data) }).then((res) => {
        
      // });
    },
    async getInputData() {
      const edges = this.getFlowContent().edges;
      const nodes = this.getFlowContent().nodes;
      const jsonInfo = getJsonInfo({
        edges,
        nodes,
        nodeId: this.selectNode.nodeId,
      });
      const data = jsonInfo;
      await getPreviewData({ json: JSON.stringify(data) }).then((res) => {
        console.log("finish");
        const table = mergeTable({
          selectItems: jsonInfo.selectItems,
          data: res.obj,
        });
        this.preTable = table;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.d-bottom {
  bottom: 0;
  width: 100%;
  height: 50vh;
  background-color: white;
  user-select: none;
  display: flex;
  flex-direction: column;
  position: relative;
  .end-title {
    padding: 0 9px;

    .icon {
      margin: 0 10px;
      border-radius: 4px;
      background: #248af9;
      color: #fff;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      display: inline-block;
    }
  }
  & section {
    height: 100%;
    position: relative;
  }
  .d-tab-item {
    position: relative;
    margin-left: 30px;
    padding: 7px;
    cursor: pointer;
    height: 40px;
    border: none;
    background-color: transparent;
  }
  .item-active::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-primary);
  }
}
</style>