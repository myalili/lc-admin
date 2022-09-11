<template>
  <el-container>
    <el-main>
      <el-form ref="addForm" label-width="90px">
        <!-- <el-form-item label="集群选择">
          <ClusterSelect v-model="clusterId" />
        </el-form-item> -->
        <el-form-item label="文件（zip）:">
          <el-upload ref="upload" :auto-upload="false" :limit="1" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>选择文件</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer style="padding-left:120px">
      <el-button type="primary" @click="handleAdd" :loading="adding">确定</el-button>
      <el-button @click="close()">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex';
// import ClusterSelect from '@/components/lpCluster/ClusterSelect';

export default {
  store:window.aopsStore,
  mixins:[window.V8.mixins],
  data() {
    return {
      adding: false,
      clusterId: ''
    };
  },
  components: {
    // ClusterSelect
  },
  methods: {
    ...mapActions('lpDefinition1', ['deploy']),
    async handleAdd() {
      const files = this.$refs.upload.$data.uploadFiles;
      if (files.length === 0) {
        this.$message({ message: '请选择文件', type: 'error' });
        return;
      }
      this.adding = true;
      try {
        await this.deploy({ clusterId: 'aops-afoe', file: files[0].raw });
        this.$message({ message: '导入成功', type: 'success' });
        this.$root.confirm();
        this.$root.close();
        // this.$store.commit('callback', { name: 'confirm' });
        // this.close();
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
      this.adding = false;
    }
  },
  beforeDestroy() {
    this.$refs.upload.abort();
  }
};
</script>
