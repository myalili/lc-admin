<template>
  <div class="h-full">
    <div class="header flex justify-between justify-items-center items-center">
      <div class="flex justify-items-center">
        <div @click="goBack">
          <codeless-icon icon="icon-fanhui1" class="gobackIcon"></codeless-icon>
        </div>
        <span>{{ AParams.row.desc }}</span>
      </div>
      <div class="flex operation">
        <div
          class="operation-box flex flex-col items-center justify-between mr-7"
          @click="runScript"
        >
          <codeless-icon
            icon="icon-yunhang"
            class="operation-icon"
          ></codeless-icon>
          <span class="operation-test">运行</span>
        </div>
        <div
          class="operation-box flex flex-col items-center justify-between mr-8"
          @click="saveScript"
        >
          <codeless-icon
            icon="icon-baocun1"
            class="operation-icon"
          ></codeless-icon>
          <span class="operation-test">保存</span>
        </div>
      </div>
    </div>
    <div class="center">
      <div
        class="inside"
        :style="{ 'margin-right': scriptResult ? '300px' : '0' }"
      >
        <div class="code-editor-content" id="container" ref="target"></div>
      </div>
    </div>
    <div class="left flex flex-col items-center">
      <el-input
        v-model="searchValue"
        placeholder="关键词查询"
        class="search-input"
        size="mini"
        clearable
        @keydown.enter.native="_getEntityList"
      >
        <i class="el-icon-search el-input__icon" slot="prefix"> </i>
      </el-input>
      <div class="schemas-list">
        <div
          class="schemas-list-item cursor-pointer flex flex-col justify-center"
          @click="selectUser"
          :class="{ 'schemas-list-item-actived': selectedUser }"
        >
          <p class="font-bold">用户上下文</p>
          <p class="mt-1" style="color: #7f8c93">USERAUTH</p>
        </div>
        <div
          class="schemas-list-item cursor-pointer flex flex-col justify-center"
          v-for="item in entityList"
          :key="item.id"
          @click="changeCode(item)"
          :class="{
            'schemas-list-item-actived': selectedEntities.some(
              (i) => i.id === item.id
            ),
          }"
        >
          <p class="font-bold">{{ item.desc }}</p>
          <p class="mt-1" style="color: #7f8c93">{{ item.name }}</p>
        </div>
      </div>
      <el-pagination
        small
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageNum"
        @current-change="_getEntityList"
      />
    </div>
    <div
      class="right pl-4 py-5 pr-5 box-border"
      :style="{ 'margin-left': scriptResult ? '-300px' : '0' }"
    >
      <div class="w-full flex items-center justify-between">
        <p class="font-bold">运行结果</p>
        <i
          class="el-icon-close cursor-pointer"
          @click="scriptResult = false"
        ></i>
      </div>

      <div
        class="w-full mt-5 overflow-scroll json-data"
        style="height: calc(100% - 100px)"
      >
        <json-viewer
          :value="jsonData"
          v-if="jsonData"
          style="background: transparent; padding: 0"
        ></json-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { Gesture } from "monaco-editor/esm/vs/base/browser/touch";
