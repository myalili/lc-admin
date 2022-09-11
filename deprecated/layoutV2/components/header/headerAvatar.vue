<template>
  <div>
    <el-dropdown size="small" @command="handleCommand">
    <div class="aweb-header-avatar cursor-pointer" >
      <!-- <el-avatar class="avatar" size="small" shape="circle" :src="user.avatar" /> -->
     
      <svg class="icon svg-icon avatar" aria-hidden="true">
        <use xlink:href="#icon-suoyouzhe"></use>
      </svg>
      <span class="name  text-muted flex items-center whitespace-nowrap">
          <span>{{ role }}</span>
          <i class="el-icon-minus"></i>
          <span>{{(user.userInfo && user.userInfo.user && user.userInfo.user.nickname) || user.userName }}</span>
        </span> 
      <span class="down-icon"><i class="el-icon-arrow-down"></i></span>
    </div>

    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item>
        <i class="el-icon-document" />
        <span>个人中心</span>
      </el-dropdown-item>
      <el-dropdown-item>
        <i class="el-icon-setting" />
        <span>设置</span>
      </el-dropdown-item> -->
      <el-dropdown-item command="modifiedPassword">
        <i class="iconfont icon-zhongzhimima"  style='font-size:12px'/>
        <span>修改密码</span>
      </el-dropdown-item>
      <el-dropdown-item command="logout">
        <i class="el-icon-close" />
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <!-- 重置密码 -->
        <el-dialog  
                width='500px'
                :visible="true" :close-on-click-modal="false"
                    v-if='resetPasswordDialogVisible'
                    custom-class="no-header-and-footer-dialog"
                   class="dialog-small adaptDialog" :append-to-body="true">
           <codeless-dialog-ctn 
              title="重置用户密码"
              :loading='submitLoading'
              @close="resetPasswordDialogVisible = false" 
              @cancel="resetPasswordDialogVisible = false"
              @confirm="resetPassword">
             <template v-slot:dialogContent>
              <el-form label-width="140px" :rules="formRules" ref="user" :model="formData" size="mini">
                <el-form-item label="旧密码" prop='oldPassword'>
                  <el-input v-model="formData.oldPassword" clearable placeholder="请输入旧密码" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop='password1'>
                  <el-input v-model="formData.password1" clearable placeholder="密码的长度不能少于8位数" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="再次输入新密码" prop='password2'>
                  <el-input v-model="formData.password2" clearable placeholder="请再次输入新密码" type="password" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
             </template>
           </codeless-dialog-ctn>        
          
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click.native="resetPasswordDialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="resetPassword" :loading="submitLoading">确定</el-button>
          </div> -->
        </el-dialog>
  </div>
  
</template>

<script>
const { getToken } = window.alcapCoreUtils;


export default {
  name: "headerAvatar",
  computed: {
    user() {
      // console.log(this.$store.state.user.currentData.roles);
      return this.$store.state.user;
    },
    role() {
      return this.$store.state.user.currentData.roles[0].name
    }
  },
  data(){
    let validatePass = (rule, value, callback) => {
        
          if(value.length<8){
            callback(new Error('密码长度不小于8位'));
          }else if (this.formData.password1 !== '') {
            this.$refs.user.validateField('checkPass');
          }
          callback();
        
      };
      let validatePass2 = (rule, value, callback) => {
       if (value !== this.formData.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      resetPasswordDialogVisible:false,
      submitLoading: false,
      formRules:{
          password1: [
            {required: true, message: "请输入密码", trigger: "change"},
            {pattern: /[0-9A-Za-z_]+/, message: '只允许输入数字、字母、下划线',trigger:'change'},
            { validator: validatePass,trigger:'change' }
          ],
          password2: [
            {required: true, message: "请再次输入密码", trigger: "change"},
            {pattern: /[0-9A-Za-z_]+/, message: '只允许输入数字、字母、下划线',trigger:'change'},
            { validator: validatePass2, trigger: 'change' }
          ],
      },
      formData:{
        oldPassword:'',
        password1:'',
        password2:''
      }
    }
    
  },
  methods: {
    modifiedPassword(){
       this.resetPasswordDialogVisible = true;
       this.submitLoading = false;
    },
    resetPassword(){
      this.submitLoading = true;
      let self = this;
      self.$refs.user.validate((valid)=>{
        if(valid){
           
          self.$store.dispatch('user/resetPassword',self.formData)
          .then(res=>{
            self.$message.success("修改密码成功");
              this.resetPasswordDialogVisible = false;
              this.submitLoading = false;
              self.$store
              .dispatch("user/logout", { ctoken: getToken() })
              .then(() => {
                self.$router.push("/login");
              })
              .catch((error) => {
                self.$message.error("退出登录失败");
                console.log(error)
              });
          })
          .catch(e=>{
             self.$message.error("修改密码失败");
             console.log(e);
          });
        }else{
           self.submitLoading = false;
        }
      })
      
    },
    handleCommand(command){
      switch(command){
        case 'logout':
          this.logout();
          break;

        case 'modifiedPassword':
          this.modifiedPassword();
          break;

        default:
          break;
      }
    },
    logout() {
      let _this = this;
      this.$confirm("确认退出吗?","提示",{
        type: 'warning',
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(()=>{
        _this.$store
            .dispatch("user/logout", { ctoken: getToken() })
            .then(() => {
              _this.$router.push("/login");
            })
            .catch((error) => {
              _this.$message.error("退出登录失败");
            });
      })
       
    },
  },
};
</script>

<style lang="less">
.aweb-header-avatar {
  display: inline-flex;
  vertical-align: middle;
  padding-right: 10px;
  .down-icon,
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
    width:20px;
    height:20px;
  }
  .name {
    font-weight: 500;
    margin-right: 6px;
  }
  .down-icon {
    i {
      font-size: 12px;
    }
  }
}
.avatar-menu {
  width: 150px;
}
</style>
