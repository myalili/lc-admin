<template>
  <div class="d-main">
    <el-dialog
      title="添加输入源"
      :lock-scroll="true"
      :visible.sync="dialogShow"
      width="700px"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      :modal="false"
      :append-to-body="true"
      custom-class="no-header-and-footer-dialog"
    >
      <codeless-dialog-ctn
        title="添加输入源"
        maxHeight="600px"
        @confirm="confirmChooseSource"
        @close="dialogShow = false"
        @cancel="dialogShow = false"
      >
        <template v-slot:dialogContent>
          <div class="flex" style="height: 410px">
            <div class="border-right">
              <p class="select-title">1.选择输入源</p>
              <div
                style="overflow-y: scroll; max-height: 390px; overflow-x: auto"
              >
                <div
                  class="source-list"
                  :class="{ active: selectSource.name === item.name }"
                  @click="chooseSource(item)"
                  v-for="item in dataSources"
                  :key="item.id"
                >
                  <i class="el-icon-info"></i> {{ item.name }}
                </div>
              </div>
            </div>
            <div style="width: 100%">
              <p class="select-title">2.选择字段</p>
              <div
                style="
                  padding: 0 14px;
                  overflow-y: scroll;
                  overflow-x: auto;
                  height: 370px;
                "
              >
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    class="d-check-box"
                    v-for="(item, i) in selectSource.schema"
                    :key="i"
                    checked
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </template>
      </codeless-dialog-ctn>
    </el-dialog>
    <aside class="d-aside">
      <div class="back-btn text-primary" @click="back">
        <i class="el-icon-back"></i> {{ detail.desc }}
      </div>
      <div>
        <p>输入输出</p>
        <div>
          <div
            draggable="true"
            @dragstart="
              createNode(
                { nodeType: 'dcom', bindTable: null, nodeName: '输入' },
                $event
              )
            "
            @dragover.prevent
            class="d-component"
          >
            <span class="icon iconfont icon-shuru"></span> 输入
          </div>
          <div
            :draggable="!exsitOutput"
            @dragstart="
              !exsitOutput &&
                createNode({ nodeType: 'output', nodeName: '输出' }, $event)
            "
            class="d-component"
            :class="{ disabled: exsitOutput }"
          >
            <span class="icon iconfont icon-shuchu"></span> 输出
          </div>
        </div>
      </div>
      <div>
        <p>数据处理</p>
        <div v-if="mode === 'normal'">
          <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode({ nodeType: 'djoin', nodeName: '横向连接' }, $event)
            "
            class="d-component"
          >
            <span class="icon iconfont icon-hengxianglianjie"></span> 横向连接
          </div>
          <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode({ nodeType: 'dmerge', nodeName: '追加合并' }, $event)
            "
            class="d-component"
          >
            <span class="icon iconfont icon-zhuijiahebing"></span> 追加合并
          </div>
          <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode({ nodeType: 'dgroup', nodeName: '分组汇总' }, $event)
            "
            class="d-component"
          >
            <span class="icon iconfont icon-fenzuhuizong"></span> 分组汇总
          </div>
          <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode({ nodeType: 'dfilter', nodeName: '数据筛选' }, $event)
            "
            class="d-component"
          >
            <span class="icon iconfont icon-shujushaixuan"></span> 数据筛选
          </div>
          <!-- <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode({ nodeType: 'dpro', nodeName: '字段设置' }, $event)
            "
            class="d-component"
          >
            <span class="icon iconfont icon-ziduanshezhi"></span> 字段设置
          </div> -->
        </div>
        <div v-if="mode === 'custom'">
          <div
            draggable="true"
            @dragover.prevent
            @dragstart="
              createNode(
                { nodeType: 'dcustom', nodeName: '自定义逻辑' },
                $event
              )
            "
            class="d-component"
          >
            <span class="icon iconfont icon-hengxianglianjie"></span> 自定义逻辑
          </div>
        </div>
      </div>
    </aside>
    <section id="d-canvas-container">
      <div id="tool-bar" class="flex-between">
        <div class="flex flex-center">
          <div class="icon-chehui iconfont icon" @click="chehui"></div>
          <!-- <div class="icon-zhongzuo iconfont icon"></div> -->
          <div class="divider"></div>
          <div class="menu" @click="horizenDivide">
            <i class="icon-shuipingdengju iconfont"></i> 水平等距
          </div>
          <div class="menu" @click="verticalDivide">
            <i class="icon-chuizhidengju iconfont"></i>垂直等距
          </div>
          <div class="divider"></div>
          <div class="sizer">
            <i class="el-icon-minus" @click="setScale(-10)"></i>
            <span>{{ scale }}%</span>
            <i class="el-icon-plus" @click="setScale(10)"></i>
          </div>
          <div class="divider"></div>
          <i @click="removeNodes" class="icon-shanchu iconfont delete-icon"></i>
        </div>
        <div>
          <!-- <div class="btn" @click="save">保存</div> -->
          <el-button
            type="primary"
            @click="save"
            size="small"
            style="width: 70px"
            >保存</el-button
          >
        </div>
      </div>
      <div style="height: 45vh; overflow: scroll; flex: 1">
        <canvas
          style="background: #f0f3f9"
          :width="Math.floor(ratio * 2000)"
          :height="Math.floor(ratio * 2000)"
          id="d-canvas"
          ref="canvas"
        >
        </canvas>
      </div>

      <div v-show="selectInfo.nodeId" style="height: 45vh">
        <bottomVue
          ref="bottom"
          :showDialog="showDialog"
          @showDialog="showDialogFn"
          :selectNode="selectInfo"
          :getFlowContent="getFlowContent"
          :setNodeName="setNodeName"
        ></bottomVue>
      </div>
    </section>
  </div>
