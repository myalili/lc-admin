<template>
  <transition
    :enter-active-class="`animated  ${enter}`"
    :leave-active-class="`animated  ${leave}`"
    v-on:enter="enterFn"
    v-on:leave="leaveFn"
  >
    <keep-alive v-if="keepAlive">
      <component :is="AsyncComponent" v-bind="$attrs" v-on="$listeners" />
    </keep-alive>
    <component v-else :is="AsyncComponent" v-bind="$attrs" v-on="$listeners" />
  </transition>
</template>

<script>
import factory from "./factory.js";
/**
 * 动态文件加载器
 */
export default {
  name: "asyncComponent",
  inheritAttrs: false,
  props: {
    // 文件的路径
    page: {
      type: String,
      default: null
    },
    // 是否保持缓存
    keepAlive: {
      type: Boolean,
      required: false,
      default: true
    },
    // 延迟加载时间
    delay: {
      type: Number,
      default: 20
    },
    // 超时警告时间
    timeout: {
      type: Number,
      default: 60000
    },
    params: {
      type: [Object, Array],
      default: () => {}
    },
    enter: {
      type: String,
      default: ""
    },
    leave: {
      type: String,
      default: ""
    },
    deploy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      AsyncComponent: factory(this.page, this.delay, this.timeout, this.deploy)
    };
  },
  watch: {
    page() {
      this.$nextTick(() => {
        this.AsyncComponent = factory(
          this.page,
          this.delay,
          this.timeout,
          this.deploy
        );
      });
    }
  },
  methods: {
    reload(page = this.page) {
      this.AsyncComponent = factory(
        page,
        this.delay,
        this.timeout,
        this.deploy
      );
    },
    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    enterFn: function(el, done) {
      // ...
      done();
    },

    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    leaveFn: function(el, done) {
      // ...
      done();
    }
  }
};
</script>