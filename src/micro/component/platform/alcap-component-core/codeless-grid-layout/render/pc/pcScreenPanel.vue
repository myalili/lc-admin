<script>
import panel from "../screenPanel.vue";
export default {
  extends: panel,
  computed: {
    panelStyle() {
      let config = this.config;
      if (config && config.component === "v2-screen-panel") {
        return {
          ...config.commonStyle,
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
        };
      }else{
        return{
          height:"100%"
        }
      }
    },
  },
  methods: {
    startTimeout() {
      this.visible = true;
    },
  },
};
</script>
