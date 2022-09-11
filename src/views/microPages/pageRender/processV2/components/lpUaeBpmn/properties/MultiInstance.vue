<template>
  <el-collapse-item>
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-menu"></i> 多实例配置</div>
    <div>
      <el-form size="mini" :model="node.multiInstance" label-width="80px">
        <el-form-item label="多实例">
          <el-select v-model="node.multiInstance.type" placeholder="请选择" :disabled="readonly">
            <el-option v-for="item in multiOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="['parallel', 'sequential'].includes(node.multiInstance.type)">
          <el-form-item label="循环基数" prop="loopCardinality">
            <el-input v-model="node.multiInstance.loopCardinality" clearable :disabled="readonly" />
          </el-form-item>
          <el-form-item label="集合" prop="collection">
            <el-input v-model="node.multiInstance.collection" clearable :disabled="readonly" />
          </el-form-item>
          <el-form-item label="元素变量" prop="elementVariable">
            <el-input v-model="node.multiInstance.elementVariable" clearable :disabled="readonly" />
          </el-form-item>
          <el-form-item label="完成条件" prop="completionCondition">
            <el-input v-model="node.multiInstance.completionCondition" clearable :disabled="readonly" />
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="node.multiInstance.asyncBefore" :disabled="readonly">异步前</el-checkbox>
            <el-checkbox v-model="node.multiInstance.asyncAfter" :disabled="readonly">异步后</el-checkbox>
            <el-checkbox v-model="node.multiInstance.exclusive" :disabled="readonly">排除</el-checkbox>
          </el-form-item>
          <el-form-item
            v-if="node.multiInstance.asyncBefore || node.multiInstance.asyncAfter"
            label="重试周期"
            prop="failedJobRetryTimeCycle"
          >
            <el-input v-model="node.multiInstance.failedJobRetryTimeCycle" clearable :disabled="readonly" />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </el-collapse-item>
</template>

<script>
export default {
  name: 'MultiInstance',
  props: {
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiOptions: [
        // selete框配置项
        {
          value: 'parallel',
          label: '并行多重事件'
        },
        {
          value: 'sequential',
          label: '时序多重事件'
        },
        // {
        //   value: 'loop',
        //   label: '循环事件'
        // },
        {
          value: 'empty',
          label: '无'
        }
      ],
      multiValue: '', // selected框绑定值
      // multiFormData: {
      //   // 配置对象
      //   type: 'empty',
      //   loopCardinality: '', // 循环基数
      //   collection: '', // 集合
      //   elementVariable: '', // 元素变量
      //   completionCondition: '', // 完成条件
      //   asyncBefore: false, // 异步前
      //   asyncAfter: false, // 异步后
      //   exclusive: false, // 排除
      //   failedJobRetryTimeCycle: '' // 重试周期
      // }
    };
  },
  computed: {
    multiTypeReadOnly() {
      if (this.node.assignee || this.readonly) {
        return true;
      }
      return false;
    }
  },
  methods: {
    init() {
      this.multiFormData = Object.assign(this.node.multiInstance);
    }
  },
  watch: {
    // multiFormData: {
    //   deep: true,
    //   handler(val, old) {
    //     this.node.multiInstance.type = val.type;
    //     this.node.multiInstance.loopCardinality = val.loopCardinality;
    //     this.node.multiInstance.collection = val.collection;
    //     this.node.multiInstance.elementVariable = val.elementVariable;
    //     this.node.multiInstance.completionCondition = val.completionCondition;
    //     this.node.multiInstance.asyncBefore = val.asyncBefore;
    //     this.node.multiInstance.asyncAfter = val.asyncAfter;
    //     this.node.multiInstance.exclusive = val.exclusive;
    //     this.node.multiInstance.failedJobRetryTimeCycle = val.failedJobRetryTimeCycle;
    //   }
    // }
  }
};
</script>

<style lang="scss"></style>
