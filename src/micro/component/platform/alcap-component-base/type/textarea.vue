<template>
  <div class="string_input">
    {{ item.desp }}
    <el-button size="mini" type="primary" @click="visible = true">编辑</el-button>

    <edit-dialog :visible.sync="visible" :value.sync="obj.model[item.name]" v-if="visible" />
  </div>
</template>

<script>
import editDialog from '../base-config/components/editorDialog';
export default {
  inject: [ 'root' ],
  components: {
    editDialog
  },
  props: {
    obj: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  mounted() {
    const ctx = this;
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
}
</style>