import dataFactory from "./index.vue";
import JsonViewer from "vue-json-viewer";
Vue.use(JsonViewer);
export default {
  mixins: [window.codelessMixins.customDialog],
  components: {
    dataFactory,
  },
  data() {
    return {
      editor: null,
      searchValue: "",
      pageNum: 1,
      total: 0,
      entityList: [],

      projectId: this.$store.getters["user/tenantId"],

      editorNewValue: "",
      scriptResult: false,
      selectedEntities: [],

      selectedUser: false,
      editorChangeValue: null,

      codeData: null,
    };
  },
  async mounted() {
    this.initEditor();
    this.formatCode();
    await this._getEntityList();
  },
  computed: {
    editorValue: {
      get() {
        const ctx = this;

        // if (ctx.editorChangeValue) return ctx.editorChangeValue;

        let codeArr = ["function main() {", "\tvar ret = {};"];
        ctx.selectedEntities.forEach((e, index) => {
          let params = null;
          if (e.type === "data_source") {
            const fieldsObj = {};
            e.fields.map((f) => {
              fieldsObj[f.name] = "";
            });
            params = JSON.stringify(fieldsObj);
          }
          codeArr.push(
            `\tret.data${index + 1} = getEntityData('${e.type}', '${
              e.id
            }', ${params});`
          );
        });

        if (ctx.selectedUser) {
          codeArr.push("\tret.user = getAuthContext();");
        }
        
        let retCode = "\treturn ret;"
        if(ctx.selectedEntities.length > 0) {
          retCode = "\tdataHandler(ret);\n \treturn ret;"
        }

        codeArr = [...codeArr, retCode, "}", "\nmain();"];

        if (ctx.selectedUser) {
          codeArr = [
            "function getAuthContext() {",
            "\tvar authorization = new Authorization();",
            "\treturn JSON.parse(authorization.get());",
            "}\n",
            ...codeArr,
          ];
        }

        if (ctx.selectedEntities.length > 0) {
          codeArr = [
            "function getEntityData(type, entityID, params) {",
            "\tvar http = new OkHttp();",
            "\tvar data = http.send(type, entityID, '', false, params);",
            "\treturn JSON.parse(data);",
            "}\n",

            "function dataHandler(ret) {}\n",
            ...codeArr,
          ];
        }

        return codeArr.join("\n");
      },
      set(val) {
        const ctx = this;
        ctx.editorChangeValue = val;
      },
    },
    jsonData() {
      const ctx = this;
      console.log('jsonData', ctx.codeData);
      return ctx.codeData;
    },
  },
  methods: {
    async runScript() {
      const ctx = this;
      console.log("runScript");
      ctx.scriptResult = true;
      ctx.editorRepaint();

      const { getScriptPreData } = window.getBffApi();

      let res = await getScriptPreData(ctx.editor.getValue());

      if (res.success) {
        ctx.codeData = res.obj;
      } else {
        ctx.$notify({
          title: "错误",
          type: "error",
          message: res.msg || "运行失败",
        });
      }
    },
    async saveScript() {
      const ctx = this;
      const { dataFactoryApi } = window.getBffApi();
      let res = await dataFactoryApi.saveScriptEntity({
        id: ctx.AParams.row.id,
        dataFactoryJson: ctx.editor.getValue(),
        tenantId: ctx.AParams.row.tenantId,
      });
      if (res.success) {
        ctx.$notify({
          title: "保存成功！",
          type: "success",
        });
      } else {
        ctx.$notify({
          title: res.msg || "保存失败",
          type: "error",
        });
      }
    },
    goBack() {
      window.history.back();
    },
    initEditor() {
      const ctx = this;
      ctx.editor = monaco.editor.create(ctx.$refs.target, {
        value: ctx.AParams.row.dataFactoryJson || ctx.editorValue,
        scrollBeyondLastLine: false,
        language: "javascript",
        // theme: themeList[currentTheme],
        wordBasedSuggestions: false,
      });
      ctx.editorRepaint();
      // 监听编辑器内容修改
      ctx.editor.onDidChangeModelContent((_) => {
        ctx.editorChangeValue = ctx.editor.getValue();
      });
    },

    editorRepaint() {
      try {
        // ResizeObserver 不支持ie
        let ob = new ResizeObserver((_) => {
          this.resize();
        });
        ob.observe(this.$refs.target);
        this.__resize_ob = ob;
      } catch (e) {
        console.log(e);
      }
      // window.onresize= function () {
      // 		this.resize()
      // 	};
    },

    resize() {
      this.editor.layout();
    },
    resetValue(value) {
      this.editor.setValue(value);
    },
    formatCode() {
      if (!this.editor) {
        return;
      }
      this.editor.getAction("editor.action.formatDocument").run();
      this.editor.getAction(["editor.action.formatDocument"])._run();
    },
    async _getEntityList() {
      const ctx = this;
      var params = {
        name: ctx.searchValue,
        pageNum: ctx.pageNum,
        pageSize: 9,
        tenantId: ctx.projectId,
      };
      const { getEntityList } = window.getBffApi();
      await getEntityList(params)
        .then((res) => {
          ctx.entityList = res.content;
          ctx.total = res.totalElements;
          ctx.entityList.forEach((e) => {
            if (
              ctx.editor.getValue().indexOf(e.id) > -1 &&
              !ctx.selectedEntities.some((i) => i.id === e.id)
            ) {
              ctx.selectedEntities.push(e);
            }
          });
          if (ctx.editor.getValue().indexOf("getAuthContext") > -1) {
            ctx.selectedUser = true;
          }
        })
        .catch((error) => {
          ctx.$notify({
            title: error,
            type: "error",
          });
        });
    },
    selectUser() {
      const ctx = this;
      ctx.selectedUser = !ctx.selectedUser;
      ctx.editor.setValue(ctx.editorValue);
    },
    changeCode(e) {
      const ctx = this;
      if (ctx.selectedEntities.some((i) => i.id === e.id)) {
        ctx.selectedEntities.splice(
          ctx.selectedEntities.findIndex((i) => i.id === e.id),
          1
        );
      } else {
        ctx.selectedEntities.push(e);
      }
      ctx.editor.setValue(ctx.editorValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 56px;
  border-bottom: 1px solid #e7ecef;
  .gobackIcon {
    cursor: pointer;
    margin-top: 0px;
    width: 20px;
    height: 20px;
    margin-left: 20px;
    margin-right: 8px;
  }
  .operation {
    margin-right: 18px;
    height: 100%;
    .operation-box {
      cursor: pointer;
      box-sizing: border-box;
      padding: 8px 0;
      height: 100%;
      .operation-icon {
        width: 16px;
        height: 16px;
        // margin-bottom: 3px;
      }
      .operation-test {
        font-size: 12px;
        color: #89a2b7;
      }
    }
  }
}
.center {
  float: left;
  width: 100%; /*左栏上去到第一行*/
  height: 100%;
  margin-top: 8px;
  .inside {
    margin: 0 0px 0 300px;
    height: 100%;
  }
}
.left {
  float: left;
  width: 300px;
  height: 100%;
  margin-left: -100%;
  background: #f3f3f3;
  .search-input {
    width: 260px;
    margin: 12px auto;
    ::v-deep .el-input__inner {
      border-radius: 100px;
      background: transparent;
    }
  }
  .schemas-list {
    width: 100%;
    height: calc(100% - 150px);
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .schemas-list-item {
      padding: 0 20px;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      word-break: break-word;
      &:hover {
        background: #e8e8e8;
      }
      p {
        max-width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1; //在第几行显示...
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }
    .schemas-list-item-actived {
      background: #e8e8e8;
    }
  }
  ::v-deep .el-pagination {
    button {
      background: transparent;
    }
    .el-pager li {
      background: transparent;
    }
  }
}

.right {
  float: left;
  width: 300px;
  height: 100%;
  // margin-left: -300px;
  // transition:margin-left 2s;
  background-color: #f3f3f3;
  .json-data {
    &::-webkit-scrollbar {
      display: none;
    }
    ::v-deep .jv-container {
      .jv-code {
        padding: 0;
      }
    }
  }
}
.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
.schemas {
  width: 300px;
  height: 800px;
  border: 1px royalblue solid;
}

/* 使 monaco editor 适应容器尺寸 */
.code-editor-content {
  height: 100%;
  width: 100%;
  > :first-child {
    overflow: auto;
    height: 100% !important;
    width: 100% !important;
    > .overflow-guard {
      height: 100% !important;
      width: 100% !important;
    }
  }
}
</style>