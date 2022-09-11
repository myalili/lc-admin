<template>
  <el-dialog
    top="10vh"
    :visible.sync="dialogVisible"
    width="70%"
    height="500px"
    :modal-append-to-body="false"
    :show-close="false"
    :close-on-click-modal="false"
    :modal="false"
    :append-to-body="true"
    custom-class="no-header-and-footer-dialog"
  >
    <codeless-dialog-ctn
      title="文章编写"
      maxHeight="550px"
      @confirm="submit"
      @close="dialogVisible = false"
      @cancel="dialogVisible = false"
    >
      <template v-slot:dialogContent>
        <codeless-editor :value.sync="html" />
      </template>
    </codeless-dialog-ctn>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    value: {
      type: String,
      default: () => {
        return '';
      },
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  data() {
    return {
      html: ''
    };
  },
  mounted() {
    
  },
  watch: {
    visible:{
      handler(n) {
        if (n) {
          this.$set(this, 'html', this.value);
        }
      },
      immediate: true
    }
  },
  methods: {
    submit() {
      this.$emit('update:value', this.html);
      this.dialogVisible = false
    },
  },
};
</script>