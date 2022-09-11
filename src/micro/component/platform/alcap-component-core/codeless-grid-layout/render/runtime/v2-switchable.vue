<template>
  <div ref="wrap">
    <!-- <transition  name="fade" mode="out-in" appear> -->
    <slot :activeindex="innerIndex"></slot>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  props: ["activeindex"],
  data() {
    return {
      componentName: "v2-switchable",
      i:0
    };
  },
  computed: {
    innerIndex: {
      get() {
        return this.activeindex === undefined ? this.i : this.activeindex;
      },
      set(v) {
        this.i = v;
        $(this.$el).animate(
          {
            opacity: 0,
          },
          0.3,
          () => {
            this.$emit("update:activeindex", v);
            $(this.$el).animate({
              opacity: 1,
            });
          }
        );
      },
    },
  },
  watch: {
    activeindex() {
      // $(window).trigger("resize");
      setTimeout(() => {
        if (window.frames.length > 0) {
          for (let i = 0; i < window.frames.length; i++) {
            $(window.frames[i]).trigger("resize");
          }
        }
        $(window).trigger("resize");
      }, 300);
    },
  },
  methods: {
    setAmountIndex(i) {
      this.innerIndex = i;
    },
  },
};
</script>
