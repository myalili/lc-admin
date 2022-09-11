<template>
  <div class="divide-y content">
    <el-form
        ref="ruleForm"
        size="small"
        label-suffix="："
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
      <el-form-item prop="type" label="类型" v-if="!form.id">
        <el-radio-group v-model="form.type" size="mini">
          <el-radio-button label="SQL"></el-radio-button>
          <el-radio-button label="脚本"></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="英文名称" prop="name">
        <el-input
          v-model.trim="form.name"
          size="mini"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="中文名称" prop="desc">
        <el-input
          v-model.trim="form.desc"
          size="mini"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="schemaType" prop="schemas" v-show="form.type ==='脚本' || form.type === 'data_factory_script'">
        <schemaType-Select
            class="w-full"
          :schemaType="schemaType"
          @update-schema="updateSchema"
          :schemas="form.schemas"
          :onlyQuery="true"
        ></schemaType-Select>
      </el-form-item>
    </el-form>
    <!-- <div >
      <div class="content-type flex items-center">
        <label class="content-type_title">类型</label>
        <el-radio-group v-model="type" size="mini">
          <el-radio-button label="SQL"></el-radio-button>
          <el-radio-button label="脚本"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="content-input flex items-center">
        <label>英文名称</label>
        <el-input
          v-model.trim="name"
          size="mini "
          placeholder="请输入"
        ></el-input>
      </div>
      <div class="content-input flex items-center">
        <label>中文名称</label>
        <el-input
          v-model.trim="desc"
          size="mini "
          placeholder="请输入"
        ></el-input>
      </div>
        <div class=" flex items-center" v-show="type ==='脚本'">
        <label class="labelWidth">schemaType</label>
        <schemaType-Select
            class="w-full"
          :schemaType="schemaType"
          @update-schema="updateSchema"
          :schemas="schemas"
          :onlyQuery="true"
        ></schemaType-Select>
      </div>
    </div> -->
  </div>
</template>

<script>
import schemaTypeSelect from "./schemaTypeSelect.vue";
export default {
   mixins: [window.V8.mixins, window.codelessMixins.customDialog],
  data() {
    return {
      schemaType: "db",
      schemas:[],
      name: "",
      desc: "",
      type: "SQL",


      form: {
        schemaType: "db",
        schemas:[],
        name: "",
        desc: "",
        type: "SQL",
        id: null
      },

      rules: {
        name: [
            { required: true, message: '英文名称不能为空！', trigger: 'change' }
          ],
        desc: [
            { required: true, message: '中文名称不能为空！', trigger: 'change' }
          ],
        schemas: [
            { required: true, message: 'schemaType不能为空！', trigger: 'change' }
          ],
      }
    };
  },
  props: ["params"],
  components: {
    schemaTypeSelect,

  },
  mounted() {
    const ctx = this;

    ctx.form.type = ctx.params.type;
    if(ctx.params.data) {
      // ctx.form.id = ctx.params.data.id || '';
      
      // ctx.form.name = ctx.params.data.name;
      // ctx.form.desc = ctx.params.data.desc;
      // ctx.form.schemas = ctx.params.data.schemas;

      ctx.form = JSON.parse(JSON.stringify(ctx.params.data));
    }

    console.log(ctx.form);


    if(!ctx.form.id) ctx.params.type === 'data_factory_sql'?(ctx.form.type= "SQL"):(ctx.form.type = '脚本')
  
  },
  methods:{

    cancel(){
      this.$root.cancel()
    },
    updateSchema(val) {
      console.log("updateSchema",this.form.schemas,val);
        this.form.schemas = val;
    },
  }
};
</script>

<style lang="scss" scoped>

::v-deep .el-radio-group {
  // @apply bg-primary;
  // padding: 1px;
  border-radius: 22px;
  box-sizing: border-box;
  width: 132px;
  display: flex;
  align-items: center;
  .el-radio-button:nth-child(1) {
    .el-radio-button__inner {
      border-radius: 22px 0px 0px 22px;
    }
  }
  .el-radio-button:nth-child(2) {
    .el-radio-button__inner {
      border-radius: 0 22px 22px 0;
    }
  }
}
.content {
  margin-top: 10px;
  margin-left: 50px;
  margin-right: 80px;
  .content-type {
    margin-bottom: 21px;
    .content-type_title {
      width: 84px;
    }
  }

  .content-input {
    margin-bottom: 16px;
    label {
      width: 100px;
      margin-right: 10px;
    }
  }
}
.footer-button{
  width: 76px;
  margin-top:12px ;
  margin-right: 10px;
}
.labelWidth{
    margin-right: 10px;
    width: 105px;
    text-align: left;
    vertical-align: middle;
    float: left;    
}
</style>
