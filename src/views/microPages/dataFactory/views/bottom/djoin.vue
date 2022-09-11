<template>
  <section>
    <div
      v-if="selectNode.tables.length === 2"
      class="flex"
      style="height: 100%; overflow: auto"
    >
      <div style="height: 100%" class="join-panel border-right">
        <p class="join-big-title">1.设置连接方式</p>
        <el-button-group>
          <!-- <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            content="返回左右两侧表单中连接字段相等的数据"
          > -->
            <el-button
             
              size="small"
              :class="{ 'active-btn': mode === 'inner' }"
              @click="setMode('inner')"
              icon="el-icon-share"
              >内连接</el-button
            >
          <!-- </el-popover> -->
          <!-- <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            content="返回左侧表达的全部数据和右侧表单中匹配到的数据"
          > -->
            <el-button
              size="small"
             
              :class="{ 'active-btn': mode === 'left' }"
              @click="setMode('left')"
              icon="el-icon-share"
              >左连接</el-button
            >
          <!-- </el-popover> -->
          <!-- <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            content="返回右侧表达的全部数据和左侧表单中匹配到的数据"
          > -->
            <el-button
             
              size="small"
              :class="{ 'active-btn': mode === 'right' }"
              @click="setMode('right')"
              icon="el-icon-share"
              >右连接</el-button
            >
          <!-- </el-popover> -->
        </el-button-group>
        <p class="join-title">连接字段设置</p>
        <div>
          <el-checkbox v-model="checked">合并连接字段</el-checkbox>
        </div>
      </div>
      <div class="join-panel" style="width: 640px">
        <p class="join-big-title">2.添加连接字段</p>
        <div class="flex-between ret-title">
          <div>左侧表单： {{ leftTable.name }}</div>
          <div>左侧表单： {{ rightTable.name }}</div>
        </div>
        <div
          v-for="(con, ii) in conList"
          :key="ii"
          class="flex-between"
          style="align-items: center"
        >
          <div class="join-field-item" @click="showLeft($event, con)">
            {{ con.left.label }}
            <div
              class="select-panel"
              :style="{ left: left, top: bottom }"
              v-show="con.leftPanelShow"
            >
              <div
                @click="selectLeft(item, ii)"
                :class="{ 'active-item': item.label === con.left.label }"
                class="select-panel-list-item flex flex-between"
                :key="i"
                v-for="(item, i) in leftTable.schema"
              >
                <span>{{ item.label }}</span>
                <span class="meta-type" :class="item.type + '-type'">{{
                  typeMap[item.type]
                }}</span>
              </div>
            </div>
          </div>
          <span class="connector"> =</span>
          <div class="join-field-item" @click="showRight($event, con)">
            {{ con.right.label }}
            <div
              class="select-panel"
              :style="{ left: left, top: bottom }"
              v-show="con.rightPanelShow"
            >
              <div
                @click="selectRight(item, ii)"
                :class="{ 'active-item': item.label === con.right.label }"
                class="select-panel-list-item flex flex-between"
                :key="i"
                v-for="(item, i) in rightTable.schema"
              >
                <span> {{ item.label }}</span>
                <span class="meta-type" :class="item.type + '-type'">{{
                  typeMap[item.type]
                }}</span>
              </div>
            </div>
          </div>
          <i @click="deleteListItem(ii)" class="el-icon-delete delete-btn"></i>
        </div>
        <div @click="addList" class="add-btn">
          <i class="el-icon-plus"></i> 添加
        </div>
      </div>
    </div>
    <div v-else class="flex flex-center error-text" style="height: 100%">
      请将两个已配置好的节点连接至本节点
    </div>
  </section>
</template>

