<template>
  <div class="prototype-edit">
    <el-form
      ref="form"
      label-width="100px"
      :model="form"
      size="mini"
      label-suffix="："
    >
      <el-form-item label="模块名" prop="name" required>
        <el-input
          v-model="form.name"
          style="width: 270px"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="子项" prop="children">
        <el-select
          multiple
          filterable
          value-key="id"
          v-model="form.children"
          placeholder="请选择子项"
          style="width: 270px; margin-right: 14px"
        >
          <el-option
            :value="item"
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :disabled="disabled(item)"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button style="margin-left: 10px" @click="cancel">取消</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  name: "moduleForm",
  props: ["params", "title"],
  data() {
    return {
      form: {
        id: null,
        name: "",
        children: [],
      },

      // options: [],

      // otherSelected: [],
    };
  },
  mounted() {
    const ctx = this;
    if (ctx.params.obj) {
      ctx.form = ctx.params.obj;
    }
    if (!ctx.form.id) {
      ctx.form.name = "";
      ctx.form.children = [];
    }
  },
  computed: {
    compForm() {
      const ctx = this;
      if (!ctx.form.id) {
        return {
          id: null,
          name: "",
          children: [],
        };
      } else {
      }
    },
    options() {
      return this.params.entity.fields.map((i) => {
        return {
          id: i.id,
          name: i.dictionaryItem.name,
          engNameShort: i.dictionaryItem.engNameShort,
        };
      });
    },
    disabled() {
      return (item) => {
        if (!this.params.formData.forms.some((i) => i.id === item.id)) {
          return true;
        }
        let otherSelected = this.params.formData.module.filter(
          (i) => i.id !== this.form.id
        );
        let isDisabled = false;
        otherSelected.forEach(o => {
          if (o.children.some((i) => i.id === item.id)) {
            isDisabled = true
          }
        });
        return isDisabled
      };
    },
  },
  watch: {},
  methods: {
    getParentWindow(triggerNode) {
      return triggerNode.parentNode || window.document.body;
    },
    onSubmit(handlerSubmit) {
      const ctx = this;
      let closeDialog = true;
      ctx.$refs.form.validate((valid) => {
        if (valid) {
          if (!ctx.form.id)
            ctx.form.id = new Date().valueOf() + ((Math.random() * 100000) | 0);
          handlerSubmit("Module", ctx.form);
        } else {
          closeDialog = false;
          console.log("error submit!!");
          return false;
        }
      });
      return closeDialog;
    },
  },
};
</script>

<style lang="less" scoped></style>
