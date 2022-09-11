<template>
  <div class='codeless-publish-dialog'>
     <el-form ref="form" :model="form" label-width="80px" label-position='left' :rules='rules' size="mini">
        <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" ref='deviceNameInput' placeholder='请输入' @keyup.enter.native="enterKeyUp"></el-input>
        </el-form-item>
        <!-- 解决当form表单中只有一个item时，input点击回车会刷新页面 -->
        <el-form-item label="版本号" prop="deviceName" v-show='false'>
            <el-input v-model="form.version" ref='deviceNameInput' placeholder='请输入' @keyup.enter.native="enterKeyUp" @submit.native.prevent></el-input>
        </el-form-item>
        <p style='color: #7F8C93;margin-left: 84px;height:14px;line-height:14px'>版本格式：x.x.x</p>
    </el-form>
  </div>
</template>

<script>
export default {
    // mixins:[window.codelessMixins.customDialog],
    data(){
      return {
          form:{
            version:''
          },
          rules:{
            version:[{
                required: true, message: '请输入版本号', trigger: 'blur'

            },{
                pattern: /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/,message: '请输入正确的版本号',trigger: 'blur'
            }]
          }

      }
  },
  methods:{
      confirm(){
            let self = this;
            let closeDialog = false;
            self.$refs["form"].validate(valid => {
                if(valid){
                    closeDialog = true;
                }
            })
            return closeDialog
      },
      enterKeyUp(){
          
          // this.$root.confirm(this)
      }
  }
}
</script>

<style lang='less' scoped>

</style>