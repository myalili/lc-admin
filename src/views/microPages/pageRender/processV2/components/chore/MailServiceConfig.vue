<template>
  <el-container class="mail-choose">
    <el-main style="min-height:300px;max-height:400px">
      <el-form ref="mailForm" :model="mail" label-width="70px">
        <el-form-item label="收件人:">
          <el-input v-model="mail.to" style="width:90%" clearable></el-input>
          <el-button type="text" @click="openAddresseeChooseDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="抄送人:">
          <el-input v-model="mail.cc" style="width:90%" clearable></el-input>
          <el-button type="text" @click="openRecipientsChooseDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="主题:">
          <el-input v-model="mail.subject" style="width:90%" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <Tinymce v-model="mail.text" style="width:90%"></Tinymce>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="text-align: right;">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import Tinymce from '../formGenerator/components/tinymce';
export default {
  mixins:[window.V8.mixins],
  name: 'MailServiceConfig',
  components: {
    Tinymce
  },
  data() {
    return {
      mail: {
        to: '',
        cc: '',
        subject: '',
        text: ''
      },
      recipientsSelectedUsers: [],
      addresseeSelectedUsers: []
    };
  },
  created() {
    if (this.AParams.mail) {
      Object.assign(this.mail, this.AParams.mail);
    }
  },
  methods: {
    handleConfirm() {
      if (!this.mail) {
        this.$message({ message: '请选择', type: 'warning' });
        return;
      }
      this.$root.confirm(this.mail)
      // this.$store.commit('callback', { name: 'confirm', arg: this.mail });
      // this.close();
    },
    openRecipientsChooseDialog() {
      this.open({
        status: true,
        title: '选择用户',
        path: '/AssigneeChoose',
        component: Vue.options.components.AssigneeChoose,
        customClass: 'aops-el-common assignee-choose-dialog lynn',
        width: '700px',
        type: 'SUB',
        params: {
          type: 'checkbox',
          value: this.recipientsSelectedUsers,
          useronly: true
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: params => {
          if (params.length) {
            this.recipientsSelectedUsers = params;
            this.mail.cc = params.map(item => `${item.userCode}@agree.com.cn`).join(';');
          }
        }
      });
    },
    openAddresseeChooseDialog() {
      this.open({
        status: true,
        title: '选择用户',
        path: '/AssigneeChoose',
       component: Vue.options.components.AssigneeChoose,
        customClass: 'aops-el-common assignee-choose-dialog lynn',
        width: '700px',
        type: 'SUB',
        params: {
          type: 'checkbox',
          value: this.addresseeSelectedUsers,
          useronly: true
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: params => {
          if (params.length) {
            this.addresseeSelectedUsers = params;
            this.mail.to = params.map(item => `${item.userCode}@agree.com.cn`).join(';');
          }
        }
      });
    }
  }
};
</script>
