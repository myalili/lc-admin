<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <entity-select
      style="width: 180px"
      :schema-type="obj.model.schemaType"
      :value.sync="obj.model[item.name]"
      :wid="obj.model.wid"
      size="mini"
    />
  </div>
</template>

<script>
import { require } from "./mixins";
// import entitySelect from '@/views/codeLess/components/entitySelect';

export default {
  mixins: [require],

  components: {
    // entitySelect,
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
};
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
