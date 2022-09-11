<template>
  <div class="v2-a-article-edit w-full h-full">
    <div class="base-edit">
      数据类型：
      <el-select v-model="obj.model.content.type" placeholder="请选择" size="mini">
          <el-option label="实体" value="entity"></el-option>
          <el-option label="自定义" value="custom"></el-option>
          <el-option label="绑定页面数据" value="syncParam"></el-option>
      </el-select>
    </div>
    <div class="base-edit" v-show="obj.model.content.type === 'entity'">
      实体：
      <entity-select
        style="width: 180px"
        mode="id"
        schema-type="contentString"
        :value.sync="obj.model.content.entityId"
        :wid="obj.model.wid"
        size="mini"
        @handleChange="entityChange"
      />
    </div>
    <div class="base-edit"  v-show="obj.model.content.type === 'custom'">
      文章自定义：
      <el-button size="mini" type="primary" @click="visible = true">编辑</el-button>
    </div>
    <div class="base-edit"  v-show="obj.model.content.type === 'syncParam'">
      数据绑定：
      <sync-param style="width: 180px" :is-custom="true" :target-params="root.argsArr" :value.sync="obj.model.content.syncParam" :componentName="'文章组件'" />
    </div>
    <edit-dialog :visible.sync="visible" :value.sync="obj.model.content.value" v-if="visible" />
  </div>
</template>

<script>
import editDialog from './dialog';
import pck from "./package.json";
export default {
  name: "v2AArticleEdit",
  _options: pck.docs,
  inject: [ 'root' ],
  components: {
    editDialog
  },
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
  },
  data() {
    return {
      visible: false,
      value: ''
    }
  },
  watch: {
    'obj.model.content.value': {
      handler(n, o) {
        if (n && n !== o) {
          this.obj.model.content.entityId = ''
          this.obj.model.content.syncParam = ''
        }
      }
    }
  },
  methods: {
    openEditor() {
      
    },
    entityChange(e) {
      this.obj.model.content.entityId = ''
      this.obj.model.content.value = ''
    },
    handleChange(e) {
      console.log(e);
      msgHub.$emit("syncParam", e);
      this.obj.model.content.syncParam = ''
      this.obj.model.content.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.v2-a-article-edit {
  .base-edit {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 27px;
    color: #333333;
  }
  .full-screen-container{
    z-index: 2;
  }
}

</style>