<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <entity-select
      style="width: 180px"
      mode="id"
      :schema-type="obj.model.schemaType"
      :exclude="item.exclude"
      :value.sync="obj.model[item.name]"
      :wid="obj.model.wid"
      :immedHandle="true"
      size="mini"
      @handleChange="entityChange"
    />
  </div>
</template>

<script>
import { require } from './mixins'
// import entitySelect from '@/views/codeLess/components/entitySelect'
export default {
  mixins: [ require ],
  components: {
    // entitySelect
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
  data() {
    return {};
  },
  computed: {
  },
  mounted() {
    const ctx = this;
    console.log(ctx.obj);
    console.log(ctx.item);
    //:schema-type="schemaType"
  },
  methods: {
    entityChange(e) {
      console.log(e);
      msgHub.$emit('entityChange', e);
    }
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