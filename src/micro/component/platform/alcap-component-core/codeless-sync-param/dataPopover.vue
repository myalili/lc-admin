<template>
  <div class="codeless-sync-param-popover-content">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="data-panel-tabs"
      @tab-click="tabClick"
    >
      <el-tab-pane
        :label="itemt.label"
        :name="itemt.name"
        v-for="itemt in dataType"
        :key="itemt.name"
      >
        <div class="data-panel-header flex items-center mb-2">
          <div class="text-sm pr-8 relative flex items-center">
            <el-select
              size="mini"
              v-model="dataArg"
              placeholder="请选择"
              class="w-24"
            >
              <el-option
                :key="arg.id"
                :label="arg.desc"
                :value="arg.name"
                v-for="arg in selectOptions"
              ></el-option>
            </el-select>
            <div class="data-panel-len ml-1">{{ argChild.filter(i=>i.id).length }}</div>
          </div>
          <div class="flex-1">
            <el-input placeholder="搜索" v-model="searchWord" size="mini">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <el-row class="data-panel-title mb-1">
          <el-col :span="12" class="pl-2">中文描述</el-col>
          <el-col :span="12" class="pl-2">英文名称</el-col>
        </el-row>
        <div class="data-panel-ctn h-52 overflow-scroll">
          <div
            class="data-panel-row cursor-pointer hover:bg-gray-50"
            v-for="item in argChild.filter(i=>i.id)"
            :key="item.id"
            @click="select(item)"
          >
            <el-row>
              <el-col
                :span="12"
                :title="item.name"
                class="
                  whitespace-nowrap
                  overflow-hidden overflow-ellipsis
                  pl-2
                  h-9
                  flex
                  items-center
                "
                :class="{
                  'font-bold': dataArgChild.id === item.id,
                  ' text-primary': dataArgChild.id === item.id,
                }"
                >{{ item.name }}</el-col
              >
              <el-col
                :span="12"
                :title="item.id"
                class="
                  whitespace-nowrap
                  overflow-hidden overflow-ellipsis
                  px-2
                  h-9
                  flex
                  items-center
                "
              >
                <el-popover
                  v-if="item.children"
                  placement="top-start"
                  width="200"
                  popper-class="data-panel-popover"
                  ref="obj"
                  trigger="hover"
                >
                  <p style="padding: 0 12px">可选择对象属性</p>
                  <div class="data-panel-hover-wrapper">
                    <div
                      v-for="(key, index) of item.children"
                      :key="index"
                      style="line-height: 30px"
                      class="data-panel-hover cursor-pointer px-3"
                    >
                      {{ key.name }}
                    </div>
                  </div>

                  <div slot="reference">{{ item.name }}</div>
                </el-popover>
                <span
                  v-else
                  class="w-full overflow-ellipsis overflow-hidden text-gray-400"
                  :class="{ 'font-bold': dataArgChild.id === item.id }"
                  >{{ item.id }}</span
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    argsArr: {
      type: Array,
      default() {
        return [];
      },
    },
    currentValueObj: {
      type: Object,
      default() {
        return {};
      },
    },
    componentParams: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeTab: "page",

      dataType: [
        {
          name: "page",
          label: "页面",
        },
        {
          name: "component",
          label: "组件",
        },
      ],
      dataArg: "",
      dataArgChild: {},
    };
  },
  mounted() {
    const ctx = this;
    ctx.dataArg = ctx.currentValueObj.name || "";
    ctx.dataArgChild = ctx.currentValueObj.current || "";
    // console.log('当前选中的', ctx.dataArgChild);
    if (ctx.argsArr?.length > 0 && !ctx.dataArg)
      ctx.dataArg = this.argsArr[0].name;
  },
  computed: {
    argChild() {
      return this.selectOptions.find((i) => i.name === this.dataArg)?.children || [];
    },
    selectOptions() {
      if (this.activeTab === "component") {
        this.dataArg = "";
        return this.componentParams;
      } else {
        if (this.argsArr?.length > 0 && !this.dataArg)
        this.dataArg = this.argsArr[0].name;
        return this.argsArr;
      }
    },
  },
  methods: {
    select(e) {
      this.dataArgChild = e;
      this.$emit(
        "update:value",
        this.dataArg ? this.dataArg + "." + e.id : e.id
      );
      let desc = this.selectOptions.find((i) => i.name === this.dataArg).desc;
      this.$emit("select", desc ? desc + "." + e.name : e.name);
    },
    tabClick(e) {
      const ctx = this;
      ctx.$emit("typeChange", e.name);
    },
  },
};
</script>

<style>
</style>