</template>

<script>
const { getBffTableData, dataFactoryApi } = window.getBffApi();
import dAopsFlow from "./topo/flow";
import "./font/iconfont.css";
import { join } from "./tools/join";
import { studentData, peopleData, consumerData } from "./mock";
import bottomVue from "./views/bottom.vue";
import "./index.css";
import { getPrevTables, isCustomMode, getJsonInfo } from "./utils";
// import { mixins } from "@v2-lib/vue.spa.plugin";
import listCtn from "./index.vue";

import alcap from "./utils/mixin.js";
function getBasicNode() {
  return {
    nodeId: "node1",
    mode: "normal",
    nodeIndex: 1,
    nodeType: "dcom",
    hide: false,
    expand: true,
    output: [
      {
        name: "开始",
        paramName: "returnCode",
        type: "judge",
        criteria: "==",
        value: "0",
        color: "#1FD0CA",
        description: "开始节点，出口只有一个",
        id: "output0",
      },
    ],
    textBox: {
      fontSize: "12px",
      outline: "rgba(255, 50, 50)",
      number: 0,
      x: 5,
      y: 55,
      width: 70,
      height: 20,
    },
    userData: {},
    bounds: { x: 334, y: 369, height: 50, width: 180 }, // 位置和节点大小
  };
}
let selectNode = {};

