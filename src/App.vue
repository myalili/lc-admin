<template>
  <div id="app" name="layout">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "app",
  mounted() {
    window.msgHub = this.msgHub;
    document.body.className = ''
  },
  data() {
      return {
        msgHub: new Vue(),
      };
    },
};

</script>

<style lang="less">
html,body{
  width: 100%;
  height: 100%;
  

}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size:14px;
}
* {
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar {
  width: 0.5em;
  height: 0.5em;
  background-color: transparent;
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.35);
}
</style>
