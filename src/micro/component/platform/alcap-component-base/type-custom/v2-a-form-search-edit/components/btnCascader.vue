<template>
  <div class="w-full">
    <div class="align">
      <el-button
        type="primary"
        size="mini"
        class="w-5 h-5"
        style="padding: 0"
        icon="el-icon-plus"
        circle
        @click="addCascader"
      ></el-button>
    </div>
    <div class="cascader flex items-center" v-for="(item, index) in form.cascader" :key="item.id">
      <div class="flex items-center">
        <span style="margin-right: 9px">{{ index + 1 }}.</span>
        <el-select v-model="item.config" style="width: 110px">
          <el-option label="变量修改" value="1"></el-option>
          <el-option label="隐藏" value="2"></el-option>
          <!-- <el-option label="显示" value="3"></el-option> -->
        </el-select>
    
        <sync-param
          style="width: 110px"
          :is-custom="true"
          :target-params="currentArgsArr"
          :value.sync="item.arg"
          v-if="item.config === '1' || item.config === '2' || item.config === '3'"
        />

        <el-select
          v-model="item.editType"
          placeholder="选择方式"
          style="width: 110px"
          v-if="item.config === '1'"
        >
          <el-option label="赋值" value="="></el-option>
          <el-option label="加" value="+"></el-option>
          <el-option label="减" value="-"></el-option>
        </el-select>

        <el-select
          v-model="item.hideType"
          placeholder="选择方式"
          style="width: 110px"
          v-if="item.config === '2'"
        >
          <el-option label="等于" value="=="></el-option>
          <el-option label="大于" value=">"></el-option>
          <el-option label="小于" value="<"></el-option>
          <el-option label="不等于" value="!=="></el-option>
        </el-select>

        <el-select
          v-model="item.showType"
          placeholder="选择方式"
          style="width: 110px"
          v-if="item.config === '3'"
        >
          <el-option label="等于" value="=="></el-option>
          <el-option label="大于" value=">"></el-option>
          <el-option label="小于" value="<"></el-option>
          <el-option label="不等于" value="!=="></el-option>
        </el-select>

        <span style="margin: 0 9px; font-weight: bold">，</span>

        <el-input
          v-if="item.config === '1' && item.editType"
          style="width: 110px"
          v-model="item.editValue"
          placeholder="请输入"
        ></el-input>

        <el-input
          v-if="item.config === '2' && item.hideType"
          style="width: 110px"
          v-model="item.hideValue"
          placeholder="请输入"
        ></el-input>

        <el-input
          v-if="item.config === '3' && item.showType"
          style="width: 110px"
          v-model="item.showValue"
          placeholder="请输入"
        ></el-input>
      </div>
      <i class="el-icon-remove btn-del cursor-pointer hover:text-red-500" @click="delCascader(item)"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currentArgsArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 级联配置-添加
     */
    addCascader() {
      const ctx = this;
      if (!ctx.form.cascader) ctx.$set(ctx.form, "cascader", []);
      ctx.form.cascader.push({
        id: ctx.form.cascader.length,
      });
    },
    /**
     * 级联配置-删除
     */
    delCascader(item) {
      const ctx = this;
      ctx.form.cascader.splice(
        ctx.form.cascader.findIndex((i) => i.id === item.id),
        1
      );
    },
  },
};
</script>

<style lang="less" scoped>
.align {
    height: 28px;
    display: flex;
    align-items: center;
  }
  .cascader {
    display: flex;
    align-items: center;
    margin-top: 18px;
    .btn-del {
      font-size: 16px;
      color: #aabec8;
      margin-left: 12px;
      &:hover {
        cursor: pointer;
        color: #f65656;
      }
    }
  }
</style>