export default {
  mixins: [alcap, window.V8.mixins],
  components: { bottomVue },
  data() {
    return {
      exsitOutput: false,
      detail: {},
      dataSources: [studentData, peopleData, consumerData],
      checkList: [],
      dialogShow: false,
      selectSource: {},
      selectInfo: {},
      selectCom: {},
      ratio: 1,
      scale: 100,
      setNodeName: (name, nodeId) => {
        console.log(selectNode);
        const node = this.flow.flowContent.nodes.find(
          (node) => node.nodeId === nodeId
        );
        if (node) {
          node.nodeName = name;
          selectNode.data.nodeName = name;
        }
      },
      showDialog: () => {
        console.log(this.selectInfo, this.dataSources);
        this.showDialogFn();
      },
      getFlowContent: () => {
        return this.flow.flowContent;
      },
    };
  },
  computed: {
    // getFlowContent:()=>{
    //   return this.flow.flowContent
    // }
  },
  created() {
    //debugger;
    // window.onbeforeunload = function (event) {
    //   var e = window.event || event;
    //   e.returnValue = "确定离开当前页面吗？";
    // };
  },
  watch: {
    dialogShow() {
      if (this.dialogShow == false) {
        this.checkList = [];
        this.selectSource = {};
      }
    },
  },
  methods: {
    showDialogFn() {
      const target =
        this.dataSources.find(
          (item) => item.id === selectNode.data.bindTable.id
        ) || {};
      this.chooseSource(target, true);
      this.dialogShow = true;
      this.loadInput(selectNode);
      this.$nextTick().then((_) => {
        this.checkList = selectNode.data.bindTable.schema
          .filter((item) => !item.hide)
          .map((item) => item.value);
      });
    },
    back() {
      // this.$router.push("/data-factory");
      //  this.open({
      //           title: '数据工厂',
      //           type: 'SELF',
      //           component: listCtn,
      //           path: '/dataFactoryList',
      //           params: {}
      //         });
      this.$router.back(-1);
    },
    removeNodes() {
      this.flow.removeNodes();
      this.checkOutput();
    },
    async save() {
      console.log(this.$refs.bottom)
      let dataFactoryJson = '{}'
      const edges = this.getFlowContent().edges;
      const nodes = this.getFlowContent().nodes;
      dataFactoryJson = JSON.stringify(getJsonInfo({
        edges,
        nodes,
        nodeId: this.selectInfo.nodeId,
      }));

      const data = {
        ...this.detail,
        dataFactoryJson,
        dataNodeJson: JSON.stringify(this.flow.flowContent),
        tenantId: this.tenantId,
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      dataFactoryApi
        .saveEntity(data)
        .then((res) => {
          if (res.success) {
            this.$notify.success("保存成功");
          }
          loading.close();
        })
        .catch((e) => {
          loading.close();
        });
    },
    chehui() {
      this.flow.forWardFlow();
    },
    horizenDivide() {
      this.flow.horizenDivide();
    },
    verticalDivide() {
      this.flow.verticalDivide();
    },
    setScale(i) {
      if (this.scale === 50 && i < 0) return;
      this.scale += i;
      this.flow.uae.scale = this.scale / 100;
    },
    createNode(d, $e) {
      $e.preventDefault();
      this.flow.createNode({ ...getBasicNode(), ...d });
      if (d.nodeType === "output") {
        this.exsitOutput = true;
      }
    },
    chooseSource(item, from) {
      this.selectSource = item;
      if (!from) {
        this.$nextTick().then((_) => {
          this.checkList = JSON.parse(
            JSON.stringify(item.schema.map((item) => item.value))
          );
        });
      }
    },
    confirmChooseSource() {
      selectNode.data.bindTable = JSON.parse(JSON.stringify(this.selectSource));
      selectNode.data.bindTable.schema.forEach((item) => {
        if (!this.checkList.includes(item.value)) {
          item.hide = true;
        } else {
          item.hide = false;
        }
      });
      this.dialogShow = false;
      this.$refs.bottom.getInputData();
      this.checkList = [];
      this.selectSource = {};
    },
    loadInput(i, obj) {
      console.log(i, obj);
      this.selectInfo = { ...i.data, ...obj };
    },
    checkOutput() {
      this.exsitOutput = this.flow.flowContent.nodes.find(
        (item) => item.nodeType === "output"
      );
    },
    // 获取BFF实例数据
    getBffTableData() {
      getBffTableData({ tenantId: this.tenantId, type: "db", pageSize: 10000 }).then((res) => {
        console.log(res, "getBffTableData");
        let dataSources = res?.obj?.content?.map((data) => {
          let schema = data?.fields?.map((item) => {
            return {
              label: item.desc,
              type: item.type,
              value: item.name,
            };
          });
          return {
            id: data.name + "_" + this.tenantId,
            name: data.desc,
            entityId: data.id,
            data: [],
            schema,
          };
        });
        this.dataSources = dataSources;
      });
    },
  },
  async mounted() {
    // window.debuggerPage = this;
    this.getBffTableData();
    console.log("获取到的参数", this, this.AParams);
    //this.mode = isCustomMode() ? "custom" : "normal";
    this.mode =
      this.AParams?.row?.type === "data_factory_script" ? "custom" : "normal";
    const id = this.AParams.row.id;
    const res = await dataFactoryApi.getEntity(id);
    this.detail = res.obj;
    console.log(this.detail, "this.detail");
    this.flow = new dAopsFlow(
      this.$refs.canvas,
      // JSON.parse(res.obj.dataNodeChainJson || '{"nodes":[],"edges":[]}')
      JSON.parse(res.obj.dataNodeJson || '{"nodes":[],"edges":[]}')
    );

    this.checkOutput();

    this.flow.on("addEdge", (e) => {
      console.log(e);
    });
    this.flow.on("click", (e) => {
      if (!e) {
        this.selectInfo = {};
        return;
      }
      const edges = this.flow.flowContent.edges;
      const nodes = this.flow.flowContent.nodes;

      if (e.$tag === "dcom") {
        selectNode = e;
        console.log();
        if (!e.data.bindTable) {
          this.dialogShow = true;
        } else {
          this.loadInput(e);
        }
      } else if (
        ["djoin", "dmerge", "dgroup", "dfilter", "dpro", "dcustom"].includes(
          e.$tag
        )
      ) {
        selectNode = e;
        let tables = getPrevTables({ edges, nodes, nodeId: e.$id });
        this.loadInput(e, {
          tables,
          setBindSet: (table) => {
            e.data.bindSet = JSON.parse(JSON.stringify(table));
          },
          setBindTable: (table) => {
            e.data.bindTable = JSON.parse(JSON.stringify(table));
          },
        });
      } else if (e.$tag === "output") {
        selectNode = e;
        //判断是否有连接
        const edges = this.flow.flowContent.edges;
        const nodes = this.flow.flowContent.nodes;
        const tEdge = edges.find((edge) => edge.eNode === e.$id);
        let tNode = null;
        if (tEdge) {
          tNode = nodes.find((node) => node.nodeId === tEdge.sNode);
        }
        if (tNode) {
          this.loadInput(e, { table: tNode.bindTable });
        }
      } else {
        this.loadInput(e, {});
      }
    });
  },
};
</script>

<style scoped lang="scss">
.select-title {
  padding: 10px;
  color: #333;
  font-size: 14px;
}
.source-list {
  color: #3dc2b8;
  font-size: 12px;
  cursor: pointer;
  line-height: 30px;
  color: #505e66;
  padding: 3px 15px;
  width: 230px;
  &:hover {
    background-color: var(--color-primary-light-7);
    // color: var(--color-base);
  }
}
.d-main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
  position: relative;

  .d-aside {
    box-shadow: 0 2px 6px 0 rgba(84, 48, 132, 0.1);
    height: 100%;
    padding: 10px;
    width: 130px;
    flex-shrink: 0;
    user-select: none;
    z-index: 2;
    background-color: #fff;
    .back-btn {
      // color: var(--color-primary);
      margin-bottom: 10px;
      padding: 4px;
      cursor: pointer;
      i {
        margin-right: 7px;
        font-weight: bold;
      }
    }
    p {
      line-height: 30px;
      font-size: 14px;
    }
    .d-component {
      font-size: 12px;
      height: 30px;
      line-height: 28px;
      margin-top: 4px;
      background: #f3f6fc;
      color: #1f2d3d;
      border: 1px solid #f4f6fc;
      cursor: move;
      padding-left: 7px;
      .icon {
        color: #749fd1;
        margin: 0 8px 0 4px;
        font-size: 14px;
      }
      &:hover {
        border: 1px dashed var(--color-primary);
        // color: #10b2a6;

        @apply text-primary;
      }
      &:hover .icon {
        // color: #10b2a6;
        @apply text-primary;
      }
    }
    .disabled {
      background-color: #f5f5f5;
      color: #c3cdda;
      cursor: not-allowed;
      &:hover {
        border: 1px solid #f4f6fc;
        background-color: #f5f5f5;
        color: #c3cdda;
      }
      .icon {
        color: #c3cdda;
      }
      &:hover .icon {
        color: #c3cdda;
      }
    }
  }

  .active {
    background-color: #e6f6f4;
  }
  .d-check-box {
    margin-bottom: 10px;
    display: block;
  }
}

