<template>
    <div>
        <el-form :model="user" label-width="80px" :rules="userRules" ref="user" :disabled="userFormDisable">
            <el-form-item prop="name" label="用户名">
              <el-input v-model="user.name" :disabled="user.disabled" clearable placeholder="请使用英文、数字或者下划线(2-50位)组合"></el-input>
            </el-form-item>
            <el-form-item prop="nickname" label="昵称">
              <el-input v-model="user.nickname" clearable placeholder="请输入用户昵称"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="user.phone" clearable placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email" clearable placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="user.desc" clearable placeholder="可以在这里填写备注"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props:{
       user:{} 
    },
    data(){
        return{
        //   user:{},
          userRules: {
            //  pass: [
            //     {required: true, message: "请输入密码", trigger: "blur"},
            //     { validator: validatePass, trigger: 'blur' }
            //   ],
            //   checkPass: [
            //      {required: true, message: "请再次输入密码", trigger: "blur"},
            //     { validator: validatePass2, trigger: 'blur' }
            //   ],
            name: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {
                min: 2,
                max: 50,
                message: "名称长度在 2 到 50个字符",
                trigger: "change",
            },
            {pattern: '^[\\w]{1,}$', message: '只支持英文数字和下划线', trigger: "change"}
            ],
            nickname: [
            {required: true, message: "请输入用户昵称", trigger: "blur"},
            {
                min: 0,
                max: 50,
                message: "昵称长度在 0 到 50个字符",
                trigger: "blur",
            },
            ],
            phone: [
            {required: true, message: "请输入联系电话号码", trigger: "blur"},
            {
                min: 0,
                max: 50,
                message: "联系电话号码长度在 0 到 50个字符",
                trigger: "blur",
            },
            ],
        }, //用户字段规则
           userFormDisable: false, //用户表单禁用
        }
    }
}
</script>