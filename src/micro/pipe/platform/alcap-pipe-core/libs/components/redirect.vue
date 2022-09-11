<script>
export default {
  data() {
    return {
      keepAlive: false
    };
  },
  created() {
    if (!this.keepAlive) {
      this.redirect();
    }
  },
  activated() {
    if (this.keepAlive) {
      this.redirect();
    }
  },
  deactivated() {
    this.keepAlive = true;
  },
  methods: {
    redirect() {
      const { params, query } = this.$route;
      let { path } = params;
      path = path ? "/" + path : this.$route.path;
      this.$router.replace({ path: path, query });
    }
  },
  render: function(h) {
    return h();
  }
};
</script>
