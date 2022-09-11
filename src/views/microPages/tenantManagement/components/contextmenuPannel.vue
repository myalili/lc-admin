<template>
  <div
    ref="contextmenu"
    v-show="show"
    class="common-right-menu-ctn"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ContextmenuPannel',
  data() {
    return {
      x: 0,
      y: 0,
      show: false,
      bodyListener: 0
    }
  },
  created() {
    this.bodyListener = () => {
      this.show = false
    }
    document.body.addEventListener('click', this.bodyListener, true)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.bodyListener)
  },
  methods: {
    showByMouseEvent(mouseEvent) {
      const clientX = mouseEvent.clientX
      const clientY = mouseEvent.clientY
      const rect = this.$parent.$el.getBoundingClientRect()
      this.x = clientX - rect.left
      this.y = clientY - rect.top
      this.show = true
      // 需要判断整个context的位置，如果超过了屏幕，需要做偏移
      setTimeout(() => {
        const rect = this.$el.getBoundingClientRect()
        const documentElement = document.documentElement
        // 底部情况
        if (documentElement.clientHeight < rect.y + rect.height) {
          this.y =
            this.y - (rect.y + rect.height - documentElement.clientHeight)
        }
        // 右边情况
        if (documentElement.clientWidth < rect.x + rect.width) {
          this.x = this.x - (rect.x + rect.width - documentElement.clientWidth)
        }
      })
    },
    hidden() {
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
//右键菜单样式
.common-right-menu-ctn {
  position: absolute;
  width: 120px;
  padding: 10px 0;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0px 0px 14px 0px rgba(55, 78, 113, 0.2);
  z-index: 10;
  .el-button {
    width: 100%;
    padding: 0 20px;
    line-height: 36px;
    color: #5B5B5B;
    text-align: left;
    border-radius: 0;
    &:hover {
      background-color: #e6f8f8;
      color: #009AA6;
    }
  }
  p.none-line {
    border-top: 0;
    padding-top: 0;
    margin-top: 0;
  }
}
</style>