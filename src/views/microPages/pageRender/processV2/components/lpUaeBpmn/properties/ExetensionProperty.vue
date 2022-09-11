<template>
  <el-collapse-item>
    <div slot="title" class="panel-tab__title"> <i class="header-icon el-icon-circle-plus"></i> 扩展属性 </div>
    <div>
      <el-table :data="propertyTableData">
        <el-table-column label="属性名称" prop="name"></el-table-column>
        <el-table-column label="属性值" prop="value"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="toExetensionEdit(scope.row)" type="text" :disabled="readonly">编辑</el-button>
            <el-button @click="toExetensionRemove(scope)" type="text" style="color: red" :disabled="readonly">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="opr_bottom_button">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddExetensionProperty" :disabled="readonly">添加字段</el-button>
      </div>
    </div>
  </el-collapse-item>
</template>

<script>
import Property  from  '@uae/uae-bpmn-editor/definitions/processElements/common/property';
import  PropertyAdd from '../../chore/PropertyAdd'
export default {
  mixins:[window.V8.mixins],
  name: 'ExetensionProperty',
  props: {
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    propertyTableData: {
      get() {
        if (this.node.properties) {
          return this.node.properties;
        }
        return [];
      }
    }
  },
  methods: {
    toExetensionEdit(property) {
      this.open({
        title: '编辑扩展属性',
        path: '/PropertyAdd',
        // page: 'microPages/process/components/chore/PropertyAdd',
        component:PropertyAdd,
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideConfirmBtn:true,
        hideCancelBtn:true,
        // hideFooter: true,
        params: {
          property
        },
        confirmCallback: data => {
          Object.assign(property, data);
          this.propertyTableData.splice(0, 0);
        }
      });
    },
    toExetensionRemove(scope) {
      const index = scope.$index;
      this.node.properties.splice(index, 1);
    },
    toAddExetensionProperty() {
      this.open({
        title: '添加扩展属性',
        path: '/PropertyAdd',
        component:PropertyAdd,
        // page: 'microPages/process/components/chore/PropertyAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '550px',
        // hideFooter: true,
        hideConfirmBtn:true,
        hideCancelBtn:true,
        confirmCallback: data => {
          this.node.properties.push(new Property(data));
        }
      });
    }
  }
};
</script>

<style></style>
