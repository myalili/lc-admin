<template>
  <div class="code-less-add">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-suffix="："
      label-width="100px"
      size="mini"
    >
      <el-form-item ref="name" :label="params.name" prop="name" required>
        <el-input
          v-model="form.name"
          style="width: 300px"
          placeholder="请输入"
        />
      </el-form-item>
      <!-- <el-form-item
        label="排序"
      >
        <el-input
          v-model="form.order"
          style="width: 300px"
          placeholder="请输入"
        />
      </el-form-item> -->
      <el-form-item
        ref="iconName"
        :label="params.iconName"
        prop="icon"
        v-if="params.iconEditable"
      >
        <codeless-dialog-icon :value.sync="form.icon" :operationEnable = "true" />
      </el-form-item>
      <template v-if="params.isMicro">
        <el-form-item label="页面路径" prop="component" >
          <el-input
            style="width: 300px"
            v-model="form.component"
            placeholder="请输入页面路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="页面类型">
          <el-select v-model="form.pageType" placeholder="请选择页面类型">
            <el-option
              v-for="item in pageTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item
        label="所属分类"
        v-if="params.data && params.data.length > 0"
      >
        <tree-select
          :options="params.data"
          :value.sync="form.scene"
          :accordion="isAccordion"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'addAppV2',
  mixins: [ window.V8.mixins ],
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: ["change"],
          },
        ],
        component: [
          {
            required: true,
            message: "页面路径不能为空",
            trigger: ["change"],
          },
        ],
        icon: [
          {
            required: true,
            message: "请选择图标",
            trigger: "change",
          },
        ],
      },
      form: {
        name: "",
        icon: "icon-yemianmingcheng1",
        scene: "",
        pageType: "",
        component: "",
        // order: ""
      },
      pageTypes: [
        // {
        //   value: "",
        //   label: "vue模式",
        // },
        {
          value: "js",
          label: "js模式",
        },
        {
          value: "iframe",
          label: "iframe模式",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
  },
  mounted() {
    if (this.params.detail) {
      this.form = { ...this.form, ...this.params.detail };
    }
    console.log('this.form', this.form);
    console.log('this.params', this.params);
  },
};
</script>

<style scoped lang="less">

</style>