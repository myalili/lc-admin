<template>
  <el-table
    class="base-table"
    ref="table"
    style="width: 100%"
    v-bind="$attrs"
    v-on="$listeners"
    size='medium'
  >
    <el-table-column
      v-if="showSelection"
      label=" "
      type="selection"
      width="50"
      align="center"
      :selectable="selectable"
    />
    <slot name="after-selection"></slot>
    <el-table-column
      v-for="item in innerColumns"
      :key="item.prop"
      v-bind="item"
    />
    <slot></slot>
    <el-table-column v-if="showCustomColumns" width="60px" align="right">
      <template slot="header">
        <popover-checkbox v-model="checkdColumn" :list="columns" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import popoverCheckbox from './popoverCheckbox.vue'
export default {
  name: 'BaseTable',
  inheritAttrs: false,
  components: { popoverCheckbox },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    showCustomColumns: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Function,
      default() {
        return () => true
      }
    }
  },
  data() {
    return {
      checkdColumn: [],
      isShowColumnGroup: false
    }
  },
  computed: {
    innerColumns() {
      const checkedMap = this.checkdColumn.reduce((result, item) => {
        result[item] = true
        return result
      }, {})
      return this.columns.filter(item => checkedMap[item.prop])
    }
  },
  watch: {
    columns: {
      handler() {
        this.checkdColumn = this.columns.map(item => item.prop)
      },
      immediate: true
    }
  },
  methods: {
    clearSelection() {
      if (this.$refs.table) {
        this.$refs.table.clearSelection()
      }
    },
    toggleRowSelection(...args) {
      if (this.$refs.table) {
        this.$refs.table.toggleRowSelection(...args)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-table {
  &::v-deep {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .el-table__header-wrapper {
      border-bottom: 1px solid #ebeef5;
    }
    .el-table__body-wrapper {
      height: 100%;
      flex-grow: 1;
      overflow-y: auto;
    }
  }
}
</style>
