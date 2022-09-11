<template>
  <div class="v2-a-work-notice-edit">
    <div class="flex-center margin-top-8">
      <span class="config-title">标题</span>
      <el-input
        size="mini"
        style="width: 180px"
        class="margin-left-8"
        v-model="obj.model[item.name].title"
      ></el-input>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">标题图标</span>
      <!-- <el-input
        size="mini"
        style="width: 180px"
        class="margin-left-8"
        v-model="obj.model[item.name].titleIcon"
      ></el-input> -->
      <div style="width: 180px">
        <codeless-dialog-icon :value.sync="obj.model[item.name].titleIcon" :operationEnable = "true" />
      </div>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">“更多” 跳转</span>
      <div style="width: 180px">
        <page-select
          :value.sync="obj.model[item.name].viewAllPage"
          :wid="obj.model.wid"
        />
      </div>
      
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">数据实体</span>
      <entity-select
        mode="id"
        :immedHandle="true"
        style="width: 180px"
        class="margin-left-8"
        schema-type="ALCAP_PAGEING"
        :wid="obj.model.wid"
        :value.sync="obj.model[item.name].entityId"
        @handleChange="entityChange"
      />
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">显示内容字段</span>
      <el-select
        class="margin-left-8"
        style="width: 180px"
        filterable
        value-key="id"
        v-model="obj.model[item.name].fields.contentField"
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
    <div class="flex-center margin-top-8">
      <span class="config-title">内容图标字段</span>
      <!-- <el-select
        class="margin-left-8"
        style="width: 180px"
        filterable
        value-key="id"
        v-model="obj.model[item.name].fields.iconField"
        placeholder="请选择"
        size="mini"
      >
        <el-option
          v-for="field in fields"
          :key="field.id"
          :label="field.dictionaryItem.name"
          :value="field"
        />
      </el-select> -->
      <div style="width: 180px">
        <codeless-dialog-icon :value.sync="obj.model[item.name].contentIcon" :operationEnable = "true" />
        <el-color-picker v-model="obj.model[item.name].contentBgColor"></el-color-picker>
      </div>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">创建时间字段</span>
      <el-select
        class="margin-left-8"
        style="width: 180px"
        filterable
        value-key="id"
        v-model="obj.model[item.name].fields.createTimeField"
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
  </div>
</template>

<script>
import pck from "./package.json";
// import entitySelect from '@/views/codeLess/components/entitySelect';

export default {
  _options: pck.docs,
  name: "v2AWorkNoticeEdit",

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
    },
    getSchemasAndFields(e) {
      this.fields = e.fields;
    },

    // chooseMorePage(e) {
    //   this.obj.model[this.item.name].viewAllPage = e;
    // },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-notice-edit {
  padding-bottom: 16px;
}

.config-title {
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: space-between;
}

.margin-top-8 {
  margin-top: 8px;
}
.margin-left-8 {
  margin-left: 8px;
}
</style>
