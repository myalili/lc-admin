<template>
  <div class="v2-a-work-panel-edit">
    <div class="flex-center margin-top-8">
      <span class="config-title">标题</span>
      <el-input
        size="mini"
        class="margin-left-8"
        v-model="obj.model[item.name].title"
      ></el-input>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">“更多” 跳转</span>
      <page-select
        class="margin-left-8"
        :value.sync="obj.model[item.name].morePage"
        :wid="obj.model.wid"
      />
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">默认激活</span>
      <el-input
        size="mini"
        class="margin-left-8"
        v-model="obj.model[item.name].active"
      ></el-input>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">参数配置</span>
      <!-- <span class="btn-add margin-left-8" @click="addItem">+</span> -->
      <el-button type="primary" size="mini" class="w-5 h-5 ml-2" style="padding: 0" icon="el-icon-plus" circle @click="addItem"></el-button>
    </div>
    <div
      class="card-item"
      v-for="(tab, idx) of obj.model[item.name].tabs"
      :key="idx"
    >
      <div class="flex-center">
        <span>标签名</span>
        <el-input
          size="mini"
          class="margin-left-8"
          v-model="tab.label"
        ></el-input>
      </div>
      <div class="flex-center margin-top-8">
        <span>标签值</span>
        <el-input
          size="mini"
          class="margin-left-8"
          v-model="tab.value"
        ></el-input>
      </div>
      <div class="flex-center margin-top-8">
        <span>数据实体</span>
        <entity-select
          class="margin-left-8"
          style="width: 100%"
          schema-type="ALCAP_PAGEING"
          :value.sync="tab.entity"
          :wid="obj.model.wid"
          mode="id"
          :immedHandle="true"
          @handleChange="entityChange"
        />
      </div>
      <div class="flex-center margin-top-8">
        <span>配置字段</span>
        <el-select
          class="margin-left-8"
          style="width: 100%"
          filterable
          value-key="id"
          v-model="tab.fields"
          multiple
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
      <div class="select-fields-box" v-show="tab.fields && tab.fields.length">
        <div class="margin-top-8" v-for="field of tab.fields" :key="field.id">
          <span>{{ field.dictionaryItem.name }}</span>
          <el-select
            class="margin-top-8"
            style="width: 100%"
            filterable
            v-model="field.component"
            value-key="href"
            placeholder="请选择组件"
            size="mini"
          >
            <el-option
              :value="comp"
              :label="comp.name"
              v-for="comp in componentList"
              :key="comp.href"
            >
              {{ comp.name }}
            </el-option>
          </el-select>
          <page-select
            class="margin-top-8"
            :value.sync="field.page"
            :wid="field.wid"
            v-if="field.component && field.component.href === 'v2-a-table-link'"
          />
        </div>
      </div>
      <div class="operate-wrap">
        <el-button
          type="text"
          icon="el-icon-delete"
          class="text-sm text-gray-500"
          @click="subItem(idx)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
// // import entitySelect from '@/views/codeLess/components/entitySelect';

export default {
  _options: pck.docs,
  name: "v2AWorkPanelEdit",

  // // components: { entitySelect },

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
      componentList: [
        {
          name: "无",
        },
      ],
    };
  },

  mounted() {
    this.getComponentList();
    if (this.obj.model[this.item.name].tabs.length === 0) {
      this.addItem();
    }
  },

  methods: {
    addItem() {
      this.obj.model[this.item.name].tabs.push({
        label: "",
        value: "",
        entity: null,
        fields: [],
        businessData: {
          totalNum: 0,
          dataList: [],
        },
        wid: this.obj.model.wid + '-' + this.obj.model[this.item.name].tabs.length
      });
    },
    subItem(idx) {
      this.obj.model[this.item.name].tabs.splice(idx, 1);
    },

    entityChange(e) {
      this.getSchemasAndFields(e);
    },
    getSchemasAndFields(e) {
      this.fields = e.fields;
    },
    // choosePage(e, field) {
    //   field.page = e;
    // },
    chooseMorePage(e) {
      this.obj.model[this.item.name].morePage = e;
    },


    getComponentList() {
      this.componentList = pipe.component.getComponentList('table');
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-panel-edit {
  padding-bottom: 16px;
}


.btn-sub {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 1px 1px 0 0;
  border-radius: 50%;
  background: linear-gradient(134deg, #f55050 0%, #df0000 100%);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.card-item {
  position: relative;
  background: white;
  width: 100%;
  border: 1px solid #c8d0d4;
  border-radius: 5px;
  padding: 16px;
  margin-top: 16px;

  &:first-child {
    margin-top: 8px;
  }
  &:last-child {
    margin-bottom: 16px;
  }

  .operate-wrap {
    position: absolute;
    right: 0;
    top: 0;

    button {
      padding: 0;
    }
  }
}

.select-fields-box {
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid rgb(170, 170, 170);
}

.config-title {
  font-weight: bold;
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
