<template>
  <el-input 
    v-model="vModel"
    :max-length="Number(maxLength)"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    size="mini"
  >
    <template slot="append" >
      <el-upload
        class="upload-demo"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple  
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-change="handleChange"
        :http-request="customUpload"
        :show-file-list="false"
        :disabled="loading"
      >
        <i :class="[ loading ? 'el-icon-loading' : 'el-icon-bank-card', loading ?'cursor-not-allowed': 'cursor-pointer' ]  " />
      </el-upload>
      
    </template>
    
  </el-input>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AInputOcr',
  inject: ['root'],
  props: {
    maxLength: {
      type: String,
      default: ()=> {
        return '255';
      }
    },
    type: {
      type: String,
      default: ()=> {
        return 'text';
      }
    },
    value: {
      type: String,
      default: ()=> {
        return '';
      }
    },
    placeholder: {
      type: String,
      default: ()=> {
        return '请输入';
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    entityId: {
      type: String,
      default: ()=> {
        return '';
      }
    },
    config: {
      type: Object,
      default: ()=> {
        return {};
      }
    }
  },
  data() {
    return {
      dataValue: this.value,
      fileList: [],
      loading: false
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    "dataValue": {
      handler(n) {
        if (this.$parent.config) {
          this.$parent.config.value = n;
        } else {
          this.$emit('update:value', n);
        }
          
        console.log(this.syncParam, this.root.args);
      }
    },
    "value": {
      handler(n) {
        this.dataValue = n;
      }
    },
  },
  methods: {
    async customUpload() {
      const ctx = this;
      const reader = new FileReader()

      reader.readAsDataURL(ctx.fileList[0].raw);
      reader.onload = async ()=>{      
        let res = await pipe.entity.getEntityDetail(ctx.config.entityId);
        let imgId = res.fields.filter(i=>i.dictionaryItem.engNameShort === (ctx.config.component.labelValue || 'IMG'))[0].id
        let params = {
          entityId: res.id,
          fields: [
            {
              entityFieldId: imgId,
              value: reader.result.substring(reader.result.indexOf(',') + 1)
            }
          ],
        }
        if (ctx.config.component.ocrType === 'bank_card') {
          params.fields.push({
            entityFieldId: res.fields.filter(i=>i.dictionaryItem.engNameShort === 'TEMPLATE_NAME')[0].id,
            value: 'bank_card'
          })
        }
        ctx.loading = true

        const { dataSourceRetrieveRecord } = window.getBffApi();

        dataSourceRetrieveRecord(params).then((res) => {
          if (res.success) {
            ctx.fileList = []
            const raw_text = res.obj && res.obj.raw_text

            if (ctx.config.component.ocrType === 'id_card') {
              ctx.dataValue = res.obj['公民身份号码']
            }
            if (ctx.config.component.ocrType === 'bank_card') {
              ctx.dataValue = res.obj.card_id
            }
            ctx.loading = false
            this.$message({
              message: "识别成功！",
              type: "success",
            });
            
          } else {
            ctx.loading = false
            ctx.$message.error(res.msg);
            ctx.fileList = []
          }
        }).catch(err=> {
          ctx.loading = false
          ctx.$message.error(err.msg);
          ctx.fileList = []
        });
      }
      
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log("handleChange", fileList);
    },
  }
}
</script>

<style>

</style>