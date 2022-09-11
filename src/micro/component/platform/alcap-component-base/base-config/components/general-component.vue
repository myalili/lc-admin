<template>
  <div class="general-component">
    <div class="item">
      组件显示条件
      <span><el-switch v-model="obj.model.generalComponentShow.isOpen" />
      {{ obj.model.generalComponentShow.isOpen? '开启': '关闭' }}</span>
    </div>
    <div class="item" v-if="obj.model.generalComponentShow.isOpen">

      <sync-param
        style="width: 180px"
        :is-custom="true"
        :target-params="root.argsArr"
        :value.sync="obj.model.generalComponentShow.arg"
        :componentName="obj.model.name"
      />

      <el-select v-model="obj.model.generalComponentShow.showType" size="mini" placeholder="选择方式">
        <el-option label="等于" value="=="></el-option>
        <el-option label="大于" value=">"></el-option>
        <el-option label="小于" value="<"></el-option>
        <el-option label="不等于" value="!=="></el-option>
        <el-option label="绑定" value="bind"></el-option>
      </el-select>

      <el-input v-model="obj.model.generalComponentShow.showValue" style="width:110px" size="mini" placeholder="请输入"></el-input>
      </div>
  </div>
</template>

<script>
export default {
  inject: ["root"],
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isSync: this.item.sync,
    };
  },
  created() {
    const ctx = this;
    const generalConfig = {
      generalComponentShow: {
        arg: '',
        showType: '',
        showValue: null,
        isOpen: false
      }
    }
    for (const key in generalConfig) {
      if (!ctx.obj.model[key]) {
        ctx.$set(ctx.obj.model, key, generalConfig[key]);
      }
    }
    console.log('公共的属性', ctx.obj.model);
  },
  mounted() {
    const ctx = this;
    if (ctx.obj.model[ctx.item.name]) {
      ctx.isSync = false;
    }
  },
  computed: {
    syncParam: {
      get() {
        return this.obj.model.syncParam;
      },
      set(val) {
        this.obj.model.syncParam = val;
      },
    },
  },
  methods: {
    change() {
      this.$forceUpdate();
    },
    handleChange(e) {
      console.log(e);
      const ctx = this;
      msgHub.$emit("syncParam", e);
    },
  },
};
</script>

<style lang="less" scoped>
.general-component {
  width: 100%;
  margin-bottom: 20px;
  .item {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 27px;
    color: #333333;
  }
}

</style>