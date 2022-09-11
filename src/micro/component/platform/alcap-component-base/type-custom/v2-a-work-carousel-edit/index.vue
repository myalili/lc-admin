<template>
  <div class="v2-a-work-carousel-edit">
    <div class="box-item">
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">数据实体</span>
        <entity-select
          mode="id"
          :immedHandle="true"
          style="width: 180px"
          class="margin-left-8"
          schema-type="ALCAP_PAGEING"
          :value.sync="obj.model[item.name].entityId"
          :wid="obj.model.wid"
          @handleChange="entityChange"
        />
      </div>
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">图片字段</span>
        <el-select
          class="margin-left-8"
          style="width: 180px"
          filterable
          value-key="id"
          v-model="obj.model[item.name].fields.imgField"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="field in fields"
            :key="field.id"
            :label="field.dictionaryItem.name"
            :value="field"
          />
        </el-select>
      </div>
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">链接字段</span>
        <el-select
          class="margin-left-8"
          style="width: 180px"
          filterable
          value-key="id"
          v-model="obj.model[item.name].fields.linkField"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="field in fields"
            :key="field.id"
            :label="field.dictionaryItem.name"
            :value="field"
          />
        </el-select>
      </div>
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">排序</span>
        <el-select
          class="margin-left-8"
          style="width: 180px"
          filterable
          value-key="id"
          v-model="obj.model[item.name].fields.sortField"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="field in fields"
            :key="field.id"
            :label="field.dictionaryItem.name"
            :value="field"
          />
        </el-select>
      </div>
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">展示数量</span>
        <el-input style="width: 180px" size="mini" v-model="obj.model[item.name].num" placeholder="请输入数量"></el-input>
      </div>
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">标题</span>
        <el-input style="width: 180px" v-model="obj.model[item.name].title" size="mini" placeholder="请输入标题"></el-input>
      </div> 
    </div>

    <div class="box-item">
      <div class="flex-center margin-top-8 justify-between">
        <span class="config-title">节点配置</span>
        <!-- <span class="btn-add margin-left-8" @click="addItem">+</span> -->
        <el-button type="primary" size="mini" class="w-5 h-5 ml-2" style="padding: 0" icon="el-icon-plus" circle @click="addItem"></el-button>
      </div>
      <div
        class="flex-center"
        v-for="(node, idx) of obj.model[item.name].nodeConfig.list"
        :key="idx"
      >
        <span>{{ "节点" + (idx + 1) }}</span>
        <el-input
          size="mini"
          class="margin-left-8"
          v-model="node.src"
        ></el-input>
        <el-button
          type="text"
          icon="el-icon-delete"
          class="margin-left-8 text-sm text-gray-500"
          @click="subItem(idx)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
// import entitySelect from '@/views/codeLess/components/entitySelect';

export default {
  _options: pck.docs,
  name: "v2AWorkCarouselEdit",

  // components: { entitySelect },

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

  data() {
    return {
      fields: [],
    };
  },

  methods: {
    entityChange(e) {
      this.getSchemasAndFields(e);
      msgHub.$emit('entityChange', e);
    },
    getSchemasAndFields(e) {
      this.fields = e.fields;
    },

    addItem() {
      this.obj.model[this.item.name].nodeConfig.list.push({
        src: "",
      });
    },
    subItem(idx) {
      this.obj.model[this.item.name].nodeConfig.list.splice(idx, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.box-item {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #dcdfe6;
}


.config-title {
  font-weight: normal;
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.margin-top-8 {
  margin-top: 8px;
}
.margin-left-8 {
  margin-left: 8px;
}
</style>
