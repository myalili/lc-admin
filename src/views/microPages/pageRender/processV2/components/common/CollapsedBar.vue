<template>
  <div class="collapsed-bar" :class="[position, { collapsed, buttononly }]" @click.stop="clickBar">
    <div class="collapsed-button" @click.stop="clickBtn">
      <i :class="iconClass" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'left' // left, right, top, bottom
    },
    buttononly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapsed: this.value
    };
  },
  computed: {
    iconClass() {
      const position = this.position;
      if (position === 'left') {
        return 'el-icon-arrow-right';
      }
      if (position === 'right') {
        return 'el-icon-arrow-left';
      }
      if (position === 'top') {
        return 'el-icon-arrow-down';
      }
      if (position === 'bottom') {
        return 'el-icon-arrow-up';
      }
      return '';
    }
  },
  watch: {
    value(val) {
      this.collapsed = val;
    }
  },
  methods: {
    clickBar() {
      if (this.collapsed) {
        this.collapsed = false;
        this.$emit('input', false);
      }
    },
    clickBtn() {
      this.collapsed = !this.collapsed;
      this.$emit('input', this.collapsed);
    }
  }
};
</script>

<style lang="less">
.collapsed-bar {
  z-index: 999;
  position: absolute;
}
.collapsed-bar.left,
.collapsed-bar.right {
  position: absolute;
  height: 100%;
  width: 12px;
  top: 0;
  .collapsed-button {
    transition: all ease 0.3s;
    position: absolute;
    top: 0;
    bottom: 0;
    height: 36px;
    width: 12px;
    margin: auto 0;
    background: #cedae2;
    cursor: pointer;
    > i {
      line-height: 36px;
      font-weight: bold;
    }
  }
  &.collapsed {
    .collapsed-button {
      transform: rotateY(180deg);
    }
  }
  &.buttononly {
    width: 0;
  }
}
.collapsed-bar.left {
  left: 0;
  .collapsed-button {
    left: 0;
    border-radius: 0 4px 4px 0;
  }
}
.collapsed-bar.right {
  right: 0;
  width: 0;
  .collapsed-button {
    right: 0;
    border-radius: 4px 0 0 4px;
  }
  &.collapsed {
    width: 12px;
  }
}

.collapsed-bar.top,
.collapsed-bar.bottom {
  position: absolute;
  width: 100%;
  height: 12px;
  left: 0;
  .collapsed-button {
    transition: all ease 0.3s;
    position: absolute;
    left: 0;
    right: 0;
    width: 36px;
    height: 12px;
    margin: 0 auto;
    background: #cedae2;
    cursor: pointer;
    text-align: center;
    > i {
      line-height: 12px;
      font-weight: bold;
    }
  }
  &.collapsed {
    .collapsed-button {
      transform: rotateX(180deg);
    }
  }
  &.buttononly {
    height: 0;
  }
}
.collapsed-bar.top {
  top: 0;
  .collapsed-button {
    top: 0;
    border-radius: 0 0 4px 4px;
  }
}
.collapsed-bar.bottom {
  bottom: 0;
  .collapsed-button {
    bottom: 0;
    border-radius: 4px 4px 0 0;
  }
}
</style>
