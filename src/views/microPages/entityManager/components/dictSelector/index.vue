<template>
  <div class="data-dictionary-dialog-body">
    <div class="data-dictionary-dialog-body-left">
      <left-area @item-click="itemClick" />
    </div>
    <div class="data-dictionary-dialog-body-right">
      <dictionary-list
        :selectedList="selectedList"
        :filterText="filterText"
        :dictId="dict.id"
        :singleSelect="singleSelect"
        @selection-change="selectionChange"
      />
    </div>
  </div>
</template>

<script>
import DictionaryList from './components/dictionaryList.vue'
import leftArea from './components/leftArea.vue'
export default {
  name: 'DataDictionaryDialog',
  components: { leftArea, DictionaryList },
  props: {
    filterText: {
      type: String,
      default: ''
    },
    selectedList: {
      type: Array,
      default() {
        return []
      }
    },
    singleSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dict: {},
    }
  },
  methods: {
    itemClick(data) {
      this.dict = data
    },
    selectionChange(list) {
      this.$emit('selection-change', list)
    },
  }
}
</script>

<style lang="scss" scoped>
.data-dictionary-dialog {
  &-body {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &-left {
      width: 300px;
      height: 100%;
      overflow: hidden;
      border-right: 1px solid #ebeef5;
    }
    &-right {
      height: 100%;
      width: 100%;
      flex-grow: 1;
      overflow: hidden;
      // padding: 16px;
    }
  }
}
</style>