#d-canvas-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
#tool-bar {
  background-color: white;
  width: 100%;
  align-items: center;
  padding: 7px;
  user-select: none;
  .icon {
    padding: 0 17px;
    font-size: 12px;
    cursor: pointer;
  }
  .divider {
    height: 20px;
    width: 0.5px;
    background: #333;
    margin: 0 10px;
  }
  .sizer {
    span {
      width: 50px;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      line-height: 30px;
    }
    i {
      padding: 0 14px;
      font-size: 12px;
      line-height: 30px;
      color: #3f80ae;
    }
  }
  i {
    padding: 0 7px;
    cursor: pointer;
  }
  .delete-icon {
    padding: 0 10px;
    font-size: 12px;
    line-height: 30px;
    color: #3f80ae;
    &:hover {
      background: #e2ecf9;
    }
  }
  .menu {
    cursor: pointer;
    padding: 3px 12px;
    font-weight: 400;
    font-size: 12px;
    line-height: 30px;
    vertical-align: middle;
    &:hover {
      background: #e2ecf9;
      color: #749fd1;
    }
    i {
      line-height: 30px;
      font-size: 12px;
      color: #3f80ae;
    }
  }
  .btn {
    color: #fff;
    // background-color: var(--color-primary);
    // border-color: var(--color-primary);
    width: 70px;
    height: 30px;
    line-height: 28px;
    margin: 0 20px;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    border: 1px solid transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background;
    transition-duration: 0.3s;
  }
}

::v-deep.el-dialog__body {
  padding: 0;
}
::v-deep.el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
}
</style>