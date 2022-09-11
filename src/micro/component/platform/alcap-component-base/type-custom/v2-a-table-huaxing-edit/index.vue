<template>
  <div class="v2-a-work-files-edit">
    <div class="flex items-center justify-between">
      表头
    <el-dropdown
      trigger="click"
      :hide-on-click="false"
      @command="splice"
    >
      <!-- <span class="btn-add" @click="(e) => e.preventDefault()"
        >+</span
      > -->
      <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="(e) => e.preventDefault()"></el-button>
      <el-dropdown-menu
        style="width: 220px; max-height: 400px; overflow: scroll"
        slot="dropdown"
      >
        <el-dropdown-item
          v-for="itemi in fields"
          :key="itemi.dataIndex"
          :command="itemi"
        >
          <div class="flex items-center justify-between">
            <span>{{
              itemi.title }}</span>
            <i
              class="el-icon-check text-blue-300"
              v-if="
                obj.model[item.name].some(
                  (i) => i.dataIndex === itemi.dataIndex)
              "
            ></i>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          v-if="
            selectedEntity &&
            selectedEntity.fields &&
            selectedEntity.fields.length === 0
          "
        >
          <div class="flex items-center justify-center">
            <span>暂无数据</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <div class="flex-center margin-top-8" v-for="itemi in obj.model[item.name]" :key="itemi.dataIndex">
      <span class="config-title">{{ itemi.dataIndex }}</span>
      <el-input
        size="mini"
        class="margin-left-8"
        v-model="itemi.title"
        style="width: 180px"
      ></el-input>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
// import entitySelect from "@/views/codeLess/components/entitySelect";

export default {
  _options: pck.docs,
  name: "v2ATableHuaxingEdit",

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
  created() {
    this.obj.model.startGet = true;
    msgHub.$on('huaxingTask', (e)=> {
      if (this.obj.model[this.item.name].length === 0) {
        this.$set(this.obj.model, [this.item.name], e);
      }
      
      this.$set(this, 'fields', JSON.parse(JSON.stringify(e)));
      console.log(1111111111111);
      this.$forceUpdate()
    })
  },

  methods: {
    splice(itemi) {
      const ctx = this;
      console.log(ctx.obj.model[ctx.item.name].some((i) => i.dataIndex === itemi.dataIndex));
      if (ctx.obj.model[ctx.item.name].some((i) => i.dataIndex === itemi.dataIndex)) {
        ctx.obj.model[ctx.item.name].splice(
          ctx.obj.model[ctx.item.name].findIndex((i) => i.dataIndex === itemi.dataIndex),
          1
        );
      } else {
        ctx.obj.model[ctx.item.name].push({
          ...itemi,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-files-edit {
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
