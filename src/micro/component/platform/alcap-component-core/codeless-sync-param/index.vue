<template>
  <!-- <el-select v-model="dataValue" style="width: 100%;" placeholder="请选择" size="mini" @change="handleChange">
      <el-option-group
        v-for="group in argsArr"
        :key="group.name"
        :label="group.desc">
        <el-option
          v-for="item in group.children"
          :key="item.id"
          :label="item.name"
          :value="group.name + '.' + item.id">
        </el-option>
      </el-option-group>
    </el-select> -->
  <div class="codeless-sync-param inline-block w-full">
    <el-popover placement="bottom" width="300" trigger="click" ref="popover">
      <data-popover
        :argsArr="argsArr"
        :componentParams="componentParamsComp"
        :value.sync="dataValue"
        :currentValueObj="currentValueObj"
        @select="select"
        @typeChange="typeChange"
      />
      <el-input
        slot="reference"
        v-model="dataValueText"
        size="mini"
        style="width: 100%"
        placeholder="请选择变量"
        clearable
        @clear="dataValue = ''"
      >
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import dataPopover from "./dataPopover.vue";
export default {
  name: "syncParam",
  inject: ["root"],
  components: { dataPopover },
  props: {
    targetParams: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
    componentParams: {
      type: Array,
      default: () => {
        return [
          {
            children: [],
            desc: "",
            id: "component",
            name: "",
          },
        ];
      },
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
    componentName: {
      type: String,
      default: "组件参数",
    },
  },
  data() {
    return {
      currentValueObj: {},

      dataValueText: "",
    };
  },
  computed: {
    argsArr() {
      if (this.isCustom) {
        return this.targetParams;
      } else {
        return this.root.argsArr || this.root.content.argsArr;
      }
    },
    dataValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      },
    },
    componentParamsComp() {
      console.log('组件的名字', this.componentName);
      if (!this.componentParams[0].desc) {
        this.componentParams[0].desc = this.componentName;
      }
      return this.componentParams;
    },
  },
  watch: {
    value: {
      handler(n) {
        const ctx = this;
        ctx.getCurrentValueObj(n);
      },
      immediate: true,
    },
  },
  methods: {
    handleChange(e) {
      console.log(e);
      const ctx = this;
      msgHub.$emit("syncParam", e);
    },
    select(e) {
      this.$refs.popover.showPopper = false;
    },
    getCurrentValueObj(n) {
      const ctx = this;
      if (!ctx.value) return;
      console.log("组件的value", ctx.value);
      let p = ctx.value.substring(0, ctx.value.indexOf("."));
      let c = ctx.value.substring(ctx.value.indexOf(".") + 1);
      if (ctx.isComponent) {
        ctx.currentValueObj = ctx.componentParams[0];
        ctx.currentValueObj["current"] = ctx.currentValueObj.children.find(
          (i) => i.id === ctx.value
        );
      } else {
        ctx.currentValueObj = ctx.argsArr.find((i) => i.name === p);
        ctx.currentValueObj["current"] = ctx.currentValueObj.children.find(
          (i) => i.id === c
        );
      }
      ctx.dataValueText = ctx.currentValueObj.desc
        ? ctx.currentValueObj.desc + "." + ctx.currentValueObj["current"].name
        : ctx.currentValueObj["current"].name;
      console.log("组件value", ctx.value, ctx.currentValueObj);
    },
    typeChange(e) {
      const ctx = this;
      ctx.$emit("update:isComponent", e === "component" ? true : false);
    },
  },
};
</script>

<style>
</style>