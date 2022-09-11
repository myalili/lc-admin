<template>
  <el-popover
    trigger="click"
    placement="bottom-start"
    :visible-arrow="false"
    @hide="showColumnGroup"
    @show="showColumnGroup"
  >
    <div class="popover-checkbox">
      <p class="popover-checkbox-title">表格字段定制</p>
      <el-checkbox-group
        class="popover-checkbox-check-group"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-checkbox v-for="item in list" :key="item.prop" :label="item.prop">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div slot="reference">
      <div
        class="popover-checkbox-icon"
        :class="[isShowColumnGroup ? 'is-active' : '']"
      >
        <svg aria-hidden="true">
          <use xlink:href="#aupiconset"></use>
        </svg>
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'PropoverCheckbox',
  inheritAttrs: false,
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isShowColumnGroup: false
    }
  },
  methods: {
    showColumnGroup() {
      // this.isShowColumnGroup = !this.isShowColumnGroup
      this.$set(this, 'isShowColumnGroup', !this.isShowColumnGroup)
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-checkbox {
  &-title {
    color: #7f8b93;
    font-size: 12px;
    line-height: 26px;
  }
  &-check-group {
    display: flex;
    flex-direction: column;
    & > * {
      padding: {
        top: 5px;
        bottom: 5px;
      }
    }
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      background: #eff3f5;
    }
    &.is-active {
      background: #eff3f5;
    }
  }
}
</style>
