<template>
  <div class="relative">
    <div class="absolute top-0 right-0">
      <el-button
        type="primary"
        icon="el-icon-document"
        round
        size="mini"
        title="保存"
        @click="save"
        >保存</el-button
      >
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      label-position="right"
      style="width: 80%; height: 100%"
    >
      <el-form-item label="数据源中文名" prop="desc">
        <el-input
          v-model="form.desc"
          style="width: 44%"
          size="small"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据源英文名" prop="name">
        <el-input
          v-model="form.name"
          style="width: 44%"
          size="small"
          :disabled="disabled"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="服务名" prop="domain">
        <div class="flex items-center w-full">
          <el-input
            size="small"
            style="width: 44%"
            placeholder="请输入"
            v-model="form.domain"
            class="input-with-select"
          >
            <el-select v-model="form.https" slot="prepend" placeholder="请选择">
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in httpOption"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-input>

          <el-form-item label="端口" label-width="69px" prop="port">
            <el-input
              v-model="form.port"
              style="width: 82px"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="w-full justify-end flex items-center">
            <span>接口</span>
            <div
              style="border-radius: 50%"
              class="
                content-head-add
                w-4
                h-4
                flex
                items-center
                justify-center
                leading-5
                text-white
                cursor-pointer
                ml-2
                bg-primary
              "
              @click="addInterface"
            >
              <!-- <i class="iconfont icon-jiahao inline-block"></i> -->
              <span class="text-white" style="font-size: 16px" title="新增接口"
                >+</span
              >
            </div>
          </div>
        </template>
        <div
          class="flex items-center mb-3"
          v-for="item in form.interfaces"
          :key="item.id"
        >
          <el-select v-model="item.method" placeholder="请选择" size="small">
            <el-option
              v-for="m in ['post', 'get', 'put', 'delete']"
              :key="m"
              :value="m"
              >{{ m }}</el-option
            >
          </el-select>
          <el-input
            v-model="item.name"
            style="width: 25%"
            size="small"
            class="input-left"
            placeholder="接口名："
          >
          </el-input>
          <el-input
            v-model="item.if"
            style="width: 35%"
            size="small"
            class="input-right"
            placeholder="路径："
          >
          </el-input>
          <i
            class="
              el-icon-remove-outline
              cursor-pointer
              text-lg text-gray-300
              hover:text-red-500
              ml-2
            "
            @click="delInterface(item)"
          ></i>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "list-item",
  props: ["form", "disabled"],
  data() {
    return {
      str: "",
      rules: {
        name: [{ required: true, message: "英文名不能为空", trigger: "blur" }],
        desc: [{ required: true, message: "中文名不能空", trigger: "blur" }],
        domain: [{ required: true, message: "服务不能为空", trigger: "blur" }],
      },
      select: "https://",

      httpOption: [
        {
          label: "https://",
          value: true,
        },
        {
          label: "http://",
          value: false,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    addInterface() {
      this.form.interfaces.push({
        id: new Date().getTime(),
        if: "",
        name: "",
        method: "post",
      });
    },
    delInterface(item) {
      this.form.interfaces.splice(
        this.form.interfaces.findIndex((i) => i.id === item.id),
        1
      );
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>
<style scoped lang="less">
::v-deep .el-form-item__content {
  height: 30px;
  line-height: 30px;
  .el-select {
    width: 90px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .input-left {
    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
  .input-right {
    .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
::v-deep .el-input__inner {
  color: #333333;
}
::v-deep .el-form-item__label {
  color: #333333;
  line-height: 30px;
  height: 30px;
}
</style>