<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="left">
          <el-form-item label="结构名称" prop="name">
             <el-input v-model="form.name" style="width:200px" size="small" :readonly="disabled"></el-input>
          </el-form-item>
          <el-form-item label="中文描述" prop="desc">
            <el-input v-model="form.desc" style="width:200px" size="small" :readonly="disabled"></el-input>
          </el-form-item>
      </el-form>
    <!-- <div v-for="(item, index) in list" :key="index">
      
      <a-input-group compact style="margin-top: 10px">
        <a-input
          style="width: 20%"
          default-value="input content"
          v-model="item.id"
        />
        <a-select default-value="string">
          <a-select-option value="string"> string </a-select-option>
        </a-select>
        <a-input
          style="width: 20%"
          default-value="input content"
          v-model="item.value"
          placeholder="值"
        />
      
      </a-input-group>
    </div> -->
  </div>
</template>
<script>
export default {
  name: "list-item",
  props:['form','disabled'],
  data() {
    return { 
     
     str:'',
     rules: {
          name: [
            { required: true, message: '请输入数据结构', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请输入中文描述', trigger: 'change' },
          ],
     }
  };
  },
  mounted(){
  },
  methods:{
    
  }
};
</script>
<style scoped lang="less">
::v-deep .el-form-item__content{
  height:30px;
  line-height: 30px;
}
::v-deep .el-input__inner{
  color:#333333,
}
::v-deep .el-form-item__label{
    color:#333333;
    line-height:30px;
    height:30px;
  }
</style>