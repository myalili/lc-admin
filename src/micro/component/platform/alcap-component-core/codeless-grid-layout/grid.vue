<script>
import page from "./render/pc/pcScreenPage.vue";
import pcScreenPanel from "./render/pc/pcScreenPanel.vue";
import { GridLayout, GridItem } from "vue-grid-layout";
window.IDE = undefined;
export default {
  
  components: {  pcScreenPanel, GridLayout, GridItem },
  extends: page,
  mounted() {
    this.$parent.$on(
      "refresh",
      (this.refreshHandle = () => {
        this.$nextTick(() => {
          this.relocal();
        });
      })
    );
  },
  beforeDestroy() {
    this.$parent.$off("refresh", this.refreshHandle);
  },
};
</script>
