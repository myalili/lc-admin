<template>
  <el-table
    class="base-table"
    ref="table"
    style="width: 100%"
    v-bind="$attrs"
    v-on="$listeners"
    size="mini"
  >
    <el-table-column
      v-if="showSelection"
      type="selection"
      :selectable="selectable"
      v-bind="mergeShowCustomColumns"
    />
    <slot name="after-selection"></slot>
    <template v-for="item in innerColumns">
      <el-table-column
        v-if="item.render && typeof item.render === 'function'"
        :key="item.prop || item.id"
        v-bind="item"
      >
        <template slot-scope="{ row, $index, column }">
          <render-vnode
            :vnode="item.render(row[item.prop], row, $index, column)"
          />
        </template>
      </el-table-column>
      <el-table-column v-else :key="item.prop || item.id" v-bind="item" />
    </template>

    <slot></slot>
    <el-table-column v-if="showCustomColumns" v-bind="mergeCustomColumnsInfo">
      <div class="custom-columns-header" slot="header">
        <slot name="custom-columns-header">{{ mergeCustomColumnsInfo.label }}</slot>
        <popover-checkbox v-model="checkdColumn" :list="checkboxColumns" />
      </div>
      <template slot-scope="data">
        <slot name="custom-columns" v-bind="data"> </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import popoverCheckbox from './popoverCheckbox.vue'
import renderVnode from './renderVnode'
export default {
  name: 'BaseTable',
  inheritAttrs: false,
  components: { popoverCheckbox, renderVnode },
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
    },
    customColumnsInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    selectionColumnInfo: {
      type: Object,
      default() {
        return {}
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
    },
    checkboxColumns() {
      return this.columns.filter(item => !item.always)
    },
    mergeCustomColumnsInfo() {
      return {
        width: '60px',
        ...(this.customColumnsInfo || {})
      }
    },
    mergeShowCustomColumns() {
      return {
        width: '50',
        align: 'center',
        ...(this.showCustomColumns || {})
      }
    }
  },
  watch: {
    columns: {
      handler() {
        this.checkdColumn = this.columns.filter(item => !item.defaultHide).map(item => item.prop)
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
    .el-table__body-wrapper {
      height: 100%;
      flex-grow: 1;
      overflow-y: auto;
    }
  }
  .custom-columns-header {
    display: flex;
    align-items: center;
  }
}
</style>
