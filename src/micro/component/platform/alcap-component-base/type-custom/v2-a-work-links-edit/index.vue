<template>
  <div class="v2-a-work-links-edit">
    <div class="flex-center margin-top-8">
      <span class="config-title">标题</span>
      <el-input
        size="mini"
        class="margin-left-8"
        v-model="obj.model[item.name].title"
      ></el-input>
    </div>
    <div class="flex-center margin-top-8">
      <span class="config-title">参数配置</span>
      <!-- <span class="btn-add margin-left-8" @click="addItem">+</span> -->
      <el-button type="primary" size="mini" class="w-5 h-5 ml-2" style="padding: 0" icon="el-icon-plus" circle @click="addItem"></el-button>
    </div>
    <div
      class="card-item"
      v-for="(link, idx) of obj.model[item.name].links"
      :key="idx"
    >
      <div class="flex-center">
        <span>链接名称</span>
        <el-input
          size="mini"
          class="margin-left-8"
          v-model="link.name"
        ></el-input>
      </div>
      <div class="flex-center margin-top-8">
        <span>选择页面</span>
        <page-select
          class="margin-left-8"
          :value.sync="link.page"
          :wid="link.wid"
        />
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

export default {
  _options: pck.docs,
  name: "v2AWorkLinksEdit",

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

  mounted() {
    if (this.obj.model[this.item.name].links.length === 0) {
      this.addItem();
    }
  },

  methods: {
    addItem() {
      this.obj.model[this.item.name].links.push({
        name: "",
        page: {},
        wid: this.obj.model.wid + '-' + this.obj.model[this.item.name].links.length
      });
    },
    subItem(idx) {
      this.obj.model[this.item.name].links.splice(idx, 1);
    },
    // choosePage(e, link) {
    //   link.page = e;
    // },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-links-edit {
  padding-bottom: 16px;
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
    right: 2px;
    top: 0;

    button {
      padding: 0;
    }
  }
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
