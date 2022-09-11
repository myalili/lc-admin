<template>
  <el-container class="amq-service-config">
    <el-main style="min-height:300px;max-height:400px">
      <el-form ref="form0" :model="amq" :rules="rules" label-width="50px">
        <el-form-item label="主题:" prop="topic">
          <el-input v-model="amq.topic" placeholder="topic" clearable />
        </el-form-item>
        <el-form-item label="标签:" prop="tags">
          <el-input v-model="amq.tags" placeholder="tags, 多个逗号分隔" clearable />
        </el-form-item>
        <el-form-item label="Keys:" prop="keys">
          <el-input v-model="amq.keys" placeholder="keys, 多个逗号分隔" clearable />
        </el-form-item>
        <el-form-item label="信息:" prop="message">
          <el-input v-model="amq.message" type="textarea" :rows="4" placeholder="message" clearable />
        </el-form-item>
        <el-form-item label="参数:">
          <div class="opr_bottom_button">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddProperty">添加参数</el-button>
          </div>
          <el-table :data="amq.properties">
            <el-table-column label="属性名称" prop="name" show-overflow-tooltip />
            <el-table-column label="属性值" prop="value" show-overflow-tooltip />
            <el-table-column label="操作" width="90px">
              <template slot-scope="{ row, $index }">
                <el-button size="mini" type="text" @click="editProperty(row)">编辑</el-button>
                <el-button size="mini" type="text" @click="amq.properties.splice($index, 1)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
const { defaultRule } = window.aopsUtils;
import PropertyAdd from './PropertyAdd'
export default {
  mixins:[window.V8.mixins],
  name: 'AmqServiceConfig',
  data() {
    return {
      amq: {
        topic: '',
        tags: '',
        keys: '',
        message: '',
        properties: []
      },
      rules: {
        topic: defaultRule
        // tags: defaultRule,
        // keys: defaultRule,
        // message: defaultRule
      }
    };
  },
  created() {
    if (this.AParams.amq) {
      Object.assign(this.amq, this.AParams.amq);
      if (!Array.isArray(this.amq.properties)) {
        this.amq.properties = Object.keys(this.amq.properties).map(item => ({
          name: item,
          value: this.amq.properties[item]
        }));
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form0.validate(valid => {
        if (valid) {
          const properties = {};
          this.amq.properties.forEach(item => (properties[item.name] = item.value));
          // this.$store.commit('callback', {
          //   name: 'confirm',
          //   arg: {
          //     ...this.amq,
          //     properties
          //   }
          // });
          this.$root.confirm({
              ...this.amq,
              properties
            })
          // this.close();
        } else {
          this.$message({ message: '请填写完整！', type: 'warning' });
          return false;
        }
      });
    },
    toAddProperty() {
      this.open({
        title: '添加属性',
        path: '/PropertyAdd',
        component:PropertyAdd,
        // page: 'microPages/process/components/chore/PropertyAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.amq.properties.push(data);
        }
      });
    },
    editProperty(property) {
      this.open({
        title: '添加属性',
        path: '/PropertyAdd',
        component:PropertyAdd,
        // page: 'microPages/process/components/chore/PropertyAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          property
        },
        confirmCallback: data => {
          Object.assign(property, data);
        }
      });
    }
  }
};
</script>