<script>
export default {
  props: ["selectNode"],
  watch: {
    "selectNode.nodeId"() {
      this.init();
    },
  },
  computed: {
    leftTable() {
      return (this.selectNode?.tables || [])[0];
    },
    rightTable() {
      return (this.selectNode?.tables || [])[1];
    },
  },
  created() {
    this.init();
  },
  methods: {
    setMode(mode) {
      this.mode = mode;
      this.setBindSet();
    },
    init() {
      if (this.selectNode.bindSet?.vueData) {
        this.conList = this.selectNode.bindSet.vueData.conList;
        this.mode = this.selectNode.bindSet.vueData.mode;
      } else {
        this.conList = [];
        this.mode = "";
      }
      const lTable = JSON.parse(JSON.stringify(this.leftTable));
      const rTable = JSON.parse(JSON.stringify(this.rightTable));
      console.log(lTable, "lTable");
      lTable.schema.forEach((item) => (item.value = item.alias || item.value));
      rTable.schema.forEach((item) => (item.value = item.alias || item.value));
      lTable.schema.forEach((item) => {
        const same = rTable.schema.find(
          (ele) => ele.value === item.value && ele.alias === item.alias
        );
        if (same) {
          item.alias = (item.alias || item.value) + "-left";
          same.alias = (same.alias || same.value) + "-right";
        }
      });
      this.lTable = lTable;
      this.rTable = rTable;
      this.setBindSet();
    },
    addList() {
      this.conList.push({
        left: { label: " ", value: "" },
        right: { label: " ", value: "" },
        leftPanelShow: false,
        rightPanelShow: false,
      });
      this.setBindSet();
    },
    selectLeft(item, index) {
      this.conList[index].left = item;
      this.setBindSet();
    },
    selectRight(item, index) {
      this.conList[index].right = item;
      this.setBindSet();
    },
    deleteListItem(i) {
      this.conList.splice(i, 1);
      this.setBindSet();
    },
    showLeft(e, con) {
      console.log(e);
      const pos = e.target.getBoundingClientRect();
      this.bottom = pos.top - 190 + "px";
      this.left = pos.left + "px";
      con.leftPanelShow = !con.leftPanelShow;
      con.rightPanelShow = false;
      this.setBindSet();
    },
    showRight(e, con) {
      const pos = e.target.getBoundingClientRect();
      this.bottom = pos.top - 190 + "px";
      this.left = pos.left + "px";
      con.rightPanelShow = !con.rightPanelShow;
      con.leftPanelShow = false;
      this.setBindSet();
    },
    setBindSet() {
      const set = {
        vueData: {
          conList: this.conList,
          mode: this.mode,
        },
        joinType: this.mode,
        joinConditions: this.conList.map((item) => {
          return {
            leftNodeField: item.left.alias || item.left.value,
            rightNodeField: item.right.alias || item.right.value,
          };
        }),
      };
      this.selectNode.setBindSet(JSON.parse(JSON.stringify(set)));

      const table = {
        name: this.leftTable.name + "-" + this.rightTable.name,
        schema: [
          ...this.lTable.schema.map((item) => {
            return {
              ...item,
              tablePosition: "left",
            };
          }),
          ...this.rTable.schema.map((item) => {
            return {
              ...item,
              tablePosition: "right",
            };
          }),
        ],
      };
      this.selectNode.setBindTable(JSON.parse(JSON.stringify(table)));
    },
  },
  data() {
    return {
      checked: false,
      selectPanel: false,
      typeMap: {
        string: "文本",
        time: "时间",
        number: "数字",
      },
      lTable: {},
      rTable: {},
      left: "",
      bottom: "",
      mode: "",
      conList: [],
    };
  },
};
</script>

<style scoped lang="scss">
.join-panel {
  min-width: 400px;
  padding: 4px 12px;
  overflow-y: auto;
}
.join-big-title {
  font-size: 14px;
  color: #000;
  margin-bottom: 5px;
  padding: 7px 0;
}
.join-title {
  font-size: 12px;
  color: #91a1b7;
  margin-bottom: 5px;
  padding: 7px 0;
}
.delete-btn {
  cursor: pointer;
  color: #3f80ae;
  margin-left: 9px;
}
.active-btn {
  background: var(--color-primary);
  color: #fff;
}
.select-panel {
  position: fixed;
  width: 320px;
  height: 180px;
  border: 1px solid #ccc;
  background-color: white;
  overflow-y: scroll;
  z-index: 900;
  box-shadow: 0 0 6px rgba(51, 51, 51, 0.2);
  .active-item {
    background: #e6f6f4;
  }

  .select-panel-list-item {
    padding: 0 9px;
    font-size: 12px;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    align-items: center;
    .meta-type {
      border-radius: 40px;
      padding: 0 10px;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
    }
    .string-type {
      color: var(--color-primary);
      background-color: #eaf7f6;
    }
    .time-type {
      color: #248af9;
      background-color: #eaf3ff;
    }
    .number-type {
      color: #f4b700;
      background-color: #fef8e9;
    }
    &:hover {
      background: #e6f6f4;
    }
  }
}
.join-field-item {
  width: 310px;
  height: 32px;
  border: 1px solid #d9d9d9;
  display: flex;
  border-radius: 2px;
  justify-content: space-between;
  line-height: 30px;
  font-size: 12px;
  padding: 0 9px;
  margin: 9px 0;
  position: relative;
}
.connector {
  color: #2481f9;
  margin: 0 30px;
  line-height: 32px;
}
.ret-title {
  font-size: 12px;
}
.add-btn {
  color: var(--color-primary);
  margin-top: 12px;
  cursor: pointer;
  display: inline-block;
}
::v-deep.el-popover {
  padding: 0;
}
::v-deep.el-popper {
  padding: 0;
}
